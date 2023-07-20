import { apiServer } from '@finalx/common'
import { APIS } from '../api.constant'
import { LoginType } from './types'

export const login = (data: LoginType) => {
  return apiServer({
    data,
    url: APIS.LOGIN,
  })
}
