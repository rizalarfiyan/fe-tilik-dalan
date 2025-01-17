import { cn } from '@lib/utils'
import * as React from 'react'

interface DotLiveProps {
	className?: string
	color?: 'red' | 'green'
}

const DotLive: React.FC<DotLiveProps> = ({ color, className }) => {
	const colorMap = React.useMemo(() => {
		switch (color) {
			case 'green':
				return {
					ping: 'bg-green-400',
					normal: 'bg-green-500',
				}
			default:
				return {
					ping: 'bg-red-400',
					normal: 'bg-red-500',
				}
		}
	}, [color])

	return (
		<span className={cn('flex size-2', className)}>
			<span
				className={cn(
					'absolute inline-flex size-2 animate-ping rounded-full opacity-75',
					colorMap.ping,
				)}
			/>
			<span
				className={cn(
					'relative inline-flex size-2 rounded-full',
					colorMap.normal,
				)}
			/>
		</span>
	)
}

export default DotLive
