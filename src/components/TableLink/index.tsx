import React  from 'react';
import { Table, Button, Modal } from 'antd';
import DocTypeForm from '@/components/DocTypeForm';


interface ITableLinkProps {
  relateDocTypeDefine?: any
  fieldName: string
  defaultData?: any[]
  onChange?: (data: any) => any
}

const TableLink = (props: ITableLinkProps) => {
  const { relateDocTypeDefine = {} } = props;
  const [ selectRecords, setSelectRecords ] = React.useState<any[]>([]);
  const [ dataSource, setDataSource ] = React.useState<any[]>(props.defaultData || []);
  const [ currentSelectedRow, setSelectedRow ] = React.useState<any>(null);
  const [ editModalVisible, setEditModalVisible ] = React.useState<boolean>(false);
  const [ addModalVisible, setAddModalVisible ] = React.useState<boolean>(false);
  const { fields = [] } = relateDocTypeDefine;
  const hideOrShowAddModal = () => setAddModalVisible(!addModalVisible);
 

  const hideOrShowEditModal = (record?: any) => {
    if (!editModalVisible) {
      setSelectedRow(record);
    } else {
      setSelectedRow(null);
    }
    setEditModalVisible(!editModalVisible);
  }

  const onEditDataSource = (body: any) => {
    const tmpDataSource = dataSource.slice(0);
    let targetIndex = -1;
    for (const [index, item] of tmpDataSource.entries()) {
      if (item.name === currentSelectedRow.name) {
        targetIndex = index;
        break;
      }
    }

    if (targetIndex >= 0) {
      tmpDataSource[targetIndex] = {...tmpDataSource[targetIndex], ...body};
      setDataSource([...tmpDataSource]);
    }
    hideOrShowEditModal();
  };

  const onAddDataSource = (body: any) => {
    const tmpDataSource = dataSource.slice(0);
    tmpDataSource.push(body);
    setDataSource([...tmpDataSource]);
    hideOrShowAddModal();
  };

  const onRemoveDataSource = () => {
    const leftDataSource = dataSource.filter((item: any) => !selectRecords.includes(item.name));
    setDataSource([...leftDataSource]);
    setSelectRecords([]);
  };

  const generateColumns = () => {
    const columns: any = [];
    for (const item of fields) {
      if (item.in_list_view) {
        columns.push({
          title: item.label,
          dataIndex: item.fieldname,
          key: item.fieldname
        });
      }
    }
    columns.push({
      title: '-',
      key: 'action',
      render: (record: any) => {
        return <Button type='link' onClick={() => hideOrShowEditModal(record)}>编辑</Button>
      }
    })
    return columns;
  }

  return (
    <div>
      <Modal
        visible={editModalVisible}
        title='编辑行'
        footer={null}
        onCancel={hideOrShowEditModal}>
        <DocTypeForm
          onCancel={hideOrShowEditModal}
          onSubmit={onEditDataSource}
          docTypeDefine={props.relateDocTypeDefine}
          defaultValue={currentSelectedRow}/>
      </Modal>
      <Modal
        visible={addModalVisible}
        title='添加行'
        footer={null}
        onCancel={hideOrShowAddModal}>
        <DocTypeForm
          onSubmit={onAddDataSource}
          onCancel={hideOrShowEditModal}
          docTypeDefine={props.relateDocTypeDefine}
          defaultValue={{}}/>
      </Modal>
      <Table
        columns={generateColumns()}
        dataSource={dataSource}
        rowKey={(record: any) => record.name}
        pagination={false}
        bordered={true}
        rowSelection={{
          onChange: (selectedRowKeys: any, selectedRows: any) => {
            setSelectRecords([...selectedRowKeys]);
          }
        }}
      />
      <div style={{marginTop: 5}}>
        {selectRecords.length > 0 && <Button danger={true} type='primary' onClick={onRemoveDataSource}>删除</Button>}
        <Button onClick={hideOrShowAddModal} type="primary" style={{ marginLeft: 16 }}>
          添加行
        </Button>
      </div>
    </div>
  )
};

export default TableLink;
