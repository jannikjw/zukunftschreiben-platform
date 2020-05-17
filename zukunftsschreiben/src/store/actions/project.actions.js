import { projectConstants } from '../constants';
import { projectService } from '../services';


export const projectActions = {
  create,
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

  function request(title) { return { type: projectConstants.CREATE_REQUEST_INITIATED, title } }
  function success(project) { return { type: projectConstants.CREATE_REQUEST_SUCCEEDED, project } }
  function failure(error) { return { type: projectConstants.CREATE_REQUEST_FAILED, error } }
}
