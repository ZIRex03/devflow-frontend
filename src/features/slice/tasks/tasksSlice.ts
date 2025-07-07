
import { BASE_URL } from "@/utils/constants";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export interface Tasks {
    id: number, 
    name: string,
    description: string,
    image: string,
    status: string,
    priority: string,
    start_date: Date,
    end_date: Date
}

interface User {
    id: number,
    user_name: string,
    user_surname: string
    icon: string
}

type TasksUsersType = Record<number, User[]>;

interface TasksState {
    tasksList: Tasks[] | null,
    taskInfoForm: boolean,
    tasksUsers: TasksUsersType,
    tasksLoading: boolean,
    tasksView: string,
    isLoading: boolean,
    curentTaskStatus: string,
    taskAddOpen: boolean,
    allUserTasks: Tasks []
}

interface TaskCreateData {
  name: string;
  description: string;
  priority: string;
  status: string;
  start_date: string;
  end_date: string;
  project_id: number;
  image?: File;
}

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData: TaskCreateData, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append('name', taskData.name);
      formData.append('description', taskData.description);
      formData.append('priority', taskData.priority);
      formData.append('status', taskData.status);
      formData.append('start_date', taskData.start_date);
      formData.append('end_date', taskData.end_date);
      formData.append('project_id', taskData.project_id.toString());
      
      if (taskData.image) {
        formData.append('image', taskData.image);
      }

      const res = await axios.post(`${BASE_URL}/add/tasks`, formData);
      
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getUserTasks = createAsyncThunk(
    'tasks/getUserAllTasks',
    async(userId: number, thunkAPI) => {
        try {
            const res = await axios.get(`${BASE_URL}/user-tasks/${userId}`);
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, formData }: { id: number; formData: FormData }, thunkAPI) => {
    try {
      const res = await axios.put(`${BASE_URL}/edit/tasks/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (taskId: number, thunkAPI) => {
    try {
      await axios.delete(`${BASE_URL}/delete/task/${taskId}`);
      return taskId;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getProjectTasks = createAsyncThunk(
    'tasks/getProjectTasks',
    async(projectId:number, thunkAPI) => {
        try {
            
            const res = await axios(`${BASE_URL}/projects/${projectId}/tasks`);
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
)

export const getTasksUsers = createAsyncThunk(
  'tasks/getTasksUsers',
  async(taskId:number, thunkAPI) => {
    try {
      const res = await axios(`${BASE_URL}/tasks/${taskId}/users`);
      return { taskId, users: res.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const initialState: TasksState = {
    tasksList: [],
    taskInfoForm: false,
    tasksUsers: {},
    tasksLoading: false,
    tasksView: 'kanban',
    isLoading: false,
    curentTaskStatus: '',
    taskAddOpen: false,
    allUserTasks: []
}

const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        toggleTaskInfoForm: (state, {payload}) => {
            state.taskInfoForm = payload
        },
        toggleTasksView: (state, {payload}) => {
            state.tasksView = payload
        },
        toggleTaskAdd: (state, {payload}) => {
            state.taskAddOpen = payload
        },
        setCurrentTaskStatus: (state, {payload}) => {
            state.curentTaskStatus = payload
        }
    },

    extraReducers: (builder) => {
        builder.addCase(getProjectTasks.fulfilled, (state, {payload}) => {
            state.tasksLoading = false;
            state.tasksList = payload;
        });
        builder.addCase(getProjectTasks.pending, (state) => {
            state.tasksLoading = true;
        })
        builder.addCase(getTasksUsers.fulfilled, (state, {payload}) => {
            state.tasksUsers[payload.taskId] = payload.users;
        });
        builder.addCase(createTask.fulfilled, (state) => {
            state.isLoading = false
        });
        builder.addCase(createTask.pending, (state) => {
            state.isLoading = true
        });
        builder.addCase(createTask.rejected, (state) => {
            state.isLoading = false
        });
        builder.addCase(getUserTasks.fulfilled, (state, {payload}) => {
            state.allUserTasks = payload;
        });
        
    }
})

export default tasksSlice.reducer;

export const {
    toggleTaskInfoForm, toggleTasksView, toggleTaskAdd, setCurrentTaskStatus
} = tasksSlice.actions