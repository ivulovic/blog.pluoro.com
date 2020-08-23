import request, {
  makeApiUrl,
  makeGetReq,
  makePostReq,
  makePatchReq,
  makeDeleteReq,
} from "../utils/request";
import { isNotEmpty } from "../utils/validators";

const wrapResponse = (payload) => {
  return {
    type: 'application',
    payload,
  }
}

export const createApplication = async (payload) => {
  if (isNotEmpty(payload.name)) {
    const response = await request(
      makeApiUrl("/applications"),
      makePostReq({ name: payload.name.trim() })
    );
    return wrapResponse(response);
  }
}

export const updateApplication = async (payload) => {
  if (isNotEmpty(payload.name)) {
    const response = await request(
      makeApiUrl("/applications/" + payload.applicationId),
      makePatchReq({ name: payload.name.trim() })
    );
    return wrapResponse(response);
  }
}

export const removeApplication = async (payload) => {
  const response = await request(
    makeApiUrl("/applications/" + payload.applicationId),
    makeDeleteReq(),
  );
  return wrapResponse(response);
}

export const loadApplications = async () => {
  const response = await request(
    makeApiUrl("/applications"),
    makeGetReq()
  );
  return wrapResponse(response);
}

