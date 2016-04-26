import API from './api';

export const HTTP_GET = 'GET';
export const HTTP_POST = 'POST';
export const HTTP_PUT = 'PUT';
export const HTTP_DELETE = 'DELETE';

export const get = function get(url, headers = {}) {
  return this._call(HTTP_GET, url, undefined, headers);
}.bind(API);

export const post = function post(url, body = {}, headers = {}) {
  return this._call(HTTP_POST, url, body, headers);
}.bind(API);

export const put = function put(url, body = {}, headers = {}) {
  return this._call(HTTP_PUT, url, body, headers);
}.bind(API);

export const del = function del(url, headers = {}) {
  return this._call(HTTP_DELETE, url, undefined, headers);
}.bind(API);

export const request = function request(url, method, body = undefined, headers = {}) {
  return this._call(method, url, body, headers);
}.bind(API);
