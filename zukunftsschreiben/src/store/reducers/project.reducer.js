import { projectConstants } from '../constants';

const initialState = { creating: false, errors: {}, project: null, projects: [] };

export function project(state = initialState, action) {
  switch (action.type) {
    case projectConstants.CREATE_PROJECT_REQUEST_INITIATED:
      return {
        ...state, ...{
          creating: true
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
          projects: data,
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

    default:
      return state
  }
}
