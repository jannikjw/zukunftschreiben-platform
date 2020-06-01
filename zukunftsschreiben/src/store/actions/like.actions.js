import { projectConstants } from '../constants';
import { likeService } from '../services';

export const likeActions = {
  likeProject,
  unlikeProject
};


// -----------------
// private functions
// -----------------

function getOptimisticallyUpdatedProject(project, userWillHaveLiked) {
  let expectedProject = JSON.parse(JSON.stringify(project))
  expectedProject.userHasLiked = userWillHaveLiked;
  if (project.userHasLiked !== userWillHaveLiked) {
    const expectedLikeDelta = userWillHaveLiked ? 1 : -1;
    expectedProject.likes = project.likes + expectedLikeDelta;
  }
  return expectedProject;
}


// -----------------
// actions
// -----------------

function likeProject(project) {

  return dispatch => {
    dispatch(updateProject(getOptimisticallyUpdatedProject(project, true)));

    likeService.likeProject(project._id)
      .then(
        response => {
          // if the like succeeded still update the project with the one from the server
          const updatedProject = response.data;
          dispatch(updateProject(updatedProject));
        },
        error => {
          // if the like didn't succeed roll back the change
          dispatch(updateProject(getOptimisticallyUpdatedProject(project, true)));
        }
      );
  };

  function updateProject(project) { return { type: projectConstants.UPDATE_PROJECT_REQUEST_SUCCEEDED, project } }
}

function unlikeProject(project) {
  return dispatch => {
    // Let's do some optimistic UI magic here:
    // We update the project right away with the expectation that it works
    // and later with the actual value from the server.
    dispatch(updateProject(getOptimisticallyUpdatedProject(project, false)));

    likeService.unlikeProject(project._id)
      .then(
        response => {
          // if the like succeeded still update the project with the one from the server
          const updatedProject = response.data;
          dispatch(updateProject(updatedProject));
        },
        error => {
          // if the like didn't succeed roll back the change
          dispatch(updateProject(getOptimisticallyUpdatedProject(project, true)));
        }
      );
  };

  function updateProject(project) { return { type: projectConstants.UPDATE_PROJECT_REQUEST_SUCCEEDED, project } }
}
