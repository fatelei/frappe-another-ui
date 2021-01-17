import { PageContainer } from '@ant-design/pro-layout';
import { Table, Button } from 'antd';
import { useDispatch, useSelector } from 'dva';
import React from 'react';
import { useParams, Link } from "umi";

import SearchBar from './SearchBar';

import { generateListFields } from '@/utils/generate';


const List = () => {
  const params: any = useParams();
  const dispatch = useDispatch();
  const docTypeState = useSelector((state: any) => state.docTypeState);
  const currentDocTypeState = docTypeState.docTypeMap[params.docType] || {};
  const loading = docTypeState.loading;
  const { inListViewFields = [], total = 0, data = [], searchConditionFields = [] } = currentDocTypeState;

  const generateTableColumns = () => {
    const columns: any = [];
    for (const item of inListViewFields) {
      columns.push({
        title: item.label,
        dataIndex: item.fieldname,
        key: item.fieldname
      });
    }
    return columns;
  }

  const onSearch = (conditions: string[][]) => {
    const queryFields = generateListFields(inListViewFields.map((item: any) => item.fieldname));
    dispatch({type: 'docTypeState/listDocumentsResposne', payload: {
      docType: params.docType,
      queryFields,
      conditions,
      orderBy: '`modified` desc'
    }});
  };

  React.useEffect(() => {
    dispatch({type: 'docTypeState/getDocTypeDefine', docType: params.docType});
  }, [params.docType]);
  
  return (
    <PageContainer>
      <div>
        <SearchBar
          searchFields={searchConditionFields}
          onSearch={onSearch}/>
        <Table
          title={() => <Link to={`/modules/${params.moduleName}/docTypes/${params.docType}/add`}><Button type='primary'>新建</Button></Link>}
          loading={loading}
          dataSource={data}
          columns={generateTableColumns()}
          pagination={{
            total,
            pageSize: 20
          }}/>
      </div>
    </PageContainer>
  );
}

export default List;
