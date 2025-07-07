import React from 'react'

import './Notifications.scss'
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks'

import { IoFolderOpenOutline } from "react-icons/io5";
import { MdOutlineTask } from 'react-icons/md';
import { markAllNotificationsAsRead } from '@/features/slice/notifications/notificationsSlice';

const Notifications = () => {

    const dispatch = useAppDispatch()
    const {notificationsList} = useAppSelector(({notifications}) => notifications)
    const {currentUser} = useAppSelector(({users}) => users)

    const handleMarkNotifications = () => {
        if(currentUser){
            dispatch(markAllNotificationsAsRead(currentUser.id))
        }
    }

  return (
    <div className='notifications'>

        <p className="notifications-title">
            Уведомления
        </p>

        <button
            className="notifications-read"
            onClick={handleMarkNotifications}
            disabled={notificationsList.every(n => n.is_read === 'true')}
        >
            отметить все прочитанным
        </button>

        <div className="notifications__box">
            {notificationsList.map(({id, type, created_time, message, is_read}) => (
                <div key={id} className={`notifications__box-item ${is_read === 'false'? 'active' : ''}`}>
                    {type === 'project'?
                        <IoFolderOpenOutline className='item-icon'/>
                    :
                        <MdOutlineTask className='item-icon'/>
                    }

                    <div className="notifications__box-item-info">

                        <p className="notifications__box-item-info-message">
                            {message}
                        </p>

                        <p className="notifications__box-item-info-time">
                            {new Date(created_time).toLocaleString()}
                        </p>
                    </div>

                    {is_read === 'false' &&
                        <span className='unload-banner'>Новое</span>
                    }
                </div>
            ))}
        </div>
    </div>
  )
}

export default Notifications