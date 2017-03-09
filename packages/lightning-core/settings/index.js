import React from 'react'
import reactCSS from 'reactcss'

export const SettingsPage = () => {
  const styles = reactCSS({
    defaut: {
      page: {

      },
    },
  })

  return (
    <div style={ styles.page }>
      SettingsPage
    </div>
  )
}

export default SettingsPage
