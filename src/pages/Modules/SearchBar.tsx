import { Checkbox, Form, Input } from 'antd'; 
import React from 'react';
import { useParams } from "umi";
import FrappeAutoComplete from '@/components/AutoComplete';
import { generateFilterFields } from '@/utils/generate';

interface ISearchBarProps {
  searchFields: any
  onSearch?: (conditions: string[][]) => any
}


const SearchBar = (props: ISearchBarProps) => {
  const params: any = useParams();
  const [form] = Form.useForm();
  const { searchFields = {} } = props;
  const [filters, setFilters] = React.useState({})

  const search = (conditions: string[][]) => {
    if (props.onSearch) {
      props.onSearch(conditions);
    }
  };

  const onAutoCompleteSelect = (fieldname: string, field: string[]) => {
    setFilters({
      ...filters,
      [fieldname]: field
    });

    const tmp = {...filters, [fieldname]: field}
    const conditions = Object.keys(tmp).map(key => tmp[key]).filter(item => item.length > 0).map(item => item);
    search(conditions)
  };

  const onCheckboxChange = (e: any) => {
    let field: string[] = [];
    if (e.target.checked) {
      field = generateFilterFields(e.target.name, '=', 1); 
    }

    setFilters({
      ...filters,
      [e.target.name]: field
    });

    const tmp = {...filters, [e.target.name]: field}
    const conditions = Object.keys(tmp).map(key => tmp[key]).filter(item => item.length > 0).map(item => item);
    search(conditions)
  };

  const renderFormItem = (fieldType: string, lableText: string, options: string, fieldname: string) => {
    if (fieldType === 'Data') {
      return <Input placeholder={lableText}/>
    } else if (fieldType === 'Link') {
      return (
        <FrappeAutoComplete
          placeholder={lableText}
          options={options}
          fieldname={fieldname}
          onSelect={onAutoCompleteSelect}
          referenceDoctype={params.moduleName}/>
      )
    } else if (fieldType === 'Check') {
      return (
        <Checkbox name={fieldname} onChange={onCheckboxChange}>
          {lableText}
        </Checkbox>
      )
    }
    return null;
  };

  return (
    <Form form={form} layout='inline'>
      {Object.keys(searchFields).map((field: string) => {
        const { fieldType, lableText, options } = searchFields[field] || {};
        const item = renderFormItem(fieldType, lableText, options, field);
        if (item) {
          if (fieldType === 'Check') {
            return (
              <Form.Item key={field} name={field} valuePropName='checked'>
                {item}
              </Form.Item>
            )
          }

          return (
            <Form.Item key={field} name={field}>
              {item}
            </Form.Item>
          )
        }
        return null;
      })}
    </Form>
  )
};

export default SearchBar;
