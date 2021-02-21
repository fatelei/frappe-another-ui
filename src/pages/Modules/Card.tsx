import React from 'react';
import { Card, Row, Col, Spin } from 'antd';
import { useParams, Link } from "umi";
import { getModuleView } from '@/services/menu';


export default (): React.ReactNode => {
  const params: any = useParams();
  const [loading, setLoading] = React.useState(false);
  const [cards, setCards] = React.useState<Frappe.IModuleViewResponse | null>(null);
  React.useEffect(() => {
    setLoading(true)
    getModuleView(params.moduleName.replaceAll('_', ' ')).then((res: API.IModuleView) => {
      setCards(res.message);
      setLoading(false);
    }).catch(err => {
      setLoading(false);
    })
  }, [params.moduleName]);

  return (
    <Spin spinning={loading}>
      <Row justify='start' gutter={8}>
        {cards?.data.map((item: Frappe.IModuleViewCard, index: number) => {
          return (
            <Col key={index} span='6'>
              <Card title={item.label} style={{ height: '100%' }}>
                <ul>
                  {item.items.map((innerItem: Frappe.IModuleViewItem, innerIndex: number) => {
                    const type: string = innerItem.type;
                    const docType: string = innerItem.name.replaceAll(' ', '_');
                    if (type === 'doctype') {
                      return (
                        <li key={innerIndex}><Link to={`/modules/${params.moduleName}/docTypes/${docType}`}>{innerItem.label}</Link></li>
                      );
                    } else {
                      return (
                        <li key={innerIndex}><Link to={`/modules/${params.moduleName}/pages/${docType}`}>{innerItem.label}</Link></li>
                      );
                    }
                  })}
                </ul>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Spin>
  )
};
