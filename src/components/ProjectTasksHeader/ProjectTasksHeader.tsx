import React, { useEffect, useState } from 'react'

import { IoMdClose } from "react-icons/io";
import { FaEllipsisV } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";

import DEFAULT_ICON from '@icons/default_icon.png'

import './ProjectTasksHeader.scss'
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/routes/routes';
import { ProjectTeam, toggleProjectEditForm, toggleProjectTab, toggleTeamWindow } from '@/features/slice/projects/projectsSlice';
import { BASE_URL, checkUserRole } from '@/utils/constants';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import EditProjectInfo from '../EditProjectInfo/EditProjectInfo';
import EditProjectOverlay from '../EditProjectOverlay/EditProjectOverlay';
import TaskAddOverlay from '../TaskAddOverlay/TaskAddOverlay';
import AddUsersToProject from '../AddUsersToProject/AddUsersToProject';



const ProjectTasksHeader = () => {

    const dispatch = useAppDispatch();

    const {currentUser} = useAppSelector(({users}) => users);
    const {projectTeam, stateProjectEditForm, activeProject, projectsTab} = useAppSelector(({projects}) => projects);

    const {taskAddOpen, curentTaskStatus} = useAppSelector(({tasks}) => tasks)
    const [editProject, setEditProject] = useState(false)

    const [addUsers, setAddUsers] = useState(false)

    const filteredProjectTeam = projectTeam?.filter((_, i: number) => i < 3) || [];

    let isAdmin = false;

    if(currentUser){
        isAdmin = checkUserRole(currentUser.role)
    }

    const closeEditProjectOverlay = () =>{
        dispatch(toggleProjectEditForm(false))
    }

    const navigate = useNavigate();

    useEffect(() => {

        if(window.innerWidth <= 1400){
            const projectsList = document.getElementById('projectslist')

            if(projectsList){
                projectsList.style.display = 'none'
            }
        }
    })

    const closeProject = () => {
        navigate(ROUTES.PROJECTS);

        if(window.innerWidth <= 1400){
            const projectsList = document.getElementById('projectslist')

            if(projectsList){
                projectsList.style.display = 'flex'
            }
        }
    }

    const openTeamWindow = () => {
        dispatch(toggleTeamWindow(true))
    }

    const openAddUsersWindow = () =>{
        setAddUsers(true)
    }

    const closeAddUsersWindow = () =>{
        setAddUsers(false)
    }

    const handleProjectsTab = (tab: string) =>{
        dispatch(toggleProjectTab(tab))
    }

  return (

    <div className='projecttasks__header'>

        <div className="projecttasks__header-project">
            <p className="projecttasks__header-project-title">
                {activeProject.name}
            </p>

            <div className="projecttasks__header-buttons">
                <IoMdClose
                    className='projecttasks__header-buttons-icons'
                    onClick={closeProject}
                />
                {isAdmin &&
                    <FaEllipsisV
                        className='projecttasks__header-buttons-icons elipsis'
                        onClick={() => setEditProject(prev => !prev)}
                    />
                }
                
                {editProject && <EditProjectInfo/>}
                
            </div>
        </div>

        <p className="projecttasks__header-type">
            {activeProject.type}
        </p>

        <div className="projecttasks__header-bottom">

            <div className="projecttasks__header-tabs">

                {/* <div 
                    className={`projecttasks__header-tabs-item ${projectsTab === 'discussions' ? 'active' : ''}`}
                    onClick={() => handleProjectsTab('discussions')}
                >
                    <p className="projecttasks__header-tabs-name">Обсуждение</p>
                </div> */}

                <div 
                    className={`projecttasks__header-tabs-item ${projectsTab === 'tasks' ? 'active' : ''}`}
                    onClick={() => handleProjectsTab('tasks')}
                >
                    <p className="projecttasks__header-tabs-name">Задачи</p>
                </div>

                <div 
                    className={`projecttasks__header-tabs-item ${projectsTab === 'overview' ? 'active' : ''}`}
                    onClick={() => handleProjectsTab('overview')}
                >
                    <p className="projecttasks__header-tabs-name">Обзор</p>
                </div>

            </div>

            <div className="projecttasks__header-bottom-team">

                {(filteredProjectTeam.length > 0)?
                    <div
                        className="projecttasks__header-bottom-team-box"
                        onClick={openTeamWindow}
                    >

                        {filteredProjectTeam?.map(({user_id, user_icon}:ProjectTeam) => {

                            let iconUrl = '';
                            if(user_icon !== '' && user_icon){
                                iconUrl = `${BASE_URL}${user_icon}`
                            }
                            else{
                                iconUrl = DEFAULT_ICON
                            }
                            
                            return(
                                <div key={user_id} className="team-box-avatar">
                                    <img src={iconUrl} alt="" className='team-box-avatar-icon'/>
                                </div>
                            )
                        })}

                        {(projectTeam !== null && projectTeam?.length > 3) && 
                            <div className="team-box-avatar">
                                <p>+{projectTeam?.length - 3}</p>
                            </div>
                        }

                    </div>
                    :
                    <div className="projecttasks__header-bottom-team-box">
                        <p>Список участников пуст</p>
                    </div>

                }                

                {isAdmin && 
                    <div
                        className="projecttasks__header-bottom-team-add"
                        onClick={openAddUsersWindow}
                    >
                        <FaPlus className='plus-icon'/>
                    </div>
                }
                
            </div>
        </div>

        {stateProjectEditForm &&
            <>
                <div onClick={closeEditProjectOverlay} className="overlay"></div>
                <EditProjectOverlay/>
            </>
        }

        {taskAddOpen &&
    
            <TaskAddOverlay
                status={curentTaskStatus}
            />
        }

        {addUsers && 
            <>
                <div className="overlay"></div>
                <AddUsersToProject
                    projectId={activeProject.id}
                    closeModal={closeAddUsersWindow}
                />
            </>
        }

        
    </div>
  )
}

export default ProjectTasksHeader