import { Alert, Checkbox, message } from 'antd';
import React, { useState } from 'react';
import { Link, SelectLang, useModel, history, History } from 'umi';
import { LoginParamsType, accountLogin } from '@/services/login';
import LoginFrom from './components/Login';
import styles from './style.less';

const { Tab, Username, Password, Submit } = LoginFrom;

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

/**
 * 此方法会跳转到 redirect 参数所在的位置
 */
const replaceGoto = () => {
  setTimeout(() => {
    const { query } = history.location;
    const { redirect } = query as { redirect: string };
    if (!redirect) {
      history.replace('/');
      return;
    }
    (history as History).replace(redirect);
  }, 10);
};

const Login: React.FC<{}> = () => {
  const [userLoginState, setUserLoginState] = useState<API.LoginStateType>({});
  const [submitting, setSubmitting] = useState(false);
  const { initialState, setInitialState } = useModel('@@initialState');
  const [autoLogin, setAutoLogin] = useState(true);
  const handleSubmit = async (values: LoginParamsType) => {
    setSubmitting(true);
    try {
      // 登录
      const msg = await accountLogin({ ...values });
      if (msg.message === 'Logged In' && initialState) {
        message.success('登录成功！');
        const currentUser = await initialState?.fetchUserInfo();
        setInitialState({
          ...initialState,
          currentUser,
        });
        replaceGoto();
        return;
      }
      // 如果失败去设置用户错误信息
      setUserLoginState(msg);
    } catch (error) {
      message.error('登录失败，请重试！');
    }
    setSubmitting(false);
  };

  const { exc, type: loginType = 'acount' } = userLoginState;

  return (
    <div className={styles.container}>
      <div className={styles.lang}>
        <SelectLang />
      </div>
      <div className={styles.content}>
        <div className={styles.main}>
          <LoginFrom activeKey={'account'} onSubmit={handleSubmit}>
            <Tab key="account" tab="账户密码登录">
              {typeof exc !== 'undefined' && loginType === 'account' && !submitting && (
                <LoginMessage content="账户或密码错误（admin/ant.design）" />
              )}
              <Username
                name="usr"
                placeholder="用户名: admin or user"
                rules={[
                  {
                    required: true,
                    message: '请输入用户名!',
                  },
                ]}
              />
              <Password
                name="pwd"
                placeholder="密码: ant.design"
                rules={[
                  {
                    required: true,
                    message: '请输入密码！',
                  },
                ]}
              />
            </Tab>
            <div>
              <Checkbox checked={autoLogin} onChange={(e) => setAutoLogin(e.target.checked)}>
                自动登录
              </Checkbox>
              <a
                style={{
                  float: 'right',
                }}
              >
                忘记密码
              </a>
            </div>
            <Submit loading={submitting}>登录</Submit>
            <div className={styles.other}>
              <Link className={styles.register} to="/user/register">
                注册账户
              </Link>
            </div>
          </LoginFrom>
        </div>
      </div>
    </div>
  );
};

export default Login;
