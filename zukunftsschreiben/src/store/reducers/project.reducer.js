import { projectConstants } from '../constants/project.constants';

const initialState = {
  items: [],
  item: {}
}

export function manageProjects(state = initialState, action) {
  switch (action.type) {
    case projectConstants.FETCH_PROJECTS:
      return;
    case projectConstants.NEW_PROJECT:
      return {
        ...state,
        item: action.payload
      }
    default:
      return state;
  }
}