import { createLazyFileRoute, Link } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/')({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div className="flex min-h-screen w-full items-center justify-center">
			<div className="space-y-2 text-center">
				<h1 className="font-semibold text-4xl">Home Page</h1>
				<Link to="/login" className="block text-primary underline">
					Login
				</Link>
			</div>
		</div>
	)
}
