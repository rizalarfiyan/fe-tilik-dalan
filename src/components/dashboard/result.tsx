import type { CCTV } from '@/types/cctv'
import Typography from '@components/typography'
import { Label } from '@components/ui/label'
import { RadioGroupItem } from '@components/ui/radio-group'
import * as React from 'react'

interface ResultProps {
	results: CCTV[]
}

const Result: React.FC<ResultProps> = ({ results }) => {
	return results.map((val) => {
		return (
			<div key={val.id}>
				<RadioGroupItem value={val.id} id={val.id} className="peer sr-only" />
				<Label
					htmlFor={val.id}
					className="flex w-full cursor-pointer items-center justify-between gap-3 overflow-hidden rounded-md border-2 border-muted bg-popover p-2 transition-colors duration-300 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
				>
					<div className="aspect-video h-14 w-auto overflow-hidden rounded-md border border-border bg-slate-200">
						<img
							src={val.image.thumb}
							className="h-full w-full object-cover"
							alt={val.title}
						/>
					</div>
					<div className="flex-1">
						<Typography
							as="h3"
							variant="large"
							className="line-clamp-2 text-base leading-tight"
						>
							{val.title}
						</Typography>
					</div>
				</Label>
			</div>
		)
	})
}

export default React.memo(Result)
