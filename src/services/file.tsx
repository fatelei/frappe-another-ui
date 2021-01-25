import { request } from 'umi';

export const uploadFile = async (file: any) => {
  const formData = new FormData();
  formData.append('file', file);

  const res = await request('/api/method/upload_file', {
    method: 'POST',
    data: formData
  });
  return res;
}
