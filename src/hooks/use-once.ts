import * as React from 'react'

function useOnce<T = unknown>(cb: () => T) {
	const isCalledRef = React.useRef(false)

	React.useEffect(() => {
		if (!isCalledRef.current) {
			isCalledRef.current = true
			cb()
		}
	}, [cb])
}

export default useOnce
