import { Tag, Space } from 'antd';
import React from 'react';
import { useModel, Link } from 'umi';
import HeaderSearch from '../HeaderSearch';
import Avatar from './AvatarDropdown';
import Helper from './Help';
import SelectLang from './SelectLang';
import styles from './index.less';

export type SiderTheme = 'light' | 'dark';

const ENVTagColor = {
  dev: 'orange',
  test: 'green',
  pre: '#87d068',
};

const GlobalHeaderRight: React.FC<{}> = () => {
  const { initialState } = useModel('@@initialState');

  if (!initialState || !initialState.settings) {
    return null;
  }

  const { navTheme, layout } = initialState.settings;
  let className = styles.right;

  if ((navTheme === 'dark' && layout === 'top') || layout === 'mix') {
    className = `${styles.right}  ${styles.dark}`;
  }
  return (
    <Space className={className}>
      <HeaderSearch
        className={`${styles.action} ${styles.search}`}
        placeholder="站内搜索"
        options={[
          {
            label: <Link to='/modules/i3_Inventory'>i3 Inventory模块</Link>,
            value: 'i3 Inventory模块' 
          },
          {
            label: <Link to='/modules/Settings'>Settings模块</Link>,
            value: 'Settings模块',
          },
          {
            label: <Link to='/modules/i3_Setting_Up'>i3 Setting Up模块</Link>,
            value: 'i3 Setting Up模块',
          },
          {
            label: <Link to='/modules/Settings/docTypes/Notification'>Notification列表</Link>,
            value: 'Notification列表',
          },
        ]}
      />
      <Avatar />
      <Helper />
      <SelectLang />
      {REACT_APP_ENV && (
        <span>
          <Tag color={ENVTagColor[REACT_APP_ENV]}>{REACT_APP_ENV}</Tag>
        </span>
      )}
    </Space>
  );
};
export default GlobalHeaderRight;
