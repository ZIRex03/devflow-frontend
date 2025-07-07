import React, { useEffect, useState } from 'react';
import { Calendar } from 'primereact/calendar';
import { addLocale } from 'primereact/api';
import './ProjectAddOverlay.scss';
import { Nullable } from 'primereact/ts-helpers';
import { IoMdClose } from 'react-icons/io';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { createProject, getAllProjects, getAllTechnologies, getUserProjects } from '@/features/slice/projects/projectsSlice';
import { checkUserRole } from '@/utils/constants';

type Props = {
    closeForm: () => void;
}

const ProjectAddOverlay = ({ closeForm }: Props) => {
    const dispatch = useAppDispatch();
    const {isLoading, allTechnologies} = useAppSelector(({projects}) => projects)
    const {currentUser} = useAppSelector(({users}) => users)
    const currentDate = new Date();

    useEffect(() => {
        dispatch(getAllTechnologies())
    }, [dispatch])

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        type: 'Веб-приложение',
    });

    const [selectedTechnologies, setSelectedTechnologies] = useState<number[]>([]);
    const [startDate, setStartDate] = useState<Nullable<Date>>(null);
    const [endDate, setEndDate] = useState<Nullable<Date>>(null);
    const [error, setError] = useState('');

    const formatLocalDate = (date: Date | null): string => {
        if (!date) return '';
        
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        
        return `${year}-${month}-${day}`;
    };

    addLocale('ru', {
        firstDayOfWeek: 1,
        monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
        monthNamesShort: ['Янв', 'Фев', 'Март', 'Апр', 'Май', 'Июнь', 'Июль', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
        today: 'Hoy',
        clear: 'Limpiar'
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleTechnologySelect = (techId: number) => {
        setSelectedTechnologies(prev => 
            prev.includes(techId) 
                ? prev.filter(id => id !== techId) 
                : [...prev, techId]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.name || !startDate || !endDate) {
            setError('Пожалуйста, заполните все обязательные поля');
            return;
        }

        if (startDate > endDate) {
            setError('Дата окончания не может быть раньше даты начала');
            return;
        }

        setError('');

        try {
            const project = await dispatch(createProject({
                name: formData.name,
                description: formData.description,
                type: formData.type,
                start_date: formatLocalDate(startDate),
                end_date: formatLocalDate(endDate),
                status: 'active',
                technologies: selectedTechnologies
            })).unwrap();

            if(currentUser) {
                if(checkUserRole(currentUser.role)){
                    dispatch(getAllProjects());
                }
                else{
                    dispatch(getUserProjects(currentUser.id))
                }
            }

            closeForm();
        } catch (err) {
            console.error('Ошибка при создании проекта:', err);
            setError('Произошла ошибка при создании проекта');
        }
    };

    return (
        <div className='addprojectoverlay'>
            <p className="addprojectoverlay-title">
                Добавление проекта
            </p>

            <IoMdClose
                className='close-icon'
                onClick={closeForm}
            />

            <form className='addprojectoverlay__form' onSubmit={handleSubmit}>
                {error && <div className="error-message">{error}</div>}

                <div className="addprojectoverlay__form-header">
                    <div className="addprojectoverlay__form-inputgroup">
                        <label htmlFor="name">Название проекта*</label>
                        <input 
                            type="text"
                            name="name"
                            placeholder='Введите название проекта'
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="addprojectoverlay__form-selectgroup">
                        <label htmlFor="type">Тип проекта*</label>
                        <select 
                            name="type" 
                            id="type"
                            value={formData.type}
                            onChange={handleInputChange}
                        >
                            <option value="Веб-приложение">Веб-приложение</option>
                            <option value="Веб-сайт">Веб-сайт</option>
                            <option value="Десктоп">Десктоп</option>
                            <option value="Мобильное приложение">Мобильное приложение</option>
                        </select>
                    </div>

                    <div className="addprojectoverlay__form-selectgroup">
                        <label htmlFor="startDate">Дата начала*</label>
                        <Calendar
                            locale='ru'
                            className='calendar start'
                            minDate={currentDate}
                            dateFormat="dd/mm/yy"
                            showIcon
                            value={startDate}
                            onChange={(e) => setStartDate(e.value)}
                            required
                        />
                    </div>

                    <div className="addprojectoverlay__form-selectgroup">
                        <label htmlFor="endDate">Дата конца*</label>
                        <Calendar
                            locale='ru'
                            className='calendar start'
                            minDate={startDate || currentDate}
                            dateFormat="dd/mm/yy"
                            showIcon
                            value={endDate}
                            onChange={(e) => setEndDate(e.value)}
                            required
                        />
                    </div>
                </div>

                <div className="addprojectoverlay__form-inputgroup">
                    <label htmlFor="description">Описание проекта</label>
                    <textarea 
                        name="description"
                        placeholder='Введите описание проекта'
                        value={formData.description}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="addprojectoverlay__form-selectgroup">
                    <details>
                        <summary>
                            Выбор технологий
                        </summary>
                        
                        {allTechnologies && allTechnologies.length > 0 &&
                            <div className="technologies__box">
                                {allTechnologies.map(({id, technology_name, technology_status, technology_description}) => (
                                    <div key={id}
                                        className="technologies__box-item"
                                        onClick={() => handleTechnologySelect(id)}
                                    >
                                        <div className="technologies__box-item-info" title={technology_description}>
                                            <p className="technologies__box-item-info-name">{technology_name}</p>
                                            <p className='technologies__box-item-info-status'>
                                                {technology_status}
                                            </p>
                                        </div>

                                        <input 
                                            type="checkbox" 
                                            checked={selectedTechnologies.includes(id)}
                                            onChange={() => handleTechnologySelect(id)}
                                            className='checkbox'
                                        />
                                    </div>
                                ))}
                            </div>
                        }
                    </details>
                </div>

                <div className="addprojectoverlay__form-actions">
                    <button
                        type="button"
                        className='addprojectoverlay__form-actions-button cancel'
                        onClick={closeForm}
                        disabled={isLoading}
                    >
                        отмена
                    </button>

                    <button 
                        type="submit"
                        className='addprojectoverlay__form-actions-button accept'
                        disabled={isLoading}
                    >
                        {isLoading? 'создание...' : 'создать'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProjectAddOverlay;