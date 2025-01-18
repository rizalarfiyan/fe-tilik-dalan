import { cn } from '@lib/utils'
import { AlertCircle, Loader2, type LucideIcon } from 'lucide-react'
import type * as React from 'react'
import Typography from './typography'

export interface IState {
	loading?: boolean
	error?: string | null
}

interface StateProps {
	icon: LucideIcon
	iconClassName?: string
	message: string
}

const State: React.FC<StateProps> = ({
	icon: Icon,
	iconClassName,
	message,
}) => {
	return (
		<div className="absolute inset-0 z-[1] flex h-full w-full items-center justify-center bg-slate-800/80">
			<div className="z-10 flex items-center justify-center gap-3 rounded-md bg-slate-800 p-3">
				<Icon className={cn('size-5 text-white', iconClassName)} />
				<Typography className="!mt-0 font-medium text-sm text-white">
					{message}
				</Typography>
			</div>
		</div>
	)
}

interface StateObjectProps {
	state?: IState | null
	loadingText?: string
}

const StateObject: React.FC<StateObjectProps> = ({ state, loadingText }) => {
	if (state?.loading) {
		return (
			<State
				icon={Loader2}
				iconClassName="animate-spin"
				message={loadingText ?? 'Loading...'}
			/>
		)
	}

	if (state?.error) {
		return <State icon={AlertCircle} message={state.error} />
	}

	return null
}

export default StateObject
