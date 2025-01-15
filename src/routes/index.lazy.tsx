import { Button } from '@components/ui/button'
import useAuth from '@hooks/useAuth'
import { createLazyFileRoute, Link } from '@tanstack/react-router'
import { useMemo } from 'react'

export const Route = createLazyFileRoute('/')({
	component: RouteComponent,
})

function RouteComponent() {
	const auth = useAuth()

	const link = useMemo(() => {
		if (auth.user) {
			return {
				to: '/dashboard',
				text: 'Dashboard',
			}
		}
		return {
			to: '/login',
			text: 'Login',
		}
	}, [auth.user])

	return (
		<div className="flex min-h-screen w-full items-center justify-center">
			<div className="space-y-4 text-center">
				<h1 className="font-semibold text-4xl">Home Page</h1>
				<Button asChild>
					<Link to={link.to}>{link.text}</Link>
				</Button>
			</div>
		</div>
	)
}
