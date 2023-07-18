import { View } from '@tarojs/components'
import React, { FC, ReactElement } from 'react'
import './index.scss'

export const CircleLoading: FC<{ children?: ReactElement | string }> = ({ children }) => {
  return (
    <View className='sd_circle-loading'>
      <View className='sd_circle-loading-content'>
        <View className='sd_circle-loading-content-line-1' />
        <View className='sd_circle-loading-content-line-2' />
        <View className='sd_circle-loading-content-line-3' />
        <View className='sd_circle-loading-content-text'>{children}</View>
      </View>
    </View>
  )
}
