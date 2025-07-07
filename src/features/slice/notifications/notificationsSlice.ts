import { BASE_URL } from "@/utils/constants";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (userId: number, thunkAPI) => {
    try {
      const res = await axios.get(`${BASE_URL}/notifications/${userId}`);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const markAllNotificationsAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (userId: number, thunkAPI) => {
    try {
      const res = await axios.patch(`${BASE_URL}/notifications/mark-all-read/${userId}`);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

interface Notification {
    id: number,
    message: string,
    type: string,
    task_id: number,
    project_id: number,
    is_read: string,
    created_time: Date
}

interface NotificationState {
    notificationsList: Notification[] | [],
    isLoading: boolean
}

const initialState: NotificationState = {
    notificationsList: [],
    isLoading: false,
}

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
  
  },
  extraReducers: (builder) => {
    builder.addCase(fetchNotifications.fulfilled, (state, {payload}) => {
        state.notificationsList = payload;
        state.isLoading = false;
    })
    builder.addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
    })
    builder.addCase(fetchNotifications.rejected, (state) => {
        state.isLoading = false;
    })
    builder.addCase(markAllNotificationsAsRead.fulfilled, (state, {payload}) => {
        state.notificationsList = payload;
    })
  },
});

export default notificationSlice.reducer;