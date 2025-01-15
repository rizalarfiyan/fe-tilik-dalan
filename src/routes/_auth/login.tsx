import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

export const Route = createFileRoute('/_auth/login')({
	validateSearch: z.object({
		token: z
			.string()
			.optional()
			.refine(
				(val) => {
					if (!val) return true
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
})
