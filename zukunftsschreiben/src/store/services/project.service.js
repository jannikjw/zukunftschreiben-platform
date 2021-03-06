import { authHeader } from '../../helpers';

const API_URL = process.env.REACT_APP_API_HOST + '/api'

export const projectService = {
  create,
  update,
  getAll,
  getProject,
  deleteProject
};

// -----------------
// private functions
// ----------------- 

// For other responses a 401 error means that the JWT is expired
// If this is the case, delete the use and perform a hard reload the page
function handleResponse(response) {
  return response.text().then(text => {
    const data = text && JSON.parse(text);
    if (!response.ok) {

      if (response.status === 401) {
        // auto-logout if 401 response returned from api
        localStorage.removeItem(process.env.REACT_APP_LOCAL_STORAGE_KEY_FOR_USER);
        window.location.reload(true);
      }

      const error = data
      return Promise.reject(error);
    }
    return data;
  });
}

// -----------------
// service functions
// -----------------
function create(title, description, category, hidden, startDate, endDate, image, fundingGoal) {
  const requestOptions = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify({ title, description, category, hidden, startDate, endDate, image, fundingGoal })
  };
  return fetch(`${API_URL}/project/create`, requestOptions)
    .then(handleResponse);
}

function update(title, description, category, hidden, startDate, endDate, image, goal, id) {
  const requestOptions = {
    method: 'PUT',
    headers: authHeader(),
    body: JSON.stringify({ title, description, category, hidden, startDate, endDate, image, goal, id })
  };
  return fetch(`${API_URL}/project/update`, requestOptions)
    .then(handleResponse);
}

function deleteProject(id) {
  const requestOptions = {
    method: 'DELETE',
    headers: authHeader(),
    body: JSON.stringify({ id })
  };
  return fetch(`${API_URL}/project/delete`, requestOptions)
    .then(handleResponse);
}

function getProject(id) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader(),
  };

  return fetch(`${API_URL}/project/getProject/` + id, requestOptions)
    .then(handleResponse);
}

function getAll() {
  //gets Array of all projects
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  };
  return fetch(`${API_URL}/project/`, requestOptions)
    .then(handleResponse);
};

