import React, { useEffect, useState } from 'react'

import './ListTasks.scss'

import DEFAULT_ICON from '@icons/default_icon.png'

import { IoEllipsisVertical } from 'react-icons/io5'
import { BsPaperclip } from 'react-icons/bs'
import { FiMessageSquare } from 'react-icons/fi'
import { getTasksUsers, Tasks, toggleTaskInfoForm } from '@/features/slice/tasks/tasksSlice'
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks'
import { BASE_URL, translatePriority } from '@/utils/constants'
import TaskInfoWindow from '../TaskInfoWindow/TaskInfoWindow'

type Props = {
  taskList: Tasks[];
};

type Task = {
  id: number;
  name: string;
  priority: string;
  status: string;
  description: string;
  image: string;
  start_date: Date,
  end_date: Date
};

enum TaskPriority {
  Высокий = 3,
  Средний = 2,
  Низкий = 1,
}

type PriorityKey = keyof typeof TaskPriority;

const ListTasksItem = ({taskList}:Props) => {

    const dispatch = useAppDispatch();
    const { taskInfoForm, tasksUsers } = useAppSelector(({ tasks }) => tasks);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    
    const [sortDirection, setSortDirection] = useState<'desc' | 'asc'>('desc');
      
    const getSortedTasks = () => {
        return [...taskList].sort((a, b) => {
          const priorityA = TaskPriority[a.priority as PriorityKey];
          const priorityB = TaskPriority[b.priority as PriorityKey];
          
          return sortDirection === 'desc' 
            ? priorityB - priorityA 
            : priorityA - priorityB;
        });
    };
    
    useEffect(() => {
        taskList.forEach(task => {
            if (!tasksUsers[task.id]) {
                dispatch(getTasksUsers(task.id));
            }
        });
    }, [taskList, dispatch, tasksUsers]);

    const closeTaskInfo = () => {
        dispatch(toggleTaskInfoForm(false));
        setSelectedTask(null);
    };
    
    const openTaskInfo = (task: Task) => {
        setSelectedTask(task);
        dispatch(toggleTaskInfoForm(true));
    };

  return (
    <div className='listtasks__tasks'>

        {getSortedTasks().map((task) => {
            const { id, name, priority, image } = task;
            const users = tasksUsers[id] || [];

            return(
                <div className="listtasks__details-main">

                    <div className="listtasks__details-main-header">
                        <p className={`listtasks__details-main-header-priority ${translatePriority.get(priority)}`}>{priority}</p>
                        <IoEllipsisVertical
                            className='listtasks__details-main-header-info'
                            onClick={() => openTaskInfo(task)}
                        />
                    </div>

                    <p className="listtasks__details-main-title">{name}</p>

                    {image !== '' && image &&
                        <div className="listtasks__details-main-image">
                            <img src={`${BASE_URL}${image}`} alt="" />
                        </div>
                    }       

                    <div className="listtasks__details-main-footer">

                        <div className="listtasks__details-main-footer-options">
                            <div className="listtasks__details-main-footer-options-message">
                                <FiMessageSquare className="message-icon" />
                                <p className="message-count">12</p>
                            </div>
                            
                            <div
                                className="listtasks__details-main-footer-options-files"
                                
                            >
                                <BsPaperclip className="files-icon" />
                                <p className="files-count">4</p>
                            </div>
                        </div>

                        <div className="listtasks__details-main-footer-assign">

                            {users.length > 0?
                            <>
                                <p>Назначена для</p>

                                <div                className="listtasks__details-main-footer-assign-avatars">

                                    {users.slice(0,3).map(({icon}) => {

                                        let iconUrl = '';
                                        if(icon){
                                            iconUrl = `${BASE_URL}${icon}`
                                        }
                                        else{
                                            iconUrl = DEFAULT_ICON
                                        }
                                        return(
                                            <div className="avatars-box">
                                                <img src={iconUrl} alt="" />
                                            </div>

                                            
                                        )
                                    })}

                                    {users.length > 3 && 
                                        <div className="listtasks__details-main-footer-assign-count">
                                            <p>+{users.length - 3}</p>
                                        </div>
                                    }
  
                                </div>

                                

                            </>
                            :
                            <>
                                <p className="listtasks__details-main-footer-assign-text">Нет участников</p>
                            </>
                            }
                            
                        </div>
                    </div>
                </div>
            )
        })}

        {taskInfoForm && selectedTask && (
        <>
          <div
            className='overlays_task'
            onClick={closeTaskInfo}
            onMouseDown={(e) => e.stopPropagation()}
            onMouseMove={(e) => e.stopPropagation()}
          />
          <TaskInfoWindow
            id={selectedTask.id}
            closeForm={closeTaskInfo}
            isActiveForm={taskInfoForm}
            name={selectedTask.name}
            description={selectedTask.description}
            image={selectedTask.image}
            assignedUsers={tasksUsers[selectedTask.id]}
            start_date={selectedTask.start_date}
            end_date={selectedTask.end_date}
            priority={selectedTask.priority}
            status={selectedTask.status}
          />
        </>
      )}
        
    </div>
  )
}

export default ListTasksItem