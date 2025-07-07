import { configureStore } from "@reduxjs/toolkit";
import userSlice from '@slice/user/userSlice'
import projectsSlice from '@slice/projects/projectsSlice'
import tasksSlice from '@slice/tasks/tasksSlice'
import notificationsSlice from '@/features/slice/notifications/notificationsSlice'

export const store = configureStore({
    reducer:{
        users: userSlice,
        projects: projectsSlice,
        tasks: tasksSlice,
        notifications: notificationsSlice,
    },
    devTools: true
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;