
import React, { useEffect, useState } from 'react'

import './EditProjectOverlay.scss'
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { toggleProjectEditForm, updateProject } from '@/features/slice/projects/projectsSlice';

const EditProjectOverlay = () => {
    const dispatch = useAppDispatch();
    const { activeProject, isLoading } = useAppSelector(({ projects }) => projects)
    
    const [formData, setFormData] = useState({
        name: activeProject?.name || '',
        description: activeProject?.description || '',
        type: activeProject?.type || 'Веб-приложение',
        status: activeProject?.status || 'active'
    });

    useEffect(() => {
        if (activeProject) {
            setFormData({
                name: activeProject.name,
                description: activeProject.description,
                type: activeProject.type,
                status: activeProject.status
            });
        }
    }, [activeProject]);

    const closeEditProjectOverlay = () => {
        dispatch(toggleProjectEditForm(false));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!activeProject) return;
        
        try {
            await dispatch(updateProject({
                projectId: activeProject.id,
                projectData: formData
            })).unwrap();
            
            closeEditProjectOverlay();
        } catch (error) {
            console.error('Ошибка при обновлении проекта:', error);
        }
    };

    if (!activeProject) {
        return null;
    }

    return (
        <div className='projectoverlay'>
            <p className="projectoverlay-title">Редактирование проекта</p>

            <form className="projectoverlay__form" onSubmit={handleSubmit}>

                <div className="projectoverlay__form-inputgroup">
                    <label htmlFor="name">Название проекта</label>
                    <input
                        type="text"
                        name='name'
                        id='name'
                        placeholder='Введите название проекта'
                        value={formData.name}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="projectoverlay__form-inputgroup">
                    <label htmlFor="description">Описание проекта</label>
                    <textarea
                        name='description'
                        id='description'
                        placeholder='Введите описание проекта'
                        value={formData.description}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="projectoverlay__form-selectgroup">
                    <label htmlFor="type">Тип проекта</label>
                    <select
                        name="type"
                        id="type"
                        value={formData.type}
                        onChange={handleInputChange}
                    >
                        <option value="Веб-приложение">Веб-приложение</option>
                        <option value="Десктоп">Десктоп</option>
                        <option value="Мобильное приложение">Мобильное приложение</option>
                        <option value="Веб-сайт">Веб-сайт</option>
                    </select>
                </div>

                <div className="projectoverlay__form-selectgroup">
                    <label htmlFor="status">Статус проекта</label>
                    <select
                        name="status"
                        id="status"
                        value={formData.status}
                        onChange={handleInputChange}
                    >
                        <option value="active">Активное</option>
                        <option value="hold">Пауза</option>
                        <option value="done">Готово</option>
                    </select>
                </div>
                
                <div className="projectoverlay__form-actions">
                    <button
                        type="button"
                        className='projectoverlay__form-actions-button cancel'
                        onClick={closeEditProjectOverlay}
                        disabled={isLoading}
                    >
                        Отмена
                    </button>

                    <button 
                        type="submit" 
                        className='projectoverlay__form-actions-button accept'
                        disabled={isLoading}
                    >
                        {isLoading ? 'Сохранение...' : 'Сохранить'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditProjectOverlay