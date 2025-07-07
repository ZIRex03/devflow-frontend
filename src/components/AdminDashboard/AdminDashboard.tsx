import React, { useEffect } from 'react'

import './AdminDashboard.scss'
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks'
import DoughnutAdmin from './DoughnutAdmin/DoughnutAdmin'
import { getAllProjects } from '@/features/slice/projects/projectsSlice';
import BarchartAdmin from './BarchartAdmin/BarchartAdmin';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/routes/routes';
import ProjectsIconSelector from '../ProjectsList/ProjectsIconSelector';
import { FaExternalLinkAlt } from 'react-icons/fa';


function AdminDashboard() {

    const dispatch = useAppDispatch();

    useEffect(() =>{
        dispatch(getAllProjects())
    }, [dispatch])

    const {projectsList} = useAppSelector(({projects}) => projects)

    const currentDate = new Date()

    const deadlineProjectsList = projectsList?.filter((project) => {
        const endDate = new Date(project.end_date)
        return ((currentDate > endDate) && project.status !== 'done')
    }) || []


    return (

        <div className="dashboard__box">
            <div className='dashboard__content'>

                <div className="dashboard__content-projects">

                    <p className="dashboard__content-projects-title">
                        Количество проектов: {projectsList?.length}
                    </p>
                    <DoughnutAdmin/>
                </div>

                <div className="dashboard__content-users">
                    <p className="dashboard__content-users-title">
                        Самые загруженные разработчики
                    </p>

                    <BarchartAdmin/>
                </div>
            </div>

            <div className="dashboard__deadlines">
                <p className='dashboard__deadlines-title'>Просроченные проекты</p>
                {deadlineProjectsList.length > 0?
                    <div className='dashboard__deadlines-box'>
                        <p className='dashboard__deadlines-box-title'>Обратите внимание у вас есть просроченные проекты</p>
                        {deadlineProjectsList.map(({id, name, type}) => (
                            <Link to={`${ROUTES.PROJECTS}/${id}`} className='dashboard__deadlines-box-project'>
                                <div className="project-main">
                                    <div className="dashboard__deadlines-box-project-icon">
                                        {ProjectsIconSelector(type)}
                                    </div>
                                    <div className="dashboard__deadlines-box-project-info">
                                        <p className='info-name'>{name}</p>
                                        <p className='info-type'>{type}</p>
                                    </div>
                                    
                                </div>

                                <FaExternalLinkAlt className='link-icon'/>
                                
                            </Link>
                        ))}
                    </div>
                    :
                    <>
                        <p className='dashboard__deadlines-box-title normal'>у вас нет просроченных проектов</p>
                    </>
                }
            </div>
        </div>
        
    )
}

export default AdminDashboard