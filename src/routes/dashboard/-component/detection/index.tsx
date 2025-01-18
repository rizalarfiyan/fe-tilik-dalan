import Typography from '@components/typography'
import { Button } from '@components/ui/button'
import { Card, CardContent, CardHeader } from '@components/ui/card'
import useDashboard from '@hooks/use-dashboard'
import useOnce from '@hooks/use-once'
import { Link } from '@tanstack/react-router'
import { Activity, Image, MapIcon } from 'lucide-react'
import type React from 'react'
import LoadModel from './load-model'
import ModelInformation from './model-information'
import DetectImage from './detect-image'

function Detection() {
	const { active, setPage, isDisable, setActive } = useDashboard()

	useOnce(() => {
		setPage({
			isLoading: false,
		})
	})

	const onDeactivate = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		setActive(null)
	}

	return (
		<div className="relative flex min-h-screen w-full items-center justify-center bg-slate-100">
			<div className="absolute top-4 left-4 flex gap-3">
				{!isDisable && (
					<Button variant="outline" asChild>
						<Link to="/dashboard">
							<MapIcon className="size-5" />
							{active ? 'Show in Map' : 'Show Maps'}
						</Link>
					</Button>
				)}
				{active && (
					<Button variant="outline" disabled={isDisable} onClick={onDeactivate}>
						<Image className="size-5" />
						Detect Image
					</Button>
				)}
			</div>
			<Card className="m-6 mt-20 w-full max-w-7xl">
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
					<LoadModel>
						{active ? <h2>From Video</h2> : <DetectImage />}
					</LoadModel>
				</CardContent>
			</Card>
		</div>
	)
}

export default Detection
