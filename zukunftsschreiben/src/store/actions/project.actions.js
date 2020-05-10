import { projectConstants } from '../constants/project.constants';
import { authHeader } from "../../helpers";

export const createProject = projectData => dispatch => {
  const API_URL = process.env.REACT_APP_API_HOST + "/api";
  const endpoint = API_URL + "/projects"; // 'api/posts'

  const requestOptions = {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify({ projectData }),
  };

  fetch(endpoint, requestOptions)
    .then((response) => {
      return response.text().then((text) => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
          const error = data;
          console.log(error);
          return Promise.reject(error);
        }
        console.log(data);
      });
    })
    .then(project => dispatch({
      type: projectConstants.NEW_POST,
      payload: project
    }))

    .catch((err) => {
      console.log(err)
    });
}