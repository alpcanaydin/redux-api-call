// Export middleware to create a new API instance
export createAPIMiddleware from './middleware';

// Export http verbs
export { get, post, put, del, request } from './methods';

// Export reducer for API actions
export APIReducer from './reducer';

// Export utils
export { objectToQueryString } from './utils';
