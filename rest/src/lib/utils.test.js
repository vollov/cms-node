import { publicAPI } from './utils'

describe('test fun publicAPI', () => {
	it('POST /api/auth/login is public API', () => {
		// const reg = /\/api\/auth\/login/g
		// const r  = reg.test('/api/auth/login')
		// expect(r).toEqual(true)
		expect(publicAPI('POST', '/api/auth/login')).toEqual(true)
	})

	it('GET /api/auth/google/login/AABBCC is public API', () => {
		expect(publicAPI('GET', '/api/auth/google/login/AABBCC')).toEqual(true)
	})

	it('GET /api/products/ABB is public API', () => {
		expect(publicAPI('GET', '/api/products/ABB')).toEqual(true)
	})

	it('GET /api/products/BAT0001 is public API', () => {
		expect(publicAPI('GET', '/api/products/BAT0001')).toEqual(true)
	})

	it('GET /api/products is public API', () => {
		expect(publicAPI('GET', '/api/products')).toEqual(true)
	})
})
