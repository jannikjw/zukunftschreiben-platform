import { projectConstants } from '../constants';
import { projectService } from '../services';


export const projectActions = {
  create,
  update,
  getAll,
  getProjectAction,
  deleteProject
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

function update(title, description, category, hidden, startDate, endDate, image, goal, id) {
  return dispatch => {
    dispatch(request({ title }));

    projectService.update(title, description, category, hidden, startDate, endDate, image, goal, id)
      .then(
        project => {
          dispatch(success(project));
        },
        error => {
          dispatch(failure(error));
        }
      );
  };

  function request(title) { return { type: projectConstants.UPDATE_REQUEST_INITIATED, title } }
  function success(project) { return { type: projectConstants.UPDATE_REQUEST_SUCCEEDED, project } }
  function failure(error) { return { type: projectConstants.UPDATE_REQUEST_FAILED, error } }
}

function getProjectAction(id) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      dispatch({ type: projectConstants.GET_PROJECT_REQUEST_INITIATED, id });

      projectService.getProject(id)
        .then(
          project => {
            dispatch({ type: projectConstants.GET_PROJECT_REQUEST_SUCCEEDED, project });
          },
          error => {
            dispatch({ type: projectConstants.GET_PROJECT_REQUEST_FAILED, error });
          }
        );

      resolve();
    });
  };
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
  function success(data) { return { type: projectConstants.GET_PROJECTS_REQUEST_SUCCEEDED, data } }
  function failure(error) { return { type: projectConstants.GET_PROJECTS_REQUEST_FAILED, error } }

}

function deleteProject(id) {
  return dispatch => {
    dispatch(request({ id }));

    projectService.deleteProject(id)
      .then(
        id => {
          dispatch(success(id));
        },
        error => {
          dispatch(failure(error));
        }
      );
  };

  function request(id) { return { type: projectConstants.DELETE_REQUEST_INITIATED, id } }
  function success(id) { return { type: projectConstants.DELETE_REQUEST_SUCCEEDED, id } }
  function failure(error) { return { type: projectConstants.DELETE_REQUEST_FAILED, error } }
}