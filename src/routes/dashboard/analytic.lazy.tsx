import useDashboard from '@hooks/use-dashboard'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/dashboard/analytic')({
	component: RouteComponent,
})

function RouteComponent() {
	const { active } = useDashboard()

	return (
		<div>
			<code>
				<pre>{JSON.stringify(active, null, 2)}</pre>
			</code>
		</div>
	)
}
