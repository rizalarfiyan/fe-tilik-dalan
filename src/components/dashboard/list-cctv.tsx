import { RadioGroup } from '@components/ui/radio-group'
import useDashboard from '@hooks/use-dashboard'
import * as React from 'react'
import Result from './result'
import { Route } from '@/routes/dashboard'
import Fuse from 'fuse.js'
import type { CCTV } from '@/types/cctv'

function ListCCTV() {
	const { cctv, active, setActive, isDisable } = useDashboard()
	const params = Route.useSearch()

	const fuse = React.useMemo(
		() =>
			new Fuse(cctv, {
				keys: ['title'],
				includeMatches: true,
				threshold: 0.5,
			}),
		[cctv],
	)

	const results = React.useMemo((): CCTV[] => {
		const { search, order } = params
		const searching = () => {
			if (!search) return [...cctv]
			return fuse.search(search).map((val) => val.item)
		}

		const val = searching()
		return order === 'desc' ? val.reverse() : val
	}, [params, cctv, fuse])

	const onValueChange = React.useCallback(
		(value: string) => {
			const current = cctv.find((val) => val.id === value)
			if (!current) return
			setActive(current)
		},
		[cctv, setActive],
	)

	// TODO: show the result
	return (
		<RadioGroup
			className="relative"
			onValueChange={onValueChange}
			value={active?.id ?? ''}
			disabled={isDisable}
		>
			<Result results={results} />
		</RadioGroup>
	)
}

export default React.memo(ListCCTV)
