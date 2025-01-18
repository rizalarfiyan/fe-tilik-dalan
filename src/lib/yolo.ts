import type { IModelClass, IModelClasses } from '@/types/model'
import {
	IOU_THRESHOLD,
	KEY_CACHE_MODEL,
	MAX_OUTPUT_SIZE,
	SCORE_THRESHOLD,
} from '@constants'
import * as tf from '@tensorflow/tfjs'
import axios from 'axios'
import type React from 'react'
import RenderBox, {
	type IRenderBoxOptions,
	type IRenderBoxProps,
} from './render-box'

export type IModelSource = HTMLImageElement | HTMLVideoElement

export interface IModelProgress {
	percentage: number
	reason: string
}

export interface InitModelConfig {
	modelPath: string
	classes: IModelClasses[]
	scoreThreshold?: number
	iouThreshold?: number
	maxOutputSize?: number
	cacheKey?: string
	onProgress?: (state: IModelProgress | null) => void
}

export type ModelConfig = InitModelConfig &
	Required<
		Pick<
			InitModelConfig,
			'scoreThreshold' | 'iouThreshold' | 'maxOutputSize' | 'cacheKey'
		>
	>

export interface PreprocessResult {
	input: tf.NamedTensorMap
	xRatio: number
	yRatio: number
}

export type PreprocessSource = (source: IModelSource) => PreprocessResult

export type IResultArray = Float32Array | Int32Array | Uint8Array

export type IModelPrediction = {
	boxes: IResultArray
	scores: IResultArray
	classes: IResultArray
	ratios: [number, number]
}

export type PredictionResult = {
	boxes: tf.Tensor<tf.Rank>
	scores: tf.Tensor<tf.Rank>
	classes: tf.Tensor<tf.Rank>
}

export interface TotalResult {
	class: IModelClasses
	total: number
}

export type DetectOptions = {
	results?: (results: TotalResult[]) => void
	renderBox?: (renderBox: Omit<IRenderBoxProps, 'canvas'>) => void
	callback?: () => void
}

class Yolo {
	private readonly model: tf.GraphModel
	private readonly classes: IModelClasses[]
	private readonly config: ModelConfig

	private constructor(
		model: tf.GraphModel,
		classes: IModelClasses[],
		config: ModelConfig,
	) {
		this.model = model
		this.classes = classes
		this.config = config
	}

	static async loadModel(config: InitModelConfig) {
		const {
			modelPath,
			classes,
			onProgress,
			maxOutputSize,
			iouThreshold,
			scoreThreshold,
		} = config
		await tf.ready()
		await tf
			.setBackend('webgl')
			.then(() => {
				const gl = document.createElement('canvas').getContext('webgl2')
				if (gl) {
					tf.env().set('WEBGL_USE_SHAPES_UNIFORMS', true)
					tf.env().set('WEBGL_PACK', true)
				}
				console.info('WebGL backend set')
			})
			.catch((err) => {
				console.error('Error setting WebGL backend:', err)
			})

		const cacheKey = `indexeddb://${config.cacheKey ?? KEY_CACHE_MODEL}`
		const newConfig = {
			...config,
			cacheKey,
			maxOutputSize: maxOutputSize ?? MAX_OUTPUT_SIZE,
			iouThreshold: iouThreshold ?? IOU_THRESHOLD,
			scoreThreshold: scoreThreshold ?? SCORE_THRESHOLD,
		}

		const cache = await tf.io.listModels()
		if (cache[cacheKey]) {
			console.info('Model loaded from cache')
			const cachedModel = await tf.loadGraphModel(cacheKey, {
				onProgress: (fraction) => {
					onProgress?.({
						percentage: fraction * 100,
						reason: 'Loading from cache',
					})
				},
			})
			return new Yolo(cachedModel, classes, newConfig)
		}

		onProgress?.({ percentage: 0, reason: 'Downloading model.json' })
		const response = await axios.get(modelPath, {
			responseType: 'json',
			onDownloadProgress: ({ total, loaded }) => {
				if (total) {
					const jsonProgress = (loaded / total) * 100
					onProgress?.({
						percentage: Math.round(jsonProgress),
						reason: 'Downloading model.json',
					})
				}
			},
		})

		const modelJson = response.data
		// biome-ignore lint/suspicious/noExplicitAny: any is used to handle the model.json structure
		const weightsManifest: any[] = modelJson.weightsManifest
		const binUrls = weightsManifest.flatMap((entry) =>
			entry.paths.map((path: string) => new URL(path, modelPath).href),
		)

		const binWeight = 100 / (binUrls.length + 1)
		let overallProgress = binWeight
		const modelBlobMap: { [url: string]: Blob } = {}
		const binPromises = binUrls.map((url) =>
			axios
				.get(url, {
					responseType: 'arraybuffer',
					onDownloadProgress: (progressEvent) => {
						if (progressEvent.total) {
							const binProgress =
								(progressEvent.loaded / progressEvent.total) * binWeight
							onProgress?.({
								percentage: Math.round(overallProgress + binProgress),
								reason: `Downloading .bin file (${binUrls.length})`,
							})
						}
					},
				})
				.then((response) => {
					modelBlobMap[url] = new Blob([response.data])
				})
				.finally(() => {
					overallProgress += binWeight
				}),
		)

		await Promise.all(binPromises)
		const handler = tf.io.browserHTTPRequest(modelPath, {
			fetchFunc: async (input: RequestInfo | URL, init?: RequestInit) => {
				const inputString = typeof input === 'string' ? input : input.toString()
				if (modelBlobMap[inputString]) {
					return new Response(modelBlobMap[inputString])
				}
				return fetch(input, init)
			},
		})

		const downloadedModel = await tf.loadGraphModel(handler)
		await downloadedModel.save(cacheKey)

		return new Yolo(downloadedModel, classes, newConfig)
	}

	dispose() {
		this.model.dispose()
	}

	async removeModel() {
		await tf.io.removeModel(this.config.cacheKey)
		this.dispose()
	}

	async reloadModel() {
		return await Yolo.loadModel(this.config)
	}

	shape(): number[] {
		return this.model?.inputs[0]?.shape ?? [1, 640, 640, 3]
	}

	async info(): Promise<object> {
		const curBackendName = tf.getBackend()
		let webglRenderer = 'NA'
		try {
			let webglBackend = tf.findBackend('webgl')
			if (webglBackend == null) {
				if (!(await tf.setBackend('webgl'))) {
					throw new Error('Failed to initialize WebGL backend.')
				}
				webglBackend = tf.backend()
			}
			// biome-ignore lint/suspicious/noExplicitAny: any is used to handle the WebGL backend
			const gl = (webglBackend as Record<string, any>)?.gpgpu?.gl
			const dbgRenderInfo = gl.getExtension('WEBGL_debug_renderer_info')
			webglRenderer = gl.getParameter(dbgRenderInfo.UNMASKED_RENDERER_WEBGL)
		} catch {
			webglRenderer = 'NA'
		}
		await tf.setBackend(curBackendName)

		await tf.time(() => tf.add(tf.tensor1d([1]), tf.tensor1d([1])).data())
		return {
			webgl: webglRenderer,
			version: {
				core: tf.version_core,
				layers: tf.version_layers,
				converter: tf.version_converter,
			},
			env: tf.env().features,
		}
	}

	preprocess(
		source: IModelSource,
		modelWidth: number,
		modelHeight: number,
	): [tf.Tensor<tf.Rank>, number, number] {
		let xRatio = 0
		let yRatio = 0

		const input = tf.tidy(() => {
			const img = tf.browser.fromPixels(source)
			const [h, w] = img.shape.slice(0, 2)
			const maxSize = Math.max(w, h)
			const imgPadded = img.pad([
				[0, maxSize - h],
				[0, maxSize - w],
				[0, 0],
			])

			xRatio = maxSize / w
			yRatio = maxSize / h

			return tf.image
				.resizeBilinear(imgPadded as tf.Tensor4D, [modelWidth, modelHeight])
				.div(255.0)
				.expandDims(0)
		})

		return [input, xRatio, yRatio]
	}

	private getResults(predicted: IResultArray): TotalResult[] {
		const result = {} as Record<IModelClass, TotalResult>
		for (let i = 0; i < predicted.length; i++) {
			const val = this.classes[predicted[i]] as IModelClasses<IModelClass>
			const key = val.label
			if (result[key]) {
				result[key].total += 1
				continue
			}

			result[key] = {
				class: val,
				total: 1,
			}
		}

		return Object.values(result)
	}

	async detect(source: IModelSource, opts?: DetectOptions) {
		const [modelWidth, modelHeight] = this.shape().slice(1, 3)

		tf.engine().startScope()
		const [input, xRatio, yRatio] = this.preprocess(
			source,
			modelWidth,
			modelHeight,
		)

		const res = this.model.execute(input)
		const transRes = (res as tf.Tensor<tf.Rank>).transpose([0, 2, 1])
		const boxes = tf.tidy(() => {
			const w = transRes.slice([0, 0, 2], [-1, -1, 1])
			const h = transRes.slice([0, 0, 3], [-1, -1, 1])
			const x1 = tf.sub(transRes.slice([0, 0, 0], [-1, -1, 1]), tf.div(w, 2))
			const y1 = tf.sub(transRes.slice([0, 0, 1], [-1, -1, 1]), tf.div(h, 2))
			return tf.concat([y1, x1, tf.add(y1, h), tf.add(x1, w)], 2).squeeze()
		})

		const [scores, classes] = tf.tidy(() => {
			const rawScores = transRes
				.slice([0, 0, 4], [-1, -1, this.classes.length])
				.squeeze()
			return [rawScores.max(1), rawScores.argMax(1)]
		})

		const nms = await tf.image.nonMaxSuppressionAsync(
			boxes as tf.Tensor2D,
			scores as tf.Tensor1D,
			this.config.maxOutputSize,
			this.config.iouThreshold,
			this.config.scoreThreshold,
		)

		const boxesData = boxes.gather(nms, 0).dataSync() as IResultArray
		const scoresData = scores.gather(nms, 0).dataSync() as IResultArray
		const classesData = classes.gather(nms, 0).dataSync() as IResultArray

		opts?.renderBox?.({
			classes: this.classes,
			prediction: {
				boxes: boxesData,
				classes: classesData,
				scores: scoresData,
				ratios: [xRatio, yRatio],
			},
		})

		if (opts?.results) opts?.results(this.getResults(classesData))

		tf.dispose([res, transRes, boxes, scores, classes, nms])
		opts?.callback?.()
		tf.engine().endScope()
	}

	detectVideo(
		source: HTMLVideoElement,
		canvas: HTMLCanvasElement,
		stateRef: React.MutableRefObject<boolean>,
		options?: IRenderBoxOptions,
	) {
		const detectFrame = async () => {
			if (!stateRef.current) return
			if (source.videoWidth === 0 && source.srcObject === null) {
				const ctx = canvas.getContext('2d')!
				ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
				return
			}

			this.detect(source, {
				renderBox: (prediction) =>
					new RenderBox({
						canvas,
						...prediction,
					}).build(options),
				callback: () => {
					requestAnimationFrame(detectFrame)
					// const timeout = setTimeout(() => {
					//   detectFrame()
					//   clearTimeout(timeout)
					// }, 200)
				},
			})
		}

		detectFrame()
	}
}

export default Yolo
