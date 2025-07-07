
import React, { useState } from 'react'

import './TeamWindow.scss'
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks'
import { removeProjectTeamUser } from '@/features/slice/projects/projectsSlice'

type User = {
    user_id: number,
    name: string,
    surname: string
}

type Props = {
    selectedUser: User | null,
    closeForm: () => void
}

const DeleteTeamUser = ({selectedUser, closeForm}: Props) => {
    const {activeProject} = useAppSelector(({projects}) => projects);
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState(false);

    const handleDeleteUser = async () => {
        if (!selectedUser || !activeProject) return;
        
        setIsLoading(true);
        try {
            await dispatch(removeProjectTeamUser({
                projectId: activeProject.id, 
                userId: selectedUser.user_id
            })).unwrap();
            
            closeForm();
        } catch (error) {
            console.error('Ошибка при удалении пользователя:', error);
            // Можно добавить отображение ошибки пользователю
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='userdelete'>
            <p className="userdelete__title">Удаление пользователя</p>

            <p className="userdelete__warning">
                Вы действительно хотите удалить из проекта пользователя 
                <span> {selectedUser?.name} {selectedUser?.surname}</span>?
            </p>

            <div className="userdelete__action">
                <button
                    className='userdelete__action-button cancel'
                    onClick={closeForm}
                    disabled={isLoading}
                >
                    Отмена
                </button>

                <button
                    className='userdelete__action-button accept'
                    onClick={handleDeleteUser}
                    disabled={isLoading}
                >
                    {isLoading ? 'Удаление...' : 'Да'}
                </button>
            </div>
        </div>
    );
};

export default DeleteTeamUser