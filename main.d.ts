/**
 * Copyright (c) 2024 DeAundre Payne
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY, without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 **/

declare module 'dom-matrix' {
	export interface IDOMMatrixReadOnly {
		readonly is2D: boolean
		readonly isIdentity: boolean
		readonly a: number
		readonly b: number
		readonly c: number
		readonly d: number
		readonly e: number
		readonly f: number
		readonly m11: number
		readonly m12: number
		readonly m13: number
		readonly m14: number
		readonly m21: number
		readonly m22: number
		readonly m23: number
		readonly m24: number
		readonly m31: number
		readonly m32: number
		readonly m33: number
		readonly m34: number
		readonly m41: number
		readonly m42: number
		readonly m43: number
		readonly m44: number
		flipX(): IDOMMatrix
		flipY(): IDOMMatrix
		multiply(other: IDOMMatrixReadOnly): IDOMMatrix
		toFloat64Array(): Float64Array
	}
	
	export interface IDOMMatrix extends IDOMMatrixReadOnly {
		a: number
		b: number
		c: number
		d: number
		e: number
		f: number
		m11: number
		m12: number
		m13: number
		m14: number
		m21: number
		m22: number
		m23: number
		m24: number
		m31: number
		m32: number
		m33: number
		m34: number
		m41: number
		m42: number
		m43: number
		m44: number
		multiplySelf(other: IDOMMatrixReadOnly): IDOMMatrix
	}
}