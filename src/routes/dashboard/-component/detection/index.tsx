import Typography from '@components/typography'
import { Button } from '@components/ui/button'
import { Card, CardContent, CardHeader } from '@components/ui/card'
import useDashboard from '@hooks/use-dashboard'
import useOnce from '@hooks/use-once'
import { Link } from '@tanstack/react-router'
import { Activity, Image, MapIcon } from 'lucide-react'
import * as React from 'react'
import LoadModel from './load-model'
import ModelInformation from './model-information'
import { aspectRatio } from '@lib/utils'

function Detection() {
	const { active, setPage, setActive } = useDashboard()

	useOnce(() => {
		setPage({
			isLoading: false,
		})
	})

	const ratio = React.useMemo(() => {
		const val = aspectRatio(active?.aspect)
		return `${val[0]} / ${val[1]}`
	}, [active])

	const onDeactivate = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		setActive(null)
	}

	return (
		<div className="relative flex min-h-screen w-full items-center justify-center bg-slate-100">
			<div className="absolute top-4 left-4 flex gap-3">
				<Button variant="outline" asChild>
					<Link to="/dashboard">
						<MapIcon className="size-5" />
						{active ? 'Show in Map' : 'Show Maps'}
					</Link>
				</Button>
				{active && (
					<Button variant="outline" onClick={onDeactivate}>
						<Image className="size-5" />
						Detect Image
					</Button>
				)}
			</div>
			<Card className="w-full max-w-4xl">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 border-b p-4">
					<div className="flex items-center gap-3">
						<Activity className="size-5 text-primary" />
						<Typography as="h3" variant="h4">
							{active?.title ?? 'Detect a image'}
						</Typography>
					</div>
					<ModelInformation />
				</CardHeader>
				<CardContent className="pt-6">
					<LoadModel aspectRatio={ratio}>
						<div
							style={{
								aspectRatio: ratio,
							}}
							className="flex items-center justify-center rounded-md border"
						>
							Model has been loaded!
						</div>
					</LoadModel>
				</CardContent>
			</Card>
		</div>
	)
}

export default Detection
