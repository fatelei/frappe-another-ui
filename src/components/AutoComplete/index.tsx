import { AutoComplete, Button, Col, Empty, Input, Modal, Row } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import React from 'react';

import { searchLink, validateSearchLink } from '@/services/reportView';
import { generateFilterFields } from '@/utils/generate';
import { create as createDocType } from '@/services/docType';


interface IFrappeAutoCompleteProps {
  placeholder: string
  options: string
  docType: string
  referenceDoctype: string
  fieldname: string
  showAdvance?: boolean
  mode?: string
  defaultValue?: string
  onSelect?: (fieldname: string, field: string[]) => any
  onChange?: (fieldname: string, value: string) => any
}

const FrappeAutoComplete = (props: IFrappeAutoCompleteProps) => {
  const [options, setOptions] = React.useState<any>([]);
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [showAdvanceSearchModal, setShowAdvanceSearchModal] = React.useState(false);
  const [newValue, setNewValue] = React.useState('');
  const [value, setValue] = React.useState(props.defaultValue || '');
  const mode = props.mode ? props.mode : 'search';
  
  const hideOrShowAddModal = () => setShowAddModal(!showAddModal);
  const hideOrShowAdvanceSearchModal = () => {
    if (!showAdvanceSearchModal) {
      onSearch(value, false);
    }
    setShowAdvanceSearchModal(!showAdvanceSearchModal);
  };
  const onNewValueChange = (e: React.ChangeEvent<HTMLInputElement>) => setNewValue(e.currentTarget.value);
  const saveDocType = () => {
    createDocType(props.docType, {
      [props.fieldname]: newValue
    }).then(res => {
      hideOrShowAddModal();
      setOptions([{
        label: newValue,
        value: newValue
      }, ...options]);
      setNewValue('');
      setValue(res.data.domain);
    });
  };

  const onSearch = (value: string, showAdvance: boolean = false) => {
    const txt = value ? value: '';
    searchLink(props.options, txt, props.referenceDoctype).then(res => {
      const rsts: any = (res.results || []).map((item: Frappe.ISearchLink) => {
        return {label: item.value, value: item.value};
      });
      if (showAdvance) {
        rsts.push({
          value: undefined,
          label: (
            <a href='#add-link-value' onClick={hideOrShowAddModal}>
              <PlusOutlined/>{`创建一个新的${props.placeholder}`}
            </a>
          )
        });

        rsts.push({
          value: undefined,
          label: (
            <a href='#advance-search-link-value' onClick={hideOrShowAdvanceSearchModal}>
              <SearchOutlined/>高级搜索
            </a>
          )
        });
      }
      setOptions([...rsts]);
    }).catch(err => {
      console.error(err);
    })
  };

  const onAdvanceSearch = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const currentValue = e.currentTarget.value;
    onSearch(currentValue, false);
    setValue(currentValue);
  };

  const onChange = (txt: string) => {
    if (txt !== undefined) {
      setValue(txt);
    }

    if (!txt || txt.length === 0) {
      if (props.onSelect !== undefined && mode === 'search') {
        props.onSelect(props.fieldname, []);
        return;
      }
    }

    validateSearchLink(txt, props.options).then((res: any) => {
      if (res.message === 'Ok' && res.valid_value) {
        if (props.onSelect !== undefined && mode === 'search') {
          props.onSelect(props.fieldname, generateFilterFields(props.fieldname, '=', res.valid_value));
        } else if (props.onChange !== undefined && mode === 'add_or_edit') {
          props.onChange(props.fieldname, res.valid_value);
        }
      }
    }).catch(err => {
      console.error(err);
    });
  }

  return (
    <React.Fragment>
      <Modal
        title={`新建 ${props.placeholder}`}
        okText='保存'
        cancelText='关闭'
        onCancel={hideOrShowAddModal}
        onOk={saveDocType}
        visible={showAddModal}>
        <Input placeholder={props.placeholder} onChange={onNewValueChange} value={newValue}/>
      </Modal>
      <Modal
        title={`选择${props.placeholder}`}
        okText='保存'
        cancelText='关闭'
        onCancel={hideOrShowAdvanceSearchModal}
        onOk={hideOrShowAdvanceSearchModal}
        visible={showAdvanceSearchModal}>
        <div>
          <Input placeholder='可以使用通配符%' onChange={onAdvanceSearch} value={value}/>
          {options.length === 0 ?
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='没有结果'>
              <Button type='primary' onClick={hideOrShowAddModal}>{`新建${props.placeholder}`}</Button>
            </Empty>
            :
            options.map((searchedItem: any, index: number) => {
              return (
                <Row key={index} gutter={16} style={{borderBottom: '1px solid black'}}>
                  <Col span={8} style={{cursor: 'pointer'}} onClick={() => {
                    setValue(searchedItem.value);
                    hideOrShowAdvanceSearchModal();
                  }}>
                    {searchedItem.label}
                  </Col>
                  <Col span={8}>{searchedItem.value}</Col>
                </Row>
              );
            })
          }
        </div>
      </Modal>
      <AutoComplete
        allowClear={true}
        style={{ width: 200 }}
        dropdownMatchSelectWidth={false}
        options={options}
        value={value}
        onSearch={v => onSearch(v, props.showAdvance)}
        onChange={onChange}
        filterOption={(value: string, option: any) => {
          if (!option.value) {
            return true;
          }

          if (option) {
            return option.label.indexOf(value.toLowerCase()) !== -1;
          }
          return true;
        }}
        placeholder={props.placeholder}/>
    </React.Fragment>
  );
}

export default FrappeAutoComplete;
