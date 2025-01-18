import type { MODEL_CLASS } from '@constants'

export interface IModelClasses<T extends string = string> {
	label: T
	color: string
	foreground: string
}

export type IModelClass = (typeof MODEL_CLASS)[keyof typeof MODEL_CLASS]
