import { projectConstants } from '../constants';

const initialState = { creating: false, errors: {}, project: null, projects: [] };


function updateProject(projects, project) {
  let updatedProjects = projects.map(p => {
    if (p._id === project._id) {
      return project;
    } else {
      return p;
    }
  })
  return updatedProjects;
}

export function project(state = initialState, action) {
  switch (action.type) {
    case projectConstants.CREATE_PROJECT_REQUEST_INITIATED:
      return {
        ...state, ...{
          creating: true,
          project: null
        }
      };
    case projectConstants.CREATE_PROJECT_REQUEST_SUCCEEDED:
      return {
        ...state, ...{
          creating: false,
          project: action.project,
          errors: {}
        }
      };
    case projectConstants.CREATE_PROJECT_REQUEST_FAILED:
      return {
        ...state, ...{
          creating: false,
          errors: action.error
        }
      };
    case projectConstants.GET_PROJECTS_REQUEST_INITIATED:
      return {
        ...state, ...{
          loading: true
        }
      };
    case projectConstants.GET_PROJECTS_REQUEST_SUCCEEDED:
      const data = action.projectData;
      return {
        ...state, ...{
          initialLoadHappened: true,
          loading: false,
          errors: {},
          projects: data.data,
        }
      };
    case projectConstants.UPDATE_PROJECT_REQUEST_SUCCEEDED:
      return {
        ...state, ...{
          initialLoadHappened: true,
          loading: false,
          projects: updateProject(state.projects, action.project)
        }
      };
    case projectConstants.UPDATE_PROJECT_REQUEST_FAILED:
      return {
        ...state, ...{
          initialLoadHappened: true,
          loading: false,
          errors: action.error,
        }
      };
    default:
      return state
  };
}
