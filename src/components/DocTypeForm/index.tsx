import { UploadOutlined } from '@ant-design/icons';
import {
  Button,
  Checkbox,
  Col,
  Collapse,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Spin,
  TimePicker,
  Upload,
  message
} from 'antd'; 
import React from 'react';

import ReactQuill from 'react-quill';


import { useParams } from 'umi';

import proxy from '../../../config/proxy';

import { uploadFile } from '@/services/file';

import {
  formatFloat,
  generateMetaInfo,
  getBase64
} from '@/pages/Modules/utils';
import FrappeAutoComplete from '@/components/AutoComplete';

import 'react-quill/dist/quill.snow.css';

const Option = Select.Option;


interface IDocTypeFormProps {
  docTypeDefine: any
  defaultValue: any
  onCancel?: () => any
  onSubmit?: (data: any) => any
}


const DocTypeForm = (props: IDocTypeFormProps) => {
  const params: any = useParams();
  const [metaMap, setMetaMap] = React.useState({});
  const [groupFields, setGroupFields] = React.useState([]);
  const [valueMap, setValueMap] = React.useState({});
  const [sectionMeta, setSectionMetaArray] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [fileListMap, setFileListMap] = React.useState({});
  const [body, setBody] = React.useState({});
  const [form] = Form.useForm();

  React.useEffect(() => {
    setLoading(true);
    const {
      groupFields = [],
      fieldMetaMap = {},
      defaultValueMap = {},
      sectionMetaArray = []
    } = generateMetaInfo(props.docTypeDefine);
    setMetaMap({
      ...fieldMetaMap
    });
    setValueMap({
      ...defaultValueMap,
      ...props.defaultValue
    });
    setGroupFields(groupFields);
    setSectionMetaArray({...sectionMetaArray});
    const tmpfileListMap = {};
    Object.keys(fieldMetaMap).filter((key: string) => fieldMetaMap[key].dataType === 'Attach Image').forEach((key: string) => {
      if (props.defaultValue[key]) {
        tmpfileListMap[key] = [props.defaultValue[key]]
      }
    });
    setFileListMap({...fileListMap, ...tmpfileListMap});
    form.setFieldsValue({
      ...defaultValueMap,
      ...props.defaultValue
    })
    setLoading(false);
  }, [])

  const onAttachImagePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
  };

  const onCancel = () => {
    if (props.onCancel) {
      props.onCancel();
    }
  }

  const renderItem = (meta: any, defaultValue: any) :JSX.Element | null=> {
    const { dataType, label, options, readOnly, name, required = false } = meta;
    if (dataType === 'Data') {
      return (
        <Input
          disabled={readOnly || (required && defaultValue)}/>
      );
    } else if (dataType === 'Date') {
      return (
        <DatePicker
          disabled={readOnly || (required && defaultValue)}
          format='YYYY-MM-DD'/>
      );
    } else if (dataType === 'Time') {
      return (
        <TimePicker
          disabled={readOnly || (required && defaultValue)}
          placeholder='选择时间'
          format='HH:mm:ss'/>
      );
    } else if (dataType === 'Password') {
      return (
        <Input
          type='password'
          disabled={readOnly || (required && defaultValue)}/>
      );
    } else if (['Long Text', 'Text', 'Small Text'].includes(dataType)) {
      return (
        <Input.TextArea
          disabled={readOnly || (required && defaultValue)}/>
      );
    } else if (dataType === 'Int') {
      return (
        <InputNumber
          disabled={readOnly || (required && defaultValue)}/>
      );
    } else if (dataType === 'Button') {
      return <Button disabled={readOnly || (required && defaultValue)} type='primary'>{label}</Button>;
    } else if (dataType === 'Date and Time') {
      return (
        <DatePicker
          showTime={true}
          disabled={readOnly || (required && defaultValue)}
          format='YYYY-MM-DD HH:mm:ss'/>
      );
    } else if (dataType === 'Attach') {
      return <Input type='file' disabled={readOnly}/>;
    } else if (dataType === 'Read Only') {
      return <Input disabled={true} defaultValue={defaultValue}/>;
    } else if (dataType === 'Attach Image') {
      return (
        <Upload
          disabled={readOnly}
          listType='picture-card'
          onPreview={onAttachImagePreview}
          fileList={[
            {
              uid: '-1',
              name,
              status: 'done',
              url: `${proxy.dev['/api/'].target}${defaultValue}`,
              type: '',
              size: 50
            }
          ]}
          onChange={(info: any) => {
            if (info.file.status === 'done') {
              message.success(`${info.file.name} 上传成功`);
              setFileListMap({...fileListMap, [name]: [info.file]});
            } else if (info.file.status === 'error') {
              message.error(`${info.file.name} 上传失败`);
            }
          }}
          onRemove={(file: any) => {
            setFileListMap({...fileListMap, [name]: []});
            setBody({...body, [name]: null});
          }}
          customRequest={async (options: any) => {
            const { onSuccess, onError, file } = options;
            try {
              const res = await uploadFile(file);
              onSuccess("Ok");
              setBody({...body, [name]: res.message.file_url});
              console.log("server res: ", res);
            } catch (err) {
              console.log("Eroor: ", err);
              onError({ err });
            }
          }}>
          {(fileListMap[name] || []).length >= 1 ? null : <Button icon={<UploadOutlined />}>附件</Button>}
        </Upload>
      );
    } else if (dataType === 'Check') {
      return <Checkbox disabled={readOnly || (required && defaultValue)}>{label}</Checkbox>;
    } else if (dataType === 'Select') {
      return (
        <Select
          disabled={readOnly || (required && defaultValue)}
          placeholder='请选择'
          style={{ width: '120px' }}
          allowClear={true}>
          {options.filter((option: string) => option).map((option: string) => <Option key={option} value={option}>{option}</Option>)}
        </Select>
      )
    } else if (dataType === 'Link') {
      return (
        <FrappeAutoComplete
          placeholder={label}
          docType={options}
          defaultValue={defaultValue}
          options={options}
          showAdvance={true}
          mode='add_or_edit'
          onChange={(fieldname: string, value: string) => setBody({...body, [fieldname]: value})}
          fieldname={name}
          referenceDoctype={params.docType.replaceAll('_', ' ')}/>
      );
    } else if (dataType === 'Text Editor') {
      return (
        <ReactQuill theme="snow" style={{height: '200px'}} value={body[name] || ''} onChange={v => setBody({...body, [name]: v})}/>
      );
    } else if (dataType === 'Float') {
      return (
        <InputNumber
          disabled={readOnly || (required && defaultValue)}
          formatter={formatFloat} step={0.001}
          style={{width: '200px'}}
          precision={3}/>
      );
    } else if (dataType === 'Currency') {
      return (
        <InputNumber
          disabled={readOnly || (required && defaultValue)}
          formatter={formatFloat}
          step={0.001}
          style={{width: '200px'}}
          precision={3}/>
      );
    }
    return null;
  };

  return (
    <div style={{ backgroundColor: '#ffffff', padding: '10px 10px'}}>
      <Spin spinning={loading}>
        <Form
          form={form}
          onFinish={(values: any) => {
            if (props.onSubmit) {
              props.onSubmit(values)
            }
          }}>
          {groupFields.map((subGroupFields: string[][], index: number) => {
            const span = Math.floor(24 / subGroupFields.length);
            const section = sectionMeta[index];
            const { collapsible = 0, label = '', notDisplay = 0 } = section || {};
            if (notDisplay) {
              return null;
            }
            return (
              <React.Fragment key={index}>
                {
                  typeof section !== 'undefined' ?
                    collapsible ?
                    <Collapse
                      bordered={false}>
                      <Collapse.Panel header={label} key="label">
                        <Row justify='start'>
                          {subGroupFields.map((columns: string[], colIndex: number) => {
                            return (
                              <Col key={colIndex} span={span}>
                                {columns.map((field: any) => {
                                const { hidden, dataType, label, readOnly, required, name} = metaMap[field];
                                if (hidden || (readOnly &&  !valueMap[field])) {
                                  return null;
                                }
                                return (
                                  <Form.Item
                                    name={name}
                                    rules={required ? [{required: true, message: `${label}必填`}]: []}
                                    key={field}
                                    labelCol={{span: 24}}
                                    wrapperCol={{span }}
                                    label={['Button', 'Check'].includes(dataType) ? undefined : label}>
                                    {renderItem(metaMap[field], valueMap[field])}
                                  </Form.Item>
                                );
                              })}
                              </Col>
                            );
                          })}
                        </Row>
                      </Collapse.Panel>
                    </Collapse>
                    :
                    <React.Fragment>
                      <Divider type='horizontal'>{label}</Divider>
                      <Row justify='start'>
                        {subGroupFields.map((columns: string[], colIndex: number) => {
                          return (
                            <Col key={colIndex} span={span}>
                              {columns.map((field: any) => {
                                const { hidden, dataType, label, readOnly, required, name } = metaMap[field];
                                if (hidden || (readOnly && !valueMap[field])) {
                                  return null;
                                }
                                return (
                                  <Form.Item
                                    name={name}
                                    rules={required ? [{required: true, message: `${label}必填`}]: []}
                                    key={field}
                                    labelCol={{span: 24}}
                                    wrapperCol={{span }}
                                    label={['Button', 'Check'].includes(dataType) ? undefined : label}>
                                    {renderItem(metaMap[field], valueMap[field])}
                                  </Form.Item>
                                );
                              })}
                            </Col>
                          );
                        })}
                      </Row>
                    </React.Fragment>
                  :
                  <Row justify='start'>
                    {subGroupFields.map((columns: string[], colIndex: number) => {
                      return (
                        <Col key={colIndex} span={span}>
                          {columns.map((field: any) => {
                            const { hidden, dataType, label, readOnly, required, name } = metaMap[field];
                            if (hidden || (readOnly &&  !valueMap[field])) {
                              return null;
                            }
                            return (
                              <Form.Item
                                name={name}
                                rules={required ? [{required: true, message: `${label}必填`}]: []}
                                key={field}
                                labelCol={{span: 24}}
                                wrapperCol={{span }}
                                label={['Button', 'Check'].includes(dataType) ? undefined : label}>
                                {renderItem(metaMap[field], valueMap[field])}
                              </Form.Item>
                            );
                          })}
                        </Col>
                      );
                    })}
                  </Row>
                }
              </React.Fragment>
            )})}
            <Form.Item>
              {props.onCancel &&
              <Button onClick={onCancel}>
                取消
              </Button>
              }
              {props.onSubmit &&
              <Button type='primary' htmlType='submit'>
                保存
              </Button>
              }
            </Form.Item>
        </Form>
      </Spin>
    </div>
  );
};

export default DocTypeForm;
