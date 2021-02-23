import { Spin } from 'antd';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'dva';
import ProLayout, { MenuDataItem, BasicLayoutProps } from '@ant-design/pro-layout';
import { MenuOutlined } from '@ant-design/icons';
import DefaultFooter from '@/components/Footer';
import RightContent from '@/components/RightContent';
import { useModel, NavLink, history } from 'umi';
import Logo from '@/assets/ucl_logo.png';


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
      logo={<img src={Logo} />}
      rightContentRender={() => <RightContent />}
      disableContentMargin={false}
      menuHeaderRender={undefined}
      itemRender={router => {
        if (router.breadcrumbName) {
          return <NavLink to={router.path}>{router.breadcrumbName}</NavLink>
        }
        return router.breadcrumbName
      }}
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
        <NavLink to={item.path || '/'}>{dom}</NavLink>
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
      footerRender={() => <DefaultFooter />}
      menuDataRender={() => loopMenuItem(menuState.routes)}>
      {props.children}
    </ProLayout>
  );
};

export default MyProLayout;
