import React, { useState } from "react";
import "./UserForm.scss";
import Header from "@/components/Header/Header";

import LOGIN_IMAGE from "@images/userform/userform-image.png";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { useAppDispatch } from "@/hooks/reduxHooks";
import { userLogin } from "@/features/slice/user/userSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "@/routes/routes";

const UserForm = () => {

  const dispatch = useAppDispatch();
  
  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
    
  const [error, setError] = useState('');

  const [values, setValues] = useState({
    userEmail: '',
    userPassword: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
  };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const resultAction = await dispatch(userLogin({...values, rememberMe}));
        
        if (userLogin.fulfilled.match(resultAction)) {
          setError('');
          const from = location.state?.from?.pathname || ROUTES.DASHBOARD;
          navigate(from, { replace: true });
        } else if (userLogin.rejected.match(resultAction)) {
          setError(String(resultAction.payload));
        }
      } 
      catch (err) {
        console.error("Неожиданная ошибка:", err);
      }
    };

  return (
    <>
      <Header />

      <div className="loginpage">
        <div className="loginpage__image">
          <img src={LOGIN_IMAGE} alt="LOGIN" className="login-image" />
        </div>

        <form className="loginpage__form" onSubmit={handleSubmit}>
          <div className="loginpage__form-title">
            <h1>С возвращением!</h1>
            <h2>Пожалуйста, введите данные.</h2>
          </div>

          <div className="loginpage__form-group">
            <div className="loginpage__form-input">
              <input
                className="form-input"
                placeholder=" "
                type="email"
                name="userEmail"
                id="useremail-input"
                required
                onChange={handleChange} 
              />

              <label className="form-label">Электронная почта</label>
            </div>

            <div className="loginpage__form-input password">
              <input
                className="form-input"
                placeholder=" "
                type={showPassword? 'text' : 'password'}
                name="userPassword"
                id="userpassword-input"
                required
                onChange={handleChange}
              />

              {showPassword?
                <FaEyeSlash className="input-icon" onClick={ () => setShowPassword(!showPassword)}/>
                :
                <FaEye className="input-icon" onClick={ () => setShowPassword(!showPassword)}/>
              }

              <label className="form-label">Пароль</label>
            </div>

            <div className="loginpage__form-group-remember">
              <p>Запомнить меня</p>
              <input
                type="checkbox"
                name=""
                id=""
                onChange={(e) => setRememberMe(e.target.checked)}
              />
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="form-button">Войти</button>
        </form>
      </div>
    </>
  );
};

export default UserForm;
