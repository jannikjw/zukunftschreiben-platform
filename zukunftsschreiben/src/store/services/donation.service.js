import { authHeader } from '../../helpers';

const API_URL = process.env.REACT_APP_API_HOST + '/api'

export const donationService = {
  donateToProject
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

function donateToProject(project_id, amount) {
  const requestOptions = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify({ amount })
  };

  return fetch(`${API_URL}/donation/${project_id}`, requestOptions)
    .then(handleResponse)
}
