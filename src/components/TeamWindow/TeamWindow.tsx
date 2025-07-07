import React, { useState } from 'react'

import './TeamWindow.scss';

import { IoMdClose } from "react-icons/io";
import { AiOutlineUserDelete } from "react-icons/ai";

import DEFAULT_ICON from '@icons/default_icon.png'
import { useAppSelector } from '@/hooks/reduxHooks';
import { ProjectTeam } from '@/features/slice/projects/projectsSlice';
import { BASE_URL, checkUserRole } from '@/utils/constants';
import DeleteTeamUser from './DeleteTeamUser';

type Props = {
    closeForm: () => void
}

type User = {
    user_id: number,
    name: string,
    surname: string
}


const TeamWindow = ({closeForm}: Props) => {

    const {projectTeam} = useAppSelector(({projects}) => projects);
    const {currentUser} = useAppSelector(({users}) => users)
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [deleteForm, setDeleteForm] = useState(false);

    let isAdmin = false;

    if(currentUser){
        isAdmin = checkUserRole(currentUser.role)
    }

    const openDeleteForm = (user: User) => {
        setSelectedUser(user)
        setDeleteForm(true)
    }

    const closeDeleteForm = () => {
        setDeleteForm(false)
        setSelectedUser(null)
    }

  return (
    <div className='teamwindow'>
        
        <div className="teamwindow__header">

            <p className="teamwindow__header-title">
                Список участников проекта
            </p>

            <IoMdClose
                className='teamwindow__header-close'
                onClick={closeForm}
            />

        </div>

        <div className="teamwindow__box">

            {projectTeam?.map(({user_id, user_icon, name, surname}:ProjectTeam) => {

                let iconUrl = '';

                if(user_icon !== '' && user_icon){
                    iconUrl = `${BASE_URL}${user_icon}`
                }
                else{
                    iconUrl = DEFAULT_ICON
                }

                return(
                    <div key={user_id} className="teamwindow__box-user">

                        <div className="teamwindow__box-user-info">

                            <div className="teamwindow__box-user-info-avatar">
                                <img src={iconUrl} alt="" />
                            </div>

                            <p className="teamwindow__box-user-info-name">
                                {name} {surname}
                            </p>
                        </div>

                        {isAdmin &&
                            <AiOutlineUserDelete
                                className='teamwindow__box-user-delete'
                                title='Удалить пользователя'
                                onClick={() => openDeleteForm({user_id, name, surname})}
                            />
                        }

                        

                    </div> 
                )
                
            })}
            
        </div>

        {deleteForm &&
            <>
                <div 
                    className="overlay-delete"
                    onClick={closeDeleteForm}
                >
                </div>
                <DeleteTeamUser
                    selectedUser={selectedUser}
                    closeForm={closeDeleteForm}
                />
   
            </>
        }
        
    </div>

    
  )
}

export default TeamWindow