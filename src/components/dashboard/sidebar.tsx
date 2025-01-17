import Logo from '@components/logo'
import Search from './search'
import Order from './order'
import useDashboard from '@hooks/use-dashboard'
import UserDropdown from '@components/user-dropdown'
import { ScrollArea } from '@components/ui/scroll-area'
import StateApi from '@components/state-api'
import ListCCTV from './list-cctv'
import { Link } from '@tanstack/react-router'
import * as React from 'react'
import { Button } from '@components/ui/button'
import { MapPin, Pin } from 'lucide-react'
import { DEFAULT_MAP } from '@constants'

function Sidebar() {
	const { isLoading, error, active, page } = useDashboard()

	const onReset = React.useCallback(
		(e: React.MouseEvent<HTMLButtonElement>) => {
			e.preventDefault()
			if (active) {
				page.moveMap?.({
					...active,
				})
				return
			}

			page.moveMap?.(DEFAULT_MAP)
		},
		[page, active],
	)

	return (
		<div className="flex w-full max-w-sm flex-col space-y-3 p-3">
			<Link to="/" className="mx-auto inline-flex">
				<Logo typographyClassName="underline underline-offset-[3px] decoration-[3px] decoration-primary" />
			</Link>
			<div className="flex gap-3">
				<Search />
				<Order />
				{page?.moveMap && (
					<Button
						variant="outline"
						type="button"
						size="icon"
						className="flex-shrink-0"
						onClick={onReset}
					>
						{active ? <Pin /> : <MapPin />}
					</Button>
				)}
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
