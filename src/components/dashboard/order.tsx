import { Button } from '@components/ui/button'
import useDebounce from '@hooks/use-debounce'
import { ArrowDownAZ, ArrowUpAZ } from 'lucide-react'
import * as React from 'react'
import { Route } from '@/routes/dashboard'
import useDashboard from '@hooks/use-dashboard'

function Search() {
	const { isDisable } = useDashboard()
	const navigate = Route.useNavigate()
	const param = Route.useSearch()
	const [isDescending, setIsDescending] = React.useState(param.order === 'desc')
	const debounce = useDebounce(isDescending, 200)

	React.useEffect(() => {
		navigate({
			search: (prev) => ({
				...prev,
				order: debounce ? 'desc' : undefined,
			}),
		})
	}, [debounce, navigate])

	const onChangeSort = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		setIsDescending((prev) => !prev)
	}

	return (
		<Button
			variant="outline"
			type="button"
			size="icon"
			className="flex-shrink-0"
			onClick={onChangeSort}
			disabled={isDisable}
		>
			{isDescending ? (
				<ArrowUpAZ className="size-5" />
			) : (
				<ArrowDownAZ className="size-5" />
			)}
		</Button>
	)
}

export default Search
