import Layout from '@components/dashboard/layout'
import DashboardProvider from '@providers/dashboard-provider'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { toast } from 'sonner'
import { z } from 'zod'

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
	component: () => {
		return (
			<DashboardProvider>
				<Layout>
					<Outlet />
				</Layout>
			</DashboardProvider>
		)
	},
	validateSearch: z.object({
		search: z.string().optional(),
		order: z.enum(['asc', 'desc']).optional(),
	}),
})
