import { BASE_URL } from "@/utils/constants";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

interface Project {
    id: number, 
    name: string,
    description: string,
    type: string,
    status: string,
    start_date: Date,
    end_date: Date
}

export interface ProjectTeam {
    project_id: number,
    user_id: number,
    name: string,
    surname: string,
    user_icon: string
}

export interface ActiveProject {
    id: number,
    name: string,
    description: string,
    type: string,
    status: string,
    start_date: Date,
    end_date: Date
}

interface TechnologiesResponse {
    name: string
}

interface ReportResponse {
  id: number;
  report_name: string;
  report_path: string;
  created_user: number;
  project_id: number;
  create_date: string; 
}

interface ClientResponse {
    client_name: string
}

interface ExtraServiceResponse{
    extra_service_name: string
}

interface AllTechnologies{
    id: number,
    technology_name: string,
    technology_description: string,
    technology_status: string
}

interface ProjectState {
    projectsList: Project[] | null,
    projectTeam: ProjectTeam[] | null,
    projectsTechnologies: TechnologiesResponse[],
    stateTeamWindow: boolean,
    activeProject: ActiveProject,
    stateProjectEditForm: boolean,
    isLoading: boolean,
    isDeleting: boolean,
    reportsList: ReportResponse[],
    reportsLoading: boolean,
    projectsTab: string,
    projectClient: ClientResponse,
    projectExtraService: ExtraServiceResponse[],
    allTechnologies: AllTechnologies[]
}

interface ProjectCreateData {
  name: string;
  description: string;
  type: string;
  start_date: string;
  end_date: string;
  status?: string;
}

export const getAllProjects = createAsyncThunk(
    'projects/getAllProjects',
    async(_, thunkAPI) => {
        try {
            const res = await axios(`${BASE_URL}/projects`);
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
)

export const getAllTechnologies = createAsyncThunk(
    'projects/getAllTechnologies',
    async(_, thunkAPI) => {
        try {
            const res = await axios(`${BASE_URL}/technologies`);
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
)

export const getReportsByProject = createAsyncThunk(
    'reports/getReportsByProject',
    async(projectId: string, thunkAPI) => {
        try {
            const res = await axios(`${BASE_URL}/reports/${projectId}`);
            return res.data;
        } catch (error:any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const getUserProjects = createAsyncThunk(
    'projects/getUserProjects',
    async(userId: number, thunkAPI) => {
        try {
            const res = await axios(`${BASE_URL}/projects/user/${userId}`);
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
)

export const getProjectsTeam = createAsyncThunk(
    'projects/getProjectsTeam',
    async(projectId:number, thunkAPI) => {
        try {
            
            const res = await axios(`${BASE_URL}/projects/${projectId}/team`);
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
)

export const updateProject = createAsyncThunk(
    'projects/updateProject',
    async({ projectId, projectData }: { projectId: number; projectData: {
        name: string;
        description: string;
        status: string;
        type: string;
    }}, thunkAPI) => {
        try {
            const res = await axios.patch(`${BASE_URL}/projects/${projectId}`, projectData);
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const removeProjectTeamUser = createAsyncThunk(
    'projects/removeProjectTeamUser',
    async({projectId, userId}: {projectId: number, userId: number}, thunkAPI) => {
        try {
            const res = await axios.delete(`${BASE_URL}/projects/${projectId}/team/${userId}`);
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const fetchActiveProject = createAsyncThunk(
  'projects/fetchActiveProject',
  async (projectId: number, thunkAPI) => {
    try {
      const res = await axios.get(`${BASE_URL}/projects/${projectId}`);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getProjectTechnologies = createAsyncThunk(
  'projects/getProjectTechnologies',
  async (projectId: number, thunkAPI) => {
    try {
      const res = await axios.get(`${BASE_URL}/technologies/${projectId}`);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getProjectClient = createAsyncThunk(
  'projects/getProjectClient',
  async (projectId: number, thunkAPI) => {
    try {
      const res = await axios.get(`${BASE_URL}/client/${projectId}`);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getProjectExtraService = createAsyncThunk(
  'projects/getProjectExtraService',
  async (projectId: number, thunkAPI) => {
    try {
      const res = await axios.get(`${BASE_URL}/extraservice/${projectId}`);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const createProject = createAsyncThunk(
  'projects/createProject',
  async (projectData: {
    name: string;
    description: string;
    type: string;
    start_date: string;
    end_date: string;
    status: string;
    technologies: number[];
  }, thunkAPI) => {
    try {
      const projectRes = await axios.post(`${BASE_URL}/add/projects`, {
        name: projectData.name,
        description: projectData.description,
        type: projectData.type,
        start_date: projectData.start_date,
        end_date: projectData.end_date,
        status: projectData.status
      });
      
      if (projectData.technologies && projectData.technologies.length > 0) {
        await axios.post(`${BASE_URL}/add/project-technologies`, {
          project_id: projectRes.data.id,
          technologies: projectData.technologies
        });
      }
      
      return projectRes.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const deleteProject = createAsyncThunk(
  'projects/deleteProject',
  async (projectId: number, thunkAPI) => {
    try {
      await axios.delete(`${BASE_URL}/delete/projects/${projectId}`);
      return projectId;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const initialState: ProjectState = {
    // projectsList: [
    //     {
    //         id: 1,
    //         name: 'FebFlow App ',
    //         description: 'desc1',
    //         type: 'Веб-приложение',
    //         status: 'active'
    //     },
    //     {
    //         id: 2,
    //         name: 'DescApp Bus',
    //         description: 'desc3',
    //         type: 'Веб-сайт',
    //         status: 'hold'
    //     },
    //     {
    //         id: 3,
    //         name: 'Figma app ',
    //         description: 'desc1',
    //         type: 'Десктоп',
    //         status: 'active'
    //     },
    //     {
    //         id: 4,
    //         name: 'EA fc app ',
    //         description: 'desc1',
    //         type: 'Веб-приложение',
    //         status: 'done'
    //     },
    //     {
    //         id: 5,
    //         name: 'EA fc app ',
    //         description: 'desc1',
    //         type: 'Веб-приложение',
    //         status: 'done'
    //     },
    //     {
    //         id: 6,
    //         name: 'EA fc app ',
    //         description: 'desc1',
    //         type: 'Веб-приложение',
    //         status: 'done'
    //     },
    //     {
    //         id: 7,
    //         name: 'EA fc app ',
    //         description: 'desc1',
    //         type: 'Веб-приложение',
    //         status: 'done'
    //     },
    //     {
    //         id: 8,
    //         name: 'EA fc app ',
    //         description: 'desc1',
    //         type: 'Веб-приложение',
    //         status: 'done'
    //     },
    //     {
    //         id: 9,
    //         name: 'EA fc app ',
    //         description: 'desc1',
    //         type: 'Веб-приложение',
    //         status: 'done'
    //     },
    //     {
    //         id: 10,
    //         name: 'EA fc app ',
    //         description: 'desc1',
    //         type: 'Веб-приложение',
    //         status: 'done'
    //     },
    //     {
    //         id: 11,
    //         name: 'EA fc app ',
    //         description: 'desc1',
    //         type: 'Веб-приложение',
    //         status: 'done'
    //     },
    // ],
    projectsList: [],
    projectTeam: [],
    stateTeamWindow: false,
    projectsTechnologies: [],
    projectExtraService: [],
    activeProject: {
        id: -1,
        name: '',
        type: '',
        description: '',
        status: '',
    },
    stateProjectEditForm: false,
    isLoading: false,
    isDeleting: false, 
    reportsList: [],
    reportsLoading: false,
    projectsTab: 'tasks',
    projectClient: {
        client_name: ''
    },
    allTechnologies: []
}

const projectsSlice = createSlice({
    name: 'projects',
    initialState,
    reducers: {
        toggleTeamWindow: (state, {payload}) => {
            state.stateTeamWindow = payload
        },
        setActiveProject: (state, {payload}) => {
            state.activeProject = payload
        },
        toggleProjectEditForm: (state, {payload}) => {
            state.stateProjectEditForm = payload
        },
        toggleProjectTab: (state, {payload}) => {
            state.projectsTab = payload
        }
    },

    extraReducers: (builder) => {
        builder.addCase(getAllProjects.fulfilled, (state, {payload}) => {
            state.projectsList = payload;
        });
        builder.addCase(getUserProjects.fulfilled, (state, {payload}) => {
            state.projectsList = payload;
        });
        builder.addCase(getProjectsTeam.fulfilled, (state, {payload}) => {
            state.projectTeam = payload;
        });
        builder.addCase(removeProjectTeamUser.fulfilled, (state, {payload}) => {
            state.projectTeam = payload;
        });
        builder.addCase(updateProject.pending, (state) => {
            state.isLoading = true
        });
        builder.addCase(updateProject.fulfilled, (state, {payload}) => {

            state.activeProject = payload;
        
            if (state.projectsList) {
                state.projectsList = state.projectsList.map(project => 
                    project.id === payload.id ? payload : project
                );
            }
        
            state.isLoading = false;
        });
        builder.addCase(fetchActiveProject.fulfilled, (state, {payload}) => {
            state.activeProject = payload;
        });
        builder.addCase(createProject.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(createProject.fulfilled, (state) => {
            state.isLoading = false;
        });
        builder.addCase(createProject.rejected, (state) => {
            state.isLoading = false;
        });
        builder.addCase(deleteProject.pending, (state) => {
            state.isDeleting = true;
        });
        builder.addCase(deleteProject.fulfilled, (state) => {
            state.isDeleting = false;
        });
        builder.addCase(getReportsByProject.fulfilled, (state, {payload}) => {
            state.reportsList = payload
            state.reportsLoading = false;
        });
        builder.addCase(getReportsByProject.pending, (state) => {
            state.reportsLoading = true;
        });
        builder.addCase(getReportsByProject.rejected, (state) => {
            state.reportsLoading = false;
        });
        builder.addCase(getProjectTechnologies.fulfilled, (state, {payload}) => {
            state.projectsTechnologies = payload;
        });
        builder.addCase(getProjectClient.fulfilled, (state, {payload}) => {
            state.projectClient = payload;
        });
        builder.addCase(getProjectExtraService.fulfilled, (state, {payload}) => {
            state.projectExtraService = payload;
        });
        builder.addCase(getAllTechnologies.fulfilled, (state, {payload}) => {
            state.allTechnologies = payload;
        });
    }
})

export default projectsSlice.reducer;
export const {
    toggleTeamWindow, setActiveProject, toggleProjectEditForm, toggleProjectTab
} = projectsSlice.actions;