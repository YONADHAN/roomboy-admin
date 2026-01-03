import { useMutation } from '@tanstack/react-query'
import { signinApi, logoutApi } from '@/services/auth.service'
import { useDispatch } from 'react-redux'
import { setUser, clearUser } from '@/store/auth.slice'
import toast from 'react-hot-toast'
import { AxiosError } from 'axios'

export const useLogout = () => {
  const dispatch = useDispatch()

  return useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      dispatch(clearUser())
      // navigate('/signin') // PrivateRoute will handle redirect, but explicit is fine too
    },
    onError: (error) => {
      console.error('Logout failed', error)
      // Force logout on client side even if server fails
      dispatch(clearUser())
    }
  })
}

export const useSignin = () => {
  const dispatch = useDispatch()

  return useMutation({
    mutationFn: signinApi,
    onSuccess: (user) => {
      dispatch(setUser(user))
      toast.success('Signed in successfully')
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        toast.error(
          error?.response?.data?.message || 'Invalid email or password'
        )
      }
    },
  })
}
