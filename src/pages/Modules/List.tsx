import { Dropdown, Menu, Table, Button } from 'antd';
import { useDispatch, useSelector } from 'dva';
import React from 'react';
import { useParams, history, Link } from "umi";

import SearchBar from './SearchBar';
import SingleDocType from './single';

const MenuItem = Menu.Item;

interface IActionProps {
  onClick: (action: string) => any
}

const Action = (props: IActionProps) => {

  const onClick = (menuInfo: any) => {
    if (props.onClick) {
      props.onClick(menuInfo.key);
    }
  }

  const menu = (
    <Menu onClick={onClick}>
      <MenuItem key='edit'>编辑</MenuItem>
      <MenuItem key='assign'>分配</MenuItem>
      <MenuItem key='print'>打印</MenuItem>
      <MenuItem key='delete'>删除</MenuItem>
    </Menu>
  )

  return (
    <Dropdown overlay={menu} trigger={['click']}>
      <Button type='primary'>操作</Button>
    </Dropdown>
  )
}


const List = () => {
  const params: any = useParams();
  const dispatch = useDispatch();
  const docTypeState = useSelector((state: any) => state.docTypeState);
  const currentDocTypeState = docTypeState.docTypeMap[params.docType] || {};
  const loading = docTypeState.loading;
  const { inListViewFields = [], total = 0, data = [], hideToolbar = 0, isSingle = 0 } = currentDocTypeState;

  const generateTableColumns = () => {
    const columns: any = [];
    for (const item of inListViewFields) {
      if (item.fieldname === 'name') {
        columns.push({
          title: item.label,
          dataIndex: item.fieldname,
          key: item.fieldname,
          render: (v: string) => <Link to={`/modules/${params.moduleName}/docTypes/${params.docType}/${v}`}>{v}</Link>
        });
      } else {
        columns.push({
          title: item.label,
          dataIndex: item.fieldname,
          key: item.fieldname
        });
      }
    }
    columns.push({
      title: '操作',
      key: 'action',
      render: (record: any) => {
        return (
          <Action onClick={(action: string) => {
            if (action === 'delete') {
              dispatch({
                type: 'docTypeState/deleteDocument',
                name: record.name,
                docType: params.docType
              })
            } else if (action === 'edit') {
              history.push(`/modules/${params.moduleName}/docTypes/${params.docType}/${record.name}`);
            }
          }} />
        )
      }
    })
    return columns;
  }

  React.useEffect(() => {
    dispatch({ type: 'docTypeState/getDocTypeDefine', docType: params.docType });
  }, [params.docType]);

  return (
    <div>
      {hideToolbar === 0 && <SearchBar/>}
      {isSingle === 0 ?
      <Table
        rowKey={v => v.name}
        title={() => <Link to={`/modules/${params.moduleName}/docTypes/${params.docType}/add`}><Button type='primary'>新建</Button></Link>}
        loading={loading}
        dataSource={data}
        columns={generateTableColumns()}
        pagination={{
          total,
          pageSize: 20
        }} />
      : <SingleDocType/>}
    </div>
  );
}

export default List;
