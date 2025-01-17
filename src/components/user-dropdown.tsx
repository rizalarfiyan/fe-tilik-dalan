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
import { Link } from '@tanstack/react-router'
import {
	ChartLine,
	ChevronsUpDown,
	Home,
	LayoutDashboard,
	LogOut,
} from 'lucide-react'
import UserInfo from './user-info'

function UserDropdown() {
	const { user } = useAuth()
	if (!user) return null

	return (
		<div>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<button
						type="button"
						className="flex w-full items-center justify-between gap-2 rounded-md border p-2 text-left"
					>
						<UserInfo {...user} />
						<ChevronsUpDown className="ml-auto size-4" />
					</button>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					className="min-w-64 rounded-lg"
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
						<Link to="/dashboard/analytic">
							<DropdownMenuItem className="cursor-pointer">
								<ChartLine />
								Analytics
							</DropdownMenuItem>
						</Link>
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<DropdownMenuItem>
						<LogOut />
						Log out
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	)
}

export default UserDropdown
