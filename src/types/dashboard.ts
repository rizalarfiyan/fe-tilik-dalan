import type React from 'react'
import type { CCTV } from './cctv'

export interface IDashboardContext {
	cctv: CCTV[]
	active: CCTV | null
	isLoading: boolean
	error?: string | null
	setActive: (cctv: CCTV | null) => void
	action: React.ReactNode | null
	setAction: (action: React.ReactNode | null) => void
}
