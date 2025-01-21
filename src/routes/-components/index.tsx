import { Link } from '@tanstack/react-router'
import HeroSection from './hero-section'
import Logo from '@components/logo'
import useAuth from '@hooks/use-auth'
import * as React from 'react'
import { Button } from '@components/ui/button'
import { LayoutDashboard, LogIn } from 'lucide-react'

function Page() {
	const auth = useAuth()
	const link = React.useMemo(() => {
		if (auth.user) {
			return {
				icon: LayoutDashboard,
				to: '/dashboard',
				text: 'Dashboard',
			}
		}
		return {
			icon: LogIn,
			to: '/login',
			text: 'Login',
		}
	}, [auth.user])

	return (
		<>
			<header className="fixed top-0 left-0 z-[98] w-full bg-background shadow-2xl shadow-slate-500/10">
				<div className="container flex items-center justify-between p-3">
					<Link to="/" className="inline-flex">
						<Logo
							svgClassName="size-8"
							typographyClassName="underline text-xl underline-offset-[3px] decoration-[3px] decoration-primary"
						/>
					</Link>
					<Button asChild>
						<Link to={link.to}>
							<link.icon className="size-4" />
							{link.text}
						</Link>
					</Button>
				</div>
			</header>
			<HeroSection />
		</>
	)
}

export default Page
