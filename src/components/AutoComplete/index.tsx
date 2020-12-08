import { AutoComplete } from 'antd';
import React from 'react';

import { searchLink, validateSearchLink } from '@/services/reportView';
import { generateFilterFields } from '@/utils/generate';


interface IFrappeAutoCompleteProps {
  placeholder: string
  options: string
  referenceDoctype: string
  fieldname: string
  onSelect?: (fieldname: string, field: string[]) => any
}

const FrappeAutoComplete = (props: IFrappeAutoCompleteProps) => {
  const [options, setOptions] = React.useState<any>([]);
  const onSearch = (txt: string) => {
    if (!txt || txt.length === 0) {
      return;
    }
    searchLink(props.options, txt, props.referenceDoctype).then(res => {
      setOptions((res.results || []).map((item: Frappe.ISearchLink) => {
        return {label: item.value, value: item.value};
      }));
    }).catch(err => {
      console.error(err);
    })
  };

  const onChange = (txt: string) => {
    if (!txt || txt.length === 0) {
      if (props.onSelect !== undefined) {
        props.onSelect(props.fieldname, []);
        return;
      }
    }

    validateSearchLink(txt, props.options).then((res: any) => {
      if (res.message === 'Ok') {
        if (props.onSelect !== undefined && res.valid_value) {
          props.onSelect(props.fieldname, generateFilterFields(props.fieldname, '=', res.valid_value));
        }
      }
    }).catch(err => {
      console.error(err);
    });
  }

  return (
    <AutoComplete
      allowClear={true}
      style={{ width: 200 }}
      dropdownMatchSelectWidth={false}
      options={options}
      onSearch={onSearch}
      onChange={onChange}
      placeholder={props.placeholder}/>
  );
}

export default FrappeAutoComplete;
