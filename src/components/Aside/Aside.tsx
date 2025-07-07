import React, { useEffect, useState } from 'react'
import TEXT_ICON from '@icons/devflow-text-icon.png'
import LOGO_ICON from '@icons/devflow-logo-icon.png'
import DEFAULT_ICON from '@icons/default_icon.png'

import './Aside.scss'

import { Link, useLocation } from 'react-router-dom';
import AsideIconSelector from './AsideIconSelector';
import { LuPanelLeftClose } from "react-icons/lu";
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks'
import { ROUTES } from '@/routes/routes'
import { BASE_URL, checkUserRole } from '@/utils/constants'
import { IoMdClose, IoMdNotificationsOutline } from 'react-icons/io'
import { fetchNotifications } from '@/features/slice/notifications/notificationsSlice'
import { BiSolidReport } from "react-icons/bi";


type pages = {
    text: string,
    link: string
}

const pagesList = [
    {
        text: 'Дашборд',
        link: 'dashboard'
    },
    {
        text: 'Проекты',
        link: 'projects'
    },


];


const Aside = () => {

    const dispatch = useAppDispatch()

    const location = useLocation();
    const [asideOpen, setAsideOpen] = useState(false);

    const {currentUser} = useAppSelector(({users}) => users)
    const {notificationsList} = useAppSelector(({notifications}) => notifications)

    const sortedNotifications = notificationsList.filter((notification) => (
        notification.is_read === 'false'
    )) || []

    useEffect(() => {
        if (!currentUser?.id) return;
        
        dispatch(fetchNotifications(currentUser.id));
        
        const interval = setInterval(() => {
        dispatch(fetchNotifications(currentUser.id));
        }, 10000);
        
        return () => clearInterval(interval);
    }, [currentUser?.id, dispatch]);

    const isActiveLink = (link: string) => {
        if (link === 'projects') {
            return location.pathname.startsWith('/projects');
        }
        return location.pathname === `/${link}`;
    };

    const avatarPath = currentUser?.icon;
    let avatarUrl = '';

    if(avatarPath !== '' && avatarPath){
      avatarUrl = `${BASE_URL}${avatarPath}`
    }
    else{
      avatarUrl = DEFAULT_ICON;
    }

    let isAdmin = false

    if(currentUser){
        isAdmin = checkUserRole(currentUser.role)
    }

    const closeAside = () => {

        const aside = document.getElementById('aside');

        if(aside){
            aside.style.transform = 'translateX(-100%)'
        }
    }

  return (
    <aside id='aside' className={`aside ${asideOpen? 'active' : ''}`}>

        <IoMdClose
            className='close-aside'
            onClick={closeAside}
        />
        <div className="aside__header">
            {asideOpen?
                <img
                    src={TEXT_ICON}
                    alt="DevFlow"
                    className="aside__header-logo" 
                />
            :
                <img
                    src={LOGO_ICON}
                    alt="DevFlow"
                    className="aside__header-logo-small"
                    onClick={() => setAsideOpen(true)} 
                />
            }
            
            <LuPanelLeftClose
                className='aside__header-close'
                onClick={() => setAsideOpen(false)}
                title='Close'
            />
        </div>

        <div className="aside__pages">
            <div className="aside__pages-main">
                {pagesList.map(({text, link}:pages, i:number) =>(
                    <Link key={i} to={`/${link}`} 
                        className='pages-link'
                    >
                        <div className="aside__pages-item">
                            <div
                                className={`aside__pages-item-icon ${isActiveLink(link) ? 'active' : ''}`}
                            >
                                {AsideIconSelector(text)}

                                {!asideOpen && (
                                    <span className="aside__tooltip">
                                        {text}
                                    </span>
                                )}
                            </div>
                            <p className="aside__pages-item-text">{text}</p>
                        </div>
                    </Link>
                ))}

                {isAdmin &&
                    <Link to={ROUTES.REPORTS} className='pages-link'>
                        <div className="aside__pages-item">

                            <div
                                className={`aside__pages-item-icon ${isActiveLink('reports') ? 'active' : ''}`}
                            >

                                <BiSolidReport className='pages-icon'/>
                                    

                                {!asideOpen && (
                                    <span className="aside__tooltip">
                                        {'Отчеты'}
                                    </span>
                                )}                           

                            </div>
                            <p className="aside__pages-item-text">Отчеты</p>
                        </div>
                    </Link>
                }

                
                
                <Link to={ROUTES.NOTIFICATIONS} className='pages-link'>
                    <div className="aside__pages-item">

                        <div
                            className={`aside__pages-item-icon ${isActiveLink('notifications') ? 'active' : ''}`}
                        >

                            <div className="item-icon-box">
                                <IoMdNotificationsOutline className='pages-icon'/>
                                {sortedNotifications.length > 0 && 
                                    <span className='notification-count'>{sortedNotifications.length}</span>
                                }
                                
                            </div>

                            {!asideOpen && (
                                <span className="aside__tooltip">
                                    {'Уведомления'}
                                </span>
                            )}                           

                        </div>
                        <p className="aside__pages-item-text">Уведомления</p>
                    </div>
                </Link>
            </div>

            {currentUser && 
                <Link to={ROUTES.PROFILE}>
                    <div className="aside__pages-profile">

                        <div className="aside__pages-profile-icon">
                            <img src={avatarUrl} alt="" />
                        </div>

                        <p className="aside__pages-profile-name">
                            {currentUser?.name}
                        </p>
                    </div>
                </Link>
            }

        </div>
    </aside>
  )
}

export default Aside