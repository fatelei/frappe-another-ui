import { useSelector } from 'dva';
import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Row, Col, Spin } from 'antd';
import { useParams } from "umi";
import { MenuDataItem } from '@umijs/route-utils';


export default (): React.ReactNode => {
  const menuState = useSelector((state: any) => state.menu);
  const params: any = useParams();
  const [loading, setLoading] = React.useState(false);
  const [cards, setCards] = React.useState<MenuDataItem>([]);
  React.useEffect(() => {
    setLoading(true)
    for (const menu of menuState.routes) {
      if (menu.name === params.moduleName) {
        setCards(menu.children);
      }
    }
    setLoading(false);
  }, [params.moduleName]);

  return (
    <PageContainer>
      <Spin spinning={loading}>
        <Row justify='start' gutter={8}>
          {cards.map((card: MenuDataItem, index: number) => {
            return (
              <Col key={index} span='6'>
                <Card title={card.name} style={{ height: '100%' }}/>
              </Col>
            );
          })}
        </Row>
      </Spin>
    </PageContainer>
  )
};
