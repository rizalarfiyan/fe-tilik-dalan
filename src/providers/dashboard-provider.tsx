import type { BaseResponse } from '@/types/api'
import type { CCTV } from '@/types/cctv'
import type { IDashboardContext } from '@/types/dashboard'
import useAxios from '@hooks/use-axios'
import * as React from 'react'

export const DashboardContext = React.createContext<IDashboardContext | null>(
	null,
)

const DashboardProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
	const api = useAxios<BaseResponse<IDashboardContext['cctv']>>('/cctv')
	const [active, setActive] = React.useState<CCTV | null>(null)
	const [action, setAction] = React.useState<React.ReactNode | null>(null)

	const value = React.useMemo((): IDashboardContext => {
		const { res, ...rest } = api
		return {
			active,
			action,
			setActive,
			setAction,
			cctv: res?.data ?? [],
			...rest,
		}
	}, [active, api, action])

	return (
		<DashboardContext.Provider value={value}>
			{children}
		</DashboardContext.Provider>
	)
}

export default DashboardProvider
