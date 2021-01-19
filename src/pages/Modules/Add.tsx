import {
  Button,
  Checkbox,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Select,
  Spin,
  TimePicker,
  Upload
} from 'antd'; 
import React from 'react';
import { useParams } from 'umi';
import { getDocType } from '@/services/reportView';

import {
  getApiDocType,
  generateMetaInfo
} from './utils';

const Option = Select.Option;

const AddDocType = () => {
  const params: any = useParams();
  const [metaMap, setMetaMap] = React.useState({});
  const [groupFields, setGroupFields] = React.useState([]);
  const [valueMap, setValueMap] = React.useState({});
  const [loading, setLoading] = React.useState(false);

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 8 },
  };

  const tailLayout = {
    wrapperCol: { offset: 8, span: 8 },
  };

  React.useEffect(() => {
    setLoading(true);
    getDocType(getApiDocType(params.docType), 0).then((res: any) => {
      const { currentDoc = {} } = res || {};
      const {
        groupFields = [],
        fieldMetaMap = {},
        defaultValueMap = {}
      } = generateMetaInfo(currentDoc);
      setMetaMap({
        ...fieldMetaMap
      });
      setValueMap({
        ...defaultValueMap
      });
      setGroupFields(groupFields);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    })
  }, [params.docType !== undefined]);

  const renderItem = (meta: any, defaultValue: any) :JSX.Element | null=> {
    const { dataType, label, options, readOnly } = meta;
    if (dataType === 'Data') {
      return <Input disabled={readOnly} defaultValue={defaultValue}/>
    } else if (dataType === 'Date') {
      return <DatePicker disabled={readOnly} defaultValue={defaultValue}/>;
    } else if (dataType === 'Time') {
      return <TimePicker disabled={readOnly} defaultValue={defaultValue} placeholder='选择时间'/>;
    } else if (dataType === 'Password') {
      return <Input type='password' disabled={readOnly} defaultValue={defaultValue}/>;
    } else if (['Long Text', 'Text', 'Small Text'].includes(dataType)) {
      return <Input.TextArea disabled={readOnly} defaultValue={defaultValue}/>;
    } else if (dataType === 'Int') {
      return <InputNumber disabled={readOnly} defaultValue={defaultValue}/>;
    } else if (dataType === 'Button') {
      return <Button disabled={readOnly} type='primary'>{label}</Button>;
    } else if (dataType === 'Date and Time') {
      return <DatePicker showTime={true} disabled={readOnly}/>;
    } else if (dataType === 'Attach') {
      return <Input type='file' disabled={readOnly}/>;
    } else if (dataType === 'Attach Image') {
      return <Upload disabled={readOnly}/>;
    } else if (dataType === 'Check') {
      return <Checkbox disabled={readOnly}>{label}</Checkbox>;
    } else if (dataType === 'Select') {
      return (
        <Select
          disabled={readOnly}
          placeholder='请选择'
          style={{ width: '120px' }}
          allowClear={true}>
          {options.filter((option: string) => option).map((option: string) => <Option key={option} value={option}>{option}</Option>)}
        </Select>
      )
    } else if (dataType === 'Column Break') {
      return <Divider type='vertical'/>;
    }
    return null;
  };


  return (
    <div style={{ backgroundColor: '#ffffff'}}>
      <Spin spinning={loading}>
        <Form
          {...layout}>
          {groupFields.map((subGroupFields: string[], index: number) => {
            return (
              <React.Fragment key={index}>
                <Form.Item>
                  <Divider type='horizontal' key={subGroupFields[0]}/>
                </Form.Item>
                {subGroupFields.map((field: string) => {
                  const { hidden, dataType, label } = metaMap[field];
                  if (hidden) {
                    return null;
                  }

                  return (
                    <Form.Item
                      key={field}
                      wrapperCol={['Button', 'Check'].includes(dataType) ? {...tailLayout.wrapperCol} : undefined}
                      label={['Button', 'Check'].includes(dataType) ? undefined : label}>
                      {renderItem(metaMap[field], valueMap[field])}
                    </Form.Item>
                  );
                })}
              </React.Fragment>
            )})}
        </Form>
      </Spin>
    </div>
  );
};

export default AddDocType;
