import { authHeader } from '../../helpers';

const API_URL = process.env.REACT_APP_API_HOST + '/api'

export const projectService = {
  create,
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
    } else {
      window.location = '/'
    }
    return data;
  });
}

// -----------------
// service functions
// -----------------
function create(title, description, category, status, startDate, endDate) {
  const requestOptions = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify({ title, description, category, status, startDate, endDate })
  };

  return fetch(`${API_URL}/project/create`, requestOptions)
    .then(handleResponse);
}

function getProject(id) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader(),
    body: JSON.stringify({ id })
  };

  return fetch(`${API_URL}/project/getProject`, requestOptions)
    .then(handleResponse);
}

