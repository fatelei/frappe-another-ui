// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';

const { REACT_APP_ENV } = process.env;

export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  layout: {
    name: 'Ant Design Pro',
    locale: false,
    ...defaultSettings,
  },
  locale: {
    // default zh-CN
    default: 'zh-CN',
    antd: true,
  
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/user',
      layout: false,
      routes: [
        {
          name: 'login',
          path: '/user/login',
          component: './user/login',
        },
      ],
    },
    {
      path: '/',
      redirect: '/modules/i3_Setting_Up/desk/i3_Setting_Up-0'
    },
    {
      path: '/modules',
      layout: false,
      component: '@/layouts/index',
      routes: [
        {
          routes: [
            {
              path: '/modules/:moduleName',
              name: 'doctype',
              component: './Modules/Card'
            },
            {
              path: '/modules/:moduleName/desk/:desk',
              component: './Modules/Card'
            },
            {
              path: '/modules/:moduleName/desk/:desk/pages/:docType',
              name: 'page',
              component: './Modules/Page',
            },
            {
              path: '/modules/:moduleName/desk/:desk/docTypes/:docType',
              name: 'doctype',
              component: './Modules/List',
            },
            {
              path: '/modules/:moduleName/desk/:desk/docTypes/:docType/add',
              component: './Modules/Add',
              name: 'add',
              title: '新建'
            },
            {
              path: '/modules/:moduleName/desk/:desk/docTypes/:docType/:name',
              component: './Modules/Edit',
              name: 'edit',
              title: '编辑'
            }
          ]
        }
      ],
    },
    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  // @ts-ignore
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  }
});
