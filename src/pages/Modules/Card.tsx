import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Row, Col, Typography, Spin } from 'antd';
import { useSelector } from 'dva';
import { querySecondLevelMenu } from '@/services/menu';
import { useParams, useModel } from "umi";


export default (): React.ReactNode => {
  const params: any = useParams();
  const [loading, setLoading] = React.useState(false);
  const [cards, setCards] = React.useState<Frappe.ISidebarCard[]>([]);
  const menus = useSelector((state: any) => state.menu.routes);
  const { initialState, setInitialState } = useModel('@@initialState');
  React.useEffect(() => {
    if (!initialState?.menuData) {
      setInitialState({
        ...initialState,
        menuData: menus
      })
    }

    setLoading(true)
    querySecondLevelMenu(params.moduleName).then(res => {
      setCards(res.message.cards.items);
      setLoading(false);
    }).finally(() => setLoading(false));
  }, [params.moduleName]);

  return (
    <PageContainer>
      <Spin spinning={loading}>
        <Row justify='start' gutter={8}>
          {cards.map(card => {
            return (
              <Col key={card.idx} span='6'>
                <Card title={card.label} style={{ height: '100%' }}>
                  <ul>
                    {card.links.map((link, index) => {
                      return (
                        <li key={index}>
                          <Typography.Text
                            strong
                            style={{
                              marginBottom: 12,
                            }}
                          >
                            {link.label}
                          </Typography.Text>
                        </li>
                      );
                    })}
                  </ul>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Spin>
    </PageContainer>
  )
};
