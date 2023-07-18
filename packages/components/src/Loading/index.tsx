import React from 'react'
import { FC, ReactElement } from 'react'
import { LineLoading } from './Line'
import { CircleLoading } from './Circle'

interface LoadingProps {
  circle?: boolean
  children?: ReactElement | string
}
export const Loading: FC<LoadingProps> = ({ circle, children }) => {
  return circle ? <CircleLoading>{children}</CircleLoading> : <LineLoading />
}
