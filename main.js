/**
 * Copyright (c) 2024 DeAundre Payne
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 *
 * @module dom-matrix
 * @license GPL-3.0
 **/

const _2DKeys = [0, 1, 4, 5, 12, 13]
const aliasKeys = ['a', 'b', 'c', 'd', 'e', 'f']

// javascript # private properties can not be accessed from a child class
// Therefore setters defined on DOMMatrix can not access private properties defined on DOMMatrixReadOnly
// class syntax does not allow this to be accessed before calling super

const dataSymbol = Symbol('data')
const setIsIdentitySymbol = Symbol('setIsIdentity')
let readOnly = true

/** @typedef {import('dom-matrix').IDOMMatrix} IDOMMatrix */
/** @typedef {import('dom-matrix').IDOMMatrixReadOnly} IDOMMatrixReadOnly */

/**
 * @class
 * @implements {IDOMMatrixReadOnly}
 */
export class DOMMatrixReadOnly {
	is2D = true
	isIdentity = true
	a = 0
	b = 0
	c = 0
	d = 0
	e = 0
	f = 0
	m11 = 0
	m12 = 0
	m13 = 0
	m14 = 0
	m21 = 0
	m22 = 0
	m23 = 0
	m24 = 0
	m31 = 0
	m32 = 0
	m33 = 0
	m34 = 0
	m41 = 0
	m42 = 0
	m43 = 0
	m44 = 0
	
	/**
	 * @param {IDOMMatrixReadOnly | ArrayLike<number>} init
	 */
	constructor(init) {
		/** @type {*} */
		this[dataSymbol] = [
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
		]
		this[dataSymbol].isIdentity = true
		
		if (init !== undefined) {
			if ((init instanceof DOMMatrixReadOnly) === true) {
				this.is2D = init.is2D
				
				for (let i = 0; i < 16; i++) {
					this[dataSymbol][i] = init[dataSymbol][i]
				}
			} else if (init.length === undefined) throw new ReferenceError('init.length must be defined')
			else if (init.length !== 6 && init.length !== 16) throw new RangeError('init.length must equal 6 or 16')
			else {
				for (let i = 0; i < init.length; i++) {
					if (init[i] === undefined) throw new ReferenceError(`init[${i}] must be defined`)
					if (typeof init[i] !== 'number') init[i] = Number(init[i]) // throw new TypeError(`init[${i}] must be a number`)
				}
				
				if (init.length === 6) {
					for (let i = 0; i < _2DKeys.length; i++) {
						this[dataSymbol][_2DKeys[i]] = init[i]
					}
				} else {
					this.is2D = false
					
					for (let i = 0; i < 16; i++) {
						this[dataSymbol][i] = init[i]
					}
				}
			}
		}
		
		for (let i = 0; i < 16; i++) {
			if (i % 5 === 0) { if (this[dataSymbol][i] !== 1) this[dataSymbol].isIdentity = false }
			else if (this[dataSymbol][i] !== 0) {
				this[dataSymbol].isIdentity = false
				break
			}
		}
		
		for (let i = 0; i < aliasKeys.length; i++) {
			this[aliasKeys[i]] = this[dataSymbol][_2DKeys[i]]
		}
		
		if (readOnly === true) {
			for (let i = 0; i < 4; i++) {
				for (let j = 0; j < 4; j++) {
					this[`m${i + 1}${j + 1}`] = this[dataSymbol][i * 4 + j]
				}
			}
			
			this.isIdentity = this[dataSymbol].isIdentity
			
			Object.freeze(this)
		} else {
			readOnly = true
			for (let i = 0; i < 4; i++) {
				for (let j = 0; j < 4; j++) {
					delete this[`m${i + 1}${j + 1}`]
				}
			}
			
			delete this.isIdentity
			delete this.a
			delete this.b
			delete this.c
			delete this.d
			delete this.e
			delete this.f
		}
	}
	
	/**
	 * 
	 */
	[setIsIdentitySymbol]() {
		if (this[dataSymbol][0] === 1 &&
			this[dataSymbol][1] === 0 &&
			this[dataSymbol][2] === 0 &&
			this[dataSymbol][3] === 0 &&
			this[dataSymbol][4] === 0 &&
			this[dataSymbol][5] === 1 &&
			this[dataSymbol][6] === 0 &&
			this[dataSymbol][7] === 0 &&
			this[dataSymbol][8] === 0 &&
			this[dataSymbol][9] === 0 &&
			this[dataSymbol][10] === 1 &&
			this[dataSymbol][11] === 0 &&
			this[dataSymbol][12] === 0 &&
			this[dataSymbol][13] === 0 &&
			this[dataSymbol][14] === 0 &&
			this[dataSymbol][15] === 1) this[dataSymbol].isIdentity = true
		else this[dataSymbol].isIdentity = false
	}
	
	/**
	 * @return {DOMMatrix}
	 */
	flipX() {
		const result = new DOMMatrix(this)
		
		result[dataSymbol][0] *= -1
		result[dataSymbol][1] *= -1
		result[dataSymbol][2] *= -1
		result[dataSymbol][3] *= -1
		
		return result
	}
	
	/**
	 * @return {DOMMatrix}
	 */
	flipY() {
		const result = new DOMMatrix(this)
		
		result[dataSymbol][4] *= -1
		result[dataSymbol][5] *= -1
		result[dataSymbol][6] *= -1
		result[dataSymbol][7] *= -1
		
		return result
	}
	
	/**
	 * @param {DOMMatrixReadOnly} other
	 * @return {DOMMatrix}
	 */
	multiply(other) {
		if (other === undefined) throw new ReferenceError('other must be defined')
		else if ((other instanceof DOMMatrixReadOnly) === false) throw new TypeError('other must be a DOMMatrixReadOnly')
		
		const result = new DOMMatrix(this)
		
		for (let i = 0; i < 4; i++) {
			for (let j = 0; j < 4; j++) {
				let sum = 0
				
				for (let k = 0; k < 4; k++) {
					sum += this[dataSymbol][k * 4 + i] * other[dataSymbol][j * 4 + k]
				}
				
				result[dataSymbol][j * 4 + i] = sum
				
				if (i === j) { if (result[dataSymbol][i] !== 1) result[dataSymbol].isIdentity = false }
				else if (result[dataSymbol][i] !== 0) {
					result[dataSymbol].isIdentity = false
				}
			}
		}
		
		return result
	}
	
	/**
	 * @return {Float32Array}
	 */
	toFloat32Array() {
		return new Float32Array(this[dataSymbol])
	}
	
	/**
	 * @return {Float64Array}
	 */
	toFloat64Array() {
		return new Float64Array(this[dataSymbol])
	}
	
	/**
	 * @return {string}
	 */
	toString() {
		let string = ''
		
		if (this.is2D === true) {
			string += 'matrix('
			
			for (let i = 0; i < _2DKeys.length - 1; i++) {
				string += `${this[dataSymbol][_2DKeys[i]]}, `
			}
			
			string += `${this[dataSymbol][13]})`
		} else {
			string += 'matrix3d('
			
			for (let i = 0; i < 16; i++) {
				if (i === 15) string += `${this[dataSymbol][15]})`
				else string += `${this[dataSymbol][i]}, `
			}
		}
		
		return string
	}
}

/**
 * @class
 * @extends DOMMatrixReadOnly
 * @implements {IDOMMatrix}
 */
export class DOMMatrix extends DOMMatrixReadOnly {
	/**
	 * @param {IDOMMatrixReadOnly | ArrayLike<number>} init
	 */
	constructor(init) {
		readOnly = false
		
		super(init)
	}
	
	get isIdentity() { return this[dataSymbol].isIdentity }
	set isIdentity(n) {}
	
	get a() { return this[dataSymbol][0] }
	set a(n) {
		if (typeof n !== 'number') n = Number(n)
		if ((this[dataSymbol][0] = n) !== 1) this[dataSymbol].isIdentity = false
		else this[setIsIdentitySymbol]()
	}
	
	get b() { return this[dataSymbol][1] }
	set b(n) {
		if ((this[dataSymbol][1] = n) !== 0) this[dataSymbol].isIdentity =  false
		else this[setIsIdentitySymbol]()
	}
	
	get c() { return this[dataSymbol][4] }
	set c(n) {
		if ((this[dataSymbol][4] = n) !== 0) this[dataSymbol].isIdentity =  false
		else this[setIsIdentitySymbol]()
	}
	
	get d() { return this[dataSymbol][5] }
	set d(n) {
		if ((this[dataSymbol][5] = n) !== 1) this[dataSymbol].isIdentity =  false
		else this[setIsIdentitySymbol]()
	}
	
	get e() { return this[dataSymbol][12] }
	set e(n) {
		if ((this[dataSymbol][12] = n) !== 0) this[dataSymbol].isIdentity =  false
		else this[setIsIdentitySymbol]()
	}
	
	get f() { return this[dataSymbol][13] }
	set f(n) {
		if ((this[dataSymbol][13] = n) !== 0) this[dataSymbol].isIdentity =  false
		else this[setIsIdentitySymbol]()
	}
	
	get m11() { return this[dataSymbol][0] }
	set m11(n) {
		if ((this[dataSymbol][0] = n) !== 1) this[dataSymbol].isIdentity =  false
		else this[setIsIdentitySymbol]()
	}
	
	get m12() { return this[dataSymbol][1] }
	set m12(n) {
		if ((this[dataSymbol][1] = n) !== 0) this[dataSymbol].isIdentity =  false
		else this[setIsIdentitySymbol]()
	}
	
	get m13() { return this[dataSymbol][2] }
	set m13(n) {
		if ((this[dataSymbol][2] = n) !== 0) this[dataSymbol].isIdentity =  false
		else this[setIsIdentitySymbol]()
	}
	
	get m14() { return this[dataSymbol][3] }
	set m14(n){
		if ((this[dataSymbol][3] = n) !== 0) this[dataSymbol].isIdentity =  false
		else this[setIsIdentitySymbol]()
	}
	
	get m21() { return this[dataSymbol][4] }
	set m21(n) {
		if ((this[dataSymbol][4] = n) !== 0) this[dataSymbol].isIdentity =  false
		else this[setIsIdentitySymbol]()
	}
	
	get m22() { return this[dataSymbol][5] }
	set m22(n) {
		if ((this[dataSymbol][5] = n) !== 1) this[dataSymbol].isIdentity =  false
		else this[setIsIdentitySymbol]()
	}
	
	get m23() { return this[dataSymbol][6] }
	set m23(n) {
		if ((this[dataSymbol][6] = n) !== 0) this[dataSymbol].isIdentity =  false
		else this[setIsIdentitySymbol]()
	}
	
	get m24() { return this[dataSymbol][7] }
	set m24(n) {
		if ((this[dataSymbol][7] = n) !== 0) this[dataSymbol].isIdentity =  false
		else this[setIsIdentitySymbol]()
	}
	
	get m31() { return this[dataSymbol][8] }
	set m31(n) {
		if ((this[dataSymbol][8] = n) !== 0) this[dataSymbol].isIdentity =  false
		else this[setIsIdentitySymbol]()
	}
	
	get m32() { return this[dataSymbol][9] }
	set m32(n) {
		if ((this[dataSymbol][9] = n) !== 0) this[dataSymbol].isIdentity =  false
		else this[setIsIdentitySymbol]()
	}
	
	get m33() { return this[dataSymbol][10] }
	set m33(n) {
		if ((this[dataSymbol][10] = n) !== 1) this[dataSymbol].isIdentity =  false
		else this[setIsIdentitySymbol]()
	}
	
	get m34() { return this[dataSymbol][11] }
	set m34(n) {
		if ((this[dataSymbol][11] = n) !== 0) this[dataSymbol].isIdentity =  false
		else this[setIsIdentitySymbol]()
	}
	
	get m41() { return this[dataSymbol][12] }
	set m41(n) {
		if ((this[dataSymbol][12] = n) !== 0) this[dataSymbol].isIdentity =  false
		else this[setIsIdentitySymbol]()
	}
	
	get m42() { return this[dataSymbol][13] }
	set m42(n) {
		if ((this[dataSymbol][13] = n) !== 0) this[dataSymbol].isIdentity =  false
		else this[setIsIdentitySymbol]()
	}
	
	get m43() { return this[dataSymbol][14] }
	set m43(n) {
		if ((this[dataSymbol][14] = n) !== 0) this[dataSymbol].isIdentity =  false
		else this[setIsIdentitySymbol]()
	}
	
	get m44() { return this[dataSymbol][15] }
	set m44(n) {
		if ((this[dataSymbol][15] = n) !== 1) this[dataSymbol].isIdentity =  false
		else this[setIsIdentitySymbol]()
	}
	
	/**
	 * @param {DOMMatrixReadOnly} other
	 * @return {DOMMatrix}
	 */
	multiplySelf(other) {
		if (other === undefined) throw new ReferenceError('other must be defined')
		else if ((other instanceof DOMMatrixReadOnly) === false) throw new TypeError('other must be a DOMMatrix')
		
		const a = [...this[dataSymbol]]
		const b = other[dataSymbol]
		
		for (let i = 0; i < 4; i++) {
			for (let j = 0; j < 4; j++) {
				let sum = 0
				
				for (let k = 0; k < 4; k++) {
					sum += a[k * 4 + i] * b[j * 4 + k]
				}
				
				this[dataSymbol][j * 4 + i] = sum
			}
		}
		
		return this
	}
}