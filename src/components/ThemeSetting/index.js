import React from 'react'
import { Drawer, Icon } from 'antd'
import styles from './index.less'

const themes = ['normal', 'blue', 'pink']

export default (props) => {
  const { visible, onClose, onSwitch, theme } = props
  return (
    <Drawer
      title='整体风格设置'
      visible={visible}
      width='270'
      onClose={() => onClose(false)}
      className={styles.themeContainer}
    >
      <div className={styles.themes}>
        {
          themes.map(n => (
            <div key={n} className={styles[n]} onClick={() => onSwitch(n)}>
              {
                theme === n && <Icon type='check' className={styles.selected} />
              }
            </div>
          ))
        }
      </div>
    </Drawer>
  )
}
