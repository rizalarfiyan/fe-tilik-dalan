import type React from 'react'

interface MarkerIconProps {
	size?: number
}

const MarkerIcon: React.FC<MarkerIconProps> = ({ size = 32 }) => {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			className="fill-red-500"
		>
			<path d="M20.69 8.69c0 5.95-7.78 14.68-8.11 15.05a.8.8 0 0 1-1.16 0c-.33-.37-8.12-9.1-8.12-15.04A8.7 8.7 0 0 1 12 0a8.7 8.7 0 0 1 8.69 8.69" />
			<path
				d="M13.24 7.4v2.63a.8.8 0 0 1-.78.78H9.21a.8.8 0 0 1-.78-.78V7.4a.8.8 0 0 1 .78-.78h3.25a.8.8 0 0 1 .78.78m1.74-.35a.47.47 0 0 1 .58.45v2.41l-.06.24a.46.46 0 0 1-.64.17l-1.23-.7V7.8l1.22-.7zm-3 8.47a7.1 7.1 0 0 1-5.88-3.4 7.1 7.1 0 0 1 0-6.81A7.3 7.3 0 0 1 12 1.9a7.1 7.1 0 0 1 5.9 3.41 7.1 7.1 0 0 1-.01 6.8 7.3 7.3 0 0 1-5.9 3.4m4.52-4.19a4.9 4.9 0 0 0 0-5.22A4.9 4.9 0 0 0 12 3.5a4.8 4.8 0 0 0-4.52 2.6 4.9 4.9 0 0 0 0 5.22 4.9 4.9 0 0 0 4.51 2.62c1.95.05 3.6-.9 4.52-2.6"
				className="fill-white"
			/>
		</svg>
	)
}

export default MarkerIcon
