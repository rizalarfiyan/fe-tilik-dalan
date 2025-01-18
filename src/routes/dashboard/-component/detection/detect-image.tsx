import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import StateObject, { type IState } from '@components/state-obect'
import Typography from '@components/typography'
import useDetection from '@hooks/use-detection'
import RenderBox from '@lib/render-box'
import { Upload, X } from 'lucide-react'
import * as React from 'react'
import { useDropzone } from 'react-dropzone'

// TODO: fix bugs to many renders
function DetectImage() {
	const { model } = useDetection()
	const canvasRef = React.useRef<HTMLCanvasElement>(null)
	const imageRef = React.useRef<HTMLImageElement>(null)
	const [state, setState] = React.useState<IState | null>(null)
	const [file, setFile] = React.useState<File | null>(null)
	const shape = model!.shape()

	const detect = async () => {
		const canvas = canvasRef.current
		const img = imageRef.current
		if (!model || !canvas || !img) return

		console.log('=========================DETECT!')
		try {
			await model.detect(img, {
				results: (results) => {
					console.log('Results: ', results)
				},
				renderBox: (prediction) =>
					new RenderBox({
						canvas,
						...prediction,
					}).build({
						fill: true,
						label: true,
					}),
			})
			setState(null)
		} catch (err) {
			// biome-ignore lint/suspicious/noExplicitAny: error is not an instance of Error
			console.warn('Error detect image: ', (err as any).toString())
			setState({
				error: 'Failed to detect object.',
			})
		}
	}

	const onImageLoad = () => {
		if (!imageRef.current) return
		detect()
	}

	const onDrop = React.useCallback((acceptedFiles: File[]) => {
		const acceptedFile = acceptedFiles[0]
		if (acceptedFile) {
			setFile(acceptedFile)
			setState({
				loading: true,
			})
			const image = imageRef.current
			if (image) {
				image.src = URL.createObjectURL(acceptedFile)
			}
		}
	}, [])

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: {
			'image/png': ['.png'],
			'image/jpeg': ['.jpg', '.jpeg'],
		},
		maxSize: 5 * 1024 * 1024, // 5MB
		minSize: 70 * 1024, // 70KB
		multiple: false,
	})

	const removeImage = () => {
		imageRef.current = null
		setFile(null)
		const canvas = canvasRef.current
		if (!canvas) return
		const ctx = canvas.getContext('2d')!
		ctx.clearRect(0, 0, canvas.width, canvas.height)
	}

	return (
		<div className="space-y-4">
			<div
				{...getRootProps()}
				className={cn(
					'relative mx-auto flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 transition-all duration-300',
					isDragActive
						? 'border-primary bg-primary/10'
						: 'border-gray-300 hover:border-primary',
					!file && 'aspect-video',
				)}
			>
				<input {...getInputProps()} />
				{!file ? (
					<div className="flex flex-col items-center justify-center space-y-0 text-center text-slate-400">
						<Upload className="mb-4 size-12" />
						<Typography className="font-bold text-sm">
							Drag & drop an image here, or click to select one
						</Typography>
						<Typography className="text-xs">
							(Only *.png, *.jpg and *.jpeg files, max 5MB, min 70KB)
						</Typography>
					</div>
				) : (
					<div className="relative w-full overflow-hidden rounded-md">
						<img
							ref={imageRef}
							src={URL.createObjectURL(file)}
							alt="Uploaded detection object"
							onLoad={onImageLoad}
							className="h-auto w-full rounded-md"
						/>
						<canvas
							ref={canvasRef}
							width={shape[1]}
							height={shape[2]}
							className="absolute inset-0 h-full w-full"
						/>
						<Button
							variant="destructive"
							size="icon"
							className="absolute top-2 right-2"
							onClick={(e) => {
								e.stopPropagation()
								removeImage()
							}}
						>
							<X className="size-4" />
						</Button>
						<StateObject state={state} />
					</div>
				)}
			</div>
		</div>
	)
}

export default DetectImage
