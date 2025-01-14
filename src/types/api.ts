import type { AxiosResponse } from 'axios'

// biome-ignore lint/suspicious/noExplicitAny: This is a generic type
export type BaseResponse<V = any> = {
	message: string
	data: V
}

// biome-ignore lint/suspicious/noExplicitAny: This is a generic type
export type AxiosBaseResponse<T = any> = AxiosResponse<BaseResponse<T>>
