import React from 'react'
import reactCSS from 'reactcss'

export const Head = ({ title, body }) => {
  const styles = reactCSS({
    'default': {
      head: {
        paddingBottom: 30,
        paddingRight: 30,
      },
      title: {
        fontSize: 24,
        color: '#666',
        paddingBottom: 10,
      },
      body: {
        fontSize: 16,
        lineHeight: '21px',
        color: '#999',
      },
    },
  })

  return (
    <div style={ styles.head }>
      <div style={ styles.title }>{ title }</div>
      <div style={ styles.body }>{ body }</div>
    </div>
  )
}

export default Head
