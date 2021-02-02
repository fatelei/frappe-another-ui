import { Checkbox, Form, Input, Select } from 'antd'; 
import { useDispatch, useSelector } from 'dva'; 
import React from 'react';
import { useParams } from "umi";
import FrappeAutoComplete from '@/components/AutoComplete';
import { generateFilterFields, generateListFields } from '@/utils/generate';

const Option = Select.Option;

interface ISearchBarProps {}


const SearchBar = (props: ISearchBarProps) => {
  const params: any = useParams();
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const docTypeState = useSelector((state: any) => state.docTypeState);
  const currentDocTypeState = docTypeState.docTypeMap[params.docType] || {};
  const { inListViewFields = [], searchConditionFields = {} } = currentDocTypeState;
  const [filters, setFilters] = React.useState({});

  const search = (conditions: string[][]) => {
    const queryFields = generateListFields(inListViewFields.map((item: any) => item.fieldname));
    dispatch({
      type: 'docTypeState/listDocuments',
      docType: params.docType,
      queryFields,
      conditions,
      orderBy: '`modified` desc'
    });
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

  const onDataFieldTypeChange = (fieldname: string, value: string) => {
    let field: string[] = [];
    if (value) {
      field = generateFilterFields(fieldname, '=', value)
    }

    setFilters({
      ...filters,
      [fieldname]: field
    });
    const tmp = {...filters, [fieldname]: field}
    const conditions = Object.keys(tmp).map(key => tmp[key]).filter(item => item.length > 0).map(item => item);
    search(conditions)
  }

  const renderFormItem = (fieldType: string, lableText: string, options: string, fieldname: string) => {
    if (fieldType === 'Data') {
      return <Input placeholder={lableText} onChange={(e: React.SyntheticEvent<HTMLInputElement>) => onDataFieldTypeChange(fieldname, e.currentTarget.value)}/>
    } else if (fieldType === 'Link') {
      return (
        <FrappeAutoComplete
          placeholder={lableText}
          options={options}
          docType={options}
          mode='search'
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
    } else if (fieldType === 'Select') {
      return (
        <Select
          placeholder={lableText}
          allowClear={true}>
          {options.split('\n').filter(option => option).map((option: string) => <Option key={option} value={option}>{option}</Option>)}
        </Select>
      )
    }
    return null;
  };

  return (
    <Form
      form={form}
      layout='inline'
      style={{ padding: '10px 10px', marginBottom: '2px', backgroundColor: '#ffffff'}}>
      {Object.keys(searchConditionFields).map((field: string) => {
        const { fieldType, lableText, options } = searchConditionFields[field] || {};
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
