import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { ROUTES } from './routes'
import Main from '@/pages/MAIN/Main'
import UserForm from '@/pages/USERFORM/UserForm'
import AsideLayout from '@/components/AsideLayout/AsideLayout'
import Dashboard from '@/pages/DASHBOARD/Dashboard'
import Project from '@/pages/PROJECT/Project'
import ProjectTasks from '@/pages/PROJECT/ProjectTasks'
import Profile from '@/pages/PROFILE/Profile'
import ProtectedRoute from './ProtectedRoute'

import PREVIEW_PROJECT from '@images/projects/project-preview.png'

import '@styles/index.scss'
import Notifications from '@/pages/NOTIFICATIONS/Notifications'
import Reports from '@/pages/REPORTS/Reports'
import GenerateReports from '@/pages/REPORTS/GenerateReports'
import ReportsView from '@/pages/REPORTS/ReportsView'


const AppRoutes = () => {

  return (
    <Routes>
      <Route path={ROUTES.MAIN} element={<Main/>}/>
      <Route path={ROUTES.USERFORM} element={<UserForm/>}/>
      <Route element={<ProtectedRoute />}>
        <Route element={<AsideLayout/>}>
          <Route path={ROUTES.DASHBOARD} element={<Dashboard/>}/>
          <Route path={ROUTES.PROJECTS} element={<Project/>}>
            <Route index element=
            {<div className='choose-project'>
              <p>Выберите проект на панели проектов</p>
              <img src={PREVIEW_PROJECT} alt="" />
            </div>}/>
              <Route path=":projectId" element={<ProjectTasks/>}/> 
          </Route>
          <Route path={ROUTES.NOTIFICATIONS} element={<Notifications/>}/>
          <Route path={ROUTES.REPORTS} element={<Reports/>}/>
          <Route path={ROUTES.REPORTS_GENERATE} element={<GenerateReports/>}/>
          <Route path={ROUTES.REPORTS_VIEW} element={<ReportsView/>}/>
          <Route path={ROUTES.PROFILE} element={<Profile/>}/>
        </Route>
      </Route>
    </Routes>
  );
};


export default AppRoutes