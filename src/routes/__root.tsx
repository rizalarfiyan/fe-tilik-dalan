import type { IRouterContext } from '@/types/app'
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import * as React from 'react'

const TanStackRouterDevtools =
	process.env.NODE_ENV === 'production'
		? () => null
		: React.lazy(() =>
				import('@tanstack/router-devtools').then((res) => ({
					default: res.TanStackRouterDevtools,
				})),
			)

export const Route = createRootRouteWithContext<IRouterContext>()({
	component: () => (
		<>
			<Outlet />
			<TanStackRouterDevtools position="top-right" />
		</>
	),
})
