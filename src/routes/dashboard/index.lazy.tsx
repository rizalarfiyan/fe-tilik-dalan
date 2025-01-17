import { createLazyFileRoute } from '@tanstack/react-router'
import Maps from './-component/map'
import MapsProvider from '@providers/maps-provider'

export const Route = createLazyFileRoute('/dashboard/')({
	component: () => {
		return (
			<MapsProvider>
				<Maps />
			</MapsProvider>
		)
	},
})
