import type { IMapsMove } from '@/types/maps'

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''
export const MAP_BOX_API_KEY = import.meta.env.VITE_APP_MAP_BOX_API_KEY || ''
export const APP_NAME = 'Tilik Jalan'

export const KEY_ACCESS_TOKEN = 'access_token'

export const DEFAULT_ZOOM_MARKER = 17
export const DEFAULT_MAP: IMapsMove = {
	latitude: -7.8,
	longitude: 110.38,
	zoom: 13,
}

export const AUTH_ROLE = {
	ADMIN: 'admin',
	GUEST: 'guest',
}
