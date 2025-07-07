import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";

import { IoMdClose } from "react-icons/io";
import { addUsersToProject, fetchAvailableUsers } from "@/features/slice/user/userSlice";

import DEFAULT_ICON from "@icons/default_icon.png";

import "./AddUsersToProject.scss";
import { BASE_URL } from "@/utils/constants";
import { getProjectsTeam } from "@/features/slice/projects/projectsSlice";

interface Props {
  projectId: number;
  closeModal: () => void;
}

const AddUsersToProject: React.FC<Props> = ({ projectId, closeModal }) => {
  const dispatch = useAppDispatch();
  const { availableUsers, isLoading } = useAppSelector(({ users }) => users);
  const {activeProject} = useAppSelector(({projects}) => projects)
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  useEffect(() => {
    dispatch(fetchAvailableUsers(projectId));
  }, [projectId, dispatch]);

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
            await dispatch(addUsersToProject({ projectId, userIds: selectedUsers, projectName: activeProject.name })).unwrap();
            dispatch(getProjectsTeam(projectId))
            closeModal();
        } catch (error) {
        console.error("Failed to add users:", error);
        }
    };

  return (
    <div className="add-users-modal">
      <div className="modal-header">
        <h2>Добавление пользователей в проект</h2>
        <IoMdClose className="close-icon" onClick={closeModal} />
      </div>

      <div className="users-list">
        {availableUsers !== null &&
          availableUsers.map((user) => {
            let iconUrl = "";

            if (user.icon !== "" && user.icon) {
              iconUrl = `${BASE_URL}${user.icon}`;
            } else {
              iconUrl = DEFAULT_ICON;
            }

            return (
              <div
                key={user.id}
                className={`user-item ${
                  selectedUsers.includes(user.id) ? "selected" : ""
                }`}
                onClick={() => toggleUserSelection(user.id)}
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
                  {selectedUsers.includes(user.id) && "✓"}
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
          {isLoading ? "Добавление..." : `Добавить (${selectedUsers.length})`}
        </button>
      </div>
    </div>
  );
};

export default AddUsersToProject;
