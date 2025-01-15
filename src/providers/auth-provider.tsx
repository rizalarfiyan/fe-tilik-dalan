import * as React from 'react'
import type { IAuthContext, IAuthUser } from '@/types/auth'
import type { BaseResponse } from '@/types/api'
import { KEY_ACCESS_TOKEN } from '@constants'
import axios from '@lib/axios'
import LoadingScreen from '@components/loading-screen'

export const AuthContext = React.createContext<IAuthContext | null>(null)

const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
	const isActiveUser = !!localStorage.getItem(KEY_ACCESS_TOKEN)
	const [isLoading, setIsLoading] = React.useState<boolean>(isActiveUser)
	const [user, setUser] = React.useState<IAuthUser>()

	const internalLogout = () => {
		setUser(undefined)
		localStorage.removeItem(KEY_ACCESS_TOKEN)
	}

	const fetchMe = async () => {
		await axios
			.get<BaseResponse<IAuthUser>>('/auth/me')
			.then((res) => {
				setUser(res.data.data)
			})
			.catch(() => {
				// TODO: add toast notification session expired
				internalLogout()
				const timeout = setTimeout(() => {
					window.location.href = '/login'
					clearTimeout(timeout)
				}, 1500)
			})
			.finally(() => setIsLoading(false))
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: This effect should only run once
	React.useEffect(() => {
		if (!isActiveUser) return
		fetchMe()
	}, [])

	// biome-ignore lint/correctness/useExhaustiveDependencies: disable internalLogout from dependencies
	const value = React.useMemo((): IAuthContext => {
		return {
			user,
			isLoggedIn: !!user,
			login: (token: string) => {
				return new Promise<void>((resolve, reject) => {
					localStorage.setItem(KEY_ACCESS_TOKEN, token)
					fetchMe()
						.then(() => {
							resolve()
						})
						.catch((err) => {
							reject(err)
						})
				})
			},
			logout: () => {
				return new Promise<void>((resolve) => {
					return axios
						.post('/logout', null, {
							withCredentials: true,
						})
						.finally(() => {
							internalLogout()
							const timeout = setTimeout(() => {
								clearTimeout(timeout)
								resolve()
							}, 10)
						})
				})
			},
		}
	}, [user])

	if (isLoading) {
		return <LoadingScreen reason="Fetching user info..." />
	}

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
