import * as React from 'react'
import ImageResult from './image-result'
import UploadImage from './upload-image'

function DetectImage() {
	const [file, setFile] = React.useState<File | null>(null)

	return (
		<div className="space-y-4">
			{!file ? (
				<UploadImage setFile={setFile} />
			) : (
				<ImageResult file={file} setFile={setFile} />
			)}
		</div>
	)
}

export default DetectImage
