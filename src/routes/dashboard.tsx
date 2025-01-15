import { Outlet, redirect } from '@tanstack/react-router'
import { createFileRoute } from '@tanstack/react-router'
import { toast } from 'sonner'

export const Route = createFileRoute('/dashboard')({
	beforeLoad: ({ context, location }) => {
		if (!context.auth.isLoggedIn) {
			toast.error('You must be logged in to access this page.')
			throw redirect({
				to: '/login',
				replace: true,
				state: {
					redirectTo: location.href,
				},
			})
		}
	},
	component: () => <Outlet />,
})
