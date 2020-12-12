import { Spin } from 'antd';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'dva';
import ProLayout, { MenuDataItem, BasicLayoutProps } from '@ant-design/pro-layout';
import { MenuOutlined } from '@ant-design/icons';
import RightContent from '@/components/RightContent';
import { useModel, Link, history } from 'umi';
import Logo from '@/assets/logo.svg';


const IconMap = {
  menu: <MenuOutlined />
};


const loopMenuItem = (menus: MenuDataItem[]): MenuDataItem[] => {
  return menus.map(({ icon, children, ...item }) => ({
    ...item,
    icon: icon && IconMap[icon as string],
    children: children && loopMenuItem(children),
  }));
}



const MyProLayout = (props: BasicLayoutProps) => {
  const menuState = useSelector((state: any) => state.menu);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({ type: 'menu/getMenus' });
  }, []);
  const { initialState } = useModel('@@initialState');
  return (
    <ProLayout
      style={{
        height: 400,
        border: '1px solid #ddd',
      }}
      logo={<img src={Logo}/>}
      rightContentRender={() => <RightContent />}
      disableContentMargin={false}
      menuHeaderRender={undefined}
      {...initialState?.settings}
      onPageChange={() => {
        const { location } = history;
        // 如果没有登录，重定向到 login
        if (!initialState?.currentUser && location.pathname !== '/user/login') {
          history.push('/user/login');
        }
      }}
      fixSiderbar={true}
      menuItemRender={(item, dom) => (
        <Link to={item.path || '/'}>{dom}</Link>
      )}
      loading={menuState.loading}
      menuContentRender={(_, dom) =>
        menuState.loading ? (
          <div
            style={{
              padding: '24px 0',
            }}
          >
            <Spin tip="菜单加载中">{dom}</Spin>
          </div>
        ) : (
            dom
          )
      }
      menuDataRender={() => loopMenuItem(menuState.routes)}>
      {props.children}
    </ProLayout>
  );
};

export default MyProLayout;
