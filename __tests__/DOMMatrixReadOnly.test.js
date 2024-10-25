import { expect, test } from '@jest/globals'
import { DOMMatrixReadOnly, DOMMatrix } from '../main.js'

test('Throw Error if init is defined but not a DOMMatrixReadOnly or an ArrayLike<number>', () => {
	expect(() => new DOMMatrixReadOnly(null)).toThrow(Error)
	expect(() => new DOMMatrixReadOnly(true)).toThrow(Error)
	expect(() => new DOMMatrixReadOnly('')).toThrow(Error)
	expect(() => new DOMMatrixReadOnly(Symbol())).toThrow(Error)
	expect(() => new DOMMatrixReadOnly({})).toThrow(Error)
})

test('DOMMatrixReadOnly instance fits the standard and is read only', () => {
	const checkDOMMatrix = matrix => {
		if ((typeof matrix.is2D !== 'boolean') ||
			(typeof matrix.isIdentity !== 'boolean')) { console.log(matrix); return false }
			
			try {
				matrix.is2D = matrix.isIdentity = null
				
				if (matrix.is2D === null || matrix.isIdentity === null) { console.log(matrix); return false }
			} catch (error) {}
		
		let identity = true
		for (let i = 1; i < 5; i++) {
			for (let j = 1; j < 5; j++) {
				const n = matrix[`m${i}${j}`]
				
				if (typeof n !== 'number') { console.log(matrix); return false }
				else if (i === j) {
					if (n !== 1) identity = false
				} else if (n !== 0) identity = false
				
				try {
					matrix[`m${i}${j}`] = null
				
					if (matrix[`m${i}${j}`] === null) { console.log(matrix); return false }
				} catch (error) {}
			}
		}
		
		if (matrix.isIdentity !== identity) { console.log(matrix); return false }
		
		if ((typeof matrix.a !== 'number' || matrix.a !== matrix.m11) ||
			(typeof matrix.b !== 'number' || matrix.b !== matrix.m12) ||
			(typeof matrix.c !== 'number' || matrix.c !== matrix.m21) ||
			(typeof matrix.d !== 'number' || matrix.d !== matrix.m22) ||
			(typeof matrix.e !== 'number' || matrix.e !== matrix.m41) ||
			(typeof matrix.f !== 'number' || matrix.f !== matrix.m42)) { console.log(matrix); return false }
		
		try {
			matrix.a = matrix.b = matrix.c = matrix.d = matrix.e = matrix.f = null
		
			if ((matrix.a === null) ||
				(matrix.b === null) ||
				(matrix.c === null) ||
				(matrix.d === null) ||
				(matrix.e === null) ||
				(matrix.f === null)) { console.log(matrix); return false }
		} catch (error) {}
		
		return true
	}
	
	const a = new DOMMatrixReadOnly
	const b = new DOMMatrixReadOnly([1, 2, 3, 4, 5, 6])
	const c = new DOMMatrixReadOnly([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16])
	
	expect(checkDOMMatrix(a)).toBe(true)
	expect(a.is2D).toBe(true)
	expect(checkDOMMatrix(b)).toBe(true)
	expect(b.is2D).toBe(true)
	expect(checkDOMMatrix(c)).toBe(true)
	expect(c.is2D).toBe(false)
})

test('flip x-axis and return a DOMMatrix', () => {
	const a = new DOMMatrixReadOnly([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16])
	
	expect(a.flipX()).toStrictEqual(new DOMMatrix([-1, -2, -3, -4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]))
})

test('flip y-axis and return a DOMMatrix', () => {
	const a = new DOMMatrixReadOnly([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16])
	
	expect(a.flipY()).toStrictEqual(new DOMMatrix([1, 2, 3, 4, -5, -6, -7, -8, 9, 10, 11, 12, 13, 14, 15, 16]))
})

test('multiply throws Error if other is not a DOMMatrixReadOnly', () => {
	const a = new DOMMatrixReadOnly
	
	expect(() => a.multiply()).toThrow(Error)
	expect(() => a.multiply(undefined)).toThrow(Error)
})

test('multiply a times b and return a DOMMatrix', () => {
	const a = new DOMMatrixReadOnly([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16])
	const b = new DOMMatrixReadOnly([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16])
	
	expect(a.multiply(b)).toStrictEqual(new DOMMatrix([90, 100, 110, 120, 202, 228, 254, 280, 314, 356, 398, 440, 426, 484, 542, 600]))
})