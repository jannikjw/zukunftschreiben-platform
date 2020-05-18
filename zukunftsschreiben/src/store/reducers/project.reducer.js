import { projectConstants } from '../constants';

const initialState = { creating: false, errors: {}, project: null, getting: false, editing_project: null };

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
    case projectConstants.GET_PROJECT_REQUEST_INITIATED:
      return {
        ...state, ...{
          getting: true,
          editing_project: null
        }
      };
    case projectConstants.GET_PROJECT_REQUEST_SUCCEEDED:
      return {
        ...state, ...{
          getting: false,
          editing_project: action.project,
          errors: {}
        }
      };
    case projectConstants.GET_PROJECT_REQUEST_FAILED:
      return {
        ...state, ...{
          getting: false,
          errors: action.error
        }
      };
    default:
      return state
  };
}
