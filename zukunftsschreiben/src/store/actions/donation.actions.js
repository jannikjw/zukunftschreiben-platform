import { projectConstants } from '../constants';
import { donationService } from '../services';

export const donationActions = {
  donateToProject
};


// -----------------
// private functions
// -----------------

function getOptimisticallyUpdatedProject(project, amount) {
  let expectedProject = JSON.parse(JSON.stringify(project))
  expectedProject.funding = project.funding + amount;
  return expectedProject;
}


// -----------------
// actions
// -----------------

function donateToProject(project, amount) {

  return dispatch => {
    dispatch(updateProject(getOptimisticallyUpdatedProject(project, amount)));

    donationService.donateToProject(project._id, amount)
      .then(
        response => {
          // if the donation succeeded still update the project with the one from the server
          const updatedProject = response.data;
          dispatch(updateProject(updatedProject));
        },
        error => {
          // if the like didn't succeed roll back the change
          dispatch(updateProject(getOptimisticallyUpdatedProject(project, -amount)));
        }
      );
  };

  function updateProject(project) { return { type: projectConstants.UPDATE_PROJECT_REQUEST_SUCCEEDED, project } }
}

