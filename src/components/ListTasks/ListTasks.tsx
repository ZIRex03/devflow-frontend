import React from 'react'

import './ListTasks.scss'

import { FaPlus } from "react-icons/fa6";
import ListTasksItem from './ListTasksItem';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { checkUserRole } from '@/utils/constants';
import { setCurrentTaskStatus, toggleTaskAdd } from '@/features/slice/tasks/tasksSlice';

const ListTasks = () => {

    const {tasksList} = useAppSelector(({tasks}) => tasks)
    const {currentUser} = useAppSelector(({users}) => users)
    const dispatch = useAppDispatch()

    let isAdmin = false;
      
    if(currentUser){
        isAdmin = checkUserRole(currentUser.role)
    }

    const todoTasks = tasksList?.filter((task) => (
        task.status === 'todo'
    )) || [];

    const progressTasks = tasksList?.filter((task) => (
        task.status === 'progress'
    )) || [];

    const reviewTasks = tasksList?.filter((task) => (
        task.status === 'review'
    )) || [];

    const completedTasks = tasksList?.filter((task) => (
        task.status === 'completed'
    )) || [];

    const openAddTask = (status: string) => {
        dispatch(setCurrentTaskStatus(status))
        dispatch(toggleTaskAdd(true))
    }

  return (
    <div className='listtasks'>

        <details className='listtasks__details'>
            <summary className='listtasks__details-header'>

                <div className="listtasks__details-header-title">
                    <p className='listtasks__details-header-title-text todo'>в планах</p>
                    <span className='listtasks__details-header-title-count'>{todoTasks.length}</span>
                </div>

                {isAdmin && 
                    <div className="listtasks__details-header-add">
                        <FaPlus
                            className='listtasks__details-header-add-icon'
                            onClick={() => openAddTask('todo')}
                        />
                    </div>
                }
                
            </summary>

            <ListTasksItem taskList={todoTasks}/>
            
        </details>

        <details className='listtasks__details'>
            <summary className='listtasks__details-header'>

                <div className="listtasks__details-header-title">
                    <p className='listtasks__details-header-title-text progress'>в работе</p>
                    <span className='listtasks__details-header-title-count'>{progressTasks.length}</span>
                </div>

                {isAdmin && 
                    <div className="listtasks__details-header-add">
                        <FaPlus
                            className='listtasks__details-header-add-icon'
                            onClick={() => openAddTask('progress')}
                        />
                    </div>
                }
                
            </summary>

            <ListTasksItem taskList={progressTasks}/>
            
        </details>
        <details className='listtasks__details'>
            <summary className='listtasks__details-header'>

                <div className="listtasks__details-header-title">
                    <p className='listtasks__details-header-title-text review'>на проверке</p>
                    <span className='listtasks__details-header-title-count'>{reviewTasks.length}</span>
                </div>

                {isAdmin && 
                    <div className="listtasks__details-header-add">
                        <FaPlus
                            className='listtasks__details-header-add-icon'
                            onClick={() => openAddTask('review')}
                        />
                    </div>
                }
                
            </summary>

            <ListTasksItem taskList={reviewTasks}/>
            
        </details>
        <details className='listtasks__details'>
            <summary className='listtasks__details-header'>

                <div className="listtasks__details-header-title">
                    <p className='listtasks__details-header-title-text completed'>завершено</p>
                    <span className='listtasks__details-header-title-count'>{completedTasks.length}</span>
                </div>

                {isAdmin && 
                    <div className="listtasks__details-header-add">
                        <FaPlus
                            className='listtasks__details-header-add-icon'
                            onClick={() => openAddTask('completed')}
                        />
                    </div>
                }
                
            </summary>

            <ListTasksItem taskList={completedTasks}/>
            
        </details>
    </div>
  )
}

export default ListTasks