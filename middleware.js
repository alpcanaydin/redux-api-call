import API from './api';

export default function createAPIMiddleware(settings) {
  return store => {
    // Create a new instance for API service with user settings.
    API.prepare(settings, store);

    return next => action => next(action);
  };
}
