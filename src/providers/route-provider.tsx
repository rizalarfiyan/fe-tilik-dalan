import type React from 'react'
import { Suspense } from 'react'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from '../routeTree.gen'

const router = createRouter({
	routeTree,
	context: {
		auth: undefined!,
	},
	defaultPreload: 'intent',
	defaultPreloadStaleTime: 0,
	defaultPendingMinMs: 0,
	defaultPendingComponent: () => <h1>Collecting data...</h1>,
})

declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router
	}

	interface HistoryState {
		redirectTo?: string
	}
}

const RouteProvider: React.FC<React.PropsWithChildren> = () => {
	return (
		<Suspense fallback={<h1>Initializing router...</h1>}>
			<RouterProvider router={router} />
		</Suspense>
	)
}

export default RouteProvider
