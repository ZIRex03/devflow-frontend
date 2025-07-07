import ProjectTasksHeader from "@/components/ProjectTasksHeader/ProjectTasksHeader";
import React, { useEffect } from "react";

import "./ProjectTasks.scss";
import KanbanBoard from "@/components/KanbanBoard/KanbanBoard";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { getProjectTasks } from "@/features/slice/tasks/tasksSlice";
import {
  fetchActiveProject,
  getProjectsTeam,
  toggleTeamWindow,
} from "@/features/slice/projects/projectsSlice";
import TeamWindow from "@/components/TeamWindow/TeamWindow";
import ProjectsTasksLoading from "@/components/ProjectsTasksLoading/ProjectsTasksLoading";
import ProjectsReview from "@/components/ProjectsOverview/ProjectsOverview";

const ProjectTasks = () => {

  const { projectId } = useParams();
  const dispatch = useAppDispatch();
  const { stateTeamWindow, activeProject, projectsTab } = useAppSelector(
    ({ projects }) => projects
  );
  const { tasksLoading } = useAppSelector(({ tasks }) => tasks);
  
  const nubmberProjectId = Number(projectId);

  useEffect(() => {
    if (nubmberProjectId) {
      dispatch(getProjectTasks(nubmberProjectId));
      dispatch(getProjectsTeam(nubmberProjectId));
      if (!activeProject || activeProject.id !== nubmberProjectId) {
        dispatch(fetchActiveProject(nubmberProjectId));
      }
    }
  }, [dispatch, nubmberProjectId]);

  const closeTeamWindow = () => {
    dispatch(toggleTeamWindow(false));
  };

  if (tasksLoading) {
    return <ProjectsTasksLoading />;
  }

  return (
    <div className="projecttasks">
      {activeProject && <ProjectTasksHeader/>}
      {projectsTab == 'tasks' && <KanbanBoard />}
      {projectsTab == 'overview' && <ProjectsReview/>}
      {stateTeamWindow && (
        <>
          <div className="overlay" onClick={closeTeamWindow}></div>
          <TeamWindow closeForm={closeTeamWindow} />
        </>
      )}
    </div>
  );
};

export default ProjectTasks;
