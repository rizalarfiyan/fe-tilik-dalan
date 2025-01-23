import React from 'react'
import { Camera, Video, MapIcon, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Typography from '@components/typography'
import { MODEL_CLASSES } from '@constants'
import { shuffleArray } from '@lib/utils'
import { Link } from '@tanstack/react-router'
import useAuth from '@hooks/use-auth'

const MAX_SHOW_CLASSES = 4
const FEATURES = [
	{
		id: 1,
		icon: Camera,
		text: 'Image Detection',
	},
	{
		id: 2,
		icon: Video,
		text: 'Video Detection',
	},
	{
		id: 3,
		icon: MapIcon,
		text: 'CCTV Mapping',
	},
	{
		id: 4,
		icon: Settings,
		text: 'Image Config',
	},
]

const HeroSection = () => {
	const auth = useAuth()
	const link = React.useMemo(() => {
		if (auth.user) {
			return {
				to: '/dashboard',
				text: 'Getting Started',
			}
		}
		return {
			to: '/login',
			text: 'Explore Now',
		}
	}, [auth.user])

	return (
		<div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden">
			<div className="pointer-events-none absolute inset-0">
				<div className="-translate-x-1/2 -translate-y-1/2 absolute top-0 left-0 size-96 rounded-full bg-primary/20 blur-3xl" />
				<div className="absolute right-0 bottom-0 size-96 translate-x-1/2 translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
			</div>

			<div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
				<div className="grid items-center gap-12 lg:grid-cols-2">
					<div className="space-y-8">
						<div className="space-y-4">
							<Badge>Powered by TensorFlow.js</Badge>
							<Typography variant="h1" as="h1">
								Traffic Object Detection with{' '}
								<span className="text-primary">Tilik Jalan</span>
							</Typography>
							<Typography variant="muted" as="p">
								Smart image and video detection platform using deep learning
								technology to monitor and analyze traffic in real-time.
							</Typography>
						</div>

						<div className="flex max-w-lg flex-wrap gap-3">
							{FEATURES.map(({ id, icon: Icon, text }) => (
								<div
									key={id}
									className="flex items-center gap-2 rounded-lg bg-slate-50 px-4 py-2"
								>
									<Icon className="size-6" />
									<span className="text-slate-700">{text}</span>
								</div>
							))}
						</div>

						<div className="flex gap-4">
							<Button size="lg" className="font-bold" asChild>
								<Link to={link.to}>{link.text}</Link>
							</Button>
						</div>
					</div>

					<div className="relative">
						<div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xl">
							<div className="relative mb-4 aspect-video overflow-hidden rounded-lg bg-slate-100">
								{/* TODO: Change image */}
							</div>

							<div className="grid grid-cols-2 items-center gap-4">
								<div className="space-y-2">
									<div className="font-medium text-slate-700 text-sm">
										Model Classes
									</div>
									<div className="flex flex-wrap gap-2">
										{shuffleArray(MODEL_CLASSES)
											.slice(0, MAX_SHOW_CLASSES)
											.map(({ label }) => (
												<Badge
													key={label}
													className="bg-slate-100 text-slate-700 hover:bg-slate-100"
												>
													{label}
												</Badge>
											))}
										<Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100">
											+{MODEL_CLASSES.length - MAX_SHOW_CLASSES} more
										</Badge>
									</div>
								</div>
								<div className="space-y-2">
									<div className="font-medium text-slate-700 text-sm">
										Confidence
									</div>
									<div className="h-2 overflow-hidden rounded-full bg-slate-100">
										<div className="h-full w-[83%] bg-red-500" />
									</div>
									<div className="text-right text-slate-500 text-xs">
										83% accuracy
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default HeroSection
