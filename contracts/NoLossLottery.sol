// SPDX-License-Identifier: BUSL-only
pragma solidity >=0.8.18;

import "./Staking.sol";
import "./Distribution.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


// Randomness Oracle interface
interface DIARandomOracleI {
    function getLastRound() external view returns(uint256);
    function getRandomValueFromRound(uint256 _round) external view returns (string memory);
}

// Lottery Winners interface
interface LotteryWinnersI {
    function depositWinnings(uint256 _winningNumber, uint256 _amountWon, address _winnerAddr) payable external;
}

contract NoLossLottery is Ownable {
    using SafeMath for uint256;

    // ParticipantsDelegation tracks all the delegations for a participant address
    struct ParticipantDelegation {
        address participant;
        uint256 delegationAmount;
    }

    // UnbondingRequest struct keeps track of an unbonding request
    struct UnbondingRequest {
        int64 completionTime;
        uint256 amount;
    }

    address public oracleAddress = 0xE4A3a85c42448D19875a66814c043E69857C615a;
    address public winnersContractAddress;
    address private developerAddress;
    uint256 private developerFee;
    // the required authorizations for Staking and Distribution
    string[] private delegateMethod = [MSG_DELEGATE];
    string[] private undelegateMethod = [MSG_UNDELEGATE];
    string[] private distributionMethods = [MSG_WITHDRAW_DELEGATOR_REWARD];
    // map to keep track of user deposits to the contract.
    mapping(address => uint256) public deposits;
    // map to keep track of the delegation amounts for a user.
    mapping(address => uint256) public delegations;
    // map that keeps track of all currently unbonding delegations
    mapping(address => UnbondingRequest[]) public unbondingDelegations;
    // the total amount staked.
    uint256 public totalStaked;
    // the totalStaked amount converted to total number of tickets.
    uint256 public totalTickets;
    // array of addresses for each user that has entered the lottery.
    address[] public participants;
    // map to keep track of addresses that have entered the lottery.
    mapping(address => bool) private addressExists;

    event Deposit(address indexed _from, uint256 _value);
    event Withdraw(address indexed _to, uint256 _value);
    event EnterLottery(address indexed _from, uint256 _value);
    event ExitLottery(address indexed _to, uint256 _value);
    event PickWinner(address indexed _winner, uint256 _value);

    constructor(address _addr) {
        developerAddress = _addr;
        developerFee = 2;
    }

    function getAllDelegations() public view returns (ParticipantDelegation[] memory){
        ParticipantDelegation[] memory allDelegations = new ParticipantDelegation[](participants.length);
        for (uint256 i = 0; i < participants.length; i++) {
            address participant = participants[i];
            uint256 delegationAmount = delegations[participant];
            allDelegations[i] = ParticipantDelegation(participant, delegationAmount);
        }
        return allDelegations;
    }

    // Deposit into the contract
    function deposit() payable external {
        require(msg.value % 1 ether == 0, "Amount must be a whole number of Evmos");
        deposits[msg.sender] = SafeMath.add(deposits[msg.sender], msg.value);
        emit Deposit(msg.sender, msg.value);
    }

    // Withdraws the unbonded delegation tokens
    function withdrawAllUnbonded() public {
        uint256 availableAmnt;
        uint16 i = 0;
        while (i < unbondingDelegations[msg.sender].length) {
            uint256 ts = uint256(int256(unbondingDelegations[msg.sender][i].completionTime));
            if (block.timestamp >= ts) {
                availableAmnt = SafeMath.add(unbondingDelegations[msg.sender][i].amount, availableAmnt);
                unbondingDelegations[msg.sender][i] = unbondingDelegations[msg.sender][unbondingDelegations[msg.sender].length - 1];
                unbondingDelegations[msg.sender].pop();
            } else {
                i++;
            }
        }
        (bool sent, ) = payable(msg.sender).call{value: availableAmnt}("");
        require(sent, "Failed to send Tokens");
        emit Withdraw(msg.sender, availableAmnt);
    }

    // Withdraw deposits from contract
    function withdraw(uint256 _amount) public {
        (bool sent, ) = payable(msg.sender).call{value: _amount}("");
        require(sent, "Failed to send Tokens");
        deposits[msg.sender] = SafeMath.sub(deposits[msg.sender], _amount);
        emit Withdraw(msg.sender, _amount);
    }

    // Picks a winner for the lottery
    function pickWinner(string memory _validatorAddr) public onlyOwner {
        Coin[] memory newRewards = DISTRIBUTION_CONTRACT.withdrawDelegatorRewards(address(this), _validatorAddr);
        require(newRewards[0].amount > 0, "The rewards have not been distributed yet");

        // Used to ensure that the order of the participants array is not used to determine the winner.
        _shuffleParticipants();

        uint256 winningNumber = _getRandomNumber(totalTickets);
        uint256 currentSum = 0;
        address winnerAddress;

        for (uint256 i = 0; i < participants.length; i++) {
            currentSum = SafeMath.add(delegations[participants[i]] / 1e18, currentSum);
            if (currentSum >= winningNumber) {
                winnerAddress = participants[i];
                break;
            }
        }

        uint256 fee = (newRewards[0].amount * developerFee) / 100;
        (bool sent,) = payable(developerAddress).call{value: fee}("");
        require(sent, "Failed to send Tokens");

        uint256 amountWon = SafeMath.sub(newRewards[0].amount, fee);

        LotteryWinnersI(winnersContractAddress).depositWinnings{value: amountWon}(winningNumber, amountWon, winnerAddress);
        emit PickWinner(winnerAddress, amountWon);
    }

    // Enters the lottery by delegating to a validator
    function enterLottery(
        string memory _validatorAddr,
        uint256 _amount
    ) public {
        require(_amount % 1 ether == 0, "Amount must be a whole number of Evmos");
        require(_amount <= deposits[msg.sender],"This address does not hold a deposit amount with the lottery");
        _approveRequiredMsgs(_amount, delegateMethod);
        STAKING_CONTRACT.delegate(address(this), _validatorAddr, _amount);
        delegations[msg.sender] = SafeMath.add(delegations[msg.sender], _amount);
        deposits[msg.sender] = SafeMath.sub(deposits[msg.sender], _amount);
        totalStaked = SafeMath.add(totalStaked, _amount);
        totalTickets = SafeMath.add(totalTickets, _amount / 1e18);
        /// make sure an address is pushed only once per prize period
        if (!addressExists[msg.sender]) {
            participants.push(msg.sender);
            addressExists[msg.sender] = true;
        }
        emit EnterLottery(msg.sender, _amount);
    }

    // Exits the lottery returning the funds back to deposits after the unbonding period
    function exitLottery(string memory _validatorAddr, uint256 _amount) public {
        require(addressExists[msg.sender], "This address does not currently participate");
        require(_amount <= delegations[msg.sender], "This address does not hold a delegation amount with the lottery");
        _approveRequiredMsgs(_amount, undelegateMethod);
        int64 completionTime = STAKING_CONTRACT.undelegate(address(this), _validatorAddr, _amount);
        delegations[msg.sender] = SafeMath.sub(delegations[msg.sender], _amount);
        unbondingDelegations[msg.sender].push(UnbondingRequest(completionTime, _amount));
        totalStaked = SafeMath.sub(totalStaked, _amount);
        totalTickets = SafeMath.sub(totalTickets, _amount / 1e18);

        if (delegations[msg.sender] == 0) {
            for (uint256 i = 0; i < participants.length; i++) {
                if (participants[i] == msg.sender) {
                    participants[i] = participants[participants.length - 1];
                    participants.pop();
                    addressExists[msg.sender] = false;
                    break;
                }
            }
        }

        emit ExitLottery(msg.sender, _amount);
    }

    // ------------------------------
    // OWNER FUNCTIONS
    // ------------------------------
    function setDeveloperAddress(address _addr) public onlyOwner {
        developerAddress = _addr;
    }

    function setDeveloperFee(uint256 _fee) public onlyOwner {
        developerFee = _fee;
    }

    function setOracleContract(address _newAddr) public onlyOwner {
        oracleAddress = _newAddr;
    }

    function setWinnersContract(address _newAddr) public onlyOwner {
        winnersContractAddress = _newAddr;
    }

    function approveDistributionMsgs() public onlyOwner {
        bool successDist = DISTRIBUTION_CONTRACT.approve(msg.sender, distributionMethods);
        require(successDist, "Distribution Approve failed");
    }

    // ------------------------------
    // VIEW FUNCTIONS
    // ------------------------------
    function getContractRewards(string memory _validatorAddr) public view returns (DecCoin[] memory) {
        return DISTRIBUTION_CONTRACT.delegationRewards(address(this), _validatorAddr);
    }

    function getUndelegations(string memory _validatorAddr) public view returns (UnbondingDelegationEntry[] memory) {
        return STAKING_CONTRACT.unbondingDelegation(address(this), _validatorAddr);
    }

    function getDelegation(address _sender, string memory _valAddr) public view returns (uint256, Coin memory) {
        return STAKING_CONTRACT.delegation(_sender, _valAddr);
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getPendingUndelegations() public view returns (UnbondingRequest[] memory){
        return unbondingDelegations[msg.sender];
    }

    // ------------------------------
    // HELPER FUNCTIONS
    // ------------------------------

    // Uses the DIARandomOracle contract to generate a random number
    function _getRandomNumber(uint256 _bound) internal view returns (uint256) {
        uint256 lastRound = DIARandomOracleI(oracleAddress).getLastRound();
        string memory randomness = DIARandomOracleI(oracleAddress).getRandomValueFromRound(lastRound);
        uint256 randomNumber = uint256(keccak256(abi.encodePacked(randomness))) % _bound;
        return randomNumber;
    }

    // Shuffles the participants before each draw so the order doesn't affect the winner
    function _shuffleParticipants() private {
        for (uint256 i = participants.length - 1; i > 0; i--) {
            uint256 j = _getRandomNumber(participants.length) % (i + 1);
            (participants[i], participants[j]) = (participants[j], participants[i]);
        }
    }

    // Approves the required Staking messages before the executing of a staking transaction.
    function _approveRequiredMsgs(uint256 _amount, string[] memory _stakingMethod) internal {
        bool successStk = STAKING_CONTRACT.approve(msg.sender, _amount, _stakingMethod);
        require(successStk, "Staking Approve failed");
    }
}
