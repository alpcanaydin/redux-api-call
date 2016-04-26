import {
  apiRequest,
  apiSuccess,
  apiError,
  apiNoInternetConnection,
  apiConnected
} from './actions';

import { objectToQueryString } from './utils';

export default class API {
  settings = {
    baseUrl: '/',
    headers: {},
    mode: 'cors',
    cache: 'default',
    credentials: 'omit',
    referrer: 'client',
    json: true,
    transformSuccess: response => response,
    transformError: response => response,
    checkInternetConnection: true,
    onlineInterval: 5000,
    offlineInterval: 1000
  }

  prepare(settings, store) {
    this.settings = Object.assign({}, this.settings, settings);
    this.store = store;

    if (this.settings.checkInternetConnection) {
      this._checkNavigatorStatus();
    }
  }

  _dispatch(action) {
    this.store.dispatch(action);
  }

  _checkNavigatorStatus() {
    let previousNavigatorStatus = true;
    let interval;

    const intervalFn = () => {
      if (navigator.onLine && !previousNavigatorStatus) {
        this._dispatch(apiConnected());
        previousNavigatorStatus = true;

        clearInterval(interval);
        interval = setInterval(intervalFn, this.settings.onlineInterval);
      }

      if (!navigator.onLine && previousNavigatorStatus) {
        this._dispatch(apiNoInternetConnection());
        previousNavigatorStatus = false;

        clearInterval(interval);
        interval = setInterval(intervalFn, this.settings.offlineInterval);
      }
    };

    interval = setInterval(intervalFn, this.settings.onlineInterval);
  }

  _prepareUrl(url) {
    let formattedUrl;

    if (url instanceof Object) {
      const parts = [url.pathname.replace(/^\//, '')];
      if (url.hasOwnProperty('query')) {
        parts.push(objectToQueryString(url.query));
      }
      formattedUrl = parts.join('?');
    } else {
      formattedUrl = url.replace(/^\//, '');
    }

    return `${this.settings.baseUrl.replace(/\/$/, '')}/${formattedUrl}`;
  }

  _fetch(url, options) {
    this._dispatch(apiRequest({
      url,
      method: options.method,
      options
    }));

    return fetch(url, options)
      .then(response => {
        if (this.settings.json) {
          return Promise.all([response, response.json()]);
        }

        return Promise.all([response, response.blob()]);
      })
      .then(values => {
        const response = values[0];
        const formatted = values[1];

        if (this.settings.hasOwnProperty('postRequest')) {
          this.settings.postRequest(url, response, formatted);
        }

        if (!response.ok) {
          return Promise.reject(values);
        }

        if (this.settings.hasOwnProperty('postSuccess')) {
          this.settings.postSuccess(url, response, formatted);
        }

        this._dispatch(apiSuccess(Object.assign({
          url,
          method: options.method,
        }, this.settings.json ? { json: formatted } : {})));

        return this.settings.transformSuccess(...values);
      })
      .catch(values => {
        const response = values[0];
        const formatted = values[1];

        if (this.settings.hasOwnProperty('postError')) {
          this.settings.postError(url, response, formatted);
        }

        this._dispatch(apiError(Object.assign({
          url,
          method: options.method,
          status: response.status,
          error: response.statusText,
        }, this.settings.json ? { json: formatted } : {})));

        return this.settings.transformError(...values);
      })
    ;
  }

  _call(method, url, body = undefined, headers = {}) {
    const fetchOptions = {
      method,
      mode: this.settings.mode,
      cache: this.settings.cache,
      credentials: this.settings.credentials,
      referrer: this.settings.referrer,
      headers: Object.assign(
        this.settings.json ? {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        } : {},
        this.settings.headers,
        headers
      )
    };

    if (typeof body !== 'undefined') {
      fetchOptions.body = body;
    }

    const fullUrl = this._prepareUrl(url);
    const next = () => this._fetch(fullUrl, fetchOptions);
    if (this.settings.hasOwnProperty('preRequest')) {
      return this.settings.preRequest(fullUrl, fetchOptions, this.store, next);
    }

    return next();
  }
}

const api = new API();
export default api;
