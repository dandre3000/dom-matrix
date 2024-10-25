import { expect, test } from '@jest/globals'
import { DOMMatrix } from '../main.js'

test('Throw Error if init is defined but not a DOMMatrix or an ArrayLike<number>', () => {
	expect(() => new DOMMatrix(null)).toThrow(Error)
	expect(() => new DOMMatrix(true)).toThrow(Error)
	expect(() => new DOMMatrix('')).toThrow(Error)
	expect(() => new DOMMatrix(Symbol())).toThrow(Error)
	expect(() => new DOMMatrix({})).toThrow(Error)
})

test('Is not read only', () => {
	const matrix = new DOMMatrix
	matrix.m11 = 9
	
	expect(matrix.m11).toBe(9)
})

test('2D alias properties always have the correct values', () => {
	const matrix = new DOMMatrix
	matrix.a = 2
	matrix.b = 3
	matrix.c = 4
	matrix.d = 5
	matrix.e = 6
	matrix.f = 7
	
	expect(matrix.m11).toBe(2)
	expect(matrix.m12).toBe(3)
	expect(matrix.m21).toBe(4)
	expect(matrix.m22).toBe(5)
	expect(matrix.m41).toBe(6)
	expect(matrix.m42).toBe(7)
	
	matrix.m11 = 1
	matrix.m12 = 0
	matrix.m21 = 0
	matrix.m22 = 1
	matrix.m41 = 0
	matrix.m42 = 0
	
	expect(matrix.a).toBe(1)
	expect(matrix.b).toBe(0)
	expect(matrix.c).toBe(0)
	expect(matrix.d).toBe(1)
	expect(matrix.e).toBe(0)
	expect(matrix.f).toBe(0)
})

test('isIdentity always has the correct value', () => {
	const matrix = new DOMMatrix
	matrix.isIdentity = false
	
	expect(matrix.isIdentity).toBe(true)
	
	matrix.m11 = 2
	
	expect(matrix.isIdentity).toBe(false)
	
	matrix.m11 = 1
	
	expect(matrix.isIdentity).toBe(true)
})

test('multiplySelf throws Error if other is not a DOMMatrix', () => {
	const a = new DOMMatrix
	
	expect(() => a.multiplySelf()).toThrow(Error)
	expect(() => a.multiplySelf(undefined)).toThrow(Error)
})

test('multiply a times b, mutate and return a', () => {
	const a = new DOMMatrix([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16])
	const b = new DOMMatrix([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16])
	
	expect(a.multiplySelf(b)).toBe(a)
	expect(a).toStrictEqual(new DOMMatrix([90, 100, 110, 120, 202, 228, 254, 280, 314, 356, 398, 440, 426, 484, 542, 600]))
})