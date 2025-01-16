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
