import React, { useEffect } from 'react'
import './ProjectsOverview.scss'
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks'
import { monthName, translateStatusProject } from '@/utils/constants'
import { getProjectClient, getProjectExtraService, getProjectTechnologies } from '@/features/slice/projects/projectsSlice'

const ProjectsOverview = () => {

  const dispatch = useAppDispatch()
  const {activeProject, projectsTechnologies, projectClient, projectExtraService} = useAppSelector(({projects}) => projects)

  useEffect(() =>{
    dispatch(getProjectTechnologies(activeProject.id))
    dispatch(getProjectClient(activeProject.id))
    dispatch(getProjectExtraService(activeProject.id))
  }, [dispatch, activeProject])   

  const endProjectDate = new Date(activeProject.end_date)

  return (
    <div className='projectsoverview'>
      
      <div className="projectsoverview__desc">
        <p className="projectsoverview__desc-title">Описание</p>
        <p className="projectsoverview__desc-text">
          {activeProject.description}
        </p>
      </div>

      <div className="projectsoverview__hero">

        <div className="projectsoverview__hero__info">
          <p className="projectsoverview__hero__info-title">Информация</p>

          <div className="projectsoverview__hero__info-box">
            <div className="info-box">
              <p className="info-box-name">Статус:</p>
              <p className='info-box-desc'>{translateStatusProject.get(activeProject.status)}</p>
            </div>

            <div className="info-box">
              <p className="info-box-name">Срок:</p>
              <p className='info-box-desc'>{monthName.get(endProjectDate.getMonth())} {endProjectDate.getDate()}, {endProjectDate.getFullYear()}</p>
            </div>

            <div className="info-box">
              <p className="info-box-name">Заказчик:</p>
              {projectClient &&
                <p className='info-box-desc'>{projectClient.client_name}</p>
              }
              
            </div>
          </div>
        </div>

        <div className="projectsoverview__hero__tech">
          <p className="projectsoverview__hero__tech-title">Технологии</p>


            {projectsTechnologies.length > 0 && projectsTechnologies &&

              <ul className="projectsoverview__hero__tech-box">
                {projectsTechnologies.map(({name}) => (
                  <li className="tech-box-item">{name}</li>
                ))}
              </ul>
            }
            
        </div>
      </div>

      <div className="projectsoverview__hero__tech extra">
          <p className="projectsoverview__hero__tech-title">Дополнительные услуги</p>


            {projectExtraService.length > 0 && projectExtraService ?

              <ul className="projectsoverview__hero__tech-box">
                {projectExtraService.map(({extra_service_name}) => (
                  <li className="tech-box-item">{extra_service_name}</li>
                ))}
              </ul>

              :

              <>При заказе данного проекта не были указаны дополнительные услуги</>
            }
            
        </div>
      
    </div>
  )
}

export default ProjectsOverview