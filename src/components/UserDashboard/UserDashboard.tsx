import React, { useEffect } from 'react'

import './UserDashboard.scss'
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks'
import { getUserTasks } from '@/features/slice/tasks/tasksSlice'
import { HiOutlineLightBulb } from "react-icons/hi";
import { RxLapTimer } from "react-icons/rx";
import { translatePriority, translateStatus } from '@/utils/constants';
import DeadlineTimer from './DeadlineTimer';

interface Task {
  id: number;
  name: string;
  description?: string;
  image?: string;
  priority: string;
  status: string;
  start_date?: string | Date;
  end_date: Date;
  project_id?: number;
}


const UserDashboard = () => {

    const dispatch = useAppDispatch()
    const {allUserTasks} = useAppSelector(({tasks}) => tasks)
    const {currentUser} = useAppSelector(({users}) => users)

    useEffect(() =>{
        if(currentUser){
            dispatch(getUserTasks(currentUser.id))
        }
        
    }, [dispatch, currentUser])

    const getUpcomingTasks = (tasks: Task[] ): Task[] => {

        if(!tasks) return []
        const now = new Date();
        
        return tasks
            .filter((task): task is Task & { end_date: string | Date } => {
                return !!task.end_date && new Date(task.end_date) >= now;
            })
            .sort((a, b) => {
                const dateA = new Date(a.end_date).getTime();
                const dateB = new Date(b.end_date).getTime();
                return dateA - dateB;
            })
            .slice(0, 5);
    };

    const upcomingTasks = allUserTasks ? getUpcomingTasks(allUserTasks) : [];

  return (
    <div className='dashboard__box'>

        <div className="dashboard__content">

            <div className="dashboard__content-alltask">
                <p className="dashboard__content-alltask-title">
                    Мои задачи
                </p>


                {allUserTasks.length > 0? 
                    <div className="dashboard__content-alltask-box">
                        {allUserTasks.map(({id, name, priority, project_name, status}) => (
                            <div key={id} className="task__box">

                                <HiOutlineLightBulb className='bulb-icon'/>
                                <div className="task__box-info">
                                    <p className="task__box-info-title">
                                        {name}
                                    </p>

                                    <div className="task__box-info-desc">
                                        <p className="task__box-info-desc-project">
                                            Из проекта: {project_name}
                                        </p>
                                        <p className={`task__box-info-desc-status ${status}`}>
                                            {translateStatus.get(status)}
                                        </p>
                                        <p className={`task__box-info-desc-priority ${translatePriority.get(priority)}`}>
                                            {priority}
                                        </p>

                                        
                                    </div>

                                    <div className="task__box-info-desc-mobile">
                                        <p className="task__box-info-desc-project">
                                            Из проекта: {project_name}
                                        </p>
                                        <div className="flexbox">
                                            <p className={`task__box-info-desc-status ${status}`}>
                                                {translateStatus.get(status)}
                                            </p>
                                            <p className={`task__box-info-desc-priority ${translatePriority.get(priority)}`}>
                                                {priority}
                                            </p>
                                        </div>
                                        
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                    :
                    <>
                        <p className='empty-task'>Нет назначенных задач</p>
                    </>
                }
            </div>

            <div className="dashboard__content-deadlinetask">
                <p className="dashboard__content-deadlinetask-title">
                    Истекает срок сдачи
                </p>

                {upcomingTasks.length > 0?
                    <div className="dashboard__content-deadlinetask-box">
                        {upcomingTasks.map(({id, project_name, name, end_date}) => (
                            <div key={id} className="deadline__box">

                                <div className="deadline__box-main">
                                    <RxLapTimer className='timer-icon'/>
                                    <div className="deadline__box-main-info">
                                        <p className='deadline__box-main-info-title'>
                                            {name}
                                        </p>
                                        <div className="deadline__box-main-info-desc">
                                            <p className="deadline__box-info-desc-project">
                                                Из проекта: {project_name}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <DeadlineTimer endDate={end_date}/>
                            </div>
                        ))}
                    </div>
                    :
                    <>
                        <p className='empty-task'>Нет назначенных задач</p>
                    </>
                }
            </div>
        </div>

    </div>
  )
}

export default UserDashboard