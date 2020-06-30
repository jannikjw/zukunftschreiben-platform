import { projectConstants } from '../constants';
import { donationService } from '../services';

export const donationActions = {
  donateToProject
};

// -----------------
// actions
// -----------------

function donateToProject(project, amount) {

  return dispatch => {
    dispatch(request(project._id))

    donationService.donateToProject(project._id, amount)
      .then(
        response => {
          // if the donation succeeded still update the project with the one from the server
          const updatedProject = response.data;
          dispatch(success(updatedProject));
        },
        error => {
          // if the like didn't succeed roll back the change
          dispatch(failure(error));
        }
      );
  };

  function request(project_id) { return { type: projectConstants.UPDATE_PROJECT_REQUEST_INITIATED, project_id } }
  function success(project) { return { type: projectConstants.UPDATE_PROJECT_REQUEST_SUCCEEDED, project } }
  function failure(error, project_id) { return { type: projectConstants.UPDATE_PROJECT_REQUEST_FAILED, error, project_id } }
}

