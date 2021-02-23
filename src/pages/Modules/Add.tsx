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

import { history, useParams } from 'umi';
import TableLink from '@/components/TableLink';
import { getDocType } from '@/services/reportView';
import { uploadFile } from '@/services/file';

import {
  formatFloat,
  getApiDocType,
  generateMetaInfo,
  getBase64
} from './utils';
import FrappeAutoComplete from '@/components/AutoComplete';

import 'react-quill/dist/quill.snow.css';
import { create } from '@/services/docType';
import { PageContainer } from '@ant-design/pro-layout';

const Option = Select.Option;

const AddDocType = () => {
  const params: any = useParams();
  const [metaMap, setMetaMap] = React.useState({});
  const [groupFields, setGroupFields] = React.useState([]);
  const [valueMap, setValueMap] = React.useState({});
  const [sectionMeta, setSectionMetaArray] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [fileListMap, setFileListMap] = React.useState({});
  const [fileValueMap, setFileValueMap] = React.useState({});
  const [body, setBody] = React.useState({});
  const [form] = Form.useForm();

  React.useEffect(() => {
    setLoading(true);
    getDocType(getApiDocType(params.docType), 0).then((res: any) => {
      const { currentDoc = {}, relateDocMap = {} } = res || {};
      const {
        groupFields = [],
        fieldMetaMap = {},
        defaultValueMap = {},
        sectionMetaArray = []
      } = generateMetaInfo(currentDoc, relateDocMap);
      setMetaMap({
        ...fieldMetaMap
      });
      setValueMap({
        ...defaultValueMap
      });
      setGroupFields(groupFields);
      setSectionMetaArray({...sectionMetaArray});
      form.setFieldsValue({
        ...defaultValueMap
      });
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    })
  }, [params.docType !== undefined]);

  const onAttachImagePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
  };

  const renderItem = (meta: any, defaultValue: any) :JSX.Element | null=> {
    const { dataType, label, options, readOnly, name, ref } = meta;
    if (dataType === 'Data') {
      return <Input disabled={readOnly}/>
    } else if (dataType === 'Date') {
      return <DatePicker disabled={readOnly} format='YYYY-MM-DD'/>;
    } else if (dataType === 'Time') {
      return <TimePicker disabled={readOnly} placeholder='选择时间' format='HH:mm:ss'/>;
    } else if (dataType === 'Password') {
      return <Input type='password' disabled={readOnly}/>;
    } else if (['Long Text', 'Text', 'Small Text'].includes(dataType)) {
      return <Input.TextArea disabled={readOnly} rows={5}/>;
    } else if (dataType === 'Int') {
      return <InputNumber disabled={readOnly}/>;
    } else if (dataType === 'Button') {
      return <Button disabled={readOnly} type='primary'>{label}</Button>;
    } else if (dataType === 'Date and Time') {
      return <DatePicker showTime={true} disabled={readOnly} format='YYYY-MM-DD HH:mm:ss'/>;
    } else if (dataType === 'Attach') {
      return <Input type='file' disabled={readOnly}/>;
    } else if (dataType === 'Read Only') {
      return <Input disabled={true}/>;
    } else if (dataType === 'Attach Image') {
      return (
        <Upload
          disabled={readOnly}
          listType='picture-card'
          onPreview={onAttachImagePreview}
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
            setFileValueMap({...fileValueMap, [name]: ''});
          }}
          customRequest={async (options: any) => {
            const { onSuccess, onError, file } = options;
            try {
              const res = await uploadFile(file);
              onSuccess("Ok");
              setFileValueMap({...fileValueMap, [name]: res.message.file_url});
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
    } else if (dataType === 'Link') {
      return (
        <FrappeAutoComplete
          placeholder={label}
          docType={options}
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
      return <InputNumber formatter={formatFloat} step={0.001} style={{width: '200px'}} precision={3}/>
    } else if (dataType === 'Currency') {
      return <InputNumber formatter={formatFloat} step={0.001} style={{width: '200px'}} precision={3}/>
    } else if (dataType === 'Table') {
      return <TableLink fieldName={name} defaultData={defaultValue} relateDocTypeDefine={ref} onChange={v => setBody({...body, [name]: v})}/>
    }
    return null;
  };

  const saveDocType = () => {
    form.validateFields().then((values: any) => {
      create(params.docType, {...values, ...body}).then(res => {
        message.success('创建成功');
        history.push(`/modules/${params.moduleName}/docTypes/${params.docType}/${res.data.name}`)
      }).catch(err => {
        console.error(err);
        message.error('创建失败');
      });
    }).catch((err: any) => {
      message.error('请先修正表单错误');
    });
  };

  return (
    <PageContainer
      title={`新建 ${params.docType}`}
      extra={[
        <Button type='primary' onClick={saveDocType} key='add'>新建</Button>
      ]}>
      <div style={{ backgroundColor: '#ffffff', padding: '10px 10px'}}>
        <Spin spinning={loading}>
          <Form
            form={form}>
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
                                  const { hidden, dataType, label, readOnly, name, required } = metaMap[field];
                                  if (hidden || (readOnly &&  !valueMap[field])) {
                                    return null;
                                  }
                                  return (
                                    <Form.Item
                                      key={field}
                                      labelCol={{span: 24}}
                                      name={name}
                                      rules={required ? [{required: true, message: `${label}必填`}]: []}
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
                                  const { hidden, dataType, label, readOnly, name, required } = metaMap[field];
                                  if (hidden || (readOnly &&  !valueMap[field])) {
                                    return null;
                                  }
                                  return (
                                    <Form.Item
                                      key={field}
                                      labelCol={{span: 24}}
                                      name={name}
                                      rules={required ? [{required: true, message: `${label}必填`}]: []}
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
                              const { hidden, dataType, label, readOnly, name, required } = metaMap[field];
                              if (hidden || (readOnly &&  !valueMap[field])) {
                                return null;
                              }
                              return (
                                <Form.Item
                                  key={field}
                                  name={name}
                                  rules={required ? [{required: true, message: `${label}必填`}]: []}
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
          </Form>
        </Spin>
      </div>
    </PageContainer>
  );
};

export default AddDocType;
