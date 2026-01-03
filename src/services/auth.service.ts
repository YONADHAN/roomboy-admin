import api from '@/api/axios'

export const signinApi = async (data: { email: string; password: string }) => {
  const res = await api.post('/auth/signin', data)
  return res.data.user
}

export const logoutApi = async () => {
  await api.post('/auth/logout')
}
