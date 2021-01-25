import moment from 'moment';

export const formatFloat = (v: any) => new Intl.NumberFormat().format(v);


export const formatDefaultValue = (dataType: string, defaultValue: string) : string | boolean | moment.Moment => {
  switch (dataType) {
    case 'Data':
      return defaultValue;
    case 'Date':
      return moment();
    case 'Check':
      return defaultValue === '0' ? false : true;
    default:
      return '';
  }
}


export const generateMetaInfo = (doc: any) => {
  const defaultValueMap: any = {};
  const fieldMetaMap: any = {};
  const groupFields: any = [[[]]];
  const sectionMetaArray: any = [];
  const { fields = [] } = doc;
  let rowIndex: number = 0
  let columnIndex: number = 0;

  // [[], [], []]
  for (const field of fields) {
    const fieldType = field.fieldtype;
    if (fieldType === 'Section Break') {
      if (field.idx > 1) {
        columnIndex = 0;
        rowIndex += 1;
      }
      groupFields[rowIndex] = [];
      groupFields[rowIndex][columnIndex] = [];
      sectionMetaArray[rowIndex] = {
        name: field.fieldname,
        dataType: field.fieldtype,
        label: field.label,
        hidden: field.hidden,
        readOnly: field.read_only,
        collapsible: field.collapsible
      };
    } else {
      if (fieldType === 'Column Break') {
        columnIndex += 1;
        groupFields[rowIndex][columnIndex] = [];
      } else {
        groupFields[rowIndex][columnIndex].push(field.fieldname);
        fieldMetaMap[field.fieldname] = {
          name: field.fieldname,
          dataType: fieldType,
          label: field.label,
          options: fieldType === 'Select' ? field.options ? field.options.split('\n').filter((x: string) => x) : [] : field.options,
          hidden: field.hidden,
          readOnly: field.read_only,
          collapsible: field.collapsible
        };
        defaultValueMap[field.fieldname] = formatDefaultValue(field.fieldtype, field.default);
      }
    }
  }

  return {
    fieldMetaMap,
    defaultValueMap,
    groupFields,
    sectionMetaArray
  }; 
}

export const getApiDocType = (x: string) => x.replaceAll('_', ' ');

export const getBase64 = (file: any) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
