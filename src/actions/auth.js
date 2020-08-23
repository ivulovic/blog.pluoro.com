import request, {
  makeGetReq,
  makeAuthUrl,
} from "../utils/request";

const wrapResponse = (payload) => {
  return {
    type: 'auth',
    payload,
  }
}

export const getUserInfo = async () => {
  const response = await request(makeAuthUrl(`/account/info`), makeGetReq());

  return wrapResponse({ isLoggedIn: true, ...response });
}
