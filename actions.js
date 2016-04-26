export const API_REQUEST = '@@API/REQUEST';
export const API_SUCCESS = '@@API/SUCCESS';
export const API_ERROR = '@@API/ERROR';
export const API_NO_INTERNET_CONNECTION = '@@API/NO_INTERNET_CONNECTION';
export const API_CONNECTED = '@@API/CONNECTED';

export const apiRequest = payload => ({
  type: API_REQUEST,
  payload
});

export const apiSuccess = payload => ({
  type: API_SUCCESS,
  payload
});

export const apiError = payload => ({
  type: API_ERROR,
  payload
});

export const apiNoInternetConnection = () => ({
  type: API_NO_INTERNET_CONNECTION
});

export const apiConnected = () => ({
  type: API_CONNECTED
});
