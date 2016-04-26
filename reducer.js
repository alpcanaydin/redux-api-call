import { API_REQUEST, API_SUCCESS, API_ERROR } from './actions';

const initialState = {
  pendingRequests: 0
};

export default function (state = initialState, { type }) {
  switch (type) {
    case API_REQUEST:
      return { ...state, pendingRequests: state.pendingRequests + 1 };
    case API_SUCCESS:
    case API_ERROR:
      return { ...state, pendingRequests: state.pendingRequests - 1 };
    default:
      return state;
  }
}
