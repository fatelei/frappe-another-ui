import * as humps from 'humps';
import { request } from 'umi';
import dayjs from 'dayjs';

import { generateCountFields } from '@/utils/generate';

/**
 * Get report view.
 * @param docType
 * @param fields 
 * @param filters 
 * @param orderBy 
 * @param start 
 * @param pageLength 
 * @param view 
 * @param withCommentCount 
 */
export async function getReportView(docType: string, fields: string[], filters: string[][], orderBy: string, start: number, pageLength: number) {
  const rsts = await request(`/api/resource/${docType}`, {
    method: 'GET',
    params: {
      fields: JSON.stringify(fields),
      filters: JSON.stringify(filters),
      order_by: orderBy,
      limit_start: start,
      limit_page_length: pageLength
    }
  })
  return rsts.data || []
}

/**
 * Remove document.
 * @param docType
 * @param name
 */
export async function removeDocument(docType: string, name: string) {
  const rsts = await request(`/api/resource/${docType}/${name}`, {
    method: 'DELETE'
  })
  if (rsts.message === 'ok') {
    return true;
  }
  return false;
}

/**
 * Get report view.
 * @param docType
 * @param fields 
 * @param filters 
 * @param orderBy 
 * @param start 
 * @param pageLength 
 * @param view 
 * @param withCommentCount 
 */
export async function countReportView(docType: string, filters: string[][]) {
  const fields = generateCountFields(docType);
  const rst = await request(`/api/resource/${docType}`, {
    method: 'GET',
    params: {
      fields: JSON.stringify(fields),
      filters: JSON.stringify(filters)
    }
  })
  const data = rst.data || [];
  if (data.length > 0) {
    return data[0].total_count;
  }
  return 0;
}


export async function searchLink(docType: string, txt: string, referenceDoctype: string) {
  const res = await request<API.SearchLink>('/api/method/frappe.desk.search.search_link', {
    method: 'POST',
    requestType: 'form',
    data: {
      doctype: docType,
      txt,
      reference_doctype: referenceDoctype
    }
  });
  return res;
}


export async function validateSearchLink(value: string, options: string) {
  const res = await request<API.ValidateSearchLink>('/api/method/frappe.desk.form.utils.validate_link', {
    method: 'GET',
    params: {
      value,
      options,
      fetch: '',
      _: new Date().getTime()
    }
  });
  return res;
}

export async function getDocType(docType: string, withParent: number) {
  const now = dayjs();
  const query = {
    doctype: docType,
    withParent,
    cachedTimestamp: now.format('YYYY-MM-DD HH:mm:ss.SSS'),
    _: now.unix()
  };
  const rsts: any = await request('/api/method/frappe.desk.form.load.getdoctype', {
    method: 'GET',
    params: humps.decamelizeKeys(query)
  });
  const { docs = [] } = rsts;
  const tmp = docs.filter((doc: any) => doc.name === docType);
  const currentDoc: any = tmp.length > 0 ? tmp[0] : null;

  return {
    currentDoc,
    docs
  };
};
