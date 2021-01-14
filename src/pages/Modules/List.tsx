import { PageContainer } from '@ant-design/pro-layout';
import { Table, message } from 'antd';
import React from 'react';
import {useParams } from "umi";

import SearchBar from './SearchBar';

import { getDocType, getReportView, countReportView } from '@/services/reportView';
import { generateListFields } from '@/utils/generate';

import AddDialog from './Add';


const List = () => {
  const params: any = useParams();
  const [loading, setLoading] = React.useState(false);
  const [inListViewFields, setInListViewFields] = React.useState<any>([]);
  const [total, setTotal] = React.useState(0);
  const [dataSource, setDataSource] = React.useState<any>([]);
  const [searchFields, setSearchFields] = React.useState<any>({});
  const docType = params.docType.replaceAll('_', ' ');

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
    const queryFields = generateListFields(docType, inListViewFields.map((item: any) => item.fieldname));
    const fetchData = getReportView(docType, queryFields, conditions, '`modified` desc', 0, 20);
    const countData = countReportView(docType, conditions);

    setLoading(true);
    Promise.all([fetchData, countData]).then((values: any) => {
      const [data = [], count = 0] = values;
      setTotal(count);
      setDataSource(data);
      setLoading(false);
    }).catch(err => {
      message.error('获取失败');
      setLoading(false);
    });
  };

  React.useEffect(() => {
    setLoading(true);
    getDocType(docType, 1).then((res: any) => {
      const { currentDoc = {} } = res;
      const tmpInListViewFields = [];
      const fields: string[] = [];
      const tmpSearchFields: any = {};

      for (const field of currentDoc.fields) {
        if (field.in_list_view > 0) {
          tmpInListViewFields.push({
            fieldname: field.fieldname,
            label: field.label
          })
          fields.push(field.fieldname);
        }
        if (field.in_standard_filter > 0) {
          tmpSearchFields[field.fieldname] = {
            fieldType: field.fieldtype,
            lableText: field.label,
            options: field.options
          }
        }
      }

      const queryFields = generateListFields(docType, fields);
      setInListViewFields(tmpInListViewFields);
      setSearchFields(tmpSearchFields);
      const fetchData = getReportView(docType, queryFields, [], '`modified` desc', 0, 20);
      const countData = countReportView(docType, []);

      Promise.all([fetchData, countData]).then((values: any) => {
        const [data = [], count = 0] = values;
        setTotal(count);
        setDataSource(data);
        setLoading(false);
      }).catch(err => {
        message.error('获取失败');
        setLoading(false);
      })
    }).finally(() => {
      setLoading(false);
    })
  }, [params.docType]);
  
  return (
    <PageContainer>
      <div>
        <SearchBar
          searchFields={searchFields}
          onSearch={onSearch}/>
        <Table
          title={() => <AddDialog/>}
          loading={loading}
          dataSource={dataSource}
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
