import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { ScrollArea, ScrollBar } from '@components/ui/scroll-area'
import useDetection from '@hooks/use-detection'
import { Info } from 'lucide-react'
import { useEffect, useState } from 'react'

function ModelInformation() {
	const { model } = useDetection()
	const [info, setInfo] = useState<object | undefined>()

	useEffect(() => {
		const getInfo = async () => {
			setInfo(await model?.info())
		}
		getInfo()
	}, [model])

	if (!info) return null

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="outline" size="icon">
					<Info className="size-5" />
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-3xl">
				<DialogHeader>
					<DialogTitle>Model Information</DialogTitle>
				</DialogHeader>
				<ScrollArea
					type="always"
					className="h-full max-h-[calc(100vh_-_210px)] w-full rounded-md bg-slate-800 p-3"
				>
					<pre className="text-white">
						<code>{JSON.stringify(info, null, 2)}</code>
					</pre>
					<ScrollBar orientation="horizontal" />
				</ScrollArea>
			</DialogContent>
		</Dialog>
	)
}

export default ModelInformation
