import moment from 'moment';
import { getDocType, getReportView, countReportView, removeDocument } from '@/services/reportView';
import { generateListFields } from '@/utils/generate';

interface IListDocumentParam {
  docType: string
  queryFields: string[]
  conditions: string[][]
  orderBy: string
}

interface IRemoveDocument {
  docType: string
  name: string
}


const generateDefaultValue = (fields: any) => {
  const defaultValueMap :any = {};
  fields.filter((x: any) => !x.hidden).reduce((_: any, x: any) => {
    if (x.default !== undefined) {
      if (x.fieldtype === 'Data') {
        defaultValueMap[x.fieldname] = x.default;
      } else if (x.fieldtype === 'Date') {
        defaultValueMap[x.fieldname] = moment().format('YYYY-MM-DD');
      } else if (x.fieldtype === 'Check') {
        defaultValueMap[x.fieldname] = x.default === '0' ? false : true;
      }
    }
  }, defaultValueMap);
  return defaultValueMap;
}


export default {
  namespace: 'docTypeState',
  state: {
    docTypeMap: {},
    loading: false
  },

  effects: {
    *deleteDocument({ docType, name} :IRemoveDocument, func: any) {
      yield func.put({
        type: 'startRequest'
      });
      const apiDocType = docType.replaceAll('_', ' ');
      const success = yield func.call(removeDocument, apiDocType, name);
      if (success) {
        yield func.put({
          type: 'removeDocumentSuccess',
          name,
          docType
        })
      }
    },
    *listDocuments({ docType, queryFields, conditions, orderBy }: IListDocumentParam, func: any) {
      yield func.put({
        type: 'startRequest'
      });
      const apiDocType = docType.replaceAll('_', ' ');
      const data = yield func.call(getReportView, apiDocType, queryFields, conditions, orderBy, 0, 20);
      const total = yield func.call(countReportView, apiDocType, []);
      yield func.put({
        type: 'listDocumentsResposne',
        data,
        total,
        docType
      });
    },
    *getDocTypeMeta(payload: any, func: any) {
      const docType = payload.docType || '';
      const apiDocType = docType.replaceAll('_', ' ');
      const { currentDoc = {}, docs = [] } = yield func.call(getDocType, apiDocType, 0);
      yield func.put({
        type: 'docTypeMetaResponse',
        currentDoc,
        docs,
        docType
      });
    },
    *getDocTypeDefine(payload: any, func: any) {
      const docType = payload.docType || '';
      const apiDocType = docType.replaceAll('_', ' ');
      yield func.put({
        type: 'startRequest'
      });
      try {
        const { currentDoc = {}, docs = [] } = yield func.call(getDocType, apiDocType, 0);
        const hideToolbar = currentDoc.hide_toolbar || 0;
        const isSingle = currentDoc.issingle || 0

        const inListViewFields = [{
          fieldname: 'name',
          label: 'Name'
        }];
        const fields: string[] = [];
        const searchConditionFields: any = {};
        let data = [];
        let total = 0;

        for (const field of currentDoc.fields) {
          if (field.in_list_view > 0) {
            inListViewFields.push({
              fieldname: field.fieldname,
              label: field.label
            })
            fields.push(field.fieldname);
          }
          if (field.in_standard_filter > 0) {
              searchConditionFields[field.fieldname] = {
              fieldType: field.fieldtype,
              lableText: field.label,
              options: field.options
            }
          }
        }

        if (!isSingle) {
          const queryFields = generateListFields(fields);
          data = yield func.call(getReportView, apiDocType, queryFields, [], 'modified desc', 0, 20);
          total = yield func.call(countReportView, apiDocType, []);
        }

        yield func.put({
          type: 'generateDocTypeData',
          data,
          total,
          inListViewFields,
          searchConditionFields,
          currentDoc,
          docs,
          docType,
          isSingle,
          hideToolbar
        });
      } catch (err) {
        console.error(err);
        yield func.put({
          type: 'endRequest'
        });
      }
    },
  },
  reducers: {
    docTypeMetaResponse(state: any, payload: any) {
      return {
        ...state,
        docTypeMap: {
          ...state.docTypeMap,
          [payload.docType]: {
            ...state.docTypeMap[payload.docType],
            currentDoc: payload.currentDoc,
            docs: payload.docs,
            defaultValueMap: generateDefaultValue(payload.currentDoc.fields)
          }
        }
      };
    },
    removeDocumentSuccess(state: any, payload: any) {
      const currentData = (state.docTypeMap[payload.docType] || {}).data || [];
      return {
        ...state,
        docTypeMap: {
          ...state.docTypeMap,
          [payload.docType]: {
            ...state.docTypeMap[payload.docType],
            data: currentData.filter((item: any) => item.name != payload.name)
          }
        },
        loading: false
      }
    },
    listDocumentsResposne(state: any, payload: any) {
      return {
        ...state,
        docTypeMap: {
          ...state.docTypeMap,
          [payload.docType]: {
            ...state.docTypeMap[payload.docType],
            data: payload.data,
            total: payload.total
          }
        },
        loading: false
      }
    },
    generateDocTypeData(state: any, payload: any) {
      return {
        ...state,
        docTypeMap: {
          ...state.docTypeMap,
          [payload.docType]: {
            currentDoc: payload.currentDoc,
            docs: payload.docs,
            inListViewFields: payload.inListViewFields,
            searchConditionFields: payload.searchConditionFields,
            data: payload.data,
            total: payload.total,
            isSingle: payload.isSingle,
            hideToolbar: payload.hideToolbar,
            defaultValueMap: generateDefaultValue(payload.currentDoc.fields)
          }
        },
        loading: false
      };
    },
    startRequest(state: any) {
      return {
        ...state,
        loading: true
      };
    },
    endRequest(state: any) {
      return {
        ...state,
        loading: false
      };
    }
  }
};
