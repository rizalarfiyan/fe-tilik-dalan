class ErrorAuthorization extends Error {
	constructor(message = 'Unauthorized') {
		super(message)
		this.message = message
	}

	toString() {
		return this.message
	}
}

class ErrorValidation extends Error {
	protected data: object

	constructor(message = 'Validation Error', data: object = {}) {
		super(message)
		this.message = message
		this.data = data
	}

	toString() {
		return this.message
	}

	getData() {
		return this.data
	}
}

export { ErrorAuthorization, ErrorValidation }
