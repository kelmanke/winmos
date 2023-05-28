import './assets/css/App.css'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { Lottery } from './components/pages/lottery'
import { Winners } from './components/pages/winners'
import UnbondingTable from './components/pages/unbonding'

function App() {
  const router = createBrowserRouter([
    { path: '/lottery', element: <Lottery /> },
    { path: '/winners', element: <Winners /> },
    { path: '/unbonding', element: <UnbondingTable /> },
    { path: '*', element: <Navigate to='/lottery' replace /> }
  ])

  return <RouterProvider router={router} />
}

export default App
