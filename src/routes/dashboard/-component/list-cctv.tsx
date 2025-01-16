import Typography from '@components/typography'
import { Label } from '@components/ui/label'
import { RadioGroup, RadioGroupItem } from '@components/ui/radio-group'
import { ScrollArea } from '@components/ui/scroll-area'
import useMaps from '@hooks/use-maps'
import * as React from 'react'

const ListCCTV: React.FC = () => {
	const { cctv, active, setActive } = useMaps()

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
			<div>Search</div>
			<ScrollArea type="always" className="h-screen p-3 pr-5">
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
