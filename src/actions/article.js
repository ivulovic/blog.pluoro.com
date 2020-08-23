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
    type: 'article',
    payload,
  }
}

export const createArticle = async (payload) => {
  // if (isNotEmpty(payload.title) && isNotEmpty(payload.description)) {
  const response = await request(
    makeApiUrl("/articles"),
    makePostReq(payload)
  );
  return wrapResponse(response);
  // }
}

export const updateArticle = async (payload) => {
  // if (isNotEmpty(payload.title) && isNotEmpty(payload.description)) {
  const { articleId, ...body } = payload;
  const response = await request(
    makeApiUrl("/articles/" + articleId),
    makePatchReq(body)
  );
  return wrapResponse(response);
  // }
}

export const removeArticle = async (payload) => {
  const response = await request(
    makeApiUrl("/articles/" + payload.articleId),
    makeDeleteReq(),
  );
  return wrapResponse(response);
}

export const loadApplicationArticles = async (payload) => {
  if (!payload.directoryId) return;
  const response = await request(
    makeApiUrl("/articles/articles/" + payload.directoryId),
    makeGetReq()
  );
  return wrapResponse(response);
}

export const loadArticleInfo = async (payload) => {
  const response = await request(
    makeApiUrl("/articles/articles/" + payload.articleId + "/info"),
    makeGetReq()
  );
  return wrapResponse(response);
}

export const loadPageArticles = async (payload) => {
  if (!payload.pageId) return;
  const response = await request(
    makeApiUrl("/articles/" + payload.pageId),
    makeGetReq()
  );
  return wrapResponse(response);
}