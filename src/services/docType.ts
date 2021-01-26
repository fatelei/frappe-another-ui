import { request } from 'umi';

export const create = async (docType: string, body: any) => {
  const apiDocType = docType.replaceAll('_', ' ');
  const res = await request(`/api/resource/${apiDocType}`, {
    method: 'POST',
    data: {
      ...body
    }
  });
  return res;
}


export const get = async (docType: string, name: string) => {
  const apiDocType = docType.replaceAll('_', ' ');
  const res = await request(`/api/resource/${apiDocType}/${name}`, {
    method: 'GET'
  });
  return res;
}

export const update = async (docType: string, name: string, body: any) => {
  const apiDocType = docType.replaceAll('_', ' ');
  const res = await request(`/api/resource/${apiDocType}/${name}`, {
    method: 'PUT',
    data: {
      ...body
    }
  });
  return res;
}

