import { APIS } from '@/api/api.constant'
import { useRequest } from '@finalx/common'

export function useLogin() {
  return useRequest({
    url: APIS.LOGIN,
  })
}
