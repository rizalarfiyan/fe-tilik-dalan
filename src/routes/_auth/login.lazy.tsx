import GoogleIcon from '@components/google-icon'
import LoadingScreen from '@components/loading-screen'
import Logo from '@components/logo'
import Typography from '@components/typography'
import { Button } from '@components/ui/button'
import { API_BASE_URL } from '@constants'
import useAuth from '@hooks/use-auth'
import illustration from '@illustration/login.svg'
import { createLazyFileRoute, Link, useNavigate } from '@tanstack/react-router'
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
	const navigate = useNavigate()
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
	}, [])

	if (showLoading) {
		return <LoadingScreen reason="Checking user info..." />
	}

	return (
		<main className="flex w-full">
			<div className="relative hidden h-screen flex-1 items-center justify-center bg-slate-900 lg:flex">
				<div className="relative z-10 w-full max-w-xl space-y-6 p-8">
					<Logo dotContrast typographyClassName="text-white" />
					<img src={illustration} aria-label="Illustration login" />
					<div className=" mt-16 space-y-3 text-center">
						<Typography as="h3" variant="h2" className="text-white">
							Start growing your business quickly
						</Typography>
						<Typography className="text-slate-300">
							Lorem ipsum dolor sit amet, consectetur adipisicing elit. Itaque,
							iusto aliquid ea pariatur molestiae alias quidem?
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
								Lorem ipsum dolor, sit amet consectetur adipisicing elit.
								Eveniet, soluta quod voluptatem cumque suscipit vitae?
							</Typography>
						</div>
					</div>
					<div>
						<Button asChild variant="outline" className="w-full p-6 text-base">
							<a href={`${API_BASE_URL}/auth/google`}>
								<GoogleIcon className="!size-6 mr-1" />
								<span>Login with Google</span>
							</a>
						</Button>
					</div>
				</div>
			</div>
		</main>
	)
}
