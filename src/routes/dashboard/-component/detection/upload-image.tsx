import Typography from '@components/typography'
import { cn } from '@lib/utils'
import { Upload } from 'lucide-react'
import * as React from 'react'
import { useDropzone } from 'react-dropzone'

interface UploadImageProps {
	setFile: (file: File | null) => void
}

const UploadImage: React.FC<UploadImageProps> = ({ setFile }) => {
	const onDrop = React.useCallback(
		(acceptedFiles: File[]) => {
			const acceptedFile = acceptedFiles[0]
			if (acceptedFile) {
				setFile(acceptedFile)
			}
		},
		[setFile],
	)

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

	// TODO: handle error
	return (
		<div
			{...getRootProps()}
			className={cn(
				'relative mx-auto flex aspect-video h-full w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 transition-all duration-300',
				isDragActive
					? 'border-primary bg-primary/10'
					: 'border-gray-300 hover:border-primary',
			)}
		>
			<input {...getInputProps()} />
			<div className="flex flex-col items-center justify-center space-y-0 text-center text-slate-400">
				<Upload className="mb-4 size-12" />
				<Typography className="font-bold text-sm">
					Drag & drop an image here, or click to select one
				</Typography>
				<Typography className="text-xs">
					(Only *.png, *.jpg and *.jpeg files, max 5MB, min 70KB)
				</Typography>
			</div>
		</div>
	)
}

export default UploadImage
