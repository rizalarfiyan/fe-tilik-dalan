import * as React from 'react'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@components/ui/alert-dialog'
import { Loader2, OctagonAlert } from 'lucide-react'
import useDisclosure, { type UseDisclosure } from '@hooks/use-disclosure'

export interface IConfirmationContext {
	create: (state: IConfirmationState) => void
	forceClose: () => void
}

export interface IConfirmationState {
	title: string
	type?: 'warning'
	description?: string
	confirmText?: string
	cancelText?: string
	setLoading?: () => void
	onCancel?: (loading: UseDisclosure, close: () => void) => void
	onConfirm?: (loading: UseDisclosure, close: () => void) => void
}

export const ConfirmationContext =
	React.createContext<IConfirmationContext | null>(null)

export const ConfirmationProvider: React.FC<React.PropsWithChildren> = ({
	children,
}) => {
	const [confirm, setConfirm] = React.useState<IConfirmationState | undefined>()
	const state = useDisclosure(false)
	const cancelLoading = useDisclosure(false)
	const confirmLoading = useDisclosure(false)

	const close = () => {
		state.close()
		const timeout = setTimeout(() => {
			cancelLoading.close()
			confirmLoading.close()
			setConfirm(undefined)
			clearTimeout(timeout)
		}, 200)
	}

	const onCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		if (confirm?.onCancel) {
			confirm?.onCancel?.(cancelLoading, close)
		} else {
			close()
		}
	}

	const onConfirm = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		if (confirm?.onConfirm) {
			confirm?.onConfirm?.(confirmLoading, close)
		} else {
			close()
		}
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: This effect should only run once
	React.useEffect(() => {
		if (confirm) {
			state.open()
		}
	}, [confirm])

	return (
		<ConfirmationContext.Provider
			value={{ create: setConfirm, forceClose: close }}
		>
			<AlertDialog open={state.isOpen}>
				<AlertDialogContent className="max-w-sm">
					<AlertDialogHeader className="py-6">
						<OctagonAlert className="mx-auto size-16 text-primary" />
						<AlertDialogTitle className="text-center font-bold text-2xl text-primary">
							{confirm?.title}
						</AlertDialogTitle>
						{confirm?.description && (
							<AlertDialogDescription className="mx-auto max-w-xs text-center">
								{confirm?.description}
							</AlertDialogDescription>
						)}
					</AlertDialogHeader>
					<AlertDialogFooter className="justify-center">
						<AlertDialogCancel
							className="w-full"
							onClick={onCancel}
							disabled={confirmLoading.isOpen || cancelLoading.isOpen}
						>
							{cancelLoading.isOpen && (
								<Loader2 className="mr-2 animate-spin" />
							)}
							<span>{confirm?.cancelText ?? 'Cancel'}</span>
						</AlertDialogCancel>
						<AlertDialogAction
							className="w-full"
							onClick={onConfirm}
							disabled={cancelLoading.isOpen || confirmLoading.isOpen}
						>
							{confirmLoading.isOpen && (
								<Loader2 className="mr-2 animate-spin" />
							)}
							<span>{confirm?.confirmText ?? 'Confirm'}</span>
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
			{children}
		</ConfirmationContext.Provider>
	)
}

export default ConfirmationProvider
