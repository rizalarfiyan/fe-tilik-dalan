import { useContext } from 'react'
import type { IDashboardContext } from '@/types/dashboard'
import { DashboardContext } from '@providers/dashboard-provider'

export const useDashboard = (): IDashboardContext => {
	const context = useContext(DashboardContext)
	if (!context) {
		throw new Error('useDashboard must be used within a DashboardProvider')
	}
	return context
}

export default useDashboard
