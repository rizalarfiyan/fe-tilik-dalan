export interface IAuthUser {
	id: string
	email: string
	name: string
}

export type IAuth = {
	user: IAuthUser
	access_token: string
}

export interface IAuthContext {
	user?: IAuthUser
	isLoggedIn: boolean
	login: (user: IAuth) => Promise<void>
	logout: () => Promise<void>
}
