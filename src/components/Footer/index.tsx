import React from 'react';
import { DefaultFooter } from '@ant-design/pro-layout';
import party from '@/assets/0dNP1tj.png';

export default () => (
  <DefaultFooter
    copyright={false}
    links={[
      {
        key: '1',
        title: '蜀ICP备18024930号',
        href: 'http://www.beian.miit.gov.cn/',
        blankTarget: true,
      },
      {
        key: '2',
        title: <span><img alt='party' src={party}/>川公网安备 51010402000954号</span>,
        href: '#',
        blankTarget: true,
      }
    ]}
  />
);
