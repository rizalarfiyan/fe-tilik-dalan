import type { CCTV } from '@/types/cctv'
import Typography from '@components/typography'
import { Button } from '@components/ui/button'
import { Label } from '@components/ui/label'
import { RadioGroup, RadioGroupItem } from '@components/ui/radio-group'
import { ScrollArea } from '@components/ui/scroll-area'
import useMaps from '@hooks/use-maps'
import Fuse from 'fuse.js'
import { MapPin, Pin } from 'lucide-react'
import * as React from 'react'
import { Route } from '../index'
import Order from './order'
import Search from './search'

function ListCCTV() {
	const params = Route.useSearch()
	const { cctv, active, setActive, movePosition } = useMaps()

	const fuse = React.useMemo(
		() =>
			new Fuse(cctv, {
				keys: ['title'],
				includeMatches: true,
				threshold: 0.5,
			}),
		[cctv],
	)

	const results = React.useMemo((): CCTV[] => {
		const { search, order } = params
		const searching = () => {
			if (!search) return [...cctv]
			return fuse.search(search).map((val) => val.item)
		}

		const val = searching()
		return order === 'desc' ? val.reverse() : val
	}, [params, cctv, fuse])

	const onReset = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		movePosition()
	}

	const onValueChange = React.useCallback(
		(value: string) => {
			const current = cctv.find((val) => val.id === value)
			if (!current) return
			setActive(current)
		},
		[cctv, setActive],
	)

	const lists = React.useMemo(() => {
		return results.map((val) => {
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
							</Typography>
						</div>
					</Label>
				</div>
			)
		})
	}, [results])

	return (
		<div>
			<div className="flex gap-3 p-3 pb-0">
				<Search />
				<Order />
				<Button
					variant="outline"
					type="button"
					size="icon"
					className="flex-shrink-0"
					onClick={onReset}
				>
					{active ? <Pin /> : <MapPin />}
				</Button>
			</div>
			<ScrollArea type="always" className="h-[calc(100vh_-_55px)] p-3 pr-5">
				<RadioGroup
					className="relative"
					onValueChange={onValueChange}
					value={active?.id ?? ''}
				>
					{lists}
				</RadioGroup>
			</ScrollArea>
		</div>
	)
}

export default ListCCTV
