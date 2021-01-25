import { request } from 'umi';

export const createDocType = async (docType: string, body: any) => {
  const apiDocType = docType.replaceAll('_', ' ');
  const res = await request(`/api/resource/${apiDocType}`, {
    method: 'POST',
    data: {
      ...body
    }
  });
  return res;
}
