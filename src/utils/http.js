// imports from utils
import * as localStorage from '../utils/localStorage';

// imports from constants
import { REQUEST_JSON_HEADERS } from '../constants/api';

async function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const clonedResponse = response.clone();

  const error = new Error(clonedResponse.statusText);
  error.apiStatus = clonedResponse.status;

  const apiMessage = await clonedResponse.text();
  try {
    const object = JSON.parse(apiMessage); // will throw in case it's not a JSON

    if (object.message) {
      error.apiMessage = object.message;
    }
  } catch (e) {
    // do nothing
  }

  throw error;
}

const parseResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');

  return {
    data: isJson ? await response.json() : await response.blob(),
  };
};

const request = (url, params = {}) => fetch(url, params)
  .then(checkStatus)
  .then(parseResponse)
  .catch((error) => {
    // TODO: net::ERR_EMPTY_RESPONSE
    // TODO: Error logging here, e.g Sentry
    throw error;
  });

export const postJson = (url, { body } = { body: {} }, authenticated = true) => {
  const auth = localStorage.getItemAndParse('auth');

  return request(url, {
    method: 'POST',
    headers: Object.assign(
      {},
      REQUEST_JSON_HEADERS,
      authenticated && !!(auth && auth.token) ? { Authorization: `JWT ${auth.token}` } : {}
    ),
    body: JSON.stringify(body),
  });
};

export const getJson = (url, authenticated = true) => {
  const auth = localStorage.getItemAndParse('auth');

  return request(url, {
    method: 'GET',
    headers: Object.assign(
      {},
      REQUEST_JSON_HEADERS,
      authenticated && !!(auth && auth.token) ? { Authorization: `JWT ${auth.token}` } : {}
    ),
  });
};
