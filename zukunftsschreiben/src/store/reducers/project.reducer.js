import { projectConstants } from '../constants';

const initialState = { creating: false, errors: {}, project: null };

export function project(state = initialState, action) {
  switch (action.type) {
    case projectConstants.CREATE_REQUEST_INITIATED:
      return {
        ...state, ...{
          creating: true
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
    default:
      return state
  }
}
