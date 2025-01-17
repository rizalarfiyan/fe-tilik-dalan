import type { IModelClasses } from '@/types/model'
import {
	IOU_THRESHOLD,
	KEY_CACHE_MODEL,
	MAX_OUTPUT_SIZE,
	SCORE_THRESHOLD,
} from '@constants'
import * as tf from '@tensorflow/tfjs'
import axios from 'axios'

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
}

export default Yolo
