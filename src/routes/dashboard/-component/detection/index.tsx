import Typography from '@components/typography'
import { Button } from '@components/ui/button'
import { Card, CardContent, CardHeader } from '@components/ui/card'
import useDashboard from '@hooks/use-dashboard'
import useDetection from '@hooks/use-detection'
import useOnce from '@hooks/use-once'
import { Link } from '@tanstack/react-router'
import { Activity, Image, MapIcon } from 'lucide-react'
import * as  React from 'react'
import { useEffect } from 'react'
import LoadModel from './load-model'

function Woke() {
	const { model } = useDetection()
	const [info, setInfo] = React.useState<object | null>(null)

	useEffect(() => {
		console.log('MODEL: ', model)
		const loadInfo = async () => {
			if (!model) return
			const modelInfo = await model.info()
			setInfo(modelInfo)
		}

		loadInfo()
	}, [model])

	return (
		<div>
			<code>
				<pre>
					{JSON.stringify(info ?? [], null, 2)}
				</pre>
			</code>
		</div>
	)
}

let i = 0
function Detection() {
	const { active, setPage, setActive } = useDashboard()

	console.log('RENDER: ', i++)

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
				<CardHeader className="flex flex-row items-center justify-between space-y-0 border-b p-6">
					<div className="flex items-center gap-4">
						<Activity className="size-5 text-primary" />
						<Typography as="h3" variant="h4">
							{active?.title ?? 'Detect a image'}
						</Typography>
					</div>
				</CardHeader>
				<CardContent className="pt-6">
					<LoadModel>
						<Woke />
					</LoadModel>
				</CardContent>
			</Card>
		</div>
	)
}

export default Detection
