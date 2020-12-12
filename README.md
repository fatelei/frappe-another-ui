# 依赖

- nodejs >= 10.0.0
- yarn

# 构建

```
>>> git clone git@github.com:fatelei/frappe-another-ui.git
>>> cd frappe-another-ui
>>> yarn
```

# 配置后端 API 地址

- 打开 /path/to/frappe-another-ui/config/proxy.ts
- 编辑 dev 的 api 地址

```
export default {
  dev: {
    '/api/': {
      target: 'http://mysite.localhost/',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  test: {
    '/api/': {
      target: 'https://preview.pro.ant.design',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  pre: {
    '/api/': {
      target: 'your pre url',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
};
```

# 启动

```
>>> yarn start
```
