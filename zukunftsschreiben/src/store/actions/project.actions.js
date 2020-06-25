import { projectConstants } from '../constants';
import { projectService } from '../services';


export const projectActions = {
  create,
  getProject,
};

function create(title, description, category, hidden, startDate, endDate, image, fundingGoal) {
  return dispatch => {
    dispatch(request({ title }));

    projectService.create(title, description, category, hidden, startDate, endDate, image, fundingGoal)
      .then(
        project => {
          dispatch(success(project));
        },
        error => {
          dispatch(failure(error));
        }
      );
  };

  function request(title) { return { type: projectConstants.CREATE_REQUEST_INITIATED, title } }
  function success(project) { return { type: projectConstants.CREATE_REQUEST_SUCCEEDED, project } }
  function failure(error) { return { type: projectConstants.CREATE_REQUEST_FAILED, error } }
}

function getProject(id) {
  return dispatch => {
    dispatch(request({ id }));

    projectService.getProject(id)
      .then(
        project => {
          dispatch(success(project));
        },
        error => {
          dispatch(failure(error));
        }
      );
  };

  function request(id) { return { type: projectConstants.GET_PROJECT_REQUEST_INITIATED, id } }
  function success(project) { return { type: projectConstants.GET_PROJECT_REQUEST_SUCCEEDED, project } }
  function failure(error) { return { type: projectConstants.GET_PROJECT_REQUEST_FAILED, error } }
}