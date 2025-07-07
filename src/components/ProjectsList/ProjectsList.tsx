import React, { useState } from 'react'

import './ProjectsList.scss'

import { CiSearch } from "react-icons/ci";
import { MdKeyboardArrowRight } from "react-icons/md";

import { useAppSelector } from '@/hooks/reduxHooks';
import ProjectsIconSelector from './ProjectsIconSelector';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '@/routes/routes';
import { checkUserRole } from '@/utils/constants';
import ProjectAddOverlay from '../ProjectAddOverlay/ProjectAddOverlay';


const ProjectsList = () => {


    const { projectsList } = useAppSelector(({ projects }) => projects);
    const [activeStatus, setActiveStatus] = useState<'active' | 'hold' | 'done'>('active');
    const [searchTerm, setSearchTerm] = useState('');
    const {currentUser} = useAppSelector(({users}) => users)

    const [addProjectOverlay, setAddProjectOverlay] = useState(false)

    let isAdmin = false;

    if(currentUser){
        isAdmin = checkUserRole(currentUser.role)
    }

    const filteredProjects = projectsList?.filter(project => {
        const matchesStatus = project.status === activeStatus;
        const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    }) || [];

    const countProjectsByStatus = (status: string) => {
        if (!projectsList) return 0;
        
        return projectsList.filter(project => {
            const matchesStatus = project.status === status;
            const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesStatus && matchesSearch;
        }).length;
    };

    const navigate = useNavigate();
    const { projectId } = useParams();

    const handleProjectClick = (id: number) => {
        navigate(`${ROUTES.PROJECTS}/${id}`);

        if(window.innerWidth <= 1400){
            const projectsList = document.getElementById('projectslist')

            if(projectsList){
                projectsList.style.display = 'none'
            }
        }
    };

    const openAddProjectOverlay = () => {
        setAddProjectOverlay(true)
    }

     const closeAddProjectOverlay = () => {
        setAddProjectOverlay(false)
    }

    return (
        <div id='projectslist' className='projectslist'>
            <div className="projectslist__header">
                <p className="projectslist__header-title">
                    Все проекты
                </p>
                <div className="projectslist__header-search-group">
                    <CiSearch className='search-icon'/>
                    <input
                        type='search'
                        className='projectslist__header-search'
                        placeholder='Найти проект'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {isAdmin && 
                    <button
                        className='projectslist__header-add'
                        onClick={openAddProjectOverlay}
                    >
                        Добавить проект
                    </button>
                }
            </div>

            <div className="projectslist__status">
                <div 
                    className={`projectslist__status-item ${activeStatus === 'active' ? 'active' : ''}`}
                    onClick={() => setActiveStatus('active')}
                >
                    <p className='projectslist__status-item-text'>
                        Активные<span>({countProjectsByStatus('active')})</span>
                    </p>
                </div>

                <div 
                    className={`projectslist__status-item ${activeStatus === 'hold' ? 'active' : ''}`}
                    onClick={() => setActiveStatus('hold')}
                >
                    <p className='projectslist__status-item-text'>
                        Пауза<span>({countProjectsByStatus('hold')})</span>
                    </p>
                </div>

                <div 
                    className={`projectslist__status-item ${activeStatus === 'done' ? 'active' : ''}`}
                    onClick={() => setActiveStatus('done')}
                >
                    <p className='projectslist__status-item-text'>
                        Готово<span>({countProjectsByStatus('done')})</span>
                    </p>
                </div>
            </div>

            <div className="projectslist__box">
                {filteredProjects.length > 0 ? (
                    filteredProjects.map(({ id, name, type }) => (
                        <div
                            key={id} 
                            className={`projectslist__box-item ${Number(projectId) === id ? 'active' : ''}`}
                            onClick={() => handleProjectClick(id)}
                        >
                            <div className="projectslist__box-item-icon">
                                {ProjectsIconSelector(type)}
                            </div>
                            <div className="projectslist__box-item-info">
                                <div className="projectslist__box-item-info-text">
                                    <p className="projectslist__box-item-info-text-title">
                                        {name}
                                    </p>
                                    <p className="projectslist__box-item-info-text-type">
                                        {type}
                                    </p>
                                </div>
                                <MdKeyboardArrowRight className='arrow-right'/>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="projectslist__empty">
                        {searchTerm ? 
                            'Проекты по вашему запросу не найдены' : 
                            'Нет проектов с выбранным статусом'
                        }
                    </p>
                )}
            </div>

            {addProjectOverlay &&
                <>
                    <div className="overlay"></div>
                    <ProjectAddOverlay
                        closeForm={closeAddProjectOverlay}
                    />
                </>
            }

            
        </div>
    );
}

export default ProjectsList