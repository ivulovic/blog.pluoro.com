export function makeAuthUrl(endpoint) {
  return '/auth' + endpoint;
}
export function makeApiUrl(endpoint) {
  return '/api/blog' + endpoint;
}

function makeGenericReq(method, body = null) {
  return {
    method,
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
  };
}

export function makePostReq(body) {
  return makeGenericReq('POST', body);
}

export function makePatchReq(body) {
  return makeGenericReq('PATCH', body);
}

export function makePutReq(body) {
  return makeGenericReq('PUT', body);
}

export function makeDeleteReq(body) {
  return makeGenericReq('DELETE', body);
}

export function makeGetReq() {
  return makeGenericReq('GET');
}


function parseJSON(response) {
  if (response.status === 204 || response.status === 205) {
    return null;
  }
  return response.json().catch(() => null);
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  return response.json().catch(() => null).then(result => {
    throw new Error(result.message)
  })
}

export default function request(url, options) {
  return fetch(url, options)
    .then(checkStatus)
    .then(parseJSON);
}