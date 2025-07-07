
import React from 'react'

import './ProjectsTasksLoading.scss'

const ProjectsTasksLoading = () => {
  return (
    <div className='projectstasksloading'>

        <div className="projectstasksloading__header">
            <div className="projectstasksloading__header-title"></div>
            <div className="projectstasksloading__header-desc"></div>
        </div>

        <div className="projectstasksloading__tabs">
            <div className="projectstasksloading__tabs-page"></div>
            <div className="projectstasksloading__tabs-page"></div>
            <div className="projectstasksloading__tabs-page"></div>
        </div>

        <div className="projectstasksloading__kanban">
            <div className="projectstasksloading__kanban-header">
                <div className="projectstasksloading__kanban-header-page"></div>
                <div className="projectstasksloading__kanban-header-page"></div>
            </div>

            <div className="projectstasksloading__kanban-tasks">

                <div className="projectstasksloading__kanban-tasks-column">

                    <div className="projectstasksloading__kanban-tasks-column-header"></div>

                    <div className="projectstasksloading__kanban-tasks-column-task"></div>
                </div>
                <div className="projectstasksloading__kanban-tasks-column">

                    <div className="projectstasksloading__kanban-tasks-column-header"></div>

                    <div className="projectstasksloading__kanban-tasks-column-task"></div>
                </div>
                <div className="projectstasksloading__kanban-tasks-column">

                    <div className="projectstasksloading__kanban-tasks-column-header"></div>

                    <div className="projectstasksloading__kanban-tasks-column-task"></div>
                </div>
                <div className="projectstasksloading__kanban-tasks-column">

                    <div className="projectstasksloading__kanban-tasks-column-header"></div>

                    <div className="projectstasksloading__kanban-tasks-column-task"></div>
                </div>
            </div>
            
        </div>
    </div>
  )
}

export default ProjectsTasksLoading