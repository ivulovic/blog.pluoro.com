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
    type: 'page',
    payload,
  }
}

export const createPage = async (payload) => {
  if (isNotEmpty(payload.title)) {
    const response = await request(
      makeApiUrl("/pages"),
      makePostReq(payload)
    );
    return wrapResponse(response);
  }
}

export const updatePage = async (payload) => {
  if (isNotEmpty(payload.title)) {
    const { pageId, ...body } = payload;
    const response = await request(
      makeApiUrl("/pages/" + pageId),
      makePatchReq(body)
    );
    return wrapResponse(response);
  }
}

export const removePage = async (payload) => {
  const response = await request(
    makeApiUrl("/pages/" + payload.pageId),
    makeDeleteReq(),
  );
  return wrapResponse(response);
}

export const loadApplicationPages = async (payload) => {
  const response = await request(
    makeApiUrl("/pages/" + payload.applicationId),
    makeGetReq()
  );
  return wrapResponse(response);
}

