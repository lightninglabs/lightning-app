import React from 'react'
import reactCSS from 'reactcss'

export const Prompt = ({ title, prompt, acceptLabel, cancelLabel, onAccept,
  onCancel }) => {
  const styles = reactCSS({
    default: {
      prompt: {
        background: '#fff',
        borderRadius: 2,
        width: 400,
        padding: 20,
        fontSize: 16,
        lineHeight: '22px',
        color: '#666',
      },
      promptTitle: {
        fontSize: 24,
        marginBottom: 15,
        color: '#333',
      },
      promptActions: {
        marginTop: 15,
        display: 'flex',
        justifyContent: 'flex-end',
      },
      button: {
        height: 44,
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 3,
        cursor: 'pointer',
        textTransform: 'uppercase',
      },
      accept: {
        background: '#DA7783',
        marginRight: 15,
        color: '#fff',
      },
      cancel: {
        background: '#eee',
        color: '#666',
      },
    },
  })

  return (
    <div style={ styles.prompt }>
      { title ? <div style={ styles.promptTitle }>{ title }</div> : null }
      { prompt }
      <div style={ styles.promptActions }>
        <div
          style={{ ...styles.button, ...styles.accept }}
          onClick={ onAccept }
        >
          { acceptLabel }
        </div>
        <div
          style={{ ...styles.button, ...styles.cancel }}
          onClick={ onCancel }
        >
          { cancelLabel }
        </div>
      </div>
    </div>
  )
}
