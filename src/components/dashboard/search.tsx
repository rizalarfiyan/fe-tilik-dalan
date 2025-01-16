import { Input } from '@components/ui/input'
import useDebounce from '@hooks/use-debounce'
import { SearchIcon } from 'lucide-react'
import * as React from 'react'
import { Route } from '@/routes/dashboard'

function Search() {
	const navigate = Route.useNavigate()
	const param = Route.useSearch()
	const [search, setSearch] = React.useState(param.search ?? '')
	const debounce = useDebounce(search, 500)

	React.useEffect(() => {
		navigate({
			search: (prev) => ({
				...prev,
				search: debounce !== '' ? debounce : undefined,
			}),
		})
	}, [debounce, navigate])

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearch(e.target.value)
	}

	return (
		<Input
			className="w-full"
			icon={SearchIcon}
			type="search"
			iconProps={{
				behavior: 'prepend',
			}}
			placeholder="Search..."
			value={search}
			onChange={onChange}
		/>
	)
}

export default Search
