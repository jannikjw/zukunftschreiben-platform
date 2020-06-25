import { projectConstants } from '../constants';
import { projectService } from '../services';


export const projectActions = {
  create,
  getProject,
  getAll
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

  function request(title) { return { type: projectConstants.CREATE_PROJECT_REQUEST_INITIATED, title } }
  function success(project) { return { type: projectConstants.CREATE_PROJECT_REQUEST_SUCCEEDED, project } }
  function failure(error) { return { type: projectConstants.CREATE_PROJECT_REQUEST_FAILED, error } }
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

function getAll() {
  return dispatch => {
    dispatch(request());

    projectService.getAll()
      .then(
        response => dispatch(success(response)),
        error => dispatch(failure(error))
      );
  };

  function request() { return { type: projectConstants.GET_PROJECTS_REQUEST_INITIATED } }
  function success(projectData) { return { type: projectConstants.GET_PROJECTS_REQUEST_SUCCEEDED, projectData } }
  function failure(error) { return { type: projectConstants.GET_PROJECTS_REQUEST_FAILED, error } }

}
