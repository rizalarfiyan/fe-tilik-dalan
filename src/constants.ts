import type { IMapsMove } from '@/types/maps'
import type { IModelClasses } from './types/model'

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''
export const STORAGE_BASE_URL = import.meta.env.VITE_STORAGE_BASE_URL || ''
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

export const KEY_CACHE_MODEL = 'cache_yolov8'

export const SCORE_THRESHOLD = 0.4
export const MAX_OUTPUT_SIZE = 200
export const IOU_THRESHOLD = 0.5
export const TRACKING_THRESHOLD = 50

export enum MODEL_CLASS {
	PEDESTRIAN = 'pedestrian',
	PEOPLE = 'people',
	BICYCLE = 'bicycle',
	CAR = 'car',
	VAN = 'van',
	TRUCK = 'truck',
	TRICYCLE = 'tricycle',
	AWNING_TRICYCLE = 'awning-tricycle',
	BUS = 'bus',
	MOTOR = 'motor',
}

export const MODEL_CLASSES: IModelClasses<MODEL_CLASS>[] = [
	{
		label: MODEL_CLASS.PEOPLE,
		color: '#33FF57',
		foreground: '#000000',
	},
	{
		label: MODEL_CLASS.PEDESTRIAN,
		color: '#FF5733',
		foreground: '#FFFFFF',
	},
	{
		label: MODEL_CLASS.BICYCLE,
		color: '#3357FF',
		foreground: '#FFFFFF',
	},
	{
		label: MODEL_CLASS.CAR,
		color: '#FF33A1',
		foreground: '#FFFFFF',
	},
	{
		label: MODEL_CLASS.VAN,
		color: '#FFA533',
		foreground: '#000000',
	},
	{
		label: MODEL_CLASS.TRUCK,
		color: '#A533FF',
		foreground: '#FFFFFF',
	},
	{
		label: MODEL_CLASS.TRICYCLE,
		color: '#33FFF2',
		foreground: '#000000',
	},
	{
		label: MODEL_CLASS.AWNING_TRICYCLE,
		color: '#FFDB33',
		foreground: '#000000',
	},
	{
		label: MODEL_CLASS.BUS,
		color: '#33FF8F',
		foreground: '#000000',
	},
	{
		label: MODEL_CLASS.MOTOR,
		color: '#FF3333',
		foreground: '#FFFFFF',
	},
]
