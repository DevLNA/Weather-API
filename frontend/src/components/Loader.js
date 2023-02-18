import React from 'react'
import { Spinner } from 'react-bootstrap'

export const Loader = () => {
  return (
    <Spinner
        animation='border'
        role='status'
        style={{
            height: '150px',
            width: '150px',
            margin: 'auto',
            display: 'block'
        }}
        variant="primary"
    >
    </Spinner>
  )
}
