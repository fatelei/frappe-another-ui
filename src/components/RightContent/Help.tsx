import React, { useCallback } from 'react';
import { Menu, Modal, Spin } from 'antd';
import { useModel } from 'umi';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

export interface GlobalHeaderRightProps {
  menu?: boolean;
}


const Helper: React.FC<GlobalHeaderRightProps> = () => {
  const { initialState } = useModel('@@initialState');

  const onMenuClick = useCallback(
    (event: {
      key: React.Key;
      keyPath: React.Key[];
      item: React.ReactInstance;
      domEvent: React.MouseEvent<HTMLElement>;
    }) => {
      const { key } = event;
      if (key === 'about') {
        Modal.confirm({
          title: 'Frappe框架',
          content: <div>为Web的开源应用程序</div>,
          okText: '确认',
          cancelText: '关闭'
        });
      } else if (key === 'shortcut') {
        Modal.confirm({
          title: '键盘快捷键',
          content: <div>为Web的开源应用程序</div>,
          okText: '确认',
          cancelText: '关闭'
        });
      }
    },
    [],
  );

  const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const { currentUser } = initialState;

  if (!currentUser || !currentUser.message) {
    return loading;
  }

  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      <Menu.Item key="about">
        关于
      </Menu.Item>
      <Menu.Item key="shortcut">
        键盘快捷键
      </Menu.Item>
    </Menu>
  );
  return (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <span className={`${styles.action} ${styles.account}`}>
        <span className={`${styles.name} anticon`}>帮助</span>
      </span>
    </HeaderDropdown>
  );
};

export default Helper;
