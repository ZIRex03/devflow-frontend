import React, { useRef, useState } from "react";

import "./KanbanTasks.scss";

import { FaPlus } from "react-icons/fa6";
import KanbanTasksTodo from "../KanbanTasksColumn/KanbanTasksTodo";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { checkUserRole } from "@/utils/constants";
import TaskAddOverlay from "../TaskAddOverlay/TaskAddOverlay";
import { setCurrentTaskStatus, toggleTaskAdd } from "@/features/slice/tasks/tasksSlice";

const KanbanTasks = () => {
  //   const kanbanBoardRef = useRef<HTMLDivElement>(null);
  //   const [isDragging, setIsDragging] = useState(false);
  //   const [startX, setStartX] = useState(0);
  //   const [scrollLeft, setScrollLeft] = useState(0);
  //   const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
  //     if (!kanbanBoardRef.current) return;
  //     setIsDragging(true);
  //     setStartX(e.pageX - kanbanBoardRef.current.offsetLeft);
  //     setScrollLeft(kanbanBoardRef.current.scrollLeft);
  //     kanbanBoardRef.current.style.cursor = "grabbing";
  //   };
  //   const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
  //     if (!isDragging || !kanbanBoardRef.current) return;
  //     e.preventDefault();
  //     const x = e.pageX - kanbanBoardRef.current.offsetLeft;
  //     const walk = (x - startX) * 1.5;
  //     kanbanBoardRef.current.scrollLeft = scrollLeft - walk;
  //   };
  //   const handleMouseUp = () => {
  //     if (!kanbanBoardRef.current) return;
  //     setIsDragging(false);
  //     kanbanBoardRef.current.style.cursor = "grab";
  //   };
  //   const handleMouseLeave = () => {
  //     if (!kanbanBoardRef.current) return;
  //     setIsDragging(false);
  //     kanbanBoardRef.current.style.cursor = "grab";
  //   };

  const dispatch = useAppDispatch();
  const kanbanBoardRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isClick, setIsClick] = useState(true);

  const {tasksList} = useAppSelector(({tasks}) => tasks)
  const {currentUser} = useAppSelector(({users}) => users)

  const openAddTask = (status: string) => {
    dispatch(setCurrentTaskStatus(status))
    dispatch(toggleTaskAdd(true))
  }

  let isAdmin = false;
  
  if(currentUser){
    isAdmin = checkUserRole(currentUser.role)
  }

  const todoTasks = tasksList?.filter((task) => (
    task.status === 'todo'
  )) || [];

  const progressTasks = tasksList?.filter((task) => (
    task.status === 'progress'
  )) || [];

  const reviewTasks = tasksList?.filter((task) => (
    task.status === 'review'
  )) || [];

  const completedTasks = tasksList?.filter((task) => (
    task.status === 'completed'
  )) || [];

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!kanbanBoardRef.current) return;
    setIsClick(true);
    setIsDragging(true);
    setStartX(e.pageX - kanbanBoardRef.current.offsetLeft);
    setScrollLeft(kanbanBoardRef.current.scrollLeft);
    kanbanBoardRef.current.style.cursor = "grabbing";
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !kanbanBoardRef.current) return;
    e.preventDefault();
    const x = e.pageX - kanbanBoardRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    kanbanBoardRef.current.scrollLeft = scrollLeft - walk;

    if (Math.abs(walk) > 5) {
      setIsClick(false); 
    }
  };

  const handleMouseUp = () => {
    if (!kanbanBoardRef.current) return;
    setIsDragging(false);
    kanbanBoardRef.current.style.cursor = "grab";
  };

  const handleMouseLeave = () => {
    if (!kanbanBoardRef.current) return;
    setIsDragging(false);
    kanbanBoardRef.current.style.cursor = "grab";
  };

  return (
    <div
      ref={kanbanBoardRef}
      className="kanbantasks"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      <div className="kanbantasks__column">
        <div className="kanbantasks__column-header">
          <div className="kanbantasks__column-header-title">
            <p className="kanbantasks__column-header-title-text todo">
              В планах
            </p>

            <span className="kanbantasks__column-header-title-count">{todoTasks.length}</span>
          </div>

          {isAdmin && 
            <div className="kanbantasks__column-header-add">
              <FaPlus
                className="kanbantasks__column-header-add-icon"
                onClick={() => openAddTask('todo')}
              />
            </div>
          }

          
        </div>

        <KanbanTasksTodo isClick={isClick} taskList={todoTasks}/>
      </div>

      <div className="kanbantasks__column">
        <div className="kanbantasks__column-header">
          <div className="kanbantasks__column-header-title">
            <p className="kanbantasks__column-header-title-text progress">
              В работе
            </p>

            <span className="kanbantasks__column-header-title-count">{progressTasks.length}</span>
          </div>

          {isAdmin && 
            <div className="kanbantasks__column-header-add">
              <FaPlus
                className="kanbantasks__column-header-add-icon"
                onClick={() => openAddTask('progress')}
              />
            </div>
          }
        </div>

        <KanbanTasksTodo isClick={isClick} taskList={progressTasks}/>
      </div>

      <div className="kanbantasks__column">
        <div className="kanbantasks__column-header">
          <div className="kanbantasks__column-header-title">
            <p className="kanbantasks__column-header-title-text review">
              На проверке
            </p>

            <span className="kanbantasks__column-header-title-count">{reviewTasks.length}</span>
          </div>

          {isAdmin && 
            <div className="kanbantasks__column-header-add">
              <FaPlus
                className="kanbantasks__column-header-add-icon"
                onClick={() => openAddTask('review')}
              />
            </div>
          }
        </div>

        <KanbanTasksTodo isClick={isClick} taskList={reviewTasks}/>
      </div>

      <div className="kanbantasks__column">
        <div className="kanbantasks__column-header">
          <div className="kanbantasks__column-header-title">
            <p className="kanbantasks__column-header-title-text completed">
              Завершено
            </p>

            <span className="kanbantasks__column-header-title-count">{completedTasks.length}</span>
          </div>

          {isAdmin && 
            <div className="kanbantasks__column-header-add">
              <FaPlus
                className="kanbantasks__column-header-add-icon"
                onClick={() => openAddTask('completed')}
              />
            </div>
          }
        </div>

        <KanbanTasksTodo isClick={isClick} taskList={completedTasks}/>
      </div>

      
    </div>
  );
};

export default KanbanTasks;
