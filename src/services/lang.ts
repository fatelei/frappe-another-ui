import { request } from 'umi';


export async function updateLang(language: string, name: string) {
  return request(`/api/resource/User/${name}`, {
    method: 'PUT',
    data: {
      language
    },
  });
}
