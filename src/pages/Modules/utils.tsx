import moment from 'moment';


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
  const groupFields: any = [[]];
  const { fields = [] } = doc;
  let sectionBreakIndex :number = -1;
  let index: number = 0

  fields.forEach((field: any) => {
    if (field.fieldtype === 'Section Break') {
      if (field.idx !== sectionBreakIndex) {
        if (field.idx > 1) {
          index += 1;
          groupFields[index] = [];
        }
        sectionBreakIndex = field.idx;
      }
    }
    groupFields[index].push(field.fieldname);
    fieldMetaMap[field.fieldname] = {
      name: field.fieldname,
      dataType: field.fieldtype,
      label: field.label,
      options: field.options ? field.options.split('\n').filter((x: string) => x) : [],
      hidden: field.hidden,
      readOnly: field.read_only
    }

    defaultValueMap[field.fieldname] = formatDefaultValue(field.fieldtype, field.default);
  });

  return {
    fieldMetaMap,
    defaultValueMap,
    groupFields
  }; 
}


export const getApiDocType = (x: string) => x.replaceAll('_', ' ');

