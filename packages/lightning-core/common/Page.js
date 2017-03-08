import React from 'react'

export const Page = ({ children }) =>
  <div style={{ padding: 30, display: 'flex', flexDirection: 'column', flex: 1 }}>
    { children }
  </div>

export default Page
