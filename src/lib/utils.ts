import { STORAGE_BASE_URL } from '@constants'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const avatarAlias = (name: string) => {
	const words = name.split(' ')
	if (words.length === 1) return words[0].substring(0, 2).toUpperCase()
	return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase()
}

export const aspectRatio = (aspect?: string): [number, number] => {
	const defaultAspect: [number, number] = [16, 9]
	if (!aspect) return defaultAspect
	const arr = aspect.split(':').map(Number)
	if (arr.length < 2) return defaultAspect
	return [arr[0], arr[1]]
}

export const calcAspectRatio = (
	width?: number,
	height?: number,
	delimiter = '/',
): string => {
	if (!width || !height) return `16${delimiter}9`
	if (width === height) return `1${delimiter}1`

	const gcd = (a: number, b: number): number => {
		return b === 0 ? a : gcd(b, a % b)
	}

	const larger = Math.max(width, height)
	const smaller = Math.min(width, height)
	const divisor = gcd(larger, smaller)
	const x = Math.floor(larger / divisor)
	const y = Math.floor(smaller / divisor)
	return `${x}${delimiter}${y}`
}

export const fileSizeSI = (size: number): string => {
	const e = (Math.log(size) / Math.log(1e3)) | 0
	return `${(size / 1e3 ** e).toFixed(2)} ${'kMGTPEZY'[e - 1] || ''}B`
}

export const kebabToTitleCase = (str: string): string => {
	return str
		.split('-')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ')
}

export const storageUrl = (path: string): string => {
	if (!path) return STORAGE_BASE_URL
	return STORAGE_BASE_URL + path
}

export const shuffleArray = <T>(array: T[]): T[] => {
	let currentIndex = array.length
	let randomIndex: number

	while (currentIndex !== 0) {
		randomIndex = Math.floor(Math.random() * currentIndex)
		currentIndex--
		;[array[currentIndex], array[randomIndex]] = [
			array[randomIndex],
			array[currentIndex],
		]
	}

	return array
}
