import api from '@/api/axios'

export const signinApi = async (data: { email: string; password: string }) => {
  const res = await api.post('/auth/signin', data)
  return res.data.user
}

export const logoutApi = async () => {
  await api.post('/auth/logout')
}

export const changePasswordApi = async (data: { current: string; new: string }) => {
  const res = await api.post('/auth/change-password', {
    currentPassword: data.current,
    newPassword: data.new,
  })
  return res.data
}
