import Typography from '@components/typography'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { Label } from '@components/ui/label'
import { RadioGroup, RadioGroupItem } from '@components/ui/radio-group'
import { ScrollArea } from '@components/ui/scroll-area'
import useMaps from '@hooks/use-maps'
import {
	ArrowDownNarrowWide,
	ArrowUpNarrowWide,
	MapPin,
	Pin,
	RotateCcw,
	Search,
} from 'lucide-react'
import * as React from 'react'

function ListCCTV() {
	const { cctv, active, setActive, movePosition } = useMaps()
	const [isDescending, setIsDescending] = React.useState(true)

	const onChangeSort = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		setIsDescending((prev) => !prev)
	}

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
							</Typography>
						</div>
					</Label>
				</div>
			)
		})
	}, [cctv])

	return (
		<div>
			<div className="flex gap-3 p-3">
				<Input
					className="w-full"
					icon={Search}
					iconProps={{
						behavior: 'prepend',
					}}
					placeholder="Search..."
				/>
				<Button
					variant="outline"
					type="button"
					size="icon"
					className="flex-shrink-0"
					onClick={onChangeSort}
				>
					{isDescending ? <ArrowUpNarrowWide /> : <ArrowDownNarrowWide />}
				</Button>
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
			<ScrollArea type="always" className="h-[calc(100vh_-_0px)] p-3 pr-5">
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
