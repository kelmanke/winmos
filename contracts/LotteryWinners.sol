// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LotteryWinners is Ownable {
    using SafeMath for uint256;

    address lotteryContract;
    // Winner struct that keeps track of each winner after every round
    struct Winner {
        uint16 round;
        uint256 winningNumber;
        address winnerAddress;
        uint256 winingAmount;
        uint256 timestamp;
    }
    // Map that keeps track of winnings
    mapping(address => uint256) public winnings;
    // The winners array stores all historical winners.
    Winner[] public winners;

    event WithdrawWinnings(address indexed _to, uint256 _value);

    // Withdraw winnings from contract
    function withdrawWinnings() public {
        require(winnings[msg.sender] > 0, "You have no winnings yet");
        payable(msg.sender).transfer(winnings[msg.sender]);
        winnings[msg.sender] = 0;
        emit WithdrawWinnings(msg.sender, winnings[msg.sender]);
    }

    // Deposits the winnings after a winner is picked
    function depositWinnings(uint256 _winningNumber, uint256 _amountWon, address _winnerAddr) payable public {
        require(msg.value > 0, "You need to send money to this contract");
        require(msg.sender == lotteryContract, "You are not the lottery contract");
        winners.push(Winner(uint16(winners.length + 1), _winningNumber, _winnerAddr, _amountWon, block.timestamp));
        winnings[_winnerAddr] = SafeMath.add(winnings[_winnerAddr], _amountWon);
    }

    // ------------------------------
    // VIEW FUNCTIONS
    // ------------------------------
    function getNumberOfRounds() public view returns (uint256){
        return winners.length;
    }

    function getAllWinners() public view returns (Winner[] memory) {
        return winners;
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    // ------------------------------
    // OWNER FUNCTIONS
    // ------------------------------
    function setLotteryContract(address _newAddr) public onlyOwner {
        lotteryContract = _newAddr;
    }

}
