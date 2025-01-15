import useAuth from '@hooks/useAuth'
import { createLazyFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createLazyFileRoute('/_auth/verify')({
	component: RouteComponent,
})

interface IAuthToken {
	message: string
	token?: string
}

const parseToken = (val: string): IAuthToken => {
	try {
		return JSON.parse(atob(val))
	} catch {
		return { message: 'Invalid token' }
	}
}

function RouteComponent() {
	const auth = useAuth()
	const data = Route.useSearch()
	const token = parseToken(data.token)

	// biome-ignore lint/correctness/useExhaustiveDependencies: Only first render
	useEffect(() => {
		if (token.token) {
			auth
				.login(token.token)
				.then(() => {
					// TODO: redirect to dashboard
					console.log('Logged in')
				})
				.catch(() => {
					console.error('Failed to login')
				})
			return
		}

		// TODO: show toast based on message
	}, [])

	return (
		<div>
			<code>
				<pre>{JSON.stringify(token, null, 2)}</pre>
			</code>
			<hr />
			<hr />
			<code>
				<pre>{JSON.stringify(auth.user, null, 2)}</pre>
			</code>
		</div>
	)
}
