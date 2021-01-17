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
    *getDocTypeDefine(payload: any, func: any) {
      const docType = payload.docType || '';
      const apiDocType = docType.replaceAll('_', ' ');
      yield func.put({
        type: 'startRequest'
      });
      const { currentDoc = {}, docs = [] } = yield func.call(getDocType, apiDocType, 0);

      const inListViewFields = [{
        fieldname: 'name',
        label: 'Name'
      }];
      const fields: string[] = [];
      const searchConditionFields: any = {};

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

      const queryFields = generateListFields(fields);
      const data = yield func.call(getReportView, apiDocType, queryFields, [], '`modified` desc', 0, 20);
      const total = yield func.call(countReportView, apiDocType, []);

      yield func.put({
        type: 'generateDocTypeData',
        data,
        total,
        inListViewFields,
        searchConditionFields,
        currentDoc,
        docs,
        docType
      });
    },
  },
  reducers: {
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
            total: payload.total
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
    }
  }
};
