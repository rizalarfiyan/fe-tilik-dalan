import { Link } from '@tanstack/react-router'
import Logo from '@components/logo'
import Typography from '@components/typography'
import { Button } from '@components/ui/button'
import { ArrowLeft } from 'lucide-react'

function NotFound() {
	return (
		<main className="relative overflow-hidden">
			<div className="absolute inset-0 bg-gradient-to-br from-red-100 via-white to-orange-100 opacity-50 dark:from-red-950 dark:via-red-900 dark:to-orange-950 dark:opacity-30" />
			<div className="-top-20 -left-20 absolute size-96 rounded-full bg-red-200/30 blur-2xl dark:bg-red-900/20" />
			<div className="-bottom-20 -right-20 absolute size-96 rounded-full bg-orange-200/30 blur-2xl dark:bg-orange-900/20" />
			<div className="relative z-10 mx-auto flex h-screen max-w-screen-xl items-center justify-start px-4 md:px-8">
				<div className="mx-auto max-w-lg space-y-6 text-center">
					<Logo />
					<div className="max-w-sm space-y-3">
						<Typography as="p" variant="h1">
							Page not found
						</Typography>
						<Typography as="p" variant="muted">
							Sorry, the page you are looking for could not be found or has been
							removed.
						</Typography>
					</div>
					<Button asChild>
						<Link to="/">
							<ArrowLeft className="mr-1 size-5" />
							<span>Back to Home</span>
						</Link>
					</Button>
				</div>
			</div>
		</main>
	)
}

export default NotFound
