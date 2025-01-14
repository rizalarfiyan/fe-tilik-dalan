import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth')({
	beforeLoad: ({ context }) => {
		if (context.auth.isLoggedIn) {
			throw redirect({
				to: '/',
				replace: true,
			})
		}
	},
})
