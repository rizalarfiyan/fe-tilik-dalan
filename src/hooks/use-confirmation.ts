import {
	ConfirmationContext,
	type IConfirmationContext,
} from '@/providers/confirmation-provider'
import { useContext } from 'react'

export const useConfirmation = (): IConfirmationContext => {
	const context = useContext(ConfirmationContext)
	if (!context) {
		throw new Error(
			'useConfirmation must be used within a ConfirmationProvider',
		)
	}
	return context
}

export default useConfirmation
