import { request } from 'umi';

export interface LoginParamsType {
  usr: string;
  pwd: string;
}

export async function accountLogin(params: LoginParamsType) {
  const formData = new FormData();
  formData.append('usr', params.usr)
  formData.append('pwd', params.pwd)
  return request<API.LoginStateType>('/api/method/login', {
    method: 'POST',
    data: formData,
  });
}

export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}

export async function outLogin() {
  return request('/api/method/logout', {method: 'POST'});
}
