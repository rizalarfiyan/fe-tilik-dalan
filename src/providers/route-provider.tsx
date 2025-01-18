import { routeTree } from '@/routeTree.gen'
import LoadingScreen from '@components/loading-screen'
import NotFound from '@components/not-found'
import useAuth from '@hooks/use-auth'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { PanelsTopLeft, Route } from 'lucide-react'
import * as React from 'react'

const router = createRouter({
	routeTree,
	context: {
		auth: undefined!,
	},
	defaultPreload: 'intent',
	defaultPreloadStaleTime: 0,
	defaultPendingMinMs: 0,
	defaultPendingComponent: () => (
		<LoadingScreen icon={PanelsTopLeft} reason="Initializing page..." />
	),
	defaultNotFoundComponent: NotFound,
	notFoundMode: 'root',
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
	const auth = useAuth()
	return (
		<React.Suspense
			fallback={<LoadingScreen icon={Route} reason="Initializing route..." />}
		>
			<RouterProvider router={router} context={{ auth }} />
		</React.Suspense>
	)
}

export default RouteProvider
