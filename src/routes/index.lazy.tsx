import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/')({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div className='flex min-h-screen w-full items-center justify-center'>
			<h1 className="font-semibold text-4xl">Home Page</h1>
		</div>
	)
}
