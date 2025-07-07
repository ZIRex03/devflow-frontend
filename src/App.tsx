import React, { useEffect, useState } from 'react'
import AppRoutes from './routes/AppRoutes'
import { useAppDispatch, useAppSelector } from './hooks/reduxHooks';
import { autoLogin} from './features/slice/user/userSlice';

const App = () => {

  const dispatch = useAppDispatch();

  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    dispatch(autoLogin()).finally(() => {
      setIsAppReady(true);
    });
  }, [dispatch]);

  if (!isAppReady) {
    return <div>Загрузка приложения...</div>;
  }

  return (
    <>
      <AppRoutes/>
    </>
    
  )
}

export default App
