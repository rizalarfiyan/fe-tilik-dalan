import { Toaster } from '@components/ui/sonner'
import AuthProvider from '@providers/auth-provider'
import ConfirmationProvider from '@providers/confirmation-provider'
import RouteProvider from '@providers/route-provider'

function App() {
	return (
		<ConfirmationProvider>
			<AuthProvider>
				<RouteProvider />
			</AuthProvider>
			<Toaster />
		</ConfirmationProvider>
	)
}

export default App
