import React, { useState } from 'react'

import './KanbanBoard.scss'

import { TbLayoutKanban } from "react-icons/tb";
import { CiBoxList } from "react-icons/ci";
import { GiSettingsKnobs } from "react-icons/gi";
import KanbanTasks from '../KanbanTasks/KanbanTasks';
import ListTasks from '../ListTasks/ListTasks';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { toggleTasksView } from '@/features/slice/tasks/tasksSlice';


const KanbanBoard = () => {

    const {tasksView} = useAppSelector(({tasks}) => tasks)

    const [activeView, setActiveView] = useState('kanban');
    const dispatch = useAppDispatch();

    const handleTasksView = (type: string) => {
        dispatch(toggleTasksView(type))
        setActiveView(type)
    }

  return (
    <div className='kanbanboard'>
        
        <div className="kanbanboard__header">

            <div className="kanbanboard__header-views">

                <div
                    className={`kanbanboard__header-views-item ${activeView === 'kanban'? 'active' : ''}`}
                    onClick={() => handleTasksView('kanban')}
                >
                    <TbLayoutKanban className='kanbanboard__header-views-item-icon'/>
                    <p className='kanbanboard__header-views-item-text'>Kanban</p>
                </div>

                <div
                    className={`kanbanboard__header-views-item ${activeView === 'list'? 'active' : ''}`}
                    onClick={() => handleTasksView('list')}
                >
                    <CiBoxList className='kanbanboard__header-views-item-icon'/>
                    <p className='kanbanboard__header-views-item-text'>Список</p>
                </div>
            </div>

            <div className="kanbanboard__header-filter">
                <GiSettingsKnobs className='kanbanboard__header-filter-icon'/>
                <p className='kanbanboard__header-filter-text'>Фильтры</p>
            </div>
        </div>

        {tasksView == 'kanban'?
            <KanbanTasks/>
            :
            <ListTasks/>
        }
        
    </div>
  )
}

export default KanbanBoard