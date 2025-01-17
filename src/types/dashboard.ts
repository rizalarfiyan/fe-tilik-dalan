import type { CCTV } from './cctv'
import type { IMapsMove } from './maps'

export interface ILoadPage {
	isLoading: boolean
	moveMap?: (move?: IMapsMove) => void
}

export interface IDashboardContext {
	cctv: CCTV[]
	active: CCTV | null
	isLoading: boolean
	error?: string | null
	setActive: (cctv: CCTV | null) => void
	page: ILoadPage
	setPage: (page: ILoadPage) => void
	isDisable: boolean
	setIsDisable: (isDisable: boolean) => void
}
