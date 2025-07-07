import React from 'react';
import './EditProjectInfo.scss';
import { FaEdit, FaRegTrashAlt } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { getAllProjects, getUserProjects, toggleProjectEditForm } from '@/features/slice/projects/projectsSlice';
import { deleteProject } from '@/features/slice/projects/projectsSlice';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/routes/routes';
import { checkUserRole } from '@/utils/constants';

const EditProjectInfo = () => {
  const dispatch = useAppDispatch();
  const { activeProject, isDeleting } = useAppSelector(({ projects }) => projects);
  const { currentUser } = useAppSelector(({ users }) => users);

  const openEditProjectOverlay = () => {
    dispatch(toggleProjectEditForm(true));
  };

  const navigate = useNavigate()

  const handleDeleteProject = async () => {
    if (!activeProject?.id) return;
    
    if (window.confirm('Вы уверены, что хотите удалить этот проект?')) {
      try {
        await dispatch(deleteProject(activeProject.id)).unwrap();

        if(currentUser) {
            if(checkUserRole(currentUser.role)){
                dispatch(getAllProjects());
            }
            else{
                dispatch(getUserProjects(currentUser.id))
            }
        }
        navigate(ROUTES.PROJECTS)

      } catch (error) {
        console.error('Ошибка при удалении проекта:', error);
        alert('Не удалось удалить проект');
      }
    }
  };

  return (
    <div className='projectedit'>
      <div
        className="projectedit__options edit"
        onClick={openEditProjectOverlay}
      >
        <FaEdit className='projectedit__options-icon'/>
        <p className="projectedit__options-text">Редактирование проекта</p>
      </div>

      <div 
        className="projectedit__options delete" 
        onClick={handleDeleteProject}
      >
        <FaRegTrashAlt className='projectedit__options-icon delete'/>
        <p className="projectedit__options-text delete">
          {isDeleting ? 'Удаление...' : 'Удалить проект'}
        </p>
      </div>
    </div>
  );
};

export default EditProjectInfo;