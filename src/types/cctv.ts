export interface CCTV {
	id: string
	title: string
	link: string
	latitude: number
	longitude: number
	width: number
	height: number
	aspect: string
	image: CCTVImage
}

export interface CCTVImage {
	src: string
	thumb: string
}
