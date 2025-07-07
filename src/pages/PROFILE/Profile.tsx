import React, { useState } from "react";
import "./Profile.scss";

import DEFAULT_BANNER from "@images/main/Caver.png";
import DEFAULT_ICON from "@icons/default_icon.png";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";

import { IoMdSettings } from "react-icons/io";
import { IoMdExit } from "react-icons/io";
import AvatarDownload from "@/components/ProfileDownload/AvatarDownload";
import BannerDownload from "@/components/ProfileDownload/BannerDownload";
import { BASE_URL } from "@/utils/constants";
import { logoutUser } from "@/features/slice/user/userSlice";

const Profile = () => {
  const dispatch = useAppDispatch()
  const { currentUser } = useAppSelector(({ users }) => users);

  const [isAvatarDownloadOpen, setIsAvatarDownloadOpen] =
    useState<boolean>(false);
  const [isBannerDownloadOpen, setIsBannerDownloadOpen] =
    useState<boolean>(false);

  const closeAvatarDownload = () => {
    setIsAvatarDownloadOpen(false);
  };

  const closeBannerDownload = () => {
    setIsBannerDownloadOpen(false);
  };

  const handleLogout = () => {
    dispatch(logoutUser())
  }

  if (currentUser) {

    const avatarPath = currentUser.icon;
    let avatarUrl = '';

    if(avatarPath !== '' && avatarPath){
      avatarUrl = `${BASE_URL}${avatarPath}`
    }
    else{
      avatarUrl = DEFAULT_ICON;
    }

    const bannerPath = currentUser.banner;
    let bannerUrl = '';

    if(bannerPath !== '' && bannerPath){
      bannerUrl = `${BASE_URL}${bannerPath}`
    }
    else{
      bannerUrl = DEFAULT_BANNER;
    }

    return (
      <div className="profile">
        <div className="profile__banner">
          <img src={bannerUrl} alt="" />
        </div>

        <div className="profile__info">
          <div className="profile__info-avatar">
            <img src={avatarUrl} alt="" />
          </div>

          <p className="profile__info-username">
            {currentUser?.name} {currentUser?.surname}
          </p>
        </div>

        {isAvatarDownloadOpen && (
          <>
            <div className="overlay" onClick={closeAvatarDownload}></div>
            <AvatarDownload
              closeForm={closeAvatarDownload}
              userId={(currentUser.id).toString()}
            />
          </>
        )}

        {isBannerDownloadOpen && (
          <>
            <div className="overlay" onClick={closeBannerDownload}></div>
            <BannerDownload
              closeForm={closeBannerDownload}
              userId={(currentUser.id).toString()}
            />
          </>
        )}

        <details className="profile__banner-edit">
            <summary>
              <IoMdSettings className="profile__banner-edit-icon" />
              <p className="profile__banner-edit-text">настройки профиля</p>
            </summary>

            <div className="profile__banner-edit-options">
              <p
                className="profile__banner-edit-options-text"
                onClick={() => setIsAvatarDownloadOpen(true)}
              >
                Аватар
              </p>

              <p
                className="profile__banner-edit-options-text"
                onClick={() => setIsBannerDownloadOpen(true)}
              >
                Обложка профиля
              </p>

              <div
                onClick={handleLogout}
                className="profile__banner-edit-options-group exit"
              >
                <IoMdExit className="profile__banner-edit-options-group-icon"/>
                <p className="profile__banner-edit-options-group-text">Выйти</p>
              </div>
            </div>
          </details>
      </div>
    );
  }
  else{
    return(
      <>
      </>
    )
  }
};

export default Profile;
