import React from "react";
import LOGO from "@icons/devflow-icon.png";
import { ROUTES } from "@/routes/routes";

import './Header.scss'


const Header = () => {
  return (
    <div className="header">
      <a href={ROUTES.MAIN} className="header-logo">
        <img src={LOGO} alt="DevFlow" className="logo-icon"/>
      </a>
    </div>
  );
};

export default Header;
