import GoogleIcon from '@components/google-icon'
import LoadingScreen from '@components/loading-screen'
import Logo from '@components/logo'
import Typography from '@components/typography'
import { Button } from '@components/ui/button'
import { API_BASE_URL } from '@constants'
import useAuth from '@hooks/use-auth'
import illustration from '@illustration/login.svg'
import { createLazyFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import React, { useEffect } from 'react'
import { toast } from 'sonner'

export const Route = createLazyFileRoute('/_auth/login')({
	component: Page,
})

interface IAuthToken {
	message: string
	token?: string
}

const parseToken = (val?: string): IAuthToken => {
	if (!val) {
		return { message: 'No token provided' }
	}

	try {
		return JSON.parse(atob(val))
	} catch {
		return { message: 'Invalid token' }
	}
}

function Page() {
	const auth = useAuth()
	const data = Route.useSearch()
	const token = parseToken(data.token)
	const navigate = Route.useNavigate()
	const [showLoading, setShowLoading] = React.useState(!!data.token)

	// biome-ignore lint/correctness/useExhaustiveDependencies: Only first render
	useEffect(() => {
		if (token.token) {
			auth
				.login(token.token)
				.then(() => {
					navigate({
						to: '/dashboard',
						replace: true,
					})
					toast.success(token.message)
				})
				.catch(() => {
					toast.error(token?.message ?? 'Failed to login')
					setShowLoading(false)
				})
			return
		}

		if (token.message && data.token) {
			toast.error(token.message)
			setShowLoading(false)
			navigate({
				search: undefined,
				replace: true,
			})
		}
	}, [])

	if (showLoading) {
		return <LoadingScreen reason="Checking user info..." />
	}

	return (
		<main className="flex w-full">
			<div className="relative hidden h-screen flex-1 items-center justify-center bg-slate-900 lg:flex">
				<div className="relative z-10 w-full max-w-xl space-y-6 p-8">
					<Logo dotContrast typographyClassName="text-white" />
					<div className="aspect-video h-full w-full">
						<img
							className="mx-auto h-full w-auto"
							src={illustration}
							alt="Illustration login"
						/>
					</div>
					<div className=" mt-16 space-y-3 text-center">
						<Typography as="h3" variant="h2" className="text-white">
							AI-Powered Visual Intelligence
						</Typography>
						<Typography className="text-slate-300">
							Machine learning algorithms detect and analyze objects in images
							and videos with high precision and real-time processing.
						</Typography>
					</div>
				</div>
				<div className="absolute inset-0 my-auto h-[500px] bg-login" />
			</div>
			<div className="relative flex h-screen flex-1 items-center justify-center">
				<Button asChild variant="outline" className="absolute top-5 left-5">
					<Link to="/">
						<ArrowLeft className="mr-1 size-5" />
						<span>Back to Home</span>
					</Link>
				</Button>
				<div className="w-full max-w-md space-y-10 bg-white px-4 text-slate-600 sm:px-0">
					<div className="space-y-5">
						<Logo className="lg:hidden" />
						<div className="space-y-3">
							<Typography className="lg:text-4xl" as="h3" variant="h1">
								Login
							</Typography>
							<Typography variant="muted">
								Access AI capabilities for intelligent image and video object
								recognition using cutting-edge machine learning technologies.
							</Typography>
						</div>
					</div>
					<div>
						<Button asChild variant="outline" className="w-full p-6 text-base">
							<a href={`${API_BASE_URL}/auth/google`}>
								<GoogleIcon className="mr-1 size-6" />
								<span>Login with Google</span>
							</a>
						</Button>
					</div>
				</div>
			</div>
		</main>
	)
}
