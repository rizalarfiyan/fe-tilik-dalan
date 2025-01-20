import type React from 'react'
import Sidebar from './sidebar'
import useDashboard from '@hooks/use-dashboard'
import { Indicator } from '@components/state-api'
import { Loader2 } from 'lucide-react'

const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
	const { page } = useDashboard()

	return (
		<div className="flex h-full min-h-screen w-full">
			<Sidebar />
			<div className="relative mt-[64px] ml-0 w-full xl:mt-0 xl:ml-96">
				{page.isLoading && (
					<Indicator
						className="absolute inset-0 z-50 h-full bg-slate-200/70"
						icon={Loader2}
						message="Loading..."
						iconClassName="animate-spin"
						textClassName="text-primary font-semibold"
					/>
				)}
				{children}
			</div>
		</div>
	)
}

export default Layout
