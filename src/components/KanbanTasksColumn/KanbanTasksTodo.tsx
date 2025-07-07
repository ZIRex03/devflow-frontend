import "./KanbanTasksColumn.scss";

import { IoEllipsisVertical } from "react-icons/io5";
import { FiMessageSquare } from "react-icons/fi";
import { BsPaperclip } from "react-icons/bs";

import TASK_PREVIEW from "@images/projects/test_task.png";
import DEFAULT_ICON from "@icons/default_icon.png";
import { getTasksUsers, Tasks, toggleTaskInfoForm } from "@/features/slice/tasks/tasksSlice";
import { BASE_URL, translatePriority } from "@/utils/constants";
import TaskInfoWindow from "../TaskInfoWindow/TaskInfoWindow";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { useEffect, useState } from "react";

type Props = {
  isClick: boolean;
  taskList: Tasks[];
};

type Task = {
  id: number;
  name: string;
  priority: string;
  status: string;
  description: string;
  image: string;
  start_date: Date,
  end_date: Date
};

enum TaskPriority {
  Высокий = 3,
  Средний = 2,
  Низкий = 1,
}

type PriorityKey = keyof typeof TaskPriority;

const KanbanTasksTodo = ({ isClick, taskList }: Props) => {

  const dispatch = useAppDispatch();
  const { taskInfoForm, tasksUsers } = useAppSelector(({ tasks }) => tasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [sortDirection, setSortDirection] = useState<'desc' | 'asc'>('desc');
  
  const getSortedTasks = () => {
    return [...taskList].sort((a, b) => {
      const priorityA = TaskPriority[a.priority as PriorityKey];
      const priorityB = TaskPriority[b.priority as PriorityKey];
      
      return sortDirection === 'desc' 
        ? priorityB - priorityA 
        : priorityA - priorityB;
    });
  };

  useEffect(() => {
    taskList.forEach(task => {
      if (!tasksUsers[task.id]) {
        dispatch(getTasksUsers(task.id));
      }
    });
  }, [taskList, dispatch, tasksUsers]);

  const handleDragStart = (e: React.DragEvent<HTMLImageElement>) => {
    e.preventDefault();
  };

  const handleClick = (
    e: React.MouseEvent<HTMLDivElement> | React.MouseEvent<SVGElement>,
    callback: () => void
  ) => {
    if (isClick) {
      callback();
    } else {
      e.preventDefault();
    }
  };

  const closeTaskInfo = () => {
    dispatch(toggleTaskInfoForm(false));
    setSelectedTask(null);
  };

  const openTaskInfo = (task: Task) => {
    setSelectedTask(task);
    dispatch(toggleTaskInfoForm(true));
  };

  return (
    <div className="tasks__box">
      {getSortedTasks().map((task) => {
        const { id, name, priority, image } = task;
        const users = tasksUsers[id] || [];
        
        return (
          <div key={id} className="task">
            <div className="task__header">
              <p className={`task__header-priority ${translatePriority.get(priority)}`}>
                {priority}
              </p>

              <IoEllipsisVertical
                className="task__header-info"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick(e, () => openTaskInfo(task));
                }}
              />
            </div>

            <p className="task-title">{name}</p>

            {image !== '' && image &&
              <div className="task-image">
                <img
                  src={`${BASE_URL}${image}`}
                  alt=""
                  draggable="false"
                  onDragStart={handleDragStart}
                />
              </div>
            }   

            <div className="task__footer">
              {/* <div className="task__footer-options">
                <div className="task__footer-options-message">
                  <FiMessageSquare className="message-icon" />
                  <p className="message-count">12</p>
                </div>

                <div
                  className="task__footer-options-files"
                  onClick={(e) => handleClick(e, testCLick)}
                >
                  <BsPaperclip className="files-icon" />
                  <p className="files-count">4</p>
                </div>
              </div> */}

              <div className="task__footer-assign">

                {users.length > 0?
                <>
                  <p className="task__footer-assign-text">Назначена для</p>
                  <div className="task__footer-assign-users">

                    {users.slice(0, 3).map(({icon, id}) => {

                      let iconUrl = '';
                      if(icon !== '' && icon){
                        iconUrl = `${BASE_URL}${icon}`
                      }
                      else{
                        iconUrl = DEFAULT_ICON
                      }

                      return(
                        <div key={id} className="task__footer-assign-users-avatar">
                          <img
                            className="user-icon"
                            src={iconUrl}
                            alt=""
                            draggable="false"
                            onDragStart={handleDragStart}
                          />
                        </div>
                      )
                    })}

                    {users.length > 3 && 
                      <div className="task__footer-assign-users-count">
                        <p>+{users.length - 3}</p>
                      </div>
                    }
                    
                  </div>
                </>
                :
                  <p className="task__footer-assign-text">Нет участников</p>
                }
                
              </div>
            </div>
          </div>
        );
      })}

      {taskInfoForm && selectedTask && (
        <>
          <div
            className={`overlays ${taskInfoForm? 'active' : ''}`}
            onClick={closeTaskInfo}
            onMouseDown={(e) => e.stopPropagation()}
            onMouseMove={(e) => e.stopPropagation()}
          />
          <TaskInfoWindow
            id={selectedTask.id}
            closeForm={closeTaskInfo}
            isActiveForm={taskInfoForm}
            name={selectedTask.name}
            description={selectedTask.description}
            image={selectedTask.image}
            assignedUsers={tasksUsers[selectedTask.id]}
            start_date={selectedTask.start_date}
            end_date={selectedTask.end_date}
            priority={selectedTask.priority}
            status={selectedTask.status}
          />
        </>
      )}
      

    </div>
  );
};

export default KanbanTasksTodo;
