import { projectConstants } from '../constants';

const initialState = { creating: false, errors: {}, project: null, projects: [], isAdmin: false, editing_project: null };


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
    case projectConstants.CREATE_REQUEST_INITIATED:
      return {
        ...state, ...{
          creating: true,
          project: null
        }
      };
    case projectConstants.CREATE_REQUEST_SUCCEEDED:
      return {
        ...state, ...{
          creating: false,
          project: action.project,
          errors: {}
        }
      };
    case projectConstants.CREATE_REQUEST_FAILED:
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
      return {
        ...state, ...{
          initialLoadHappened: true,
          loading: false,
          errors: {},
          projects: action.data.data.projectData,
          isAdmin: action.data.data.isAdmin,
        }      
      };
    case projectConstants.GET_PROJECTS_REQUEST_FAILED:
      return {
        ...state, ...{
          initialLoadHappened: true,
          loading: false,
          errors: action.error
        }
      };
    case projectConstants.UPDATE_PROJECT_REQUEST_INITIATED:
      return {
        ...state, ...{
          loading: true,
          projects: state.projects
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
      case projectConstants.GET_PROJECT_REQUEST_INITIATED:
        return {
          ...state, ...{
            loading: true,
          }
        };
      case projectConstants.GET_PROJECT_REQUEST_SUCCEEDED:
        return {
          ...state, ...{
            editing_project: action.project.data,
            loading: false,
          }      
        };
    default:
      return state
  };
}
