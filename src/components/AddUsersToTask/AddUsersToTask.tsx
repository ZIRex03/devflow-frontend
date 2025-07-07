import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { IoMdClose } from "react-icons/io";
import DEFAULT_ICON from "@icons/default_icon.png";
import "./AddUsersToTask.scss";
import { BASE_URL } from "@/utils/constants";
import { addUsersToTask } from "@/features/slice/user/userSlice";
import { getTasksUsers } from "@/features/slice/tasks/tasksSlice";

interface Props {
  taskId: number;
  closeModal: () => void;
  assignUsers: User[];
}

type User = {
  id: number;
  user_name: string;
  user_surname: string;
  icon: string;
};

const AddUsersToTask: React.FC<Props> = ({ taskId, closeModal, assignUsers }) => {
  const dispatch = useAppDispatch();
  const { isLoading} = useAppSelector(({ tasks }) => tasks);
  const { projectTeam, activeProject } = useAppSelector(({ projects }) => projects);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  // Инициализация выбранных пользователей (уже назначенных на задачу)
  useEffect(() => {
    if (assignUsers) {
      setSelectedUsers(assignUsers.map(user => user.id));
    }
  }, [assignUsers]);

  const toggleUserSelection = (userId: number) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSubmit = async () => {
    if (selectedUsers.length === 0) return;

    try {
      await dispatch(addUsersToTask({
        taskId,
        userIds: selectedUsers,
        projectId: activeProject.id,
        projectName: activeProject.name
      })).unwrap();

      dispatch(getTasksUsers(taskId));

      closeModal();
    } catch (error) {
      console.error("Failed to add users to task:", error);
    }
  };

  return (
    <div className="add-users-page">
      <div className="modal-header">
        <h2>Назначение задачи пользователям</h2>
        <IoMdClose className="close-icon" onClick={closeModal} />
      </div>

      <div className="users-list">
        {projectTeam?.map((user) => {
          const iconUrl = user.user_icon
            ? `${BASE_URL}${user.user_icon}`
            : DEFAULT_ICON;

          return (
            <div
              key={user.user_id}
              className={`user-item ${
                selectedUsers.includes(user.user_id) ? "selected" : ""
              }`}
              onClick={() => toggleUserSelection(user.user_id)}
            >
              <div className="user-info">
                <div className="icon-box">
                  <img src={iconUrl} alt="User" className="user-icon" />
                </div>
                <span>
                  {user.name} {user.surname}
                </span>
              </div>
              <div className="checkbox">
                {selectedUsers.includes(user.user_id) && "✓"}
              </div>
            </div>
          );
        })}
      </div>

      <div className="modal-actions">
        <button
          className="cancel-btn"
          onClick={closeModal}
          disabled={isLoading}
        >
          Отмена
        </button>
        <button
          className="submit-btn"
          onClick={handleSubmit}
          disabled={isLoading || selectedUsers.length === 0}
        >
          {isLoading ? "Сохранение..." : `Сохранить (${selectedUsers.length})`}
        </button>
      </div>
    </div>
  );
};

export default AddUsersToTask;