import { projectConstants } from '../constants';
import { projectService } from '../services';


export const projectActions = {
  create,
  getAll
};

function create(title, description, category, status, startDate, endDate) {
  return dispatch => {
    dispatch(request({ title }));

    projectService.create(title, description, category, status, startDate, endDate)
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
