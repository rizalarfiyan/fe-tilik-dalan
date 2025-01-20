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
import { MapPin, Menu, Pin, X } from 'lucide-react'
import { DEFAULT_MAP } from '@constants'
import { cn } from '@lib/utils'

function Sidebar() {
	const { isLoading, error, active, page } = useDashboard()
	const [isOpen, setIsOpen] = React.useState<boolean>(false)

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

	const onChangeMenu = (e: React.MouseEvent<HTMLElement>) => {
		e.preventDefault()
		const newIsOpen = !isOpen
		document.body.style.overflow = newIsOpen ? 'hidden' : 'auto'
		setIsOpen(newIsOpen)
	}

	return (
		<>
			<header className="fixed top-0 z-[98] flex w-full items-center justify-center bg-background p-3 xl:hidden">
				<Button
					variant="outline"
					type="button"
					size="icon"
					onClick={onChangeMenu}
				>
					<Menu className="size-5" />
				</Button>
				<Link to="/" className="mx-auto inline-flex">
					<Logo
						svgClassName="size-8"
						typographyClassName="underline text-xl underline-offset-[3px] decoration-[3px] decoration-primary"
					/>
				</Link>
				<div />
			</header>
			<div
				onClick={onChangeMenu}
				className={cn(
					'invisible fixed inset-0 z-[99] bg-slate-800/80 opacity-0 transition-opacity duration-300 xl:hidden',
					isOpen && 'visible opacity-100',
				)}
			/>
			<div
				className={cn(
					'-left-96 fixed top-0 z-[99] flex h-full min-h-screen w-96 flex-col space-y-3 bg-background p-3 transition-all duration-300 ease-in-out xl:left-0',
					isOpen && 'left-0',
				)}
			>
				<Button
					variant="outline"
					type="button"
					size="icon"
					className="absolute top-2 right-2 size-8 xl:hidden"
					onClick={onChangeMenu}
				>
					<X className="size-5" />
				</Button>
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
							{active ? (
								<Pin className="size-5" />
							) : (
								<MapPin className="size-5" />
							)}
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
							className="h-[calc(100vh_-_220px)] py-3 pr-5"
						>
							<ListCCTV />
						</ScrollArea>
					</StateApi>
				</div>
				<UserDropdown />
			</div>
		</>
	)
}

export default Sidebar
