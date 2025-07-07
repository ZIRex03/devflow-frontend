import React, { useState } from 'react'

import './TaskInfoWindow.scss'

import DEFAULT_ICON from '@icons/default_icon.png'

import { MdDeleteForever, MdOutlineKeyboardArrowLeft } from "react-icons/md";

import { IoShareSocialOutline } from "react-icons/io5";
import { MdOutlineEdit } from "react-icons/md";
import { FaPlus } from 'react-icons/fa';
import { BASE_URL, checkUserRole, monthName } from '@/utils/constants';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import TaskEditOverlay from '../TaskEditOverlay/TaskEditOverlay';
import { deleteTask, getProjectTasks } from '@/features/slice/tasks/tasksSlice';
import AddUsersToTask from '../AddUsersToTask/AddUsersToTask';

type User = {
  id: number,
  user_name: string,
  user_surname: string
  icon: string,
}

type Props = {
    closeForm: () => void,
    isActiveForm: boolean,
    name: string,
    description: string,
    assignedUsers: User[];
    status: string,
    priority: string,
    image: string,
    start_date: Date,
    end_date: Date
    id: number
}

type Task = {
    id: number,
    name: string,
    description: string,
    status: string,
    priority: string,
    start_date: Date,
    end_date: Date
}

const TaskInfoWindow = ({closeForm, id, isActiveForm, name, description, assignedUsers, image, start_date, end_date, priority, status}: Props) => {

    const {currentUser} = useAppSelector(({users}) => users)
    const {activeProject} = useAppSelector(({projects}) => projects)
    const [selectedTask, setSelectedTask] = useState<Task | null>(null)

    const [addUsersPage, setAddUsersPage] = useState(false)

    const dispatch = useAppDispatch();

    const [editOverlay, setEditOverlay] = useState(false)

    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    let isAdmin = false;

    if(currentUser){
        isAdmin = checkUserRole(currentUser.role)
    }

    const openEditOVerlay = () => {
        setEditOverlay(true)
    }

    const closeEditOVerlay = () => {
        setEditOverlay(false)
    }

    const openAddUsers = () => {
        setAddUsersPage(true)
    }

    const closeAddUsers = () => {
        setAddUsersPage(false)
    }

    const handleDeleteTask = async () => {
        if (!id) return;
        
        if (window.confirm('Вы уверены, что хотите удалить эту задачу?')) {
          try {
            await dispatch(deleteTask(id)).unwrap();
            dispatch(getProjectTasks(activeProject.id))

            closeForm()
    
          } catch (error) {
            console.error('Ошибка при удалении задачи:', error);
            alert('Не удалось удалить задачу');
          }
        }
    };

  return (
    <div
        className={`taskinfowindow ${isActiveForm? 'active' : ''}`}
        onMouseDown={(e) => e.stopPropagation()}
        onMouseMove={(e) => e.stopPropagation()}
    >
        
        <div className="taskinfowindow__header">

            <div
                className="taskinfowindow__header-title"
                onClick={closeForm}
            >
                <MdOutlineKeyboardArrowLeft
                    className='taskinfowindow__header-title-icon'
                />
                <p className='taskinfowindow__header-title-text'>{activeProject.name}</p>
            </div>

            <div className="taskinfowindow__header-options">
                
                <IoShareSocialOutline
                    className='taskinfowindow__header-options-icon'
                />

                {isAdmin && 
                    <MdOutlineEdit
                        className='taskinfowindow__header-options-icon'
                        onClick={() => {setSelectedTask({id, name, status, description, priority, end_date, start_date})
                        openEditOVerlay()}}
                    />
                }

                {isAdmin &&
                    <MdDeleteForever
                        className='taskinfowindow__header-options-icon delete'
                        onClick={handleDeleteTask}
                    />
                }
                
                
            </div>
        </div>

        <div className="taskinfowindow__main">

            <p className="taskinfowindow__main-title">
                {name}
            </p>

            <p className="taskinfowindow__main-desc">
                {description}
            </p>

            <div className="taskinfowindow__main-assign">

                <p className="taskinfowindow__main-assign-text">
                    Назначено
                </p>

                <div className="taskinfowindow__main-assign-box">

                    {assignedUsers.map(({id, icon, user_name, user_surname}) => {

                        let iconUrl = '';
                        if(icon !== '' && icon){
                            iconUrl = `${BASE_URL}${icon}`
                        }
                        else{
                            iconUrl = DEFAULT_ICON
                        }

                        return(
                            <div key={id} className="taskinfowindow__main-assign-box-user">

                                <div className="taskinfowindow__main-assign-box-user-avatar">
                                    <img src={iconUrl} alt="" />
                                </div>

                                <p className="taskinfowindow__main-assign-box-user-name">
                                    {user_name} {user_surname}
                                </p>
                            </div>
                        )
                    })}

                    
                    {isAdmin &&
                        <div
                            className="taskinfowindow__main-assign-box-add"
                            onClick={() => {setSelectedTask({id, name, status, description, priority, end_date, start_date})
                            openAddUsers()}}
                        >
                            <FaPlus className='plus-icon' />
                        </div>
                    }
                    

                </div>

                
            </div>

            <div className="taskinfowindow__main-timeline">

                <p className="taskinfowindow__main-timeline-text">
                    Срок
                </p>

                <div className="taskinfowindow__main-timeline-date">

                    <p>
                        {monthName.get(startDate.getMonth())} {startDate.getDate()}, {startDate.getFullYear()}
                    </p>

                    <p>до</p>

                    <p>
                        {monthName.get(endDate.getMonth())} {endDate.getDate()}, {endDate.getFullYear()}
                    </p>
                </div>

                
            </div>

            {image !== '' && image &&
                <div className="taskinfowindow__main-image">
                    <img src={`${BASE_URL}${image}`} alt="" />
                </div>
            }

            
        </div>

        {addUsersPage && selectedTask &&
            <AddUsersToTask
                assignUsers={assignedUsers}
                closeModal={closeAddUsers}
                taskId={selectedTask.id}
            />
        }

        {editOverlay && selectedTask && 
            <TaskEditOverlay
                id={selectedTask.id}
                name={selectedTask.name}
                priority={selectedTask.priority}
                description={selectedTask.description}
                start_date={selectedTask.start_date}
                end_date={selectedTask.end_date}
                status={selectedTask.status}
                closeForm={closeEditOVerlay}
            />
        }

            
    </div>
  )
}

export default TaskInfoWindow