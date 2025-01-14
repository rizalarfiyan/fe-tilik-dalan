import { useContext } from 'react'
import type { IAuthContext } from '@/types/auth'
import { AuthContext } from '@providers/auth-provider'

export const useAuth = (): IAuthContext => {
	const context = useContext(AuthContext)
	if (!context) {
		throw new Error('useAuth must be used within a AuthProvider')
	}
	return context
}

export default useAuth
