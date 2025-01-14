import * as React from 'react'
import { Link, Outlet, createRootRoute } from '@tanstack/react-router'

const TanStackRouterDevtools =
	process.env.NODE_ENV === 'production'
		? () => null
		: React.lazy(() =>
				import('@tanstack/router-devtools').then((res) => ({
					default: res.TanStackRouterDevtools,
				})),
			)

export const Route = createRootRoute({
	component: () => (
		<>
			<Outlet />
			<TanStackRouterDevtools />
		</>
	),
	notFoundComponent: () => (
		<div className='flex min-h-screen w-full items-center justify-center'>
			<div className='space-y-2 text-center'>
				<h1 className="font-semibold text-4xl">Page Not Found</h1>
				<Link to="/" className='block text-primary underline'>
					Back to Home
				</Link>
			</div>
		</div>
	),
})
