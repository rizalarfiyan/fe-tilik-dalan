import type { AUTH_ROLE } from '@constants'

export interface IAuthUser {
	id: string
	email: string
	name: string
	role: IAuthRole
	avatar: string
}

export type IAuth = {
	user: IAuthUser
	access_token: string
}

export type IAuthRole = (typeof AUTH_ROLE)[keyof typeof AUTH_ROLE]

export interface IAuthContext {
	user?: IAuthUser
	isLoggedIn: boolean
	login: (token: string) => Promise<void>
	logout: () => Promise<void>
}
