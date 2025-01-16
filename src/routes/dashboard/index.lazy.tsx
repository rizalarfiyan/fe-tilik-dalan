import { createLazyFileRoute } from '@tanstack/react-router'
import Page from './-component/page'
import MapsProvider from '@providers/maps-provider'

export const Route = createLazyFileRoute('/dashboard/')({
	component: () => {
		return (
			<MapsProvider>
				<Page />
			</MapsProvider>
		)
	},
})
