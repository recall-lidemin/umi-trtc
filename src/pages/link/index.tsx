import React, { FC } from 'react'
import { history } from 'umi'
import { Form, Input, Button, message } from 'antd'
import styles from './index.less'

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
}

const Login: FC = () => {
  const onFinish = (values: any) => {
    if (values.homeId === '888888') {
      history.push({
        pathname: '/home',
        query: {
          userId: values.userId,
          homeId: values.homeId,
        },
      })
      return
    }
    message.error('房间号不正确！')
  }
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  return (
    <div className={`${styles['login-layout']}`}>
      <Form
        {...layout}
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="房间号"
          name="homeId"
          rules={[{ required: true, message: '请输入正确的房间号' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="用户名"
          name="userId"
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            连接
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default Login
