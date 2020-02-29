import React from 'react'
import { connect } from 'dva'
import { Form, Row, Icon, Input, Button, DatePicker } from 'antd'
import { withRouter } from 'dva/router'
import styles from './LoginLayout.less'
import dayjs from 'dayjs'
// import moment from 'moment'

class Login extends React.PureComponent {
  click = () => {
    const t = dayjs().locale('zh_CN').localeData()
    console.log('t>', t)
  }

  render () {
    return (
      <>
        <div className={styles.loginContainer}>
          <div className={styles.loginConver}></div>
          <div className={styles.loginForm}>
            <Form className={styles.form}>
              <Form.Item key='1'>
                <DatePicker.RangePicker showTime/>
              </Form.Item>
              <Form.Item>
                <Button type='primary' onClick={this.click}>test</Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </>
    )
  }
}

export default withRouter(connect(({ login, loading }) => ({ login, loading: loading.models.login }))(Login))
