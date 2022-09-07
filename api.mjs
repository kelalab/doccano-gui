import fetch from 'node-fetch';
import https from 'https';
import {
  DOCCANO_ADMIN_URL,
  DOCCANO_URL,
  DOCCANO_API_URL,
  DOCCANO_VERSION,
} from './config.js';
import FormData from 'form-data';
import setCookie from 'set-cookie-parser';
import jsdom from 'jsdom';
import { extractCookies } from './util.js';
import { response } from 'express';

const agent = new https.Agent({
  rejectUnauthorized: false,
});

/**
 *
 * @returns
 */
export const getHealth = async () => {
  if (DOCCANO_VERSION > 1.6) {
    let res = await fetch(`${DOCCANO_URL}`);
    return res.status;
  }
  return doGet(`${DOCCANO_API_URL}/health`);
};

/**
 *
 * @param {*} token
 * @returns
 */
export const me = async (token) => {
  return doGet(`${DOCCANO_API_URL}/me`, token);
};

/**
 *
 * @param {*} projectId
 * @param {*} token
 * @param {*} user
 */
export const myProgress = async (projectId, token, user = null) => {
  let _me = user;
  if (!_me) {
    _me = await me(token);
  }
  if (_me) {
    const progress = await memberProgress(projectId, token);
    console.log('progress', progress);
    if (progress && progress.progress) {
      const myprogress = progress.progress.find((p) => p.user === _me.username);
      console.log('progress', progress, progress.progress, 'me', _me);
      return myprogress;
    }
  }
  return {};
};

export const memberProgress = async (projectId, token) => {
  return doGet(
    `${DOCCANO_API_URL}/projects/${projectId}/metrics/member-progress`,
    token,
  );
};

export const categoryDistribution = async () => {};

/**
 *
 * @param {*} token
 * @returns
 */
export const users = async (token) => {
  return doGet(`${DOCCANO_API_URL}/users`, token);
};

export const newUser = async (username, password, token, cookies) => {
  console.log('newUser', username, password, token, cookies);
  const req_cookies = cookies
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join(';');
  /** First we load the page to get csrftoken */
  const getData = await doGet(`${DOCCANO_ADMIN_URL}/auth/user/add/`, null, {
    Cookie: `${req_cookies}`,
  });
  const dom = new jsdom.JSDOM(getData);
  const csrftoken = dom.window.document.querySelector(
    '[name=csrfmiddlewaretoken]',
  ).value;
  console.log('tok', csrftoken);
  console.log(getData);
  const formData = new FormData();
  formData.append('csrfmiddlewaretoken', csrftoken);
  formData.append('username', username);
  formData.append('password1', password);
  formData.append('password2', password);
  formData.append('_save', 'Save');
  const headers = {
    ...formData.getHeaders(),
    Origin: DOCCANO_URL,
    Referer: DOCCANO_ADMIN_URL + '/auth/user/add/',
    Cookie: `${req_cookies}`,
  };
  const userAddResponse = await doPost(
    `${DOCCANO_ADMIN_URL}/auth/user/add/`,
    formData,
    token,
    headers,
  );
  const doc = new jsdom.JSDOM(userAddResponse);
  const errorelement = doc.window.document.querySelector('.errorlist>li');
  if (errorelement) {
    const errors = errorelement.innerHTML;
    console.error('errors', errors);
    if (errors) {
      return errors;
    }
  }
};

export const deleteUser = async (userId, token) => {
  return doPost(
    `${DOCCANO_ADMIN_URL}/auth/user/${userId}/delete`,
    JSON.stringify({
      post: 'Post',
    }),
    token,
  );
};
/**
 * Add user to project. For Doccano > 1.6 only userId and roleId required.
 * @param {number} userId
 * @param {*} username
 * @param {*} projectId
 * @param {number} roleId
 * @param {*} rolename
 * @param {*} token
 * @returns
 */
export const addRolemapping = async (
  userId,
  username,
  projectId,
  roleId,
  rolename,
  token,
) => {
  if (DOCCANO_VERSION > 1.6) {
    return doPost(
      `${DOCCANO_API_URL}/projects/${projectId}/members`,
      JSON.stringify({ user: userId, role: roleId }),
      token,
    );
  }
  return doPost(
    `${DOCCANO_API_URL}/projects/${projectId}/roles`,
    JSON.stringify({
      id: 0,
      user: userId,
      username: username,
      role: roleId,
      rolename: rolename,
    }),
    token,
  );
};
/**
 *
 * @param {*} userIds array of userIds e.g [1,2,3]
 * @param {*} projectId
 * @returns
 */
export const removeRolemapping = async (userIds, projectId, token) => {
  return doDelete(
    `${DOCCANO_API_URL}/projects/${projectId}/roles`,
    JSON.stringify({
      ids: userIds,
    }),
    token,
  );
};

/**
 *
 * @param {*} token
 * @returns
 */
export const projects = async (token, projectId = null) => {
  console.log('projects', token, projectId);
  return doGet(
    `${DOCCANO_API_URL}/projects${projectId ? `/${projectId}` : ''}`,
    token,
  );
};

export const roles = async (token) => {
  return doGet(`${DOCCANO_API_URL}/roles`, token);
};

/**
 *
 * @param {*} projectId
 * @param {*} token
 * @returns
 */
export const labels = async (projectId, token) => {
  if (DOCCANO_VERSION > 1.6) {
    return doGet(
      `${DOCCANO_API_URL}/projects/${projectId}/category-types`,
      token,
    );
  }
  return doGet(`${DOCCANO_API_URL}/projects/${projectId}/labels`, token);
};

/**
 *
 * @param {*} label
 * @param {*} projectId
 * @param {*} token
 * @returns
 */
export const newLabel = async (label, projectId, token) => {
  if (DOCCANO_VERSION > 1.6) {
    return doPost(
      `${DOCCANO_API_URL}/projects/${projectId}/category-types`,
      label,
      token,
    );
  }
  return doPost(
    `${DOCCANO_API_URL}/projects/${projectId}/labels`,
    label,
    token,
  );
};

/**
 *
 * @param {*} label
 * @param {*} projectId
 * @param {*} token
 * @returns
 */
export const deleteLabel = async (label, projectId, token) => {
  if (DOCCANO_VERSION > 1.6) {
    return doDelete(
      `${DOCCANO_API_URL}/projects/${projectId}/category-types`,
      label,
      token,
    );
  }
  return doDelete(
    `${DOCCANO_API_URL}/projects/${projectId}/labels`,
    label,
    token,
  );
};

/**
 *
 * @param {*} username
 * @param {*} password
 * @returns
 */
export const auth = async (username, password) => {
  console.log(`auth: ${username} ${password}`);
  const options = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({ username: username, password: password }),
  };
  if (new URL(DOCCANO_API_URL).protocol === 'https') {
    options.agent = agent;
  }
  const response = await fetch(`${DOCCANO_API_URL}/auth/login/`, options);
  if (response.status === 200) {
    const json = await response.json();
    console.log('authresponse: ', json);
    return json.key;
  } else {
    console.log(response);
  }
  return null;
};

export const adminAuth = async (username, password) => {
  /** First load login page to get csrftoken information */
  const test = await doGetRaw(`${DOCCANO_ADMIN_URL}/`, null);
  const htmlText = await test.text();
  const dom = new jsdom.JSDOM(htmlText);
  const tok = dom.window.document.querySelector(
    '[name=csrfmiddlewaretoken]',
  ).value;
  /* Also extract response cookies */
  const combinedCookieHeader = test.headers.get('Set-Cookie');
  const splitCookieHeaders = setCookie.splitCookiesString(combinedCookieHeader);
  const cookies = setCookie.parse(splitCookieHeaders);
  /* Create login form */
  const form = new Map();
  form.set('csrfmiddlewaretoken', tok);
  form.set('username', username);
  form.set('password', password);
  form.set('next', '/admin/');
  let formBody = [];
  form.forEach((value, key) => {
    const encodedKey = encodeURIComponent(key);
    const encodedValue = encodeURIComponent(value);
    formBody.push(encodedKey + '=' + encodedValue);
  });
  formBody = formBody.join('&');
  console.log('formBody', formBody);
  let headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Origin: DOCCANO_URL,
    Referer: DOCCANO_ADMIN_URL + '/login/?next=/admin/',
    Host: new URL(DOCCANO_URL).host,
    Connection: 'keep-alive',
  };
  let requestCookies = cookies.flatMap(
    (cookie, idx) => `${cookie.name}=${cookie.value}`,
  );
  headers['Cookie'] = requestCookies.join(';');
  console.log('headers', headers);
  // admin post request - special case
  let options = {
    method: 'POST',
    headers: headers,
    body: formBody,
    redirect: 'manual',
  };
  const url = `${DOCCANO_ADMIN_URL}/login/`;
  if (new URL(url).protocol === 'https') {
    options.agent = agent;
  }
  const response = await fetch(url, options);
  if (response.status === 302) {
    console.warn('redirect response, maybe should follow?');
    const cks = extractCookies(response.headers.raw()['set-cookie']);
    console.log(cks);
    return cks;
  }
  if (response.status === 403) {
    console.log(response);
  }
  const responseType = response.headers.get('content-type');
  if (responseType === 'application/json') {
    return response.json();
  } else if (responseType.match(/text\/(plain|html)*/)) {
    return response.text();
  }
  return null;
};

/**
 *
 * @param {*} projectId
 * @param {*} fileId
 * @param {*} format
 * @param {*} column_data
 * @param {*} column_label
 * @param {*} token
 * @param {*} delimeter
 * @returns
 */
export const upload = async (
  projectId,
  fileId,
  format,
  column_data,
  column_label,
  token,
  delimeter = '',
) => {
  console.log(
    'upload',
    projectId,
    fileId,
    format,
    column_data,
    column_label,
    token,
  );
  let data = {
    delimiter: delimeter,
  };
  if (column_data) {
    data.column_data = column_data;
  }
  if (column_label) {
    data.column_label = column_label;
  }
  const response = await doPost(
    `${DOCCANO_API_URL}/projects/${projectId}/upload`,
    JSON.stringify({
      column_data: column_data,
      column_label: column_label,
      delimiter: '',
      encoding: 'utf-8',
      format: format,
      uploadIds: [fileId],
    }),
    token,
  );
  return response.task_id;
};

export const fileUpload = async (file, token) => {
  console.log('starting upload');
  const form = new FormData();
  form.append('filepond', file, 'upload.json');
  const fileId = await doPost(
    `${DOCCANO_API_URL}/fp/process/`,
    form,
    token,
    form.getHeaders(),
  );
  console.log('upload response', fileId);
  return fileId;
};

export const getDocs = async (
  projectId,
  token,
  limit = null,
  offset = null,
) => {
  console.log('getting project docs');
  if (DOCCANO_VERSION > 1.6) {
    return doGet(
      `${DOCCANO_API_URL}/projects/${projectId}/examples${
        limit || offset ? '?' : ''
      }${limit ? 'limit=' + limit : ''}${offset ? '&offset=' + offset : ''}`,
      token,
    );
  }
  return doGet(
    `${DOCCANO_API_URL}/projects/${projectId}/docs${
      limit || offset ? '?' : ''
    }${limit ? 'limit=' + limit : ''}${offset ? '&offset=' + offset : ''}`,
    token,
  );
};

export const getDoc = async (projectId, docId, token) => {
  return doGet(
    `${DOCCANO_API_URL}/projects/${projectId}/examples/${docId}`,
    token,
  );
};

export const searchDoc = async (projectId, token, search) => {
  if (DOCCANO_VERSION > 1.6) {
    return doGet(
      `${DOCCANO_API_URL}/projects/${projectId}/examples?text=${search}`,
      token,
    );
  }
  // not implemented for now
  return null;
};

/**
 * Add a new doc to doccano
 * @param {*} projectId
 * @param {*} data
 * @param {*} token
 * @returns
 */
export const postDoc = async (projectId, data, token) => {
  if (DOCCANO_VERSION > 1.6) {
    return doPost(
      `${DOCCANO_API_URL}/projects/${projectId}/examples`,
      data,
      token,
    );
  }
  return doPost(`${DOCCANO_API_URL}/projects/${projectId}/docs`, data, token);
};

export const updateDoc = async (projectId, docId, data, token) => {
  return doPut(
    `${DOCCANO_API_URL}/projects/${projectId}/docs/${docId}`,
    data,
    token,
  );
};

export const addAnnotation = async (projectId, docId, labelId, token) => {
  if (DOCCANO_VERSION > 1.6) {
    return doPost(
      `${DOCCANO_API_URL}/projects/${projectId}/examples/${docId}/categories`,
      JSON.stringify({ label: labelId }),
      token,
    );
  }
  return doPost(
    `${DOCCANO_API_URL}/projects/${projectId}/docs/${docId}/annotations`,
    JSON.stringify({
      label: labelId,
    }),
    token,
  );
};

export const getAnnotations = async (projectId, docId, token) => {
  if (DOCCANO_VERSION > 1.6) {
    return doGet(
      `${DOCCANO_API_URL}/projects/${projectId}/examples/${docId}/categories`,
      token,
    );
  }
  return doGet(
    `${DOCCANO_API_URL}/projects/${projectId}/docs/${docId}/annotations`,
    token,
  );
};

export const removeAnnotation = async (projectId, docId, labelId, token) => {
  if (DOCCANO_VERSION > 1.6) {
    return doDelete(
      `${DOCCANO_API_URL}/projects/${projectId}/examples/${docId}/categories/${labelId}`,
      JSON.stringify({}),
      token,
    );
  }
  return doDelete(
    `${DOCCANO_API_URL}/projects/${projectId}/docs/${docId}/annotations/${labelId}`,
    JSON.stringify({}),
    token,
  );
};

export const setReady = async (projectId, docId, token) => {
  return doPost(
    `${DOCCANO_API_URL}/projects/${projectId}/examples/${docId}/states`,
    JSON.stringify({}),
    token,
  );
};

export const exportData = async (
  projectId,
  format = 'JSON',
  exportApproved = false,
  token,
  headers = { 'Content-type': 'application/json' },
) => {
  const taskIDresponse = await doPost(
    `${DOCCANO_API_URL}/projects/${projectId}/download`,
    JSON.stringify({
      format: format,
      exportApproved: exportApproved,
    }),
    token,
    headers,
  );
  console.log('exporttaskid', taskIDresponse);
  const taskId = taskIDresponse.task_id;

  let dataresponse = await doGet(
    `${DOCCANO_API_URL}/projects/${projectId}/download?taskId=${taskId}`,
    token,
    headers,
  );
  //if(dataresponse.status === 'Not ready'){
  const loop = () => {
    setTimeout(async () => {
      console.log('fetching');
      dataresponse = await doGet(
        `${DOCCANO_API_URL}/projects/${projectId}/download?taskId=${taskId}`,
        token,
        headers,
      );
      if (dataresponse.status === 'Not ready') {
        loop();
      }
    }, 1000);
  };
  loop();
  //}
  console.log('exportdata', dataresponse);
};

/**
 *
 * @param {*} url
 * @param {*} body
 * @param {*} token
 * @param {*} headers
 * @returns
 */
const doPost = async (
  url,
  body,
  token,
  headers = { 'Content-type': 'application/json' },
) => {
  if (token) {
    headers['Authorization'] = `Token ${token}`;
  }
  let options = {
    method: 'POST',
    headers: headers,
    body: body,
  };
  if (new URL(url).protocol === 'https') {
    options.agent = agent;
  }
  try {
    const response = await fetch(url, options);
    console.log('redirected', response.redirected);
    console.log('post status', response.status);
    if (response.status === 302) {
      console.warn('redirect response, maybe should follow?');
      const cks = extractCookies(response.headers.raw()['set-cookie']);
      console.log(cks);
    }
    if (response.status === 403) {
      console.log(response);
    }
    const responseType = response.headers.get('content-type');
    if (responseType === 'application/json') {
      return response.json();
    } else if (responseType.match(/text\/(plain|html)*/)) {
      return response.text();
    }
  } catch (error) {
    console.warn('request failed');
    return null;
  }
  return null;
};

/**
 *
 * @param {*} url
 * @param {*} body
 * @param {*} token
 * @param {*} headers
 * @returns
 */
const doPut = async (
  url,
  body,
  token,
  headers = { 'Content-type': 'application/json' },
) => {
  if (token) {
    headers['Authorization'] = `Token ${token}`;
  }
  let options = {
    method: 'PUT',
    headers: headers,
    body: body,
  };
  if (new URL(url).protocol === 'https') {
    options.agent = agent;
  }
  const response = await fetch(url, options);
  console.log('redirected', response.redirected);
  console.log('post status', response.status);
  if (response.status === 302) {
    console.warn('redirect response, maybe should follow?');
    const cks = extractCookies(response.headers.raw()['set-cookie']);
    console.log(cks);
  }
  if (response.status === 403) {
    console.log(response);
  }
  const responseType = response.headers.get('content-type');
  if (responseType === 'application/json') {
    return response.json();
  } else if (responseType.match(/text\/(plain|html)*/)) {
    return response.text();
  }
  return null;
};

/**
 *
 * @param {*} url
 * @param {*} body
 * @param {*} token
 * @param {*} headers
 * @returns
 */
const doDelete = async (
  url,
  body,
  token,
  headers = { 'Content-type': 'application/json' },
) => {
  if (token) {
    headers['Authorization'] = `Token ${token}`;
  }

  let options = {
    method: 'DELETE',
    headers: headers,
    body: body,
  };
  if (new URL(url).protocol === 'https') {
    options.agent = agent;
  }
  const response = await fetch(url, options);
  console.log(response);
  const responseType = response.headers.get('content-type');
  if (responseType === 'application/json') {
    return response.json();
  } else if (responseType === 'text/plain') {
    return response.text();
  } else if (response.type === 'default' && response.status === 204) {
    return response;
  }
  return null;
};

/**
 *
 * @param {*} url
 * @param {*} token
 * @returns
 */
const doGet = async (
  url,
  token,
  headers = { 'Content-Type': 'application/json' },
) => {
  if (token) {
    headers['Authorization'] = `Token ${token}`;
  }
  let options = {
    method: 'GET',
    headers: headers,
  };
  if (new URL(url).protocol === 'https') {
    options.agent = agent;
  }
  try {
    const response = await fetch(url, options);
    if (response.headers.get('content-type').match(/text\/(plain|html)*/)) {
      return response.text();
    }

    if (response.headers.get('content-type').match(/application\/zip*/)) {
      console.log('response is a zip file, zip parsing is not yet implemented');
      return { status: 'complete' };
    }

    return response.json();
  } catch (error) {
    return response
      .status(500)
      .json({ status: 'error', message: 'server error' });
  }
};
/**
 *
 * @param {*} url
 * @param {*} token
 * @returns
 */
const doGetRaw = async (url, token) => {
  let headers = {
    'Content-type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Token ${token}`;
  }
  let options = {
    method: 'GET',
    headers: headers,
  };
  if (new URL(url).protocol === 'https') {
    options.agent = agent;
  }
  const response = await fetch(url, options);
  if (response.headers.get('content-type').match(/text\/(plain|html)*/)) {
    return response;
  }

  return response.json();
};
