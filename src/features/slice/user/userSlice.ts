import { BASE_URL } from "@/utils/constants";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

interface User {
  id: number;
  name: string;
  surname: string;
  icon: string;
  banner: string;
  role: string;
}

interface AvailableUsers {
  id: number;
  name: string;
  surname: string;
  icon: string;
  role: string;
}

interface UploadAvatarResponse {
  success: boolean;
  avatarUrl: string;
  id: number;
  name: string;
  surname: string;
  icon: string;
  banner: string;
  role: string;
}

interface TopUsers {
  full_name: string,
  task_count: number
}

interface UserLogin {
  userPassword: string,
  userEmail: string
}

interface UserState {
  currentUser: User | null;
  isLoading: boolean,
  availableUsers: AvailableUsers[] | null,
  topUsers: TopUsers [] | null,
  isError: any
}

interface ReportData {
  report_name: string;
  reportfile: File;
  created_user: number;
  project_id: number;
}

interface ReportResponse {
  id: number;
  report_name: string;
  report_path: string;
  created_user: number;
  project_id: number;
  create_date: string; 
}

export const uploadReport = createAsyncThunk<
  ReportResponse,
  ReportData
>(
  "reports/uploadReport",
  async (payload, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append('reportfile', payload.reportfile);
      formData.append('report_name', payload.report_name);
      formData.append('created_user', payload.created_user.toString());
      formData.append('project_id', payload.project_id.toString());

      const res = await axios.post(`${BASE_URL}/uploadreport`, formData);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);


export const fetchAvailableUsers = createAsyncThunk(
  'projects/fetchAvailableUsers',
  async (projectId: number, thunkAPI) => {
    try {
      const res = await axios.get(`${BASE_URL}/projects/${projectId}/available-users`);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const addUsersToProject = createAsyncThunk(
  'projects/addUsersToProject',
  async ({ projectId, userIds, projectName }: { projectId: number; userIds: number[]; projectName: string }, thunkAPI) => {
    try {
      const res = await axios.post(`${BASE_URL}/projects/${projectId}/add-users`, { userIds, projectName });
      return { projectId, userIds, ...res.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const addUsersToTask = createAsyncThunk(
  'tasks/addUsersToTask',
  async ({ taskId, userIds, projectId, projectName }: { taskId: number; userIds: number[]; projectId: number, projectName: string }, thunkAPI) => {
    try {
      // Сначала удаляем всех пользователей из задачи
      await axios.delete(`${BASE_URL}/api/tasks/${taskId}/users`);
      
      // Затем добавляем выбранных пользователей
      const response = await axios.post(`${BASE_URL}/api/tasks/${taskId}/users`, { userIds, projectId, projectName });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const uploadUserAvatar = createAsyncThunk<
  UploadAvatarResponse,
  FormData
>(
  "users/unploadUserAvatar",

  async (payload, thunkAPI) => {
    try {
      const res = await axios.post(`${BASE_URL}/uploadavatar`, payload);
      
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);

export const uploadUserBanner = createAsyncThunk<
  UploadAvatarResponse,
  FormData
>(
  "users/unploadUserBanner",

  async (payload, thunkAPI) => {
    try {
      const res = await axios.post(`${BASE_URL}/uploadbanner`, payload);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);

export const userLogin = createAsyncThunk(
  "users/userLogin",
  async (payload: { userEmail: string; userPassword: string, rememberMe: boolean }, thunkAPI) => {
    try {
      const res = await axios.post(`${BASE_URL}/auth`, payload, {
        withCredentials: true,
      });
      
      if (!res.data.user) {
        throw new Error("Неверный логин или пароль");
      }
      
      return res.data.user;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message;
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const autoLogin = createAsyncThunk(
  "auth/autoLogin",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(`${BASE_URL}/check-auth`, {
        withCredentials: true,
      });
      
      if (!res.data?.user) {
        return thunkAPI.rejectWithValue("Пользователь не авторизован");
      }
      
      return res.data.user;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message;
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      await axios.post(`${BASE_URL}/logout`, {}, { 
        withCredentials: true 
      });
      
      return null;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Ошибка выхода';
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const fetchTopUsersByTasks = createAsyncThunk(
  'users/fetchTopUsersByTasks',
  async (limit: number, thunkAPI) => {
    try {
      const res = await axios.get(`${BASE_URL}/users/top-by-tasks?limit=${limit}`);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const initialState: UserState = {
//   currentUser: {
//     id: 1,
//     name: "Андрей",
//     surname: "Волкин",
//     icon: "",
//     banner: "",
//     role: "manager",
//   },
  currentUser: null,
  isLoading: false,
  availableUsers: null,
  topUsers: null,
  isError: null
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
  
  },
  extraReducers: (builder) => {
    builder.addCase(uploadUserAvatar.fulfilled, (state, { payload }) => {
      state.currentUser = payload;
    });
    builder.addCase(uploadUserBanner.fulfilled, (state, { payload }) => {
      state.currentUser = payload;
    });
    builder.addCase(userLogin.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.currentUser = payload;
    });
    builder.addCase(autoLogin.fulfilled, (state, { payload }) => {
      state.currentUser = payload;
      state.isLoading = false;
    });
    builder.addCase(autoLogin.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.isLoading = false;
      state.currentUser = null;
    });
    builder.addCase(fetchAvailableUsers.fulfilled, (state, {payload}) => {
      state.availableUsers = payload;
    });
    builder.addCase(fetchTopUsersByTasks.fulfilled, (state, {payload}) => {
      state.isLoading = false;
      state.topUsers = payload;
    });
    builder.addCase(fetchTopUsersByTasks.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchTopUsersByTasks.rejected, (state, {payload}) => {
      state.isLoading = false;
      state.isError = payload
    });
  },
});


export default userSlice.reducer;
