import RecoilNexus from 'recoil-nexus'
import { FC, useEffect, useState } from 'react'
import { login as miniProgramLogin, getAccountInfoSync } from '@tarojs/taro'
import {
  globalConfig,
  setItem,
  // useEventListener,
  useSystemInfo,
  toast,
  getUserAuth,
  log,
} from '@finalx/common'
import { userAuth } from '@finalx/middleware'
import { RecoilRoot } from 'recoil'
import config from '../global.config'
import './app.scss'
import { login } from './api/user'
import { LocalStorageKeys } from './common/enums'

// 采用shadow中的全局配置
const { useInitToken } = globalConfig({
  log: true,
  request: {
    baseUrl: config.request.baseUrl || API_LINK,
    // wsUrl: config.request.wsUrl || WS_LINK,
  },
  middleware: {
    userAuth: {
      filterKey: {
        phone: 'mobilePhone1111',
        info: 'name',
      },
    },
  },
})

export default function App(props: any) {
  const [info, setInfo] = useState<null | any>(null)

  console.log(getUserAuth(), '鉴权弹窗状态')

  useEffect(() => {
    // 中间件 - 必须在globalConfig初始化后
    userAuth.checkUserAuth(
      () => {
        log.success('鉴权成功')
      },
      () => {
        log.error('鉴权失败')
      },
    )
  }, [])

  useEffect(() => {
    ;(async function () {
      try {
        const res = await miniProgramLogin()
        if (!res.code) throw new Error()

        const { miniProgram } = getAccountInfoSync()
        const { appId } = miniProgram || {}

        const resp = await login({ appId, code: res.code })

        const { data: loginData } = resp || ({} as any)
        const { data: userInfo } = loginData || ({} as any)
        setInfo(loginData)
        setItem(LocalStorageKeys.userInfo, {
          mobilePhone: '11231332',
        })
      } catch (e) {
        toast('登录失败，请重试')
      }
    })()
  }, [])

  return (
    <RecoilRoot>
      <RecoilNexus />
      <Init info={info} />
      {props.children}
    </RecoilRoot>
  )
}

const Init: FC<{ info: { data: any; token: string } }> = ({ info }) => {
  useSystemInfo()
  const setToken = useInitToken()
  useEffect(() => {
    if (!info) return
    const { data, token } = info || {}
    setToken(token)
  }, [info])

  return null
}
