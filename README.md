# redux-api-call

An API middleware that use `fetch` library for your Redux applications.

> **NOTE:** This library is in under development! DO NOT USE right now.

## Simple Example

redux-api-call just have methods that represent HTTP verbs. Example `GET` request with **redux-saga** is like this:

```js
import { SOME_DATA_REQUESTED, dataSucceeded } from './actions';
import { takeLatest } from 'redux-saga';
import { put } from 'redux-saga/effects';
import { get } from 'redux-api-call';

function* fetchData({ query }) {
  // returns Promise
  const apiResult = yield get({ pathname: '/endpoint', query });
  yield put(dataSucceeded(apiResult));
}

export default function* root() {
  yield* takeLatest(SOME_DATA_REQUESTED, fetchData);
}
```

## Installation
`redux-api-call` is available on npm. To install library just run the following command.
```
npm install redux-api-call
```

## Configuration
You must configure your API with `createAPIMiddleware` method to set default settings like base, default headers and etc.

You may want to use `APIReducer` to get pending requests from your application's state.


```js
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { createAPIMiddleware, APIReducer } from '../service/redux-api-call';
import * as reducers from '../reducers';

export default function (initialState) {
  const middlewares = [
    createAPIMiddleware({
      baseUrl: 'http://your-api-url.com',
      transformSuccess: (response, json) => json,
      transformError: (response, json) => json.meta.error
    })
  ];

  const combinedReducers = combineReducers({
    ...reducers,
    APIReducer
  });

  const store = createStore(
    combinedReducers,
    initialState,
    applyMiddleware(...middlewares)
  );

  return store;
}
```

## Usage


### Configuring Redux Middleware: `createAPIMiddleware`
To define API settings and callback methods or transformers. It takes object as an argument.


#### Request Settings
**baseUrl** `string`
Default URL for API. For example: *http://api.site.com*

**headers** `object`
Default headers that will send with all requests.

```js
{
  Authorization: 'Bearer token',
  'Content-Type': 'application/json'
}
```

**mode** `string`
Mode of the request. Default: `cors`, Available Values: `cors`, `no-cors`, `same-origin`, `navigate`

**credentials** `string`
Credentials of the request. Default: `omit`, Available Values: `omit`, `same-origin`

**cache** `string`
Cache mode of the request. Default: `cache`, Available Values: `cache`, `no-cache`

**json** `boolean`
Is API response in JSON format? Default: `true`


#### Transform Settings
You can transform API responses via transformers. To create a response trasformer you can pass `transformSuccess` and `transformError` functions to your settings object.

**transformSuccess** `function`: `(response, formattedResponse)`
This function takes `response`, `formatted` values as arguments.

```js
{
  // Always returns payload object from response on successful API calls.
  transformSuccess: (response, json) => json.payload
}
```

**transformError** `function`: `(response, formattedResponse)`
This function takes `response`, `formatted` values as arguments.

```js
{
  // Always returns error object from response when API call failed.
  transformError: (response, json) => json.payload
}
```


#### Middlewares
You can use `pre` and `post` middlewares between requests and responses.

**preRequest** `function`: `(url, fetchOptions, store, next)`
This function takes `url`, `fetchOptions`, `store`, `next` values as arguments. `url` argument stores full formatted request URL. `fetchOptions` is an object that used by *fetch* library. You must return `next` function from this method to keep going process.

```js
{
  preRequest: (url, fetchOptions, store, next) {
    console.log(url);
    return next();
  }
}
```


**postRequest** `function`: `(url, response, formattedResponse)`
This middleware runs when request has been completed. It takes `url`, `response`, `formattedResponse` values as arguments.

```js
{
  postRequest: (url, response, formattedResponse) => {
    console.log('Request finished');
  }
}
```


**postSuccess** `function`: `(url, response, formattedResponse)`
This middleware runs when request has been completed **successfully**. It takes `url`, `response`, `formattedResponse` values as arguments.

```js
{
  postSuccess: (url, response, formattedResponse) => {
    console.log('Request has been finished successfully!');
  }
}
```


**posterror** `function`: `(url, response, formattedResponse)`
This middleware runs when request has been **failed**. It takes `url`, `response`, `formattedResponse` values as arguments.

```js
{
  postError: (url, response, formattedResponse) => {
    console.log('An error occured on API request!');
  }
}
```

#### Check Internet Connection Settings
You can check internet connection via `redux-api-call`. It dispatches actions to notify application when client's internet connection get down or reconnected.

**checkInternetConnection** `boolean`
To enable or disable this feature. Default: `true`

**onlineInterval** `integer`
Interval duration to check is internet online. Default: `5000`

**offlineInterval** `integer`
Interval duration to is internet reconnected. Default: `1000`



### Making API Requests

To make API request just import related http verb from `redux-api-call`

#### `GET` and `DELETE` Request `(url, headers)`

These methods take url `(string|object) `  and headers `object` arguments.

```js
import { get, del } from 'redux-api-call';

get('/users')
  .then(json) => console.log(json))
  .catch(err => console.log(err))
;

// OR

get({ pathname: '/users', query: { page: 3 } })
  .then(json => console.log(json))
  .catch(err => console.log(err))
;


// OR

del({ pathname: '/user/1' })
  .then(json => console.log(json))
  .catch(err => console.log(err))
;

```

You may add new headers or replace default headers to request. For this, you can pass headers object as second argument. It will combine new and default headers.

#### `POST` and `PUT` Request `(url, body, headers)`
These methods take url `(string|object) `, body `(object|FormData)` and headers `object` arguments.


```js
import { post, put } from 'redux-api-call';

const body = {
  username: 'jack',
  password: '1234'
};

const headers = {
  'X-Some-Header': 'Some value'
};

put('/user', body, headers)
  .then(json => console.log('User created', json))
  .catch(json => console.log('User creation error', json))
;

// OR

post('/user/1', body)
  .then(json => console.log('User updated', json))
  .catch(json => console.log('User update error', json))
;
```

## Actions

Good thing about `redux-api-call` that it dispatches some actions to your application. You can subscribe them to define generic API callbacks.

#### `@@API/REQUEST`
This action is dispatched on API request has been started.

![@@/API/REQUEST](https://cloud.githubusercontent.com/assets/1801024/14832260/0daeaa9e-0c02-11e6-95eb-888de531fa68.png)


#### `@@API/SUCCESS`
This action is dispatched when API request finished successfully.

![@@/API/REQUEST](https://cloud.githubusercontent.com/assets/1801024/14832335/6a4cd172-0c02-11e6-96b7-58392a022e49.png)


#### `@@API/ERROR`
This action is dispatched when API request failed.

![@@/API/ERROR](https://cloud.githubusercontent.com/assets/1801024/14832704/3923f0b0-0c04-11e6-9709-a714aef1e9d4.png)


#### `@@API/NO_INTERNET_CONNECTION`
This action is dispatched when internet connection failure detected.

![@@API/NO_INTERNET_CONNECTION](https://cloud.githubusercontent.com/assets/1801024/14832767/8d0883e4-0c04-11e6-88df-a3b4dcbc171a.png)


#### `@@API/CONNECTED`
This action is dispatched when internet reconnected.

![@@API/CONNECTED](https://cloud.githubusercontent.com/assets/1801024/14832773/914e21de-0c04-11e6-829d-94bf26d49432.png)

## State
`redux-api-call` has one reducer to keep pending requests data.

![API State](https://cloud.githubusercontent.com/assets/1801024/14832886/105c22a0-0c05-11e6-8be2-bd8ad7c3f352.png)