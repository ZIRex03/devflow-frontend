import React from 'react'

import './Dashboard.scss'
import { useAppSelector } from '@/hooks/reduxHooks'
import { checkUserRole } from '@/utils/constants'
import AdminDashboard from '@/components/AdminDashboard/AdminDashboard'
import UserDashboard from '@/components/UserDashboard/UserDashboard'


const Dashboard = () => {

  const {currentUser} = useAppSelector(({users}) => users)

  let isAdmin = false;

  if(currentUser){
    isAdmin = checkUserRole(currentUser.role)
  }
  return (
    <div className='dashboard'>
      <p className="dashboard-title">Дашборд</p>

      {isAdmin?
        <>
          <AdminDashboard/>
        </>
        :
        <>
          <UserDashboard/>
        </>
      }
    </div>
  )
}

export default Dashboard