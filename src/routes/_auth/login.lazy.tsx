import { API_BASE_URL } from '@constants'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_auth/login')({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div className="flex min-h-screen w-full items-center justify-center">
			<div className="space-y-2 text-center">
				<h1 className="font-semibold text-4xl">Login Page</h1>
				<a
					href={`${API_BASE_URL}/auth/google`}
					className="block text-primary underline"
				>
					Login with Google
				</a>
			</div>
		</div>
	)
}
