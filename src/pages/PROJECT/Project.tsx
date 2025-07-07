import ProjectsList from '@/components/ProjectsList/ProjectsList'
import React, { useEffect } from 'react'

import '@styles/index.scss'
import { Outlet } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks'
import { getAllProjects, getUserProjects } from '@/features/slice/projects/projectsSlice'
import { checkUserRole } from '@/utils/constants'


const Project = () => {

  const dispatch = useAppDispatch();

  const {currentUser} = useAppSelector(({users}) => users);

  
  
  useEffect(() => {
    if(currentUser) {
      if(checkUserRole(currentUser.role)){
        dispatch(getAllProjects());
      }
      else{
        dispatch(getUserProjects(currentUser.id))
      }
    }
  }, [dispatch]);
  
  return (
    <div className='project'>
      <ProjectsList/>
      <Outlet/>
    </div>
  )
}


export default Project