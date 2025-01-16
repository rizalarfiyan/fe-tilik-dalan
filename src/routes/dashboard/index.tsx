import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

export const Route = createFileRoute('/dashboard/')({
	validateSearch: z.object({
		search: z.string().optional(),
		order: z.enum(['asc', 'desc']).optional(),
	}),
})
