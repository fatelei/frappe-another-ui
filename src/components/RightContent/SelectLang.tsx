import React, { useCallback } from 'react';
import { Menu, message, Spin } from 'antd';
import { TranslationOutlined } from '@ant-design/icons'
import { useModel } from 'umi';
import HeaderDropdown from '../HeaderDropdown';

import { updateLang } from '@/services/lang';

import styles from './index.less';

export interface GlobalHeaderRightProps {
  menu?: boolean;
}

const SelectLang: React.FC<GlobalHeaderRightProps> = () => {
  const { initialState } = useModel('@@initialState');

  const locales = ['zh', 'en-US'];
  const languageLabels = {
    'zh': '简体中文',
    'zh-TW': '繁体中文',
    'en-US': 'English',
    'pt-BR': 'Português'
  };
  const languageIcons = {
    'zh': '🇨🇳',
    'zh-TW': '🇭🇰',
    'en-US': '🇬🇧',
    'pt-BR': '🇧🇷'
  };

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

  const setLocale = useCallback(
    (event: {
      key: React.Key;
      keyPath: React.Key[];
      item: React.ReactInstance;
      domEvent: React.MouseEvent<HTMLElement>;
    }) => {
      const { key } = event;
      updateLang(key.toString(), currentUser.message || '').then(res => {
        message.success('设置成功，页面重新加载');
        window.location.reload();
      }).catch(err => {
        message.error('设置失败');
      });
    },
    [],
  );

  const langMenu = (
    <Menu
      className={styles.menu}
      onClick={setLocale}
    >
      {locales.map(locale => (
        <Menu.Item key={locale}>
          <span role="img" aria-label={languageLabels[locale]}>
            {languageIcons[locale]}
          </span>{' '}
          {languageLabels[locale]}
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <HeaderDropdown overlay={langMenu}>
      <span className={`${styles.action} ${styles.account}`}>
        <TranslationOutlined />
      </span>
    </HeaderDropdown>
  );
};

export default SelectLang;
