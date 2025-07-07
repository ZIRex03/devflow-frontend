import React from "react";
import "./Main.scss";
import { ROUTES } from "@/routes/routes";
import PREVIEW from "@images/main/preview.png";
import { useAppSelector } from "@/hooks/reduxHooks";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header/Header";

const Main = () => {
  const { currentUser } = useAppSelector(({ users }) => users);
  const navigate = useNavigate();

  const getStarted = () => {
    if (!currentUser) {
      navigate(ROUTES.USERFORM);
    } else {
      navigate(ROUTES.DASHBOARD);
    }
  };

  return (
    <div className="main">
      
      <Header/>

      <div className="main__content">
        <div className="main__content-text">
          <h1 className="main__content-description">
            Проекты — под контролем, команды — в потоке
          </h1>
          <p className="main__content-subdescription">
            Просто. Удобно. Эффективно.
          </p>
        </div>

        <button
            className="main__content-start btn-blue"
            onClick={getStarted}
            >
            Давайте начнем
        </button>

        <div className="main__content-preview">
          <img src={PREVIEW} alt="DevFlow Screen" className="image-preview" />
        </div>
      </div>
    </div>
  );
};

export default Main;
