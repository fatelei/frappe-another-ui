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
import { update as updateData, getSingle } from '@/services/docType';

const Option = Select.Option;


const SingleDocType = () => {
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
    Promise.all([
      getDocType(getApiDocType(params.docType), 0),
      getSingle(params.docType)
    ]).then((values: any) => {
      const [ res0, res1 ] = values;

      const { currentDoc = {}, relateDocMap = {} } = res0 || {}
      const { data = {} } = res1 || {};
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
        ...defaultValueMap,
        ...data
      });
      setGroupFields(groupFields);
      setSectionMetaArray({...sectionMetaArray});
      const tmpfileListMap = {};
      Object.keys(fieldMetaMap).filter((key: string) => fieldMetaMap[key].dataType === 'Attach Image').forEach((key: string) => {
        console.log(data[key]);
        if (data[key]) {
          tmpfileListMap[key] = [data[key]]
        }
      });
      setFileListMap({...fileListMap, ...tmpfileListMap});
      form.setFieldsValue({
        ...defaultValueMap,
        ...data
      });
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [params.docType !== undefined, params.name !== undefined]);

  const onAttachImagePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
  };

  const renderItem = (meta: any, defaultValue: any) :JSX.Element | null=> {
    const { dataType, label, options, readOnly, name, ref } = meta;
    if (dataType === 'Data') {
      return <Input disabled={readOnly} defaultValue={defaultValue}/>
    } else if (dataType === 'Date') {
      return <DatePicker disabled={readOnly} defaultValue={defaultValue} format='YYYY-MM-DD'/>;
    } else if (dataType === 'Time') {
      return <TimePicker disabled={readOnly} defaultValue={defaultValue} placeholder='选择时间' format='HH:mm:ss'/>;
    } else if (dataType === 'Password') {
      return <Input type='password' disabled={readOnly} defaultValue={defaultValue}/>;
    } else if (['Long Text', 'Text', 'Small Text'].includes(dataType)) {
      return <Input.TextArea disabled={readOnly} defaultValue={defaultValue} rows={5}/>;
    } else if (dataType === 'Int') {
      return <InputNumber disabled={readOnly} defaultValue={defaultValue}/>;
    } else if (dataType === 'Button') {
      return <Button disabled={readOnly} type='primary'>{label}</Button>;
    } else if (dataType === 'Date and Time') {
      return <DatePicker showTime={true} disabled={readOnly} format='YYYY-MM-DD HH:mm:ss'/>;
    } else if (dataType === 'Attach') {
      return <Input type='file' disabled={readOnly}/>;
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
      return <InputNumber formatter={formatFloat} step={0.001} style={{width: '200px'}} precision={3}/>
    } else if (dataType === 'Currency') {
      return <InputNumber formatter={formatFloat} step={0.001} style={{width: '200px'}} precision={3}/>
    } else if (dataType === 'Table') {
      return <TableLink fieldName={name} defaultData={defaultValue} relateDocTypeDefine={ref} onChange={v => setBody({...body, [name]: v})}/>
    }
    return null;
  };

  const saveDocType = (values: any) => {
    updateData(params.docType, params.name, {...values, ...body}).then(res => {
      message.success('更新成功');
    }).catch(err => {
      console.error(err);
      message.error('更新失败');
    });
  };

  return (
    <div style={{ backgroundColor: '#ffffff', padding: '10px 10px'}}>
      <Spin spinning={loading}>
        <Form
          form={form}
          onFinish={(values: any) => {
            saveDocType(values);
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
                                const { hidden, dataType, label, readOnly, required, name } = metaMap[field];
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
          <Form.Item wrapperCol={{ span: 24, push: 20 }}>
            <Button type="primary" size='large' htmlType='submit'>保存</Button>
          </Form.Item>
        </Form>
      </Spin>
    </div>
  );
};

export default SingleDocType;
