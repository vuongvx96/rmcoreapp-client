import React, { lazy } from 'react'
import { BarLoader, ClipLoader } from 'react-spinners'

const Loading = () => {
  return (
    <BarLoader
      widthUnit='%'
      heightUnit='px'
      loading={true}
      width={100}
      height={3}
      color='#1abc9c'
    />
  )
}

const LoadingOnSite = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: 'calc(100vh - 24px - 64px)'
    }}>
      <ClipLoader
        sizeUnit='px'
        loading={true}
        size={35}
        color='#1abc9c'
      />
    </div>
  )
}

const WrapLazy = (importComponent, delay) => lazy(() => new Promise(resolve => {
  setTimeout(() => resolve(importComponent), delay)
}))

export { Loading, LoadingOnSite, WrapLazy }