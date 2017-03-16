import React from 'react'
import reactCSS from 'reactcss'

export const Head = ({ title, body, right }) => {
  const styles = reactCSS({
    'default': {
      head: {
        paddingBottom: 30,
        paddingRight: 30,
        userSelect: 'none',
        cursor: 'default',
      },
      title: {
        fontSize: 24,
        color: '#666',
        paddingBottom: 10,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
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
      <div style={ styles.title }>
        { title }
        { right }
      </div>
      <div style={ styles.body }>{ body }</div>
    </div>
  )
}

export default Head
