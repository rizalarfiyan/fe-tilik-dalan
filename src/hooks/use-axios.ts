import axios from '@lib/axios'
import type { AxiosRequestConfig } from 'axios'
import { useState, useEffect } from 'react'

interface UseAxiosProps {
	config?: AxiosRequestConfig
}

const useAxios = <T>(url: string, { config }: UseAxiosProps = {}) => {
	const [res, setRes] = useState<T | null>(null)
	const [isLoading, setIsLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true)
			setError(null)

			try {
				const response = await axios.get<T>(url, config)
				setRes(response.data)
			} catch (err) {
				if (err instanceof Error) {
					setError(err.message)
				} else {
					setError(String(err))
				}
			} finally {
				setIsLoading(false)
			}
		}

		fetchData()
	}, [url, config])

	return { res, isLoading, error }
}

export default useAxios
