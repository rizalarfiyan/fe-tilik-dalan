import useDashboard from '@hooks/use-dashboard'
import useOnce from '@hooks/use-once'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/dashboard/analytic')({
	component: RouteComponent,
})

function RouteComponent() {
	const { active, setPage } = useDashboard()

	useOnce(() => {
		setPage({
			isLoading: false,
		})
	})

	return (
		<div>
			<code>
				<pre>{JSON.stringify(active, null, 2)}</pre>
			</code>
		</div>
	)
}
