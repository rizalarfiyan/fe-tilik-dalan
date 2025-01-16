import type { CCTV } from '@/types/cctv'
import Typography from '@components/typography'
import { Label } from '@components/ui/label'
import { RadioGroup, RadioGroupItem } from '@components/ui/radio-group'
import { ScrollArea } from '@components/ui/scroll-area'
import * as React from 'react'
import type { MapRef } from 'react-map-gl'

interface ListCCTVProps {
	cctv: CCTV[]
	mapRef: React.RefObject<MapRef | null>
}

const ListCCTV: React.FC<ListCCTVProps> = ({ cctv, mapRef }) => {
	const onValueChange = React.useCallback(
		(value: string) => {
			const current = cctv.find((val) => val.id === value)
			if (!current) return

			const { id, longitude, latitude } = current
			const activeMarker = document.querySelectorAll('svg[data-active="true"]')
			for (const marker of activeMarker) {
				marker.setAttribute('data-active', 'false')
			}

			const marker = document.querySelector(`svg[data-marker-id="${id}"]`)
			marker?.setAttribute('data-active', 'true')

			mapRef.current?.flyTo({
				center: [longitude, latitude],
				zoom: 17,
				duration: 2000,
			})
		},
		[cctv],
	)

	const lists = React.useMemo(() => {
		return cctv.map((val) => {
			return (
				<div key={val.id}>
					<RadioGroupItem value={val.id} id={val.id} className="peer sr-only" />
					<Label
						htmlFor={val.id}
						className="flex w-full cursor-pointer items-center justify-between gap-4 overflow-hidden rounded-md border-2 border-muted bg-popover p-2 transition-colors duration-300 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
					>
						<div className="aspect-video h-14 w-auto overflow-hidden rounded-md border border-border bg-slate-200">
							<img
								src={val.image.thumb}
								className="h-full w-full object-cover"
								alt={val.title}
							/>
						</div>
						<div className="flex-1">
							<Typography as="h3" className="line-clamp-2 leading-tight">
								{val.title}
							</Typography>{' '}
						</div>
					</Label>
				</div>
			)
		})
	}, [cctv])

	return (
		<div>
			<ScrollArea className="h-screen p-3 pr-5">
				<RadioGroup className="relative" onValueChange={onValueChange}>
					{lists}
				</RadioGroup>
			</ScrollArea>
		</div>
	)
}

export default ListCCTV
