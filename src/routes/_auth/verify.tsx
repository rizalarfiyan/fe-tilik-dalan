import { SearchParamError } from '@tanstack/react-router'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { z } from 'zod'

export const Route = createFileRoute('/_auth/verify')({
	validateSearch: z.object({
		token: z.string().refine(
			(val) => {
				try {
					const token = JSON.parse(atob(val))
					return token && typeof token === 'object' && 'message' in token
				} catch {
					return false
				}
			},
			{
				message: 'Invalid token',
			},
		),
	}),
	onError(err) {
		if (err instanceof SearchParamError) {
			// TODO: Show error message with toast
			throw redirect({
				to: '/login',
				replace: true,
			})
		}
	},
})
