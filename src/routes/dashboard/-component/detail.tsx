import { Button } from '@components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card'
import useMaps from '@hooks/use-maps'
import { X } from 'lucide-react'
import type * as React from 'react'

function Detail() {
	const { active, deactivate } = useMaps()

	const onDeactivate = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		deactivate()
	}

	if (!active) return null
	const { title } = active

	return (
		<Card className="absolute top-4 left-4 z-10 w-full max-w-xl">
			<div className="flex flex-row justify-between gap-4">
				<CardHeader>
					<CardTitle>{title}</CardTitle>
				</CardHeader>
				<Button
					variant="outline"
					type="button"
					size="icon"
					className="m-4 flex-shrink-0"
					onClick={onDeactivate}
				>
					<X />
				</Button>
			</div>
			<CardContent>
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus,
				facilis!
			</CardContent>
		</Card>
	)
}

export default Detail
