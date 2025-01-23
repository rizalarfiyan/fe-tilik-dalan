import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@components/ui/dropdown-menu'
import useAuth from '@hooks/use-auth'
import { Link, useNavigate } from '@tanstack/react-router'
import {
	ChevronsUpDown,
	Home,
	LayoutDashboard,
	LogOut,
	ScanQrCode,
} from 'lucide-react'
import UserInfo from './user-info'
import useDashboard from '@hooks/use-dashboard'
import useConfirmation from '@hooks/use-confirmation'

function UserDropdown() {
	const { isDisable } = useDashboard()
	const { user, logout } = useAuth()
	const confirm = useConfirmation()
	const navigate = useNavigate()

	if (!user) return null

	const handleLogout = () => {
		confirm.create({
			title: 'Are you sure?',
			description: 'Make sure you want to logout from your account.',
			confirmText: 'Yes, Logout',
			onConfirm: async (loading, close) => {
				loading.open()
				await logout().finally(() => {
					navigate({
						to: '/login',
						replace: true,
					})
					close()
				})
			},
		})
	}

	return (
		<div>
			<DropdownMenu>
				<DropdownMenuTrigger disabled={isDisable} asChild>
					<button
						type="button"
						disabled={isDisable}
						className="flex w-full items-center justify-between gap-2 rounded-md border p-2 pr-4 text-left disabled:cursor-not-allowed disabled:opacity-70"
					>
						<UserInfo {...user} />
						<ChevronsUpDown className="ml-auto size-5" />
					</button>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					className="z-[99] min-w-64 rounded-lg"
					side="right"
					align="end"
					sideOffset={20}
				>
					<DropdownMenuLabel className="p-0 font-normal">
						<div className="flex items-center gap-2 p-1 text-left text-sm">
							<UserInfo {...user} />
						</div>
					</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuGroup>
						<Link to="/">
							<DropdownMenuItem className="cursor-pointer">
								<Home />
								Home
							</DropdownMenuItem>
						</Link>
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<DropdownMenuGroup>
						<Link to="/dashboard">
							<DropdownMenuItem className="cursor-pointer">
								<LayoutDashboard />
								Dashboard
							</DropdownMenuItem>
						</Link>
						<Link to="/dashboard/detection">
							<DropdownMenuItem className="cursor-pointer">
								<ScanQrCode />
								Detection
							</DropdownMenuItem>
						</Link>
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
						<LogOut />
						Log out
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	)
}

export default UserDropdown
