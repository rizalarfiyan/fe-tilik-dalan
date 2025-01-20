import type { IModelClasses } from '@/types/model'
import type { IModelPrediction } from './yolo'

export type IRenderBoxProps = {
	canvas: HTMLCanvasElement
	classes: IModelClasses[]
	prediction: IModelPrediction
}

export interface ISkipCallbackProps extends IRenderBoxSize {
	label: string
	iteration: number
}

export interface IRenderBoxOptions {
	label?: boolean
	fill?: boolean
	prediction?: 'score' | 'percent'
	centerBox?: boolean
	beforeMount?: () => void
	afterMount?: () => void
	skipCallback?: (size: ISkipCallbackProps) => IRenderBoxSkipCallback
	dataCallback?: (data: Record<string, Record<string, number>>) => void
}

export interface IRenderBoxSkipCallback {
	isValid: boolean
	type?: string
}

export interface IRenderBoxSize {
	x1: number
	x2: number
	y1: number
	y2: number
	width: number
	height: number
	centerX: number
	centerY: number
}

class RenderBox {
	private readonly ctx: CanvasRenderingContext2D
	private readonly width: number
	private readonly height: number
	private readonly classes: IModelClasses[]
	private readonly prediction: IModelPrediction
	private readonly lineWidth: number

	constructor({ canvas, classes, prediction }: IRenderBoxProps) {
		this.ctx = canvas.getContext('2d')!
		this.width = canvas.width
		this.height = canvas.height
		this.classes = classes
		this.prediction = prediction

		this.lineWidth = Math.max(Math.min(this.width, this.height) / 200, 2)
	}

	clear() {
		this.ctx.clearRect(0, 0, this.width, this.height)
	}

	build(opts?: IRenderBoxOptions) {
		this.clear()
		opts?.beforeMount?.()
		const hasLabel = opts?.label
		const hasPrediction = opts?.prediction
		if (hasLabel) this.font()

		const obj: Record<string, Record<string, number>> = {}
		const { scores, classes } = this.prediction
		for (let i = 0; i < scores.length; ++i) {
			const { color, foreground, label } = this.classes[classes[i]]

			const size = this.box(i)
			if (opts?.skipCallback) {
				const { isValid, type: boxType } = opts.skipCallback({
					...size,
					label,
					iteration: i,
				})
				if (!isValid) continue

				if (boxType) {
					if (!obj[boxType]) obj[boxType] = {}
					if (!obj[boxType][label]) obj[boxType][label] = 0
					obj[boxType][label]++
				}
			}

			const { x1, y1, width, height, centerX, centerY } = size
			if (opts?.fill) {
				this.ctx.fillStyle = RenderBox.hexToRGB(color, 0.2)
				this.ctx.fillRect(x1, y1, width, height)
			}

			this.ctx.strokeStyle = color
			this.ctx.lineWidth = this.lineWidth
			this.ctx.strokeRect(x1, y1, width, height)

			if (opts?.centerBox) {
				this.ctx.fillStyle = color
				this.ctx.beginPath()
				this.ctx.arc(centerX, centerY, Math.max(width * 0.1, 3), 0, Math.PI * 2)
				this.ctx.fill()
			}

			if (hasLabel) {
				let text = label
				if (hasPrediction) {
					if (opts.prediction === 'score') {
						text += ` - ${scores[i].toFixed(2)}`
					} else {
						text += ` - ${(scores[i] * 100).toFixed(1)}%`
					}
				}

				this.ctx.fillStyle = color
				const textWidth = this.ctx.measureText(text).width
				const textHeight = Number.parseInt(this.ctx.font, 10)
				const yText = y1 - (textHeight + this.lineWidth)
				this.ctx.fillRect(
					x1 - 1,
					yText < 0 ? 0 : yText,
					textWidth + this.lineWidth,
					textHeight + this.lineWidth,
				)

				this.ctx.fillStyle = foreground
				this.ctx.fillText(text, x1 - 1, yText < 0 ? 0 : yText)
			}
		}

		opts?.afterMount?.()
		opts?.dataCallback?.(obj)
	}

	box(idx: number): IRenderBoxSize {
		const { boxes, ratios } = this.prediction
		let [y1, x1, y2, x2] = boxes.slice(idx * 4, (idx + 1) * 4)
		x1 *= ratios[0]
		x2 *= ratios[0]
		y1 *= ratios[1]
		y2 *= ratios[1]
		return {
			x1,
			x2,
			y1,
			y2,
			width: x2 - x1,
			height: y2 - y1,
			centerX: (x1 + x2) / 2,
			centerY: (y1 + y2) / 2,
		}
	}

	font() {
		const fontSize = Math.max(
			Math.round(Math.max(this.width, this.height) / 40),
			14,
		)
		const font = `${fontSize}px Arial`
		this.ctx.font = font
		this.ctx.textBaseline = 'top'
	}

	static hexToRGB(hex: string, alpha: number) {
		const r = Number.parseInt(hex.slice(1, 3), 16)
		const g = Number.parseInt(hex.slice(3, 5), 16)
		const b = Number.parseInt(hex.slice(5, 7), 16)
		return `rgba(${r}, ${g}, ${b}, ${alpha})`
	}
}

export default RenderBox
