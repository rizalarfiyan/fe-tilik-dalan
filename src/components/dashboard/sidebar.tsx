import Logo from '@components/logo'
import Search from './search'
import Order from './order'
import useDashboard from '@hooks/use-dashboard'
import UserDropdown from '@components/user-dropdown'
import { ScrollArea } from '@components/ui/scroll-area'
import StateApi from '@components/state-api'
import ListCCTV from './list-cctv'

function Sidebar() {
	const { action, isLoading, error } = useDashboard()

	return (
		<div className="w-full max-w-sm space-y-3 p-3">
			<Logo />
			<div className="flex gap-3">
				<Search />
				<Order />
				{action}
			</div>
			<div className="rounded-md border pr-0 pl-3">
				<StateApi
					className="h-[calc(100vh_-_200px)]"
					wrapClassName="max-w-52"
					{...{ isLoading, error }}
				>
					<ScrollArea
						type="always"
						className="h-[calc(100vh_-_200px)] py-3 pr-5"
					>
						<ListCCTV />
					</ScrollArea>
				</StateApi>
			</div>
			<UserDropdown />
		</div>
	)
}

export default Sidebar
