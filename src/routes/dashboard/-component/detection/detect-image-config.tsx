import { Button } from '@components/ui/button'
import { Checkbox } from '@components/ui/checkbox'
import { Label } from '@components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@components/ui/popover'
import { RadioGroup, RadioGroupItem } from '@components/ui/radio-group'
import type RenderBox from '@lib/render-box'
import type { IRenderBoxOptions } from '@lib/render-box'
import { kebabToTitleCase } from '@lib/utils'
import type { TotalResult } from '@lib/yolo'
import { Settings2 } from 'lucide-react'
import * as React from 'react'

interface DetectImageConfigProps {
	defaultOptions?: IRenderBoxOptions
	object: TotalResult[] | null
	renderBox: RenderBox | null
}

const DetectImageConfig: React.FC<DetectImageConfigProps> = ({
	defaultOptions,
	object,
	renderBox,
}) => {
	const [option, setOption] = React.useState<IRenderBoxOptions>(
		defaultOptions ?? {},
	)
	const firstRender = React.useRef<boolean>(true)

	React.useEffect(() => {
		if (firstRender.current) {
			firstRender.current = false
			return
		}

		renderBox?.build(option)
	}, [option, renderBox])

	const onChange = <K extends keyof IRenderBoxOptions>(
		key: K,
		value: IRenderBoxOptions[K],
	) => {
		setOption({ ...option, [key]: value })
	}

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="outline" size="icon">
					<Settings2 className="size-5" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-80">
				<div className="flex justify-center">
					<table className="w-full">
						<tbody>
							<tr>
								<td className="w-20 py-1">
									<Label className="cursor-pointer" htmlFor="option-fill">
										Fill
									</Label>
								</td>
								<td className="w-3">:</td>
								<td>
									<Checkbox
										id="option-fill"
										checked={option.fill}
										onCheckedChange={(val) => {
											onChange('fill', Boolean(val))
										}}
									/>
								</td>
							</tr>
							<tr>
								<td className="w-20 py-1">
									<Label className="cursor-pointer" htmlFor="option-label">
										Label
									</Label>
								</td>
								<td className="w-3">:</td>
								<td>
									<Checkbox
										id="option-label"
										checked={option.label}
										onCheckedChange={(val) => {
											onChange('label', Boolean(val))
										}}
									/>
								</td>
							</tr>
							<tr>
								<td className="w-20 py-1">
									<div className="font-medium text-sm">Prediction</div>
								</td>
								<td className="w-3">:</td>
								<td>
									<RadioGroup
										defaultValue={option.prediction}
										disabled={!option.label}
										onValueChange={(val) => {
											if (val === 'none') {
												onChange('prediction', undefined)
												return
											}

											onChange(
												'prediction',
												val as IRenderBoxOptions['prediction'],
											)
										}}
									>
										{['none', 'score', 'percent'].map((val) => {
											const idx = `option-prediction-${val}`
											return (
												<div className="flex items-center space-x-2" key={val}>
													<RadioGroupItem value={val} id={idx} />
													<Label className="cursor-pointer" htmlFor={idx}>
														{kebabToTitleCase(val)}
													</Label>
												</div>
											)
										})}
									</RadioGroup>
								</td>
							</tr>
						</tbody>
					</table>
					<div className="w-full max-w-24 space-y-3">
						<div className="text-center font-medium text-sm">Class:</div>
						<div className="space-y-2">
							{(object ?? []).map(({ class: { label } }) => {
								const idx = `option-class-${label}`
								const allVal = option.allowClass ?? []
								return (
									<div className="flex items-center space-x-2" key={idx}>
										<Checkbox
											id={idx}
											checked={allVal.includes(label)}
											onCheckedChange={(val) => {
												if (!val) {
													onChange(
														'allowClass',
														allVal.filter((v) => v !== label),
													)
													return
												}
												onChange('allowClass', [...allVal, label])
											}}
										/>
										<Label className="cursor-pointer" htmlFor={idx}>
											{kebabToTitleCase(label)}
										</Label>
									</div>
								)
							})}
						</div>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	)
}

export default DetectImageConfig
