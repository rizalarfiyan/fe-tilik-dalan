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
