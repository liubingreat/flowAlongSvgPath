
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.flowAlongSvgPath = {}));
})(this, (function (exports) { 'use strict';

	/**
	 * @license
	 * Copyright 2010-2023 Three.js Authors
	 * SPDX-License-Identifier: MIT
	 */
	const REVISION = '152';

	const UVMapping = 300;
	const RepeatWrapping = 1000;
	const ClampToEdgeWrapping = 1001;
	const MirroredRepeatWrapping = 1002;
	const LinearFilter = 1006;
	const LinearMipmapLinearFilter = 1008;
	const UnsignedByteType = 1009;
	const RGBAFormat = 1023;
	/** @deprecated Use LinearSRGBColorSpace or NoColorSpace in three.js r152+. */
	const LinearEncoding = 3000;
	/** @deprecated Use SRGBColorSpace in three.js r152+. */
	const sRGBEncoding = 3001;

	// Color space string identifiers, matching CSS Color Module Level 4 and WebGPU names where available.
	const NoColorSpace = '';
	const SRGBColorSpace = 'srgb';
	const LinearSRGBColorSpace = 'srgb-linear';
	const DisplayP3ColorSpace = 'display-p3';

	const StaticDrawUsage = 35044;

	/**
	 * https://github.com/mrdoob/eventdispatcher.js/
	 */

	class EventDispatcher {

		addEventListener( type, listener ) {

			if ( this._listeners === undefined ) this._listeners = {};

			const listeners = this._listeners;

			if ( listeners[ type ] === undefined ) {

				listeners[ type ] = [];

			}

			if ( listeners[ type ].indexOf( listener ) === - 1 ) {

				listeners[ type ].push( listener );

			}

		}

		hasEventListener( type, listener ) {

			if ( this._listeners === undefined ) return false;

			const listeners = this._listeners;

			return listeners[ type ] !== undefined && listeners[ type ].indexOf( listener ) !== - 1;

		}

		removeEventListener( type, listener ) {

			if ( this._listeners === undefined ) return;

			const listeners = this._listeners;
			const listenerArray = listeners[ type ];

			if ( listenerArray !== undefined ) {

				const index = listenerArray.indexOf( listener );

				if ( index !== - 1 ) {

					listenerArray.splice( index, 1 );

				}

			}

		}

		dispatchEvent( event ) {

			if ( this._listeners === undefined ) return;

			const listeners = this._listeners;
			const listenerArray = listeners[ event.type ];

			if ( listenerArray !== undefined ) {

				event.target = this;

				// Make a copy, in case listeners are removed while iterating.
				const array = listenerArray.slice( 0 );

				for ( let i = 0, l = array.length; i < l; i ++ ) {

					array[ i ].call( this, event );

				}

				event.target = null;

			}

		}

	}

	const _lut = [ '00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '0a', '0b', '0c', '0d', '0e', '0f', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '1a', '1b', '1c', '1d', '1e', '1f', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '2a', '2b', '2c', '2d', '2e', '2f', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '3a', '3b', '3c', '3d', '3e', '3f', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '4a', '4b', '4c', '4d', '4e', '4f', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '5a', '5b', '5c', '5d', '5e', '5f', '60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '6a', '6b', '6c', '6d', '6e', '6f', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '7a', '7b', '7c', '7d', '7e', '7f', '80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '8a', '8b', '8c', '8d', '8e', '8f', '90', '91', '92', '93', '94', '95', '96', '97', '98', '99', '9a', '9b', '9c', '9d', '9e', '9f', 'a0', 'a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8', 'a9', 'aa', 'ab', 'ac', 'ad', 'ae', 'af', 'b0', 'b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8', 'b9', 'ba', 'bb', 'bc', 'bd', 'be', 'bf', 'c0', 'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'ca', 'cb', 'cc', 'cd', 'ce', 'cf', 'd0', 'd1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8', 'd9', 'da', 'db', 'dc', 'dd', 'de', 'df', 'e0', 'e1', 'e2', 'e3', 'e4', 'e5', 'e6', 'e7', 'e8', 'e9', 'ea', 'eb', 'ec', 'ed', 'ee', 'ef', 'f0', 'f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'fa', 'fb', 'fc', 'fd', 'fe', 'ff' ];

	// http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/21963136#21963136
	function generateUUID() {

		const d0 = Math.random() * 0xffffffff | 0;
		const d1 = Math.random() * 0xffffffff | 0;
		const d2 = Math.random() * 0xffffffff | 0;
		const d3 = Math.random() * 0xffffffff | 0;
		const uuid = _lut[ d0 & 0xff ] + _lut[ d0 >> 8 & 0xff ] + _lut[ d0 >> 16 & 0xff ] + _lut[ d0 >> 24 & 0xff ] + '-' +
				_lut[ d1 & 0xff ] + _lut[ d1 >> 8 & 0xff ] + '-' + _lut[ d1 >> 16 & 0x0f | 0x40 ] + _lut[ d1 >> 24 & 0xff ] + '-' +
				_lut[ d2 & 0x3f | 0x80 ] + _lut[ d2 >> 8 & 0xff ] + '-' + _lut[ d2 >> 16 & 0xff ] + _lut[ d2 >> 24 & 0xff ] +
				_lut[ d3 & 0xff ] + _lut[ d3 >> 8 & 0xff ] + _lut[ d3 >> 16 & 0xff ] + _lut[ d3 >> 24 & 0xff ];

		// .toLowerCase() here flattens concatenated strings to save heap memory space.
		return uuid.toLowerCase();

	}

	function clamp( value, min, max ) {

		return Math.max( min, Math.min( max, value ) );

	}

	// compute euclidean modulo of m % n
	// https://en.wikipedia.org/wiki/Modulo_operation
	function euclideanModulo( n, m ) {

		return ( ( n % m ) + m ) % m;

	}

	// https://en.wikipedia.org/wiki/Linear_interpolation
	function lerp( x, y, t ) {

		return ( 1 - t ) * x + t * y;

	}

	function denormalize( value, array ) {

		switch ( array.constructor ) {

			case Float32Array:

				return value;

			case Uint16Array:

				return value / 65535.0;

			case Uint8Array:

				return value / 255.0;

			case Int16Array:

				return Math.max( value / 32767.0, - 1.0 );

			case Int8Array:

				return Math.max( value / 127.0, - 1.0 );

			default:

				throw new Error( 'Invalid component type.' );

		}

	}

	function normalize( value, array ) {

		switch ( array.constructor ) {

			case Float32Array:

				return value;

			case Uint16Array:

				return Math.round( value * 65535.0 );

			case Uint8Array:

				return Math.round( value * 255.0 );

			case Int16Array:

				return Math.round( value * 32767.0 );

			case Int8Array:

				return Math.round( value * 127.0 );

			default:

				throw new Error( 'Invalid component type.' );

		}

	}

	class Vector2 {

		constructor( x = 0, y = 0 ) {

			Vector2.prototype.isVector2 = true;

			this.x = x;
			this.y = y;

		}

		get width() {

			return this.x;

		}

		set width( value ) {

			this.x = value;

		}

		get height() {

			return this.y;

		}

		set height( value ) {

			this.y = value;

		}

		set( x, y ) {

			this.x = x;
			this.y = y;

			return this;

		}

		setScalar( scalar ) {

			this.x = scalar;
			this.y = scalar;

			return this;

		}

		setX( x ) {

			this.x = x;

			return this;

		}

		setY( y ) {

			this.y = y;

			return this;

		}

		setComponent( index, value ) {

			switch ( index ) {

				case 0: this.x = value; break;
				case 1: this.y = value; break;
				default: throw new Error( 'index is out of range: ' + index );

			}

			return this;

		}

		getComponent( index ) {

			switch ( index ) {

				case 0: return this.x;
				case 1: return this.y;
				default: throw new Error( 'index is out of range: ' + index );

			}

		}

		clone() {

			return new this.constructor( this.x, this.y );

		}

		copy( v ) {

			this.x = v.x;
			this.y = v.y;

			return this;

		}

		add( v ) {

			this.x += v.x;
			this.y += v.y;

			return this;

		}

		addScalar( s ) {

			this.x += s;
			this.y += s;

			return this;

		}

		addVectors( a, b ) {

			this.x = a.x + b.x;
			this.y = a.y + b.y;

			return this;

		}

		addScaledVector( v, s ) {

			this.x += v.x * s;
			this.y += v.y * s;

			return this;

		}

		sub( v ) {

			this.x -= v.x;
			this.y -= v.y;

			return this;

		}

		subScalar( s ) {

			this.x -= s;
			this.y -= s;

			return this;

		}

		subVectors( a, b ) {

			this.x = a.x - b.x;
			this.y = a.y - b.y;

			return this;

		}

		multiply( v ) {

			this.x *= v.x;
			this.y *= v.y;

			return this;

		}

		multiplyScalar( scalar ) {

			this.x *= scalar;
			this.y *= scalar;

			return this;

		}

		divide( v ) {

			this.x /= v.x;
			this.y /= v.y;

			return this;

		}

		divideScalar( scalar ) {

			return this.multiplyScalar( 1 / scalar );

		}

		applyMatrix3( m ) {

			const x = this.x, y = this.y;
			const e = m.elements;

			this.x = e[ 0 ] * x + e[ 3 ] * y + e[ 6 ];
			this.y = e[ 1 ] * x + e[ 4 ] * y + e[ 7 ];

			return this;

		}

		min( v ) {

			this.x = Math.min( this.x, v.x );
			this.y = Math.min( this.y, v.y );

			return this;

		}

		max( v ) {

			this.x = Math.max( this.x, v.x );
			this.y = Math.max( this.y, v.y );

			return this;

		}

		clamp( min, max ) {

			// assumes min < max, componentwise

			this.x = Math.max( min.x, Math.min( max.x, this.x ) );
			this.y = Math.max( min.y, Math.min( max.y, this.y ) );

			return this;

		}

		clampScalar( minVal, maxVal ) {

			this.x = Math.max( minVal, Math.min( maxVal, this.x ) );
			this.y = Math.max( minVal, Math.min( maxVal, this.y ) );

			return this;

		}

		clampLength( min, max ) {

			const length = this.length();

			return this.divideScalar( length || 1 ).multiplyScalar( Math.max( min, Math.min( max, length ) ) );

		}

		floor() {

			this.x = Math.floor( this.x );
			this.y = Math.floor( this.y );

			return this;

		}

		ceil() {

			this.x = Math.ceil( this.x );
			this.y = Math.ceil( this.y );

			return this;

		}

		round() {

			this.x = Math.round( this.x );
			this.y = Math.round( this.y );

			return this;

		}

		roundToZero() {

			this.x = ( this.x < 0 ) ? Math.ceil( this.x ) : Math.floor( this.x );
			this.y = ( this.y < 0 ) ? Math.ceil( this.y ) : Math.floor( this.y );

			return this;

		}

		negate() {

			this.x = - this.x;
			this.y = - this.y;

			return this;

		}

		dot( v ) {

			return this.x * v.x + this.y * v.y;

		}

		cross( v ) {

			return this.x * v.y - this.y * v.x;

		}

		lengthSq() {

			return this.x * this.x + this.y * this.y;

		}

		length() {

			return Math.sqrt( this.x * this.x + this.y * this.y );

		}

		manhattanLength() {

			return Math.abs( this.x ) + Math.abs( this.y );

		}

		normalize() {

			return this.divideScalar( this.length() || 1 );

		}

		angle() {

			// computes the angle in radians with respect to the positive x-axis

			const angle = Math.atan2( - this.y, - this.x ) + Math.PI;

			return angle;

		}

		angleTo( v ) {

			const denominator = Math.sqrt( this.lengthSq() * v.lengthSq() );

			if ( denominator === 0 ) return Math.PI / 2;

			const theta = this.dot( v ) / denominator;

			// clamp, to handle numerical problems

			return Math.acos( clamp( theta, - 1, 1 ) );

		}

		distanceTo( v ) {

			return Math.sqrt( this.distanceToSquared( v ) );

		}

		distanceToSquared( v ) {

			const dx = this.x - v.x, dy = this.y - v.y;
			return dx * dx + dy * dy;

		}

		manhattanDistanceTo( v ) {

			return Math.abs( this.x - v.x ) + Math.abs( this.y - v.y );

		}

		setLength( length ) {

			return this.normalize().multiplyScalar( length );

		}

		lerp( v, alpha ) {

			this.x += ( v.x - this.x ) * alpha;
			this.y += ( v.y - this.y ) * alpha;

			return this;

		}

		lerpVectors( v1, v2, alpha ) {

			this.x = v1.x + ( v2.x - v1.x ) * alpha;
			this.y = v1.y + ( v2.y - v1.y ) * alpha;

			return this;

		}

		equals( v ) {

			return ( ( v.x === this.x ) && ( v.y === this.y ) );

		}

		fromArray( array, offset = 0 ) {

			this.x = array[ offset ];
			this.y = array[ offset + 1 ];

			return this;

		}

		toArray( array = [], offset = 0 ) {

			array[ offset ] = this.x;
			array[ offset + 1 ] = this.y;

			return array;

		}

		fromBufferAttribute( attribute, index ) {

			this.x = attribute.getX( index );
			this.y = attribute.getY( index );

			return this;

		}

		rotateAround( center, angle ) {

			const c = Math.cos( angle ), s = Math.sin( angle );

			const x = this.x - center.x;
			const y = this.y - center.y;

			this.x = x * c - y * s + center.x;
			this.y = x * s + y * c + center.y;

			return this;

		}

		random() {

			this.x = Math.random();
			this.y = Math.random();

			return this;

		}

		*[ Symbol.iterator ]() {

			yield this.x;
			yield this.y;

		}

	}

	class Matrix3 {

		constructor() {

			Matrix3.prototype.isMatrix3 = true;

			this.elements = [

				1, 0, 0,
				0, 1, 0,
				0, 0, 1

			];

		}

		set( n11, n12, n13, n21, n22, n23, n31, n32, n33 ) {

			const te = this.elements;

			te[ 0 ] = n11; te[ 1 ] = n21; te[ 2 ] = n31;
			te[ 3 ] = n12; te[ 4 ] = n22; te[ 5 ] = n32;
			te[ 6 ] = n13; te[ 7 ] = n23; te[ 8 ] = n33;

			return this;

		}

		identity() {

			this.set(

				1, 0, 0,
				0, 1, 0,
				0, 0, 1

			);

			return this;

		}

		copy( m ) {

			const te = this.elements;
			const me = m.elements;

			te[ 0 ] = me[ 0 ]; te[ 1 ] = me[ 1 ]; te[ 2 ] = me[ 2 ];
			te[ 3 ] = me[ 3 ]; te[ 4 ] = me[ 4 ]; te[ 5 ] = me[ 5 ];
			te[ 6 ] = me[ 6 ]; te[ 7 ] = me[ 7 ]; te[ 8 ] = me[ 8 ];

			return this;

		}

		extractBasis( xAxis, yAxis, zAxis ) {

			xAxis.setFromMatrix3Column( this, 0 );
			yAxis.setFromMatrix3Column( this, 1 );
			zAxis.setFromMatrix3Column( this, 2 );

			return this;

		}

		setFromMatrix4( m ) {

			const me = m.elements;

			this.set(

				me[ 0 ], me[ 4 ], me[ 8 ],
				me[ 1 ], me[ 5 ], me[ 9 ],
				me[ 2 ], me[ 6 ], me[ 10 ]

			);

			return this;

		}

		multiply( m ) {

			return this.multiplyMatrices( this, m );

		}

		premultiply( m ) {

			return this.multiplyMatrices( m, this );

		}

		multiplyMatrices( a, b ) {

			const ae = a.elements;
			const be = b.elements;
			const te = this.elements;

			const a11 = ae[ 0 ], a12 = ae[ 3 ], a13 = ae[ 6 ];
			const a21 = ae[ 1 ], a22 = ae[ 4 ], a23 = ae[ 7 ];
			const a31 = ae[ 2 ], a32 = ae[ 5 ], a33 = ae[ 8 ];

			const b11 = be[ 0 ], b12 = be[ 3 ], b13 = be[ 6 ];
			const b21 = be[ 1 ], b22 = be[ 4 ], b23 = be[ 7 ];
			const b31 = be[ 2 ], b32 = be[ 5 ], b33 = be[ 8 ];

			te[ 0 ] = a11 * b11 + a12 * b21 + a13 * b31;
			te[ 3 ] = a11 * b12 + a12 * b22 + a13 * b32;
			te[ 6 ] = a11 * b13 + a12 * b23 + a13 * b33;

			te[ 1 ] = a21 * b11 + a22 * b21 + a23 * b31;
			te[ 4 ] = a21 * b12 + a22 * b22 + a23 * b32;
			te[ 7 ] = a21 * b13 + a22 * b23 + a23 * b33;

			te[ 2 ] = a31 * b11 + a32 * b21 + a33 * b31;
			te[ 5 ] = a31 * b12 + a32 * b22 + a33 * b32;
			te[ 8 ] = a31 * b13 + a32 * b23 + a33 * b33;

			return this;

		}

		multiplyScalar( s ) {

			const te = this.elements;

			te[ 0 ] *= s; te[ 3 ] *= s; te[ 6 ] *= s;
			te[ 1 ] *= s; te[ 4 ] *= s; te[ 7 ] *= s;
			te[ 2 ] *= s; te[ 5 ] *= s; te[ 8 ] *= s;

			return this;

		}

		determinant() {

			const te = this.elements;

			const a = te[ 0 ], b = te[ 1 ], c = te[ 2 ],
				d = te[ 3 ], e = te[ 4 ], f = te[ 5 ],
				g = te[ 6 ], h = te[ 7 ], i = te[ 8 ];

			return a * e * i - a * f * h - b * d * i + b * f * g + c * d * h - c * e * g;

		}

		invert() {

			const te = this.elements,

				n11 = te[ 0 ], n21 = te[ 1 ], n31 = te[ 2 ],
				n12 = te[ 3 ], n22 = te[ 4 ], n32 = te[ 5 ],
				n13 = te[ 6 ], n23 = te[ 7 ], n33 = te[ 8 ],

				t11 = n33 * n22 - n32 * n23,
				t12 = n32 * n13 - n33 * n12,
				t13 = n23 * n12 - n22 * n13,

				det = n11 * t11 + n21 * t12 + n31 * t13;

			if ( det === 0 ) return this.set( 0, 0, 0, 0, 0, 0, 0, 0, 0 );

			const detInv = 1 / det;

			te[ 0 ] = t11 * detInv;
			te[ 1 ] = ( n31 * n23 - n33 * n21 ) * detInv;
			te[ 2 ] = ( n32 * n21 - n31 * n22 ) * detInv;

			te[ 3 ] = t12 * detInv;
			te[ 4 ] = ( n33 * n11 - n31 * n13 ) * detInv;
			te[ 5 ] = ( n31 * n12 - n32 * n11 ) * detInv;

			te[ 6 ] = t13 * detInv;
			te[ 7 ] = ( n21 * n13 - n23 * n11 ) * detInv;
			te[ 8 ] = ( n22 * n11 - n21 * n12 ) * detInv;

			return this;

		}

		transpose() {

			let tmp;
			const m = this.elements;

			tmp = m[ 1 ]; m[ 1 ] = m[ 3 ]; m[ 3 ] = tmp;
			tmp = m[ 2 ]; m[ 2 ] = m[ 6 ]; m[ 6 ] = tmp;
			tmp = m[ 5 ]; m[ 5 ] = m[ 7 ]; m[ 7 ] = tmp;

			return this;

		}

		getNormalMatrix( matrix4 ) {

			return this.setFromMatrix4( matrix4 ).invert().transpose();

		}

		transposeIntoArray( r ) {

			const m = this.elements;

			r[ 0 ] = m[ 0 ];
			r[ 1 ] = m[ 3 ];
			r[ 2 ] = m[ 6 ];
			r[ 3 ] = m[ 1 ];
			r[ 4 ] = m[ 4 ];
			r[ 5 ] = m[ 7 ];
			r[ 6 ] = m[ 2 ];
			r[ 7 ] = m[ 5 ];
			r[ 8 ] = m[ 8 ];

			return this;

		}

		setUvTransform( tx, ty, sx, sy, rotation, cx, cy ) {

			const c = Math.cos( rotation );
			const s = Math.sin( rotation );

			this.set(
				sx * c, sx * s, - sx * ( c * cx + s * cy ) + cx + tx,
				- sy * s, sy * c, - sy * ( - s * cx + c * cy ) + cy + ty,
				0, 0, 1
			);

			return this;

		}

		//

		scale( sx, sy ) {

			this.premultiply( _m3.makeScale( sx, sy ) );

			return this;

		}

		rotate( theta ) {

			this.premultiply( _m3.makeRotation( - theta ) );

			return this;

		}

		translate( tx, ty ) {

			this.premultiply( _m3.makeTranslation( tx, ty ) );

			return this;

		}

		// for 2D Transforms

		makeTranslation( x, y ) {

			this.set(

				1, 0, x,
				0, 1, y,
				0, 0, 1

			);

			return this;

		}

		makeRotation( theta ) {

			// counterclockwise

			const c = Math.cos( theta );
			const s = Math.sin( theta );

			this.set(

				c, - s, 0,
				s, c, 0,
				0, 0, 1

			);

			return this;

		}

		makeScale( x, y ) {

			this.set(

				x, 0, 0,
				0, y, 0,
				0, 0, 1

			);

			return this;

		}

		//

		equals( matrix ) {

			const te = this.elements;
			const me = matrix.elements;

			for ( let i = 0; i < 9; i ++ ) {

				if ( te[ i ] !== me[ i ] ) return false;

			}

			return true;

		}

		fromArray( array, offset = 0 ) {

			for ( let i = 0; i < 9; i ++ ) {

				this.elements[ i ] = array[ i + offset ];

			}

			return this;

		}

		toArray( array = [], offset = 0 ) {

			const te = this.elements;

			array[ offset ] = te[ 0 ];
			array[ offset + 1 ] = te[ 1 ];
			array[ offset + 2 ] = te[ 2 ];

			array[ offset + 3 ] = te[ 3 ];
			array[ offset + 4 ] = te[ 4 ];
			array[ offset + 5 ] = te[ 5 ];

			array[ offset + 6 ] = te[ 6 ];
			array[ offset + 7 ] = te[ 7 ];
			array[ offset + 8 ] = te[ 8 ];

			return array;

		}

		clone() {

			return new this.constructor().fromArray( this.elements );

		}

	}

	const _m3 = /*@__PURE__*/ new Matrix3();

	function arrayNeedsUint32( array ) {

		// assumes larger values usually on last

		for ( let i = array.length - 1; i >= 0; -- i ) {

			if ( array[ i ] >= 65535 ) return true; // account for PRIMITIVE_RESTART_FIXED_INDEX, #24565

		}

		return false;

	}

	function createElementNS( name ) {

		return document.createElementNS( 'http://www.w3.org/1999/xhtml', name );

	}

	const _cache = {};

	function warnOnce( message ) {

		if ( message in _cache ) return;

		_cache[ message ] = true;

		console.warn( message );

	}

	function SRGBToLinear( c ) {

		return ( c < 0.04045 ) ? c * 0.0773993808 : Math.pow( c * 0.9478672986 + 0.0521327014, 2.4 );

	}

	function LinearToSRGB( c ) {

		return ( c < 0.0031308 ) ? c * 12.92 : 1.055 * ( Math.pow( c, 0.41666 ) ) - 0.055;

	}

	/**
	 * Matrices converting P3 <-> Rec. 709 primaries, without gamut mapping
	 * or clipping. Based on W3C specifications for sRGB and Display P3,
	 * and ICC specifications for the D50 connection space. Values in/out
	 * are _linear_ sRGB and _linear_ Display P3.
	 *
	 * Note that both sRGB and Display P3 use the sRGB transfer functions.
	 *
	 * Reference:
	 * - http://www.russellcottrell.com/photo/matrixCalculator.htm
	 */

	const LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = /*@__PURE__*/ new Matrix3().fromArray( [
		0.8224621, 0.0331941, 0.0170827,
		0.1775380, 0.9668058, 0.0723974,
		- 0.0000001, 0.0000001, 0.9105199
	] );

	const LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = /*@__PURE__*/ new Matrix3().fromArray( [
		1.2249401, - 0.0420569, - 0.0196376,
		- 0.2249404, 1.0420571, - 0.0786361,
		0.0000001, 0.0000000, 1.0982735
	] );

	function DisplayP3ToLinearSRGB( color ) {

		// Display P3 uses the sRGB transfer functions
		return color.convertSRGBToLinear().applyMatrix3( LINEAR_DISPLAY_P3_TO_LINEAR_SRGB );

	}

	function LinearSRGBToDisplayP3( color ) {

		// Display P3 uses the sRGB transfer functions
		return color.applyMatrix3( LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 ).convertLinearToSRGB();

	}

	// Conversions from <source> to Linear-sRGB reference space.
	const TO_LINEAR = {
		[ LinearSRGBColorSpace ]: ( color ) => color,
		[ SRGBColorSpace ]: ( color ) => color.convertSRGBToLinear(),
		[ DisplayP3ColorSpace ]: DisplayP3ToLinearSRGB,
	};

	// Conversions to <target> from Linear-sRGB reference space.
	const FROM_LINEAR = {
		[ LinearSRGBColorSpace ]: ( color ) => color,
		[ SRGBColorSpace ]: ( color ) => color.convertLinearToSRGB(),
		[ DisplayP3ColorSpace ]: LinearSRGBToDisplayP3,
	};

	const ColorManagement = {

		enabled: true,

		get legacyMode() {

			console.warn( 'THREE.ColorManagement: .legacyMode=false renamed to .enabled=true in r150.' );

			return ! this.enabled;

		},

		set legacyMode( legacyMode ) {

			console.warn( 'THREE.ColorManagement: .legacyMode=false renamed to .enabled=true in r150.' );

			this.enabled = ! legacyMode;

		},

		get workingColorSpace() {

			return LinearSRGBColorSpace;

		},

		set workingColorSpace( colorSpace ) {

			console.warn( 'THREE.ColorManagement: .workingColorSpace is readonly.' );

		},

		convert: function ( color, sourceColorSpace, targetColorSpace ) {

			if ( this.enabled === false || sourceColorSpace === targetColorSpace || ! sourceColorSpace || ! targetColorSpace ) {

				return color;

			}

			const sourceToLinear = TO_LINEAR[ sourceColorSpace ];
			const targetFromLinear = FROM_LINEAR[ targetColorSpace ];

			if ( sourceToLinear === undefined || targetFromLinear === undefined ) {

				throw new Error( `Unsupported color space conversion, "${ sourceColorSpace }" to "${ targetColorSpace }".` );

			}

			return targetFromLinear( sourceToLinear( color ) );

		},

		fromWorkingColorSpace: function ( color, targetColorSpace ) {

			return this.convert( color, this.workingColorSpace, targetColorSpace );

		},

		toWorkingColorSpace: function ( color, sourceColorSpace ) {

			return this.convert( color, sourceColorSpace, this.workingColorSpace );

		},

	};

	let _canvas;

	class ImageUtils {

		static getDataURL( image ) {

			if ( /^data:/i.test( image.src ) ) {

				return image.src;

			}

			if ( typeof HTMLCanvasElement === 'undefined' ) {

				return image.src;

			}

			let canvas;

			if ( image instanceof HTMLCanvasElement ) {

				canvas = image;

			} else {

				if ( _canvas === undefined ) _canvas = createElementNS( 'canvas' );

				_canvas.width = image.width;
				_canvas.height = image.height;

				const context = _canvas.getContext( '2d' );

				if ( image instanceof ImageData ) {

					context.putImageData( image, 0, 0 );

				} else {

					context.drawImage( image, 0, 0, image.width, image.height );

				}

				canvas = _canvas;

			}

			if ( canvas.width > 2048 || canvas.height > 2048 ) {

				console.warn( 'THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons', image );

				return canvas.toDataURL( 'image/jpeg', 0.6 );

			} else {

				return canvas.toDataURL( 'image/png' );

			}

		}

		static sRGBToLinear( image ) {

			if ( ( typeof HTMLImageElement !== 'undefined' && image instanceof HTMLImageElement ) ||
				( typeof HTMLCanvasElement !== 'undefined' && image instanceof HTMLCanvasElement ) ||
				( typeof ImageBitmap !== 'undefined' && image instanceof ImageBitmap ) ) {

				const canvas = createElementNS( 'canvas' );

				canvas.width = image.width;
				canvas.height = image.height;

				const context = canvas.getContext( '2d' );
				context.drawImage( image, 0, 0, image.width, image.height );

				const imageData = context.getImageData( 0, 0, image.width, image.height );
				const data = imageData.data;

				for ( let i = 0; i < data.length; i ++ ) {

					data[ i ] = SRGBToLinear( data[ i ] / 255 ) * 255;

				}

				context.putImageData( imageData, 0, 0 );

				return canvas;

			} else if ( image.data ) {

				const data = image.data.slice( 0 );

				for ( let i = 0; i < data.length; i ++ ) {

					if ( data instanceof Uint8Array || data instanceof Uint8ClampedArray ) {

						data[ i ] = Math.floor( SRGBToLinear( data[ i ] / 255 ) * 255 );

					} else {

						// assuming float

						data[ i ] = SRGBToLinear( data[ i ] );

					}

				}

				return {
					data: data,
					width: image.width,
					height: image.height
				};

			} else {

				console.warn( 'THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied.' );
				return image;

			}

		}

	}

	class Source {

		constructor( data = null ) {

			this.isSource = true;

			this.uuid = generateUUID();

			this.data = data;

			this.version = 0;

		}

		set needsUpdate( value ) {

			if ( value === true ) this.version ++;

		}

		toJSON( meta ) {

			const isRootObject = ( meta === undefined || typeof meta === 'string' );

			if ( ! isRootObject && meta.images[ this.uuid ] !== undefined ) {

				return meta.images[ this.uuid ];

			}

			const output = {
				uuid: this.uuid,
				url: ''
			};

			const data = this.data;

			if ( data !== null ) {

				let url;

				if ( Array.isArray( data ) ) {

					// cube texture

					url = [];

					for ( let i = 0, l = data.length; i < l; i ++ ) {

						if ( data[ i ].isDataTexture ) {

							url.push( serializeImage( data[ i ].image ) );

						} else {

							url.push( serializeImage( data[ i ] ) );

						}

					}

				} else {

					// texture

					url = serializeImage( data );

				}

				output.url = url;

			}

			if ( ! isRootObject ) {

				meta.images[ this.uuid ] = output;

			}

			return output;

		}

	}

	function serializeImage( image ) {

		if ( ( typeof HTMLImageElement !== 'undefined' && image instanceof HTMLImageElement ) ||
			( typeof HTMLCanvasElement !== 'undefined' && image instanceof HTMLCanvasElement ) ||
			( typeof ImageBitmap !== 'undefined' && image instanceof ImageBitmap ) ) {

			// default images

			return ImageUtils.getDataURL( image );

		} else {

			if ( image.data ) {

				// images of DataTexture

				return {
					data: Array.from( image.data ),
					width: image.width,
					height: image.height,
					type: image.data.constructor.name
				};

			} else {

				console.warn( 'THREE.Texture: Unable to serialize Texture.' );
				return {};

			}

		}

	}

	let textureId = 0;

	class Texture extends EventDispatcher {

		constructor( image = Texture.DEFAULT_IMAGE, mapping = Texture.DEFAULT_MAPPING, wrapS = ClampToEdgeWrapping, wrapT = ClampToEdgeWrapping, magFilter = LinearFilter, minFilter = LinearMipmapLinearFilter, format = RGBAFormat, type = UnsignedByteType, anisotropy = Texture.DEFAULT_ANISOTROPY, colorSpace = NoColorSpace ) {

			super();

			this.isTexture = true;

			Object.defineProperty( this, 'id', { value: textureId ++ } );

			this.uuid = generateUUID();

			this.name = '';

			this.source = new Source( image );
			this.mipmaps = [];

			this.mapping = mapping;
			this.channel = 0;

			this.wrapS = wrapS;
			this.wrapT = wrapT;

			this.magFilter = magFilter;
			this.minFilter = minFilter;

			this.anisotropy = anisotropy;

			this.format = format;
			this.internalFormat = null;
			this.type = type;

			this.offset = new Vector2( 0, 0 );
			this.repeat = new Vector2( 1, 1 );
			this.center = new Vector2( 0, 0 );
			this.rotation = 0;

			this.matrixAutoUpdate = true;
			this.matrix = new Matrix3();

			this.generateMipmaps = true;
			this.premultiplyAlpha = false;
			this.flipY = true;
			this.unpackAlignment = 4;	// valid values: 1, 2, 4, 8 (see http://www.khronos.org/opengles/sdk/docs/man/xhtml/glPixelStorei.xml)

			if ( typeof colorSpace === 'string' ) {

				this.colorSpace = colorSpace;

			} else { // @deprecated, r152

				warnOnce( 'THREE.Texture: Property .encoding has been replaced by .colorSpace.' );
				this.colorSpace = colorSpace === sRGBEncoding ? SRGBColorSpace : NoColorSpace;

			}


			this.userData = {};

			this.version = 0;
			this.onUpdate = null;

			this.isRenderTargetTexture = false; // indicates whether a texture belongs to a render target or not
			this.needsPMREMUpdate = false; // indicates whether this texture should be processed by PMREMGenerator or not (only relevant for render target textures)

		}

		get image() {

			return this.source.data;

		}

		set image( value = null ) {

			this.source.data = value;

		}

		updateMatrix() {

			this.matrix.setUvTransform( this.offset.x, this.offset.y, this.repeat.x, this.repeat.y, this.rotation, this.center.x, this.center.y );

		}

		clone() {

			return new this.constructor().copy( this );

		}

		copy( source ) {

			this.name = source.name;

			this.source = source.source;
			this.mipmaps = source.mipmaps.slice( 0 );

			this.mapping = source.mapping;
			this.channel = source.channel;

			this.wrapS = source.wrapS;
			this.wrapT = source.wrapT;

			this.magFilter = source.magFilter;
			this.minFilter = source.minFilter;

			this.anisotropy = source.anisotropy;

			this.format = source.format;
			this.internalFormat = source.internalFormat;
			this.type = source.type;

			this.offset.copy( source.offset );
			this.repeat.copy( source.repeat );
			this.center.copy( source.center );
			this.rotation = source.rotation;

			this.matrixAutoUpdate = source.matrixAutoUpdate;
			this.matrix.copy( source.matrix );

			this.generateMipmaps = source.generateMipmaps;
			this.premultiplyAlpha = source.premultiplyAlpha;
			this.flipY = source.flipY;
			this.unpackAlignment = source.unpackAlignment;
			this.colorSpace = source.colorSpace;

			this.userData = JSON.parse( JSON.stringify( source.userData ) );

			this.needsUpdate = true;

			return this;

		}

		toJSON( meta ) {

			const isRootObject = ( meta === undefined || typeof meta === 'string' );

			if ( ! isRootObject && meta.textures[ this.uuid ] !== undefined ) {

				return meta.textures[ this.uuid ];

			}

			const output = {

				metadata: {
					version: 4.5,
					type: 'Texture',
					generator: 'Texture.toJSON'
				},

				uuid: this.uuid,
				name: this.name,

				image: this.source.toJSON( meta ).uuid,

				mapping: this.mapping,
				channel: this.channel,

				repeat: [ this.repeat.x, this.repeat.y ],
				offset: [ this.offset.x, this.offset.y ],
				center: [ this.center.x, this.center.y ],
				rotation: this.rotation,

				wrap: [ this.wrapS, this.wrapT ],

				format: this.format,
				internalFormat: this.internalFormat,
				type: this.type,
				colorSpace: this.colorSpace,

				minFilter: this.minFilter,
				magFilter: this.magFilter,
				anisotropy: this.anisotropy,

				flipY: this.flipY,

				generateMipmaps: this.generateMipmaps,
				premultiplyAlpha: this.premultiplyAlpha,
				unpackAlignment: this.unpackAlignment

			};

			if ( Object.keys( this.userData ).length > 0 ) output.userData = this.userData;

			if ( ! isRootObject ) {

				meta.textures[ this.uuid ] = output;

			}

			return output;

		}

		dispose() {

			this.dispatchEvent( { type: 'dispose' } );

		}

		transformUv( uv ) {

			if ( this.mapping !== UVMapping ) return uv;

			uv.applyMatrix3( this.matrix );

			if ( uv.x < 0 || uv.x > 1 ) {

				switch ( this.wrapS ) {

					case RepeatWrapping:

						uv.x = uv.x - Math.floor( uv.x );
						break;

					case ClampToEdgeWrapping:

						uv.x = uv.x < 0 ? 0 : 1;
						break;

					case MirroredRepeatWrapping:

						if ( Math.abs( Math.floor( uv.x ) % 2 ) === 1 ) {

							uv.x = Math.ceil( uv.x ) - uv.x;

						} else {

							uv.x = uv.x - Math.floor( uv.x );

						}

						break;

				}

			}

			if ( uv.y < 0 || uv.y > 1 ) {

				switch ( this.wrapT ) {

					case RepeatWrapping:

						uv.y = uv.y - Math.floor( uv.y );
						break;

					case ClampToEdgeWrapping:

						uv.y = uv.y < 0 ? 0 : 1;
						break;

					case MirroredRepeatWrapping:

						if ( Math.abs( Math.floor( uv.y ) % 2 ) === 1 ) {

							uv.y = Math.ceil( uv.y ) - uv.y;

						} else {

							uv.y = uv.y - Math.floor( uv.y );

						}

						break;

				}

			}

			if ( this.flipY ) {

				uv.y = 1 - uv.y;

			}

			return uv;

		}

		set needsUpdate( value ) {

			if ( value === true ) {

				this.version ++;
				this.source.needsUpdate = true;

			}

		}

		get encoding() { // @deprecated, r152

			warnOnce( 'THREE.Texture: Property .encoding has been replaced by .colorSpace.' );
			return this.colorSpace === SRGBColorSpace ? sRGBEncoding : LinearEncoding;

		}

		set encoding( encoding ) { // @deprecated, r152

			warnOnce( 'THREE.Texture: Property .encoding has been replaced by .colorSpace.' );
			this.colorSpace = encoding === sRGBEncoding ? SRGBColorSpace : NoColorSpace;

		}

	}

	Texture.DEFAULT_IMAGE = null;
	Texture.DEFAULT_MAPPING = UVMapping;
	Texture.DEFAULT_ANISOTROPY = 1;

	class Quaternion {

		constructor( x = 0, y = 0, z = 0, w = 1 ) {

			this.isQuaternion = true;

			this._x = x;
			this._y = y;
			this._z = z;
			this._w = w;

		}

		static slerpFlat( dst, dstOffset, src0, srcOffset0, src1, srcOffset1, t ) {

			// fuzz-free, array-based Quaternion SLERP operation

			let x0 = src0[ srcOffset0 + 0 ],
				y0 = src0[ srcOffset0 + 1 ],
				z0 = src0[ srcOffset0 + 2 ],
				w0 = src0[ srcOffset0 + 3 ];

			const x1 = src1[ srcOffset1 + 0 ],
				y1 = src1[ srcOffset1 + 1 ],
				z1 = src1[ srcOffset1 + 2 ],
				w1 = src1[ srcOffset1 + 3 ];

			if ( t === 0 ) {

				dst[ dstOffset + 0 ] = x0;
				dst[ dstOffset + 1 ] = y0;
				dst[ dstOffset + 2 ] = z0;
				dst[ dstOffset + 3 ] = w0;
				return;

			}

			if ( t === 1 ) {

				dst[ dstOffset + 0 ] = x1;
				dst[ dstOffset + 1 ] = y1;
				dst[ dstOffset + 2 ] = z1;
				dst[ dstOffset + 3 ] = w1;
				return;

			}

			if ( w0 !== w1 || x0 !== x1 || y0 !== y1 || z0 !== z1 ) {

				let s = 1 - t;
				const cos = x0 * x1 + y0 * y1 + z0 * z1 + w0 * w1,
					dir = ( cos >= 0 ? 1 : - 1 ),
					sqrSin = 1 - cos * cos;

				// Skip the Slerp for tiny steps to avoid numeric problems:
				if ( sqrSin > Number.EPSILON ) {

					const sin = Math.sqrt( sqrSin ),
						len = Math.atan2( sin, cos * dir );

					s = Math.sin( s * len ) / sin;
					t = Math.sin( t * len ) / sin;

				}

				const tDir = t * dir;

				x0 = x0 * s + x1 * tDir;
				y0 = y0 * s + y1 * tDir;
				z0 = z0 * s + z1 * tDir;
				w0 = w0 * s + w1 * tDir;

				// Normalize in case we just did a lerp:
				if ( s === 1 - t ) {

					const f = 1 / Math.sqrt( x0 * x0 + y0 * y0 + z0 * z0 + w0 * w0 );

					x0 *= f;
					y0 *= f;
					z0 *= f;
					w0 *= f;

				}

			}

			dst[ dstOffset ] = x0;
			dst[ dstOffset + 1 ] = y0;
			dst[ dstOffset + 2 ] = z0;
			dst[ dstOffset + 3 ] = w0;

		}

		static multiplyQuaternionsFlat( dst, dstOffset, src0, srcOffset0, src1, srcOffset1 ) {

			const x0 = src0[ srcOffset0 ];
			const y0 = src0[ srcOffset0 + 1 ];
			const z0 = src0[ srcOffset0 + 2 ];
			const w0 = src0[ srcOffset0 + 3 ];

			const x1 = src1[ srcOffset1 ];
			const y1 = src1[ srcOffset1 + 1 ];
			const z1 = src1[ srcOffset1 + 2 ];
			const w1 = src1[ srcOffset1 + 3 ];

			dst[ dstOffset ] = x0 * w1 + w0 * x1 + y0 * z1 - z0 * y1;
			dst[ dstOffset + 1 ] = y0 * w1 + w0 * y1 + z0 * x1 - x0 * z1;
			dst[ dstOffset + 2 ] = z0 * w1 + w0 * z1 + x0 * y1 - y0 * x1;
			dst[ dstOffset + 3 ] = w0 * w1 - x0 * x1 - y0 * y1 - z0 * z1;

			return dst;

		}

		get x() {

			return this._x;

		}

		set x( value ) {

			this._x = value;
			this._onChangeCallback();

		}

		get y() {

			return this._y;

		}

		set y( value ) {

			this._y = value;
			this._onChangeCallback();

		}

		get z() {

			return this._z;

		}

		set z( value ) {

			this._z = value;
			this._onChangeCallback();

		}

		get w() {

			return this._w;

		}

		set w( value ) {

			this._w = value;
			this._onChangeCallback();

		}

		set( x, y, z, w ) {

			this._x = x;
			this._y = y;
			this._z = z;
			this._w = w;

			this._onChangeCallback();

			return this;

		}

		clone() {

			return new this.constructor( this._x, this._y, this._z, this._w );

		}

		copy( quaternion ) {

			this._x = quaternion.x;
			this._y = quaternion.y;
			this._z = quaternion.z;
			this._w = quaternion.w;

			this._onChangeCallback();

			return this;

		}

		setFromEuler( euler, update ) {

			const x = euler._x, y = euler._y, z = euler._z, order = euler._order;

			// http://www.mathworks.com/matlabcentral/fileexchange/
			// 	20696-function-to-convert-between-dcm-euler-angles-quaternions-and-euler-vectors/
			//	content/SpinCalc.m

			const cos = Math.cos;
			const sin = Math.sin;

			const c1 = cos( x / 2 );
			const c2 = cos( y / 2 );
			const c3 = cos( z / 2 );

			const s1 = sin( x / 2 );
			const s2 = sin( y / 2 );
			const s3 = sin( z / 2 );

			switch ( order ) {

				case 'XYZ':
					this._x = s1 * c2 * c3 + c1 * s2 * s3;
					this._y = c1 * s2 * c3 - s1 * c2 * s3;
					this._z = c1 * c2 * s3 + s1 * s2 * c3;
					this._w = c1 * c2 * c3 - s1 * s2 * s3;
					break;

				case 'YXZ':
					this._x = s1 * c2 * c3 + c1 * s2 * s3;
					this._y = c1 * s2 * c3 - s1 * c2 * s3;
					this._z = c1 * c2 * s3 - s1 * s2 * c3;
					this._w = c1 * c2 * c3 + s1 * s2 * s3;
					break;

				case 'ZXY':
					this._x = s1 * c2 * c3 - c1 * s2 * s3;
					this._y = c1 * s2 * c3 + s1 * c2 * s3;
					this._z = c1 * c2 * s3 + s1 * s2 * c3;
					this._w = c1 * c2 * c3 - s1 * s2 * s3;
					break;

				case 'ZYX':
					this._x = s1 * c2 * c3 - c1 * s2 * s3;
					this._y = c1 * s2 * c3 + s1 * c2 * s3;
					this._z = c1 * c2 * s3 - s1 * s2 * c3;
					this._w = c1 * c2 * c3 + s1 * s2 * s3;
					break;

				case 'YZX':
					this._x = s1 * c2 * c3 + c1 * s2 * s3;
					this._y = c1 * s2 * c3 + s1 * c2 * s3;
					this._z = c1 * c2 * s3 - s1 * s2 * c3;
					this._w = c1 * c2 * c3 - s1 * s2 * s3;
					break;

				case 'XZY':
					this._x = s1 * c2 * c3 - c1 * s2 * s3;
					this._y = c1 * s2 * c3 - s1 * c2 * s3;
					this._z = c1 * c2 * s3 + s1 * s2 * c3;
					this._w = c1 * c2 * c3 + s1 * s2 * s3;
					break;

				default:
					console.warn( 'THREE.Quaternion: .setFromEuler() encountered an unknown order: ' + order );

			}

			if ( update !== false ) this._onChangeCallback();

			return this;

		}

		setFromAxisAngle( axis, angle ) {

			// http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm

			// assumes axis is normalized

			const halfAngle = angle / 2, s = Math.sin( halfAngle );

			this._x = axis.x * s;
			this._y = axis.y * s;
			this._z = axis.z * s;
			this._w = Math.cos( halfAngle );

			this._onChangeCallback();

			return this;

		}

		setFromRotationMatrix( m ) {

			// http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm

			// assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

			const te = m.elements,

				m11 = te[ 0 ], m12 = te[ 4 ], m13 = te[ 8 ],
				m21 = te[ 1 ], m22 = te[ 5 ], m23 = te[ 9 ],
				m31 = te[ 2 ], m32 = te[ 6 ], m33 = te[ 10 ],

				trace = m11 + m22 + m33;

			if ( trace > 0 ) {

				const s = 0.5 / Math.sqrt( trace + 1.0 );

				this._w = 0.25 / s;
				this._x = ( m32 - m23 ) * s;
				this._y = ( m13 - m31 ) * s;
				this._z = ( m21 - m12 ) * s;

			} else if ( m11 > m22 && m11 > m33 ) {

				const s = 2.0 * Math.sqrt( 1.0 + m11 - m22 - m33 );

				this._w = ( m32 - m23 ) / s;
				this._x = 0.25 * s;
				this._y = ( m12 + m21 ) / s;
				this._z = ( m13 + m31 ) / s;

			} else if ( m22 > m33 ) {

				const s = 2.0 * Math.sqrt( 1.0 + m22 - m11 - m33 );

				this._w = ( m13 - m31 ) / s;
				this._x = ( m12 + m21 ) / s;
				this._y = 0.25 * s;
				this._z = ( m23 + m32 ) / s;

			} else {

				const s = 2.0 * Math.sqrt( 1.0 + m33 - m11 - m22 );

				this._w = ( m21 - m12 ) / s;
				this._x = ( m13 + m31 ) / s;
				this._y = ( m23 + m32 ) / s;
				this._z = 0.25 * s;

			}

			this._onChangeCallback();

			return this;

		}

		setFromUnitVectors( vFrom, vTo ) {

			// assumes direction vectors vFrom and vTo are normalized

			let r = vFrom.dot( vTo ) + 1;

			if ( r < Number.EPSILON ) {

				// vFrom and vTo point in opposite directions

				r = 0;

				if ( Math.abs( vFrom.x ) > Math.abs( vFrom.z ) ) {

					this._x = - vFrom.y;
					this._y = vFrom.x;
					this._z = 0;
					this._w = r;

				} else {

					this._x = 0;
					this._y = - vFrom.z;
					this._z = vFrom.y;
					this._w = r;

				}

			} else {

				// crossVectors( vFrom, vTo ); // inlined to avoid cyclic dependency on Vector3

				this._x = vFrom.y * vTo.z - vFrom.z * vTo.y;
				this._y = vFrom.z * vTo.x - vFrom.x * vTo.z;
				this._z = vFrom.x * vTo.y - vFrom.y * vTo.x;
				this._w = r;

			}

			return this.normalize();

		}

		angleTo( q ) {

			return 2 * Math.acos( Math.abs( clamp( this.dot( q ), - 1, 1 ) ) );

		}

		rotateTowards( q, step ) {

			const angle = this.angleTo( q );

			if ( angle === 0 ) return this;

			const t = Math.min( 1, step / angle );

			this.slerp( q, t );

			return this;

		}

		identity() {

			return this.set( 0, 0, 0, 1 );

		}

		invert() {

			// quaternion is assumed to have unit length

			return this.conjugate();

		}

		conjugate() {

			this._x *= - 1;
			this._y *= - 1;
			this._z *= - 1;

			this._onChangeCallback();

			return this;

		}

		dot( v ) {

			return this._x * v._x + this._y * v._y + this._z * v._z + this._w * v._w;

		}

		lengthSq() {

			return this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w;

		}

		length() {

			return Math.sqrt( this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w );

		}

		normalize() {

			let l = this.length();

			if ( l === 0 ) {

				this._x = 0;
				this._y = 0;
				this._z = 0;
				this._w = 1;

			} else {

				l = 1 / l;

				this._x = this._x * l;
				this._y = this._y * l;
				this._z = this._z * l;
				this._w = this._w * l;

			}

			this._onChangeCallback();

			return this;

		}

		multiply( q ) {

			return this.multiplyQuaternions( this, q );

		}

		premultiply( q ) {

			return this.multiplyQuaternions( q, this );

		}

		multiplyQuaternions( a, b ) {

			// from http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm

			const qax = a._x, qay = a._y, qaz = a._z, qaw = a._w;
			const qbx = b._x, qby = b._y, qbz = b._z, qbw = b._w;

			this._x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
			this._y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
			this._z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
			this._w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;

			this._onChangeCallback();

			return this;

		}

		slerp( qb, t ) {

			if ( t === 0 ) return this;
			if ( t === 1 ) return this.copy( qb );

			const x = this._x, y = this._y, z = this._z, w = this._w;

			// http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/

			let cosHalfTheta = w * qb._w + x * qb._x + y * qb._y + z * qb._z;

			if ( cosHalfTheta < 0 ) {

				this._w = - qb._w;
				this._x = - qb._x;
				this._y = - qb._y;
				this._z = - qb._z;

				cosHalfTheta = - cosHalfTheta;

			} else {

				this.copy( qb );

			}

			if ( cosHalfTheta >= 1.0 ) {

				this._w = w;
				this._x = x;
				this._y = y;
				this._z = z;

				return this;

			}

			const sqrSinHalfTheta = 1.0 - cosHalfTheta * cosHalfTheta;

			if ( sqrSinHalfTheta <= Number.EPSILON ) {

				const s = 1 - t;
				this._w = s * w + t * this._w;
				this._x = s * x + t * this._x;
				this._y = s * y + t * this._y;
				this._z = s * z + t * this._z;

				this.normalize();
				this._onChangeCallback();

				return this;

			}

			const sinHalfTheta = Math.sqrt( sqrSinHalfTheta );
			const halfTheta = Math.atan2( sinHalfTheta, cosHalfTheta );
			const ratioA = Math.sin( ( 1 - t ) * halfTheta ) / sinHalfTheta,
				ratioB = Math.sin( t * halfTheta ) / sinHalfTheta;

			this._w = ( w * ratioA + this._w * ratioB );
			this._x = ( x * ratioA + this._x * ratioB );
			this._y = ( y * ratioA + this._y * ratioB );
			this._z = ( z * ratioA + this._z * ratioB );

			this._onChangeCallback();

			return this;

		}

		slerpQuaternions( qa, qb, t ) {

			return this.copy( qa ).slerp( qb, t );

		}

		random() {

			// Derived from http://planning.cs.uiuc.edu/node198.html
			// Note, this source uses w, x, y, z ordering,
			// so we swap the order below.

			const u1 = Math.random();
			const sqrt1u1 = Math.sqrt( 1 - u1 );
			const sqrtu1 = Math.sqrt( u1 );

			const u2 = 2 * Math.PI * Math.random();

			const u3 = 2 * Math.PI * Math.random();

			return this.set(
				sqrt1u1 * Math.cos( u2 ),
				sqrtu1 * Math.sin( u3 ),
				sqrtu1 * Math.cos( u3 ),
				sqrt1u1 * Math.sin( u2 ),
			);

		}

		equals( quaternion ) {

			return ( quaternion._x === this._x ) && ( quaternion._y === this._y ) && ( quaternion._z === this._z ) && ( quaternion._w === this._w );

		}

		fromArray( array, offset = 0 ) {

			this._x = array[ offset ];
			this._y = array[ offset + 1 ];
			this._z = array[ offset + 2 ];
			this._w = array[ offset + 3 ];

			this._onChangeCallback();

			return this;

		}

		toArray( array = [], offset = 0 ) {

			array[ offset ] = this._x;
			array[ offset + 1 ] = this._y;
			array[ offset + 2 ] = this._z;
			array[ offset + 3 ] = this._w;

			return array;

		}

		fromBufferAttribute( attribute, index ) {

			this._x = attribute.getX( index );
			this._y = attribute.getY( index );
			this._z = attribute.getZ( index );
			this._w = attribute.getW( index );

			return this;

		}

		toJSON() {

			return this.toArray();

		}

		_onChange( callback ) {

			this._onChangeCallback = callback;

			return this;

		}

		_onChangeCallback() {}

		*[ Symbol.iterator ]() {

			yield this._x;
			yield this._y;
			yield this._z;
			yield this._w;

		}

	}

	class Vector3 {

		constructor( x = 0, y = 0, z = 0 ) {

			Vector3.prototype.isVector3 = true;

			this.x = x;
			this.y = y;
			this.z = z;

		}

		set( x, y, z ) {

			if ( z === undefined ) z = this.z; // sprite.scale.set(x,y)

			this.x = x;
			this.y = y;
			this.z = z;

			return this;

		}

		setScalar( scalar ) {

			this.x = scalar;
			this.y = scalar;
			this.z = scalar;

			return this;

		}

		setX( x ) {

			this.x = x;

			return this;

		}

		setY( y ) {

			this.y = y;

			return this;

		}

		setZ( z ) {

			this.z = z;

			return this;

		}

		setComponent( index, value ) {

			switch ( index ) {

				case 0: this.x = value; break;
				case 1: this.y = value; break;
				case 2: this.z = value; break;
				default: throw new Error( 'index is out of range: ' + index );

			}

			return this;

		}

		getComponent( index ) {

			switch ( index ) {

				case 0: return this.x;
				case 1: return this.y;
				case 2: return this.z;
				default: throw new Error( 'index is out of range: ' + index );

			}

		}

		clone() {

			return new this.constructor( this.x, this.y, this.z );

		}

		copy( v ) {

			this.x = v.x;
			this.y = v.y;
			this.z = v.z;

			return this;

		}

		add( v ) {

			this.x += v.x;
			this.y += v.y;
			this.z += v.z;

			return this;

		}

		addScalar( s ) {

			this.x += s;
			this.y += s;
			this.z += s;

			return this;

		}

		addVectors( a, b ) {

			this.x = a.x + b.x;
			this.y = a.y + b.y;
			this.z = a.z + b.z;

			return this;

		}

		addScaledVector( v, s ) {

			this.x += v.x * s;
			this.y += v.y * s;
			this.z += v.z * s;

			return this;

		}

		sub( v ) {

			this.x -= v.x;
			this.y -= v.y;
			this.z -= v.z;

			return this;

		}

		subScalar( s ) {

			this.x -= s;
			this.y -= s;
			this.z -= s;

			return this;

		}

		subVectors( a, b ) {

			this.x = a.x - b.x;
			this.y = a.y - b.y;
			this.z = a.z - b.z;

			return this;

		}

		multiply( v ) {

			this.x *= v.x;
			this.y *= v.y;
			this.z *= v.z;

			return this;

		}

		multiplyScalar( scalar ) {

			this.x *= scalar;
			this.y *= scalar;
			this.z *= scalar;

			return this;

		}

		multiplyVectors( a, b ) {

			this.x = a.x * b.x;
			this.y = a.y * b.y;
			this.z = a.z * b.z;

			return this;

		}

		applyEuler( euler ) {

			return this.applyQuaternion( _quaternion$4.setFromEuler( euler ) );

		}

		applyAxisAngle( axis, angle ) {

			return this.applyQuaternion( _quaternion$4.setFromAxisAngle( axis, angle ) );

		}

		applyMatrix3( m ) {

			const x = this.x, y = this.y, z = this.z;
			const e = m.elements;

			this.x = e[ 0 ] * x + e[ 3 ] * y + e[ 6 ] * z;
			this.y = e[ 1 ] * x + e[ 4 ] * y + e[ 7 ] * z;
			this.z = e[ 2 ] * x + e[ 5 ] * y + e[ 8 ] * z;

			return this;

		}

		applyNormalMatrix( m ) {

			return this.applyMatrix3( m ).normalize();

		}

		applyMatrix4( m ) {

			const x = this.x, y = this.y, z = this.z;
			const e = m.elements;

			const w = 1 / ( e[ 3 ] * x + e[ 7 ] * y + e[ 11 ] * z + e[ 15 ] );

			this.x = ( e[ 0 ] * x + e[ 4 ] * y + e[ 8 ] * z + e[ 12 ] ) * w;
			this.y = ( e[ 1 ] * x + e[ 5 ] * y + e[ 9 ] * z + e[ 13 ] ) * w;
			this.z = ( e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z + e[ 14 ] ) * w;

			return this;

		}

		applyQuaternion( q ) {

			const x = this.x, y = this.y, z = this.z;
			const qx = q.x, qy = q.y, qz = q.z, qw = q.w;

			// calculate quat * vector

			const ix = qw * x + qy * z - qz * y;
			const iy = qw * y + qz * x - qx * z;
			const iz = qw * z + qx * y - qy * x;
			const iw = - qx * x - qy * y - qz * z;

			// calculate result * inverse quat

			this.x = ix * qw + iw * - qx + iy * - qz - iz * - qy;
			this.y = iy * qw + iw * - qy + iz * - qx - ix * - qz;
			this.z = iz * qw + iw * - qz + ix * - qy - iy * - qx;

			return this;

		}

		project( camera ) {

			return this.applyMatrix4( camera.matrixWorldInverse ).applyMatrix4( camera.projectionMatrix );

		}

		unproject( camera ) {

			return this.applyMatrix4( camera.projectionMatrixInverse ).applyMatrix4( camera.matrixWorld );

		}

		transformDirection( m ) {

			// input: THREE.Matrix4 affine matrix
			// vector interpreted as a direction

			const x = this.x, y = this.y, z = this.z;
			const e = m.elements;

			this.x = e[ 0 ] * x + e[ 4 ] * y + e[ 8 ] * z;
			this.y = e[ 1 ] * x + e[ 5 ] * y + e[ 9 ] * z;
			this.z = e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z;

			return this.normalize();

		}

		divide( v ) {

			this.x /= v.x;
			this.y /= v.y;
			this.z /= v.z;

			return this;

		}

		divideScalar( scalar ) {

			return this.multiplyScalar( 1 / scalar );

		}

		min( v ) {

			this.x = Math.min( this.x, v.x );
			this.y = Math.min( this.y, v.y );
			this.z = Math.min( this.z, v.z );

			return this;

		}

		max( v ) {

			this.x = Math.max( this.x, v.x );
			this.y = Math.max( this.y, v.y );
			this.z = Math.max( this.z, v.z );

			return this;

		}

		clamp( min, max ) {

			// assumes min < max, componentwise

			this.x = Math.max( min.x, Math.min( max.x, this.x ) );
			this.y = Math.max( min.y, Math.min( max.y, this.y ) );
			this.z = Math.max( min.z, Math.min( max.z, this.z ) );

			return this;

		}

		clampScalar( minVal, maxVal ) {

			this.x = Math.max( minVal, Math.min( maxVal, this.x ) );
			this.y = Math.max( minVal, Math.min( maxVal, this.y ) );
			this.z = Math.max( minVal, Math.min( maxVal, this.z ) );

			return this;

		}

		clampLength( min, max ) {

			const length = this.length();

			return this.divideScalar( length || 1 ).multiplyScalar( Math.max( min, Math.min( max, length ) ) );

		}

		floor() {

			this.x = Math.floor( this.x );
			this.y = Math.floor( this.y );
			this.z = Math.floor( this.z );

			return this;

		}

		ceil() {

			this.x = Math.ceil( this.x );
			this.y = Math.ceil( this.y );
			this.z = Math.ceil( this.z );

			return this;

		}

		round() {

			this.x = Math.round( this.x );
			this.y = Math.round( this.y );
			this.z = Math.round( this.z );

			return this;

		}

		roundToZero() {

			this.x = ( this.x < 0 ) ? Math.ceil( this.x ) : Math.floor( this.x );
			this.y = ( this.y < 0 ) ? Math.ceil( this.y ) : Math.floor( this.y );
			this.z = ( this.z < 0 ) ? Math.ceil( this.z ) : Math.floor( this.z );

			return this;

		}

		negate() {

			this.x = - this.x;
			this.y = - this.y;
			this.z = - this.z;

			return this;

		}

		dot( v ) {

			return this.x * v.x + this.y * v.y + this.z * v.z;

		}

		// TODO lengthSquared?

		lengthSq() {

			return this.x * this.x + this.y * this.y + this.z * this.z;

		}

		length() {

			return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z );

		}

		manhattanLength() {

			return Math.abs( this.x ) + Math.abs( this.y ) + Math.abs( this.z );

		}

		normalize() {

			return this.divideScalar( this.length() || 1 );

		}

		setLength( length ) {

			return this.normalize().multiplyScalar( length );

		}

		lerp( v, alpha ) {

			this.x += ( v.x - this.x ) * alpha;
			this.y += ( v.y - this.y ) * alpha;
			this.z += ( v.z - this.z ) * alpha;

			return this;

		}

		lerpVectors( v1, v2, alpha ) {

			this.x = v1.x + ( v2.x - v1.x ) * alpha;
			this.y = v1.y + ( v2.y - v1.y ) * alpha;
			this.z = v1.z + ( v2.z - v1.z ) * alpha;

			return this;

		}

		cross( v ) {

			return this.crossVectors( this, v );

		}

		crossVectors( a, b ) {

			const ax = a.x, ay = a.y, az = a.z;
			const bx = b.x, by = b.y, bz = b.z;

			this.x = ay * bz - az * by;
			this.y = az * bx - ax * bz;
			this.z = ax * by - ay * bx;

			return this;

		}

		projectOnVector( v ) {

			const denominator = v.lengthSq();

			if ( denominator === 0 ) return this.set( 0, 0, 0 );

			const scalar = v.dot( this ) / denominator;

			return this.copy( v ).multiplyScalar( scalar );

		}

		projectOnPlane( planeNormal ) {

			_vector$b.copy( this ).projectOnVector( planeNormal );

			return this.sub( _vector$b );

		}

		reflect( normal ) {

			// reflect incident vector off plane orthogonal to normal
			// normal is assumed to have unit length

			return this.sub( _vector$b.copy( normal ).multiplyScalar( 2 * this.dot( normal ) ) );

		}

		angleTo( v ) {

			const denominator = Math.sqrt( this.lengthSq() * v.lengthSq() );

			if ( denominator === 0 ) return Math.PI / 2;

			const theta = this.dot( v ) / denominator;

			// clamp, to handle numerical problems

			return Math.acos( clamp( theta, - 1, 1 ) );

		}

		distanceTo( v ) {

			return Math.sqrt( this.distanceToSquared( v ) );

		}

		distanceToSquared( v ) {

			const dx = this.x - v.x, dy = this.y - v.y, dz = this.z - v.z;

			return dx * dx + dy * dy + dz * dz;

		}

		manhattanDistanceTo( v ) {

			return Math.abs( this.x - v.x ) + Math.abs( this.y - v.y ) + Math.abs( this.z - v.z );

		}

		setFromSpherical( s ) {

			return this.setFromSphericalCoords( s.radius, s.phi, s.theta );

		}

		setFromSphericalCoords( radius, phi, theta ) {

			const sinPhiRadius = Math.sin( phi ) * radius;

			this.x = sinPhiRadius * Math.sin( theta );
			this.y = Math.cos( phi ) * radius;
			this.z = sinPhiRadius * Math.cos( theta );

			return this;

		}

		setFromCylindrical( c ) {

			return this.setFromCylindricalCoords( c.radius, c.theta, c.y );

		}

		setFromCylindricalCoords( radius, theta, y ) {

			this.x = radius * Math.sin( theta );
			this.y = y;
			this.z = radius * Math.cos( theta );

			return this;

		}

		setFromMatrixPosition( m ) {

			const e = m.elements;

			this.x = e[ 12 ];
			this.y = e[ 13 ];
			this.z = e[ 14 ];

			return this;

		}

		setFromMatrixScale( m ) {

			const sx = this.setFromMatrixColumn( m, 0 ).length();
			const sy = this.setFromMatrixColumn( m, 1 ).length();
			const sz = this.setFromMatrixColumn( m, 2 ).length();

			this.x = sx;
			this.y = sy;
			this.z = sz;

			return this;

		}

		setFromMatrixColumn( m, index ) {

			return this.fromArray( m.elements, index * 4 );

		}

		setFromMatrix3Column( m, index ) {

			return this.fromArray( m.elements, index * 3 );

		}

		setFromEuler( e ) {

			this.x = e._x;
			this.y = e._y;
			this.z = e._z;

			return this;

		}

		setFromColor( c ) {

			this.x = c.r;
			this.y = c.g;
			this.z = c.b;

			return this;

		}

		equals( v ) {

			return ( ( v.x === this.x ) && ( v.y === this.y ) && ( v.z === this.z ) );

		}

		fromArray( array, offset = 0 ) {

			this.x = array[ offset ];
			this.y = array[ offset + 1 ];
			this.z = array[ offset + 2 ];

			return this;

		}

		toArray( array = [], offset = 0 ) {

			array[ offset ] = this.x;
			array[ offset + 1 ] = this.y;
			array[ offset + 2 ] = this.z;

			return array;

		}

		fromBufferAttribute( attribute, index ) {

			this.x = attribute.getX( index );
			this.y = attribute.getY( index );
			this.z = attribute.getZ( index );

			return this;

		}

		random() {

			this.x = Math.random();
			this.y = Math.random();
			this.z = Math.random();

			return this;

		}

		randomDirection() {

			// Derived from https://mathworld.wolfram.com/SpherePointPicking.html

			const u = ( Math.random() - 0.5 ) * 2;
			const t = Math.random() * Math.PI * 2;
			const f = Math.sqrt( 1 - u ** 2 );

			this.x = f * Math.cos( t );
			this.y = f * Math.sin( t );
			this.z = u;

			return this;

		}

		*[ Symbol.iterator ]() {

			yield this.x;
			yield this.y;
			yield this.z;

		}

	}

	const _vector$b = /*@__PURE__*/ new Vector3();
	const _quaternion$4 = /*@__PURE__*/ new Quaternion();

	class Box3 {

		constructor( min = new Vector3( + Infinity, + Infinity, + Infinity ), max = new Vector3( - Infinity, - Infinity, - Infinity ) ) {

			this.isBox3 = true;

			this.min = min;
			this.max = max;

		}

		set( min, max ) {

			this.min.copy( min );
			this.max.copy( max );

			return this;

		}

		setFromArray( array ) {

			this.makeEmpty();

			for ( let i = 0, il = array.length; i < il; i += 3 ) {

				this.expandByPoint( _vector$a.fromArray( array, i ) );

			}

			return this;

		}

		setFromBufferAttribute( attribute ) {

			this.makeEmpty();

			for ( let i = 0, il = attribute.count; i < il; i ++ ) {

				this.expandByPoint( _vector$a.fromBufferAttribute( attribute, i ) );

			}

			return this;

		}

		setFromPoints( points ) {

			this.makeEmpty();

			for ( let i = 0, il = points.length; i < il; i ++ ) {

				this.expandByPoint( points[ i ] );

			}

			return this;

		}

		setFromCenterAndSize( center, size ) {

			const halfSize = _vector$a.copy( size ).multiplyScalar( 0.5 );

			this.min.copy( center ).sub( halfSize );
			this.max.copy( center ).add( halfSize );

			return this;

		}

		setFromObject( object, precise = false ) {

			this.makeEmpty();

			return this.expandByObject( object, precise );

		}

		clone() {

			return new this.constructor().copy( this );

		}

		copy( box ) {

			this.min.copy( box.min );
			this.max.copy( box.max );

			return this;

		}

		makeEmpty() {

			this.min.x = this.min.y = this.min.z = + Infinity;
			this.max.x = this.max.y = this.max.z = - Infinity;

			return this;

		}

		isEmpty() {

			// this is a more robust check for empty than ( volume <= 0 ) because volume can get positive with two negative axes

			return ( this.max.x < this.min.x ) || ( this.max.y < this.min.y ) || ( this.max.z < this.min.z );

		}

		getCenter( target ) {

			return this.isEmpty() ? target.set( 0, 0, 0 ) : target.addVectors( this.min, this.max ).multiplyScalar( 0.5 );

		}

		getSize( target ) {

			return this.isEmpty() ? target.set( 0, 0, 0 ) : target.subVectors( this.max, this.min );

		}

		expandByPoint( point ) {

			this.min.min( point );
			this.max.max( point );

			return this;

		}

		expandByVector( vector ) {

			this.min.sub( vector );
			this.max.add( vector );

			return this;

		}

		expandByScalar( scalar ) {

			this.min.addScalar( - scalar );
			this.max.addScalar( scalar );

			return this;

		}

		expandByObject( object, precise = false ) {

			// Computes the world-axis-aligned bounding box of an object (including its children),
			// accounting for both the object's, and children's, world transforms

			object.updateWorldMatrix( false, false );

			if ( object.boundingBox !== undefined ) {

				if ( object.boundingBox === null ) {

					object.computeBoundingBox();

				}

				_box$3.copy( object.boundingBox );
				_box$3.applyMatrix4( object.matrixWorld );

				this.union( _box$3 );

			} else {

				const geometry = object.geometry;

				if ( geometry !== undefined ) {

					if ( precise && geometry.attributes !== undefined && geometry.attributes.position !== undefined ) {

						const position = geometry.attributes.position;
						for ( let i = 0, l = position.count; i < l; i ++ ) {

							_vector$a.fromBufferAttribute( position, i ).applyMatrix4( object.matrixWorld );
							this.expandByPoint( _vector$a );

						}

					} else {

						if ( geometry.boundingBox === null ) {

							geometry.computeBoundingBox();

						}

						_box$3.copy( geometry.boundingBox );
						_box$3.applyMatrix4( object.matrixWorld );

						this.union( _box$3 );

					}

				}

			}

			const children = object.children;

			for ( let i = 0, l = children.length; i < l; i ++ ) {

				this.expandByObject( children[ i ], precise );

			}

			return this;

		}

		containsPoint( point ) {

			return point.x < this.min.x || point.x > this.max.x ||
				point.y < this.min.y || point.y > this.max.y ||
				point.z < this.min.z || point.z > this.max.z ? false : true;

		}

		containsBox( box ) {

			return this.min.x <= box.min.x && box.max.x <= this.max.x &&
				this.min.y <= box.min.y && box.max.y <= this.max.y &&
				this.min.z <= box.min.z && box.max.z <= this.max.z;

		}

		getParameter( point, target ) {

			// This can potentially have a divide by zero if the box
			// has a size dimension of 0.

			return target.set(
				( point.x - this.min.x ) / ( this.max.x - this.min.x ),
				( point.y - this.min.y ) / ( this.max.y - this.min.y ),
				( point.z - this.min.z ) / ( this.max.z - this.min.z )
			);

		}

		intersectsBox( box ) {

			// using 6 splitting planes to rule out intersections.
			return box.max.x < this.min.x || box.min.x > this.max.x ||
				box.max.y < this.min.y || box.min.y > this.max.y ||
				box.max.z < this.min.z || box.min.z > this.max.z ? false : true;

		}

		intersectsSphere( sphere ) {

			// Find the point on the AABB closest to the sphere center.
			this.clampPoint( sphere.center, _vector$a );

			// If that point is inside the sphere, the AABB and sphere intersect.
			return _vector$a.distanceToSquared( sphere.center ) <= ( sphere.radius * sphere.radius );

		}

		intersectsPlane( plane ) {

			// We compute the minimum and maximum dot product values. If those values
			// are on the same side (back or front) of the plane, then there is no intersection.

			let min, max;

			if ( plane.normal.x > 0 ) {

				min = plane.normal.x * this.min.x;
				max = plane.normal.x * this.max.x;

			} else {

				min = plane.normal.x * this.max.x;
				max = plane.normal.x * this.min.x;

			}

			if ( plane.normal.y > 0 ) {

				min += plane.normal.y * this.min.y;
				max += plane.normal.y * this.max.y;

			} else {

				min += plane.normal.y * this.max.y;
				max += plane.normal.y * this.min.y;

			}

			if ( plane.normal.z > 0 ) {

				min += plane.normal.z * this.min.z;
				max += plane.normal.z * this.max.z;

			} else {

				min += plane.normal.z * this.max.z;
				max += plane.normal.z * this.min.z;

			}

			return ( min <= - plane.constant && max >= - plane.constant );

		}

		intersectsTriangle( triangle ) {

			if ( this.isEmpty() ) {

				return false;

			}

			// compute box center and extents
			this.getCenter( _center );
			_extents.subVectors( this.max, _center );

			// translate triangle to aabb origin
			_v0$2.subVectors( triangle.a, _center );
			_v1$7.subVectors( triangle.b, _center );
			_v2$4.subVectors( triangle.c, _center );

			// compute edge vectors for triangle
			_f0.subVectors( _v1$7, _v0$2 );
			_f1.subVectors( _v2$4, _v1$7 );
			_f2.subVectors( _v0$2, _v2$4 );

			// test against axes that are given by cross product combinations of the edges of the triangle and the edges of the aabb
			// make an axis testing of each of the 3 sides of the aabb against each of the 3 sides of the triangle = 9 axis of separation
			// axis_ij = u_i x f_j (u0, u1, u2 = face normals of aabb = x,y,z axes vectors since aabb is axis aligned)
			let axes = [
				0, - _f0.z, _f0.y, 0, - _f1.z, _f1.y, 0, - _f2.z, _f2.y,
				_f0.z, 0, - _f0.x, _f1.z, 0, - _f1.x, _f2.z, 0, - _f2.x,
				- _f0.y, _f0.x, 0, - _f1.y, _f1.x, 0, - _f2.y, _f2.x, 0
			];
			if ( ! satForAxes( axes, _v0$2, _v1$7, _v2$4, _extents ) ) {

				return false;

			}

			// test 3 face normals from the aabb
			axes = [ 1, 0, 0, 0, 1, 0, 0, 0, 1 ];
			if ( ! satForAxes( axes, _v0$2, _v1$7, _v2$4, _extents ) ) {

				return false;

			}

			// finally testing the face normal of the triangle
			// use already existing triangle edge vectors here
			_triangleNormal.crossVectors( _f0, _f1 );
			axes = [ _triangleNormal.x, _triangleNormal.y, _triangleNormal.z ];

			return satForAxes( axes, _v0$2, _v1$7, _v2$4, _extents );

		}

		clampPoint( point, target ) {

			return target.copy( point ).clamp( this.min, this.max );

		}

		distanceToPoint( point ) {

			return this.clampPoint( point, _vector$a ).distanceTo( point );

		}

		getBoundingSphere( target ) {

			if ( this.isEmpty() ) {

				target.makeEmpty();

			} else {

				this.getCenter( target.center );

				target.radius = this.getSize( _vector$a ).length() * 0.5;

			}

			return target;

		}

		intersect( box ) {

			this.min.max( box.min );
			this.max.min( box.max );

			// ensure that if there is no overlap, the result is fully empty, not slightly empty with non-inf/+inf values that will cause subsequence intersects to erroneously return valid values.
			if ( this.isEmpty() ) this.makeEmpty();

			return this;

		}

		union( box ) {

			this.min.min( box.min );
			this.max.max( box.max );

			return this;

		}

		applyMatrix4( matrix ) {

			// transform of empty box is an empty box.
			if ( this.isEmpty() ) return this;

			// NOTE: I am using a binary pattern to specify all 2^3 combinations below
			_points[ 0 ].set( this.min.x, this.min.y, this.min.z ).applyMatrix4( matrix ); // 000
			_points[ 1 ].set( this.min.x, this.min.y, this.max.z ).applyMatrix4( matrix ); // 001
			_points[ 2 ].set( this.min.x, this.max.y, this.min.z ).applyMatrix4( matrix ); // 010
			_points[ 3 ].set( this.min.x, this.max.y, this.max.z ).applyMatrix4( matrix ); // 011
			_points[ 4 ].set( this.max.x, this.min.y, this.min.z ).applyMatrix4( matrix ); // 100
			_points[ 5 ].set( this.max.x, this.min.y, this.max.z ).applyMatrix4( matrix ); // 101
			_points[ 6 ].set( this.max.x, this.max.y, this.min.z ).applyMatrix4( matrix ); // 110
			_points[ 7 ].set( this.max.x, this.max.y, this.max.z ).applyMatrix4( matrix ); // 111

			this.setFromPoints( _points );

			return this;

		}

		translate( offset ) {

			this.min.add( offset );
			this.max.add( offset );

			return this;

		}

		equals( box ) {

			return box.min.equals( this.min ) && box.max.equals( this.max );

		}

	}

	const _points = [
		/*@__PURE__*/ new Vector3(),
		/*@__PURE__*/ new Vector3(),
		/*@__PURE__*/ new Vector3(),
		/*@__PURE__*/ new Vector3(),
		/*@__PURE__*/ new Vector3(),
		/*@__PURE__*/ new Vector3(),
		/*@__PURE__*/ new Vector3(),
		/*@__PURE__*/ new Vector3()
	];

	const _vector$a = /*@__PURE__*/ new Vector3();

	const _box$3 = /*@__PURE__*/ new Box3();

	// triangle centered vertices

	const _v0$2 = /*@__PURE__*/ new Vector3();
	const _v1$7 = /*@__PURE__*/ new Vector3();
	const _v2$4 = /*@__PURE__*/ new Vector3();

	// triangle edge vectors

	const _f0 = /*@__PURE__*/ new Vector3();
	const _f1 = /*@__PURE__*/ new Vector3();
	const _f2 = /*@__PURE__*/ new Vector3();

	const _center = /*@__PURE__*/ new Vector3();
	const _extents = /*@__PURE__*/ new Vector3();
	const _triangleNormal = /*@__PURE__*/ new Vector3();
	const _testAxis = /*@__PURE__*/ new Vector3();

	function satForAxes( axes, v0, v1, v2, extents ) {

		for ( let i = 0, j = axes.length - 3; i <= j; i += 3 ) {

			_testAxis.fromArray( axes, i );
			// project the aabb onto the separating axis
			const r = extents.x * Math.abs( _testAxis.x ) + extents.y * Math.abs( _testAxis.y ) + extents.z * Math.abs( _testAxis.z );
			// project all 3 vertices of the triangle onto the separating axis
			const p0 = v0.dot( _testAxis );
			const p1 = v1.dot( _testAxis );
			const p2 = v2.dot( _testAxis );
			// actual test, basically see if either of the most extreme of the triangle points intersects r
			if ( Math.max( - Math.max( p0, p1, p2 ), Math.min( p0, p1, p2 ) ) > r ) {

				// points of the projected triangle are outside the projected half-length of the aabb
				// the axis is separating and we can exit
				return false;

			}

		}

		return true;

	}

	const _box$2 = /*@__PURE__*/ new Box3();
	const _v1$6 = /*@__PURE__*/ new Vector3();
	const _v2$3 = /*@__PURE__*/ new Vector3();

	class Sphere {

		constructor( center = new Vector3(), radius = - 1 ) {

			this.center = center;
			this.radius = radius;

		}

		set( center, radius ) {

			this.center.copy( center );
			this.radius = radius;

			return this;

		}

		setFromPoints( points, optionalCenter ) {

			const center = this.center;

			if ( optionalCenter !== undefined ) {

				center.copy( optionalCenter );

			} else {

				_box$2.setFromPoints( points ).getCenter( center );

			}

			let maxRadiusSq = 0;

			for ( let i = 0, il = points.length; i < il; i ++ ) {

				maxRadiusSq = Math.max( maxRadiusSq, center.distanceToSquared( points[ i ] ) );

			}

			this.radius = Math.sqrt( maxRadiusSq );

			return this;

		}

		copy( sphere ) {

			this.center.copy( sphere.center );
			this.radius = sphere.radius;

			return this;

		}

		isEmpty() {

			return ( this.radius < 0 );

		}

		makeEmpty() {

			this.center.set( 0, 0, 0 );
			this.radius = - 1;

			return this;

		}

		containsPoint( point ) {

			return ( point.distanceToSquared( this.center ) <= ( this.radius * this.radius ) );

		}

		distanceToPoint( point ) {

			return ( point.distanceTo( this.center ) - this.radius );

		}

		intersectsSphere( sphere ) {

			const radiusSum = this.radius + sphere.radius;

			return sphere.center.distanceToSquared( this.center ) <= ( radiusSum * radiusSum );

		}

		intersectsBox( box ) {

			return box.intersectsSphere( this );

		}

		intersectsPlane( plane ) {

			return Math.abs( plane.distanceToPoint( this.center ) ) <= this.radius;

		}

		clampPoint( point, target ) {

			const deltaLengthSq = this.center.distanceToSquared( point );

			target.copy( point );

			if ( deltaLengthSq > ( this.radius * this.radius ) ) {

				target.sub( this.center ).normalize();
				target.multiplyScalar( this.radius ).add( this.center );

			}

			return target;

		}

		getBoundingBox( target ) {

			if ( this.isEmpty() ) {

				// Empty sphere produces empty bounding box
				target.makeEmpty();
				return target;

			}

			target.set( this.center, this.center );
			target.expandByScalar( this.radius );

			return target;

		}

		applyMatrix4( matrix ) {

			this.center.applyMatrix4( matrix );
			this.radius = this.radius * matrix.getMaxScaleOnAxis();

			return this;

		}

		translate( offset ) {

			this.center.add( offset );

			return this;

		}

		expandByPoint( point ) {

			if ( this.isEmpty() ) {

				this.center.copy( point );

				this.radius = 0;

				return this;

			}

			_v1$6.subVectors( point, this.center );

			const lengthSq = _v1$6.lengthSq();

			if ( lengthSq > ( this.radius * this.radius ) ) {

				// calculate the minimal sphere

				const length = Math.sqrt( lengthSq );

				const delta = ( length - this.radius ) * 0.5;

				this.center.addScaledVector( _v1$6, delta / length );

				this.radius += delta;

			}

			return this;

		}

		union( sphere ) {

			if ( sphere.isEmpty() ) {

				return this;

			}

			if ( this.isEmpty() ) {

				this.copy( sphere );

				return this;

			}

			if ( this.center.equals( sphere.center ) === true ) {

				 this.radius = Math.max( this.radius, sphere.radius );

			} else {

				_v2$3.subVectors( sphere.center, this.center ).setLength( sphere.radius );

				this.expandByPoint( _v1$6.copy( sphere.center ).add( _v2$3 ) );

				this.expandByPoint( _v1$6.copy( sphere.center ).sub( _v2$3 ) );

			}

			return this;

		}

		equals( sphere ) {

			return sphere.center.equals( this.center ) && ( sphere.radius === this.radius );

		}

		clone() {

			return new this.constructor().copy( this );

		}

	}

	class Matrix4 {

		constructor() {

			Matrix4.prototype.isMatrix4 = true;

			this.elements = [

				1, 0, 0, 0,
				0, 1, 0, 0,
				0, 0, 1, 0,
				0, 0, 0, 1

			];

		}

		set( n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44 ) {

			const te = this.elements;

			te[ 0 ] = n11; te[ 4 ] = n12; te[ 8 ] = n13; te[ 12 ] = n14;
			te[ 1 ] = n21; te[ 5 ] = n22; te[ 9 ] = n23; te[ 13 ] = n24;
			te[ 2 ] = n31; te[ 6 ] = n32; te[ 10 ] = n33; te[ 14 ] = n34;
			te[ 3 ] = n41; te[ 7 ] = n42; te[ 11 ] = n43; te[ 15 ] = n44;

			return this;

		}

		identity() {

			this.set(

				1, 0, 0, 0,
				0, 1, 0, 0,
				0, 0, 1, 0,
				0, 0, 0, 1

			);

			return this;

		}

		clone() {

			return new Matrix4().fromArray( this.elements );

		}

		copy( m ) {

			const te = this.elements;
			const me = m.elements;

			te[ 0 ] = me[ 0 ]; te[ 1 ] = me[ 1 ]; te[ 2 ] = me[ 2 ]; te[ 3 ] = me[ 3 ];
			te[ 4 ] = me[ 4 ]; te[ 5 ] = me[ 5 ]; te[ 6 ] = me[ 6 ]; te[ 7 ] = me[ 7 ];
			te[ 8 ] = me[ 8 ]; te[ 9 ] = me[ 9 ]; te[ 10 ] = me[ 10 ]; te[ 11 ] = me[ 11 ];
			te[ 12 ] = me[ 12 ]; te[ 13 ] = me[ 13 ]; te[ 14 ] = me[ 14 ]; te[ 15 ] = me[ 15 ];

			return this;

		}

		copyPosition( m ) {

			const te = this.elements, me = m.elements;

			te[ 12 ] = me[ 12 ];
			te[ 13 ] = me[ 13 ];
			te[ 14 ] = me[ 14 ];

			return this;

		}

		setFromMatrix3( m ) {

			const me = m.elements;

			this.set(

				me[ 0 ], me[ 3 ], me[ 6 ], 0,
				me[ 1 ], me[ 4 ], me[ 7 ], 0,
				me[ 2 ], me[ 5 ], me[ 8 ], 0,
				0, 0, 0, 1

			);

			return this;

		}

		extractBasis( xAxis, yAxis, zAxis ) {

			xAxis.setFromMatrixColumn( this, 0 );
			yAxis.setFromMatrixColumn( this, 1 );
			zAxis.setFromMatrixColumn( this, 2 );

			return this;

		}

		makeBasis( xAxis, yAxis, zAxis ) {

			this.set(
				xAxis.x, yAxis.x, zAxis.x, 0,
				xAxis.y, yAxis.y, zAxis.y, 0,
				xAxis.z, yAxis.z, zAxis.z, 0,
				0, 0, 0, 1
			);

			return this;

		}

		extractRotation( m ) {

			// this method does not support reflection matrices

			const te = this.elements;
			const me = m.elements;

			const scaleX = 1 / _v1$5.setFromMatrixColumn( m, 0 ).length();
			const scaleY = 1 / _v1$5.setFromMatrixColumn( m, 1 ).length();
			const scaleZ = 1 / _v1$5.setFromMatrixColumn( m, 2 ).length();

			te[ 0 ] = me[ 0 ] * scaleX;
			te[ 1 ] = me[ 1 ] * scaleX;
			te[ 2 ] = me[ 2 ] * scaleX;
			te[ 3 ] = 0;

			te[ 4 ] = me[ 4 ] * scaleY;
			te[ 5 ] = me[ 5 ] * scaleY;
			te[ 6 ] = me[ 6 ] * scaleY;
			te[ 7 ] = 0;

			te[ 8 ] = me[ 8 ] * scaleZ;
			te[ 9 ] = me[ 9 ] * scaleZ;
			te[ 10 ] = me[ 10 ] * scaleZ;
			te[ 11 ] = 0;

			te[ 12 ] = 0;
			te[ 13 ] = 0;
			te[ 14 ] = 0;
			te[ 15 ] = 1;

			return this;

		}

		makeRotationFromEuler( euler ) {

			const te = this.elements;

			const x = euler.x, y = euler.y, z = euler.z;
			const a = Math.cos( x ), b = Math.sin( x );
			const c = Math.cos( y ), d = Math.sin( y );
			const e = Math.cos( z ), f = Math.sin( z );

			if ( euler.order === 'XYZ' ) {

				const ae = a * e, af = a * f, be = b * e, bf = b * f;

				te[ 0 ] = c * e;
				te[ 4 ] = - c * f;
				te[ 8 ] = d;

				te[ 1 ] = af + be * d;
				te[ 5 ] = ae - bf * d;
				te[ 9 ] = - b * c;

				te[ 2 ] = bf - ae * d;
				te[ 6 ] = be + af * d;
				te[ 10 ] = a * c;

			} else if ( euler.order === 'YXZ' ) {

				const ce = c * e, cf = c * f, de = d * e, df = d * f;

				te[ 0 ] = ce + df * b;
				te[ 4 ] = de * b - cf;
				te[ 8 ] = a * d;

				te[ 1 ] = a * f;
				te[ 5 ] = a * e;
				te[ 9 ] = - b;

				te[ 2 ] = cf * b - de;
				te[ 6 ] = df + ce * b;
				te[ 10 ] = a * c;

			} else if ( euler.order === 'ZXY' ) {

				const ce = c * e, cf = c * f, de = d * e, df = d * f;

				te[ 0 ] = ce - df * b;
				te[ 4 ] = - a * f;
				te[ 8 ] = de + cf * b;

				te[ 1 ] = cf + de * b;
				te[ 5 ] = a * e;
				te[ 9 ] = df - ce * b;

				te[ 2 ] = - a * d;
				te[ 6 ] = b;
				te[ 10 ] = a * c;

			} else if ( euler.order === 'ZYX' ) {

				const ae = a * e, af = a * f, be = b * e, bf = b * f;

				te[ 0 ] = c * e;
				te[ 4 ] = be * d - af;
				te[ 8 ] = ae * d + bf;

				te[ 1 ] = c * f;
				te[ 5 ] = bf * d + ae;
				te[ 9 ] = af * d - be;

				te[ 2 ] = - d;
				te[ 6 ] = b * c;
				te[ 10 ] = a * c;

			} else if ( euler.order === 'YZX' ) {

				const ac = a * c, ad = a * d, bc = b * c, bd = b * d;

				te[ 0 ] = c * e;
				te[ 4 ] = bd - ac * f;
				te[ 8 ] = bc * f + ad;

				te[ 1 ] = f;
				te[ 5 ] = a * e;
				te[ 9 ] = - b * e;

				te[ 2 ] = - d * e;
				te[ 6 ] = ad * f + bc;
				te[ 10 ] = ac - bd * f;

			} else if ( euler.order === 'XZY' ) {

				const ac = a * c, ad = a * d, bc = b * c, bd = b * d;

				te[ 0 ] = c * e;
				te[ 4 ] = - f;
				te[ 8 ] = d * e;

				te[ 1 ] = ac * f + bd;
				te[ 5 ] = a * e;
				te[ 9 ] = ad * f - bc;

				te[ 2 ] = bc * f - ad;
				te[ 6 ] = b * e;
				te[ 10 ] = bd * f + ac;

			}

			// bottom row
			te[ 3 ] = 0;
			te[ 7 ] = 0;
			te[ 11 ] = 0;

			// last column
			te[ 12 ] = 0;
			te[ 13 ] = 0;
			te[ 14 ] = 0;
			te[ 15 ] = 1;

			return this;

		}

		makeRotationFromQuaternion( q ) {

			return this.compose( _zero, q, _one );

		}

		lookAt( eye, target, up ) {

			const te = this.elements;

			_z.subVectors( eye, target );

			if ( _z.lengthSq() === 0 ) {

				// eye and target are in the same position

				_z.z = 1;

			}

			_z.normalize();
			_x.crossVectors( up, _z );

			if ( _x.lengthSq() === 0 ) {

				// up and z are parallel

				if ( Math.abs( up.z ) === 1 ) {

					_z.x += 0.0001;

				} else {

					_z.z += 0.0001;

				}

				_z.normalize();
				_x.crossVectors( up, _z );

			}

			_x.normalize();
			_y.crossVectors( _z, _x );

			te[ 0 ] = _x.x; te[ 4 ] = _y.x; te[ 8 ] = _z.x;
			te[ 1 ] = _x.y; te[ 5 ] = _y.y; te[ 9 ] = _z.y;
			te[ 2 ] = _x.z; te[ 6 ] = _y.z; te[ 10 ] = _z.z;

			return this;

		}

		multiply( m ) {

			return this.multiplyMatrices( this, m );

		}

		premultiply( m ) {

			return this.multiplyMatrices( m, this );

		}

		multiplyMatrices( a, b ) {

			const ae = a.elements;
			const be = b.elements;
			const te = this.elements;

			const a11 = ae[ 0 ], a12 = ae[ 4 ], a13 = ae[ 8 ], a14 = ae[ 12 ];
			const a21 = ae[ 1 ], a22 = ae[ 5 ], a23 = ae[ 9 ], a24 = ae[ 13 ];
			const a31 = ae[ 2 ], a32 = ae[ 6 ], a33 = ae[ 10 ], a34 = ae[ 14 ];
			const a41 = ae[ 3 ], a42 = ae[ 7 ], a43 = ae[ 11 ], a44 = ae[ 15 ];

			const b11 = be[ 0 ], b12 = be[ 4 ], b13 = be[ 8 ], b14 = be[ 12 ];
			const b21 = be[ 1 ], b22 = be[ 5 ], b23 = be[ 9 ], b24 = be[ 13 ];
			const b31 = be[ 2 ], b32 = be[ 6 ], b33 = be[ 10 ], b34 = be[ 14 ];
			const b41 = be[ 3 ], b42 = be[ 7 ], b43 = be[ 11 ], b44 = be[ 15 ];

			te[ 0 ] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
			te[ 4 ] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
			te[ 8 ] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
			te[ 12 ] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

			te[ 1 ] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
			te[ 5 ] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
			te[ 9 ] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
			te[ 13 ] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

			te[ 2 ] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
			te[ 6 ] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
			te[ 10 ] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
			te[ 14 ] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

			te[ 3 ] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
			te[ 7 ] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
			te[ 11 ] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
			te[ 15 ] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

			return this;

		}

		multiplyScalar( s ) {

			const te = this.elements;

			te[ 0 ] *= s; te[ 4 ] *= s; te[ 8 ] *= s; te[ 12 ] *= s;
			te[ 1 ] *= s; te[ 5 ] *= s; te[ 9 ] *= s; te[ 13 ] *= s;
			te[ 2 ] *= s; te[ 6 ] *= s; te[ 10 ] *= s; te[ 14 ] *= s;
			te[ 3 ] *= s; te[ 7 ] *= s; te[ 11 ] *= s; te[ 15 ] *= s;

			return this;

		}

		determinant() {

			const te = this.elements;

			const n11 = te[ 0 ], n12 = te[ 4 ], n13 = te[ 8 ], n14 = te[ 12 ];
			const n21 = te[ 1 ], n22 = te[ 5 ], n23 = te[ 9 ], n24 = te[ 13 ];
			const n31 = te[ 2 ], n32 = te[ 6 ], n33 = te[ 10 ], n34 = te[ 14 ];
			const n41 = te[ 3 ], n42 = te[ 7 ], n43 = te[ 11 ], n44 = te[ 15 ];

			//TODO: make this more efficient
			//( based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm )

			return (
				n41 * (
					+ n14 * n23 * n32
					 - n13 * n24 * n32
					 - n14 * n22 * n33
					 + n12 * n24 * n33
					 + n13 * n22 * n34
					 - n12 * n23 * n34
				) +
				n42 * (
					+ n11 * n23 * n34
					 - n11 * n24 * n33
					 + n14 * n21 * n33
					 - n13 * n21 * n34
					 + n13 * n24 * n31
					 - n14 * n23 * n31
				) +
				n43 * (
					+ n11 * n24 * n32
					 - n11 * n22 * n34
					 - n14 * n21 * n32
					 + n12 * n21 * n34
					 + n14 * n22 * n31
					 - n12 * n24 * n31
				) +
				n44 * (
					- n13 * n22 * n31
					 - n11 * n23 * n32
					 + n11 * n22 * n33
					 + n13 * n21 * n32
					 - n12 * n21 * n33
					 + n12 * n23 * n31
				)

			);

		}

		transpose() {

			const te = this.elements;
			let tmp;

			tmp = te[ 1 ]; te[ 1 ] = te[ 4 ]; te[ 4 ] = tmp;
			tmp = te[ 2 ]; te[ 2 ] = te[ 8 ]; te[ 8 ] = tmp;
			tmp = te[ 6 ]; te[ 6 ] = te[ 9 ]; te[ 9 ] = tmp;

			tmp = te[ 3 ]; te[ 3 ] = te[ 12 ]; te[ 12 ] = tmp;
			tmp = te[ 7 ]; te[ 7 ] = te[ 13 ]; te[ 13 ] = tmp;
			tmp = te[ 11 ]; te[ 11 ] = te[ 14 ]; te[ 14 ] = tmp;

			return this;

		}

		setPosition( x, y, z ) {

			const te = this.elements;

			if ( x.isVector3 ) {

				te[ 12 ] = x.x;
				te[ 13 ] = x.y;
				te[ 14 ] = x.z;

			} else {

				te[ 12 ] = x;
				te[ 13 ] = y;
				te[ 14 ] = z;

			}

			return this;

		}

		invert() {

			// based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
			const te = this.elements,

				n11 = te[ 0 ], n21 = te[ 1 ], n31 = te[ 2 ], n41 = te[ 3 ],
				n12 = te[ 4 ], n22 = te[ 5 ], n32 = te[ 6 ], n42 = te[ 7 ],
				n13 = te[ 8 ], n23 = te[ 9 ], n33 = te[ 10 ], n43 = te[ 11 ],
				n14 = te[ 12 ], n24 = te[ 13 ], n34 = te[ 14 ], n44 = te[ 15 ],

				t11 = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44,
				t12 = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44,
				t13 = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44,
				t14 = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;

			const det = n11 * t11 + n21 * t12 + n31 * t13 + n41 * t14;

			if ( det === 0 ) return this.set( 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 );

			const detInv = 1 / det;

			te[ 0 ] = t11 * detInv;
			te[ 1 ] = ( n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44 ) * detInv;
			te[ 2 ] = ( n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44 ) * detInv;
			te[ 3 ] = ( n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43 ) * detInv;

			te[ 4 ] = t12 * detInv;
			te[ 5 ] = ( n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44 ) * detInv;
			te[ 6 ] = ( n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44 ) * detInv;
			te[ 7 ] = ( n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43 ) * detInv;

			te[ 8 ] = t13 * detInv;
			te[ 9 ] = ( n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44 ) * detInv;
			te[ 10 ] = ( n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44 ) * detInv;
			te[ 11 ] = ( n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43 ) * detInv;

			te[ 12 ] = t14 * detInv;
			te[ 13 ] = ( n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34 ) * detInv;
			te[ 14 ] = ( n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34 ) * detInv;
			te[ 15 ] = ( n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33 ) * detInv;

			return this;

		}

		scale( v ) {

			const te = this.elements;
			const x = v.x, y = v.y, z = v.z;

			te[ 0 ] *= x; te[ 4 ] *= y; te[ 8 ] *= z;
			te[ 1 ] *= x; te[ 5 ] *= y; te[ 9 ] *= z;
			te[ 2 ] *= x; te[ 6 ] *= y; te[ 10 ] *= z;
			te[ 3 ] *= x; te[ 7 ] *= y; te[ 11 ] *= z;

			return this;

		}

		getMaxScaleOnAxis() {

			const te = this.elements;

			const scaleXSq = te[ 0 ] * te[ 0 ] + te[ 1 ] * te[ 1 ] + te[ 2 ] * te[ 2 ];
			const scaleYSq = te[ 4 ] * te[ 4 ] + te[ 5 ] * te[ 5 ] + te[ 6 ] * te[ 6 ];
			const scaleZSq = te[ 8 ] * te[ 8 ] + te[ 9 ] * te[ 9 ] + te[ 10 ] * te[ 10 ];

			return Math.sqrt( Math.max( scaleXSq, scaleYSq, scaleZSq ) );

		}

		makeTranslation( x, y, z ) {

			this.set(

				1, 0, 0, x,
				0, 1, 0, y,
				0, 0, 1, z,
				0, 0, 0, 1

			);

			return this;

		}

		makeRotationX( theta ) {

			const c = Math.cos( theta ), s = Math.sin( theta );

			this.set(

				1, 0, 0, 0,
				0, c, - s, 0,
				0, s, c, 0,
				0, 0, 0, 1

			);

			return this;

		}

		makeRotationY( theta ) {

			const c = Math.cos( theta ), s = Math.sin( theta );

			this.set(

				 c, 0, s, 0,
				 0, 1, 0, 0,
				- s, 0, c, 0,
				 0, 0, 0, 1

			);

			return this;

		}

		makeRotationZ( theta ) {

			const c = Math.cos( theta ), s = Math.sin( theta );

			this.set(

				c, - s, 0, 0,
				s, c, 0, 0,
				0, 0, 1, 0,
				0, 0, 0, 1

			);

			return this;

		}

		makeRotationAxis( axis, angle ) {

			// Based on http://www.gamedev.net/reference/articles/article1199.asp

			const c = Math.cos( angle );
			const s = Math.sin( angle );
			const t = 1 - c;
			const x = axis.x, y = axis.y, z = axis.z;
			const tx = t * x, ty = t * y;

			this.set(

				tx * x + c, tx * y - s * z, tx * z + s * y, 0,
				tx * y + s * z, ty * y + c, ty * z - s * x, 0,
				tx * z - s * y, ty * z + s * x, t * z * z + c, 0,
				0, 0, 0, 1

			);

			return this;

		}

		makeScale( x, y, z ) {

			this.set(

				x, 0, 0, 0,
				0, y, 0, 0,
				0, 0, z, 0,
				0, 0, 0, 1

			);

			return this;

		}

		makeShear( xy, xz, yx, yz, zx, zy ) {

			this.set(

				1, yx, zx, 0,
				xy, 1, zy, 0,
				xz, yz, 1, 0,
				0, 0, 0, 1

			);

			return this;

		}

		compose( position, quaternion, scale ) {

			const te = this.elements;

			const x = quaternion._x, y = quaternion._y, z = quaternion._z, w = quaternion._w;
			const x2 = x + x,	y2 = y + y, z2 = z + z;
			const xx = x * x2, xy = x * y2, xz = x * z2;
			const yy = y * y2, yz = y * z2, zz = z * z2;
			const wx = w * x2, wy = w * y2, wz = w * z2;

			const sx = scale.x, sy = scale.y, sz = scale.z;

			te[ 0 ] = ( 1 - ( yy + zz ) ) * sx;
			te[ 1 ] = ( xy + wz ) * sx;
			te[ 2 ] = ( xz - wy ) * sx;
			te[ 3 ] = 0;

			te[ 4 ] = ( xy - wz ) * sy;
			te[ 5 ] = ( 1 - ( xx + zz ) ) * sy;
			te[ 6 ] = ( yz + wx ) * sy;
			te[ 7 ] = 0;

			te[ 8 ] = ( xz + wy ) * sz;
			te[ 9 ] = ( yz - wx ) * sz;
			te[ 10 ] = ( 1 - ( xx + yy ) ) * sz;
			te[ 11 ] = 0;

			te[ 12 ] = position.x;
			te[ 13 ] = position.y;
			te[ 14 ] = position.z;
			te[ 15 ] = 1;

			return this;

		}

		decompose( position, quaternion, scale ) {

			const te = this.elements;

			let sx = _v1$5.set( te[ 0 ], te[ 1 ], te[ 2 ] ).length();
			const sy = _v1$5.set( te[ 4 ], te[ 5 ], te[ 6 ] ).length();
			const sz = _v1$5.set( te[ 8 ], te[ 9 ], te[ 10 ] ).length();

			// if determine is negative, we need to invert one scale
			const det = this.determinant();
			if ( det < 0 ) sx = - sx;

			position.x = te[ 12 ];
			position.y = te[ 13 ];
			position.z = te[ 14 ];

			// scale the rotation part
			_m1$2.copy( this );

			const invSX = 1 / sx;
			const invSY = 1 / sy;
			const invSZ = 1 / sz;

			_m1$2.elements[ 0 ] *= invSX;
			_m1$2.elements[ 1 ] *= invSX;
			_m1$2.elements[ 2 ] *= invSX;

			_m1$2.elements[ 4 ] *= invSY;
			_m1$2.elements[ 5 ] *= invSY;
			_m1$2.elements[ 6 ] *= invSY;

			_m1$2.elements[ 8 ] *= invSZ;
			_m1$2.elements[ 9 ] *= invSZ;
			_m1$2.elements[ 10 ] *= invSZ;

			quaternion.setFromRotationMatrix( _m1$2 );

			scale.x = sx;
			scale.y = sy;
			scale.z = sz;

			return this;

		}

		makePerspective( left, right, top, bottom, near, far ) {

			const te = this.elements;
			const x = 2 * near / ( right - left );
			const y = 2 * near / ( top - bottom );

			const a = ( right + left ) / ( right - left );
			const b = ( top + bottom ) / ( top - bottom );
			const c = - ( far + near ) / ( far - near );
			const d = - 2 * far * near / ( far - near );

			te[ 0 ] = x;	te[ 4 ] = 0;	te[ 8 ] = a;	te[ 12 ] = 0;
			te[ 1 ] = 0;	te[ 5 ] = y;	te[ 9 ] = b;	te[ 13 ] = 0;
			te[ 2 ] = 0;	te[ 6 ] = 0;	te[ 10 ] = c;	te[ 14 ] = d;
			te[ 3 ] = 0;	te[ 7 ] = 0;	te[ 11 ] = - 1;	te[ 15 ] = 0;

			return this;

		}

		makeOrthographic( left, right, top, bottom, near, far ) {

			const te = this.elements;
			const w = 1.0 / ( right - left );
			const h = 1.0 / ( top - bottom );
			const p = 1.0 / ( far - near );

			const x = ( right + left ) * w;
			const y = ( top + bottom ) * h;
			const z = ( far + near ) * p;

			te[ 0 ] = 2 * w;	te[ 4 ] = 0;	te[ 8 ] = 0;	te[ 12 ] = - x;
			te[ 1 ] = 0;	te[ 5 ] = 2 * h;	te[ 9 ] = 0;	te[ 13 ] = - y;
			te[ 2 ] = 0;	te[ 6 ] = 0;	te[ 10 ] = - 2 * p;	te[ 14 ] = - z;
			te[ 3 ] = 0;	te[ 7 ] = 0;	te[ 11 ] = 0;	te[ 15 ] = 1;

			return this;

		}

		equals( matrix ) {

			const te = this.elements;
			const me = matrix.elements;

			for ( let i = 0; i < 16; i ++ ) {

				if ( te[ i ] !== me[ i ] ) return false;

			}

			return true;

		}

		fromArray( array, offset = 0 ) {

			for ( let i = 0; i < 16; i ++ ) {

				this.elements[ i ] = array[ i + offset ];

			}

			return this;

		}

		toArray( array = [], offset = 0 ) {

			const te = this.elements;

			array[ offset ] = te[ 0 ];
			array[ offset + 1 ] = te[ 1 ];
			array[ offset + 2 ] = te[ 2 ];
			array[ offset + 3 ] = te[ 3 ];

			array[ offset + 4 ] = te[ 4 ];
			array[ offset + 5 ] = te[ 5 ];
			array[ offset + 6 ] = te[ 6 ];
			array[ offset + 7 ] = te[ 7 ];

			array[ offset + 8 ] = te[ 8 ];
			array[ offset + 9 ] = te[ 9 ];
			array[ offset + 10 ] = te[ 10 ];
			array[ offset + 11 ] = te[ 11 ];

			array[ offset + 12 ] = te[ 12 ];
			array[ offset + 13 ] = te[ 13 ];
			array[ offset + 14 ] = te[ 14 ];
			array[ offset + 15 ] = te[ 15 ];

			return array;

		}

	}

	const _v1$5 = /*@__PURE__*/ new Vector3();
	const _m1$2 = /*@__PURE__*/ new Matrix4();
	const _zero = /*@__PURE__*/ new Vector3( 0, 0, 0 );
	const _one = /*@__PURE__*/ new Vector3( 1, 1, 1 );
	const _x = /*@__PURE__*/ new Vector3();
	const _y = /*@__PURE__*/ new Vector3();
	const _z = /*@__PURE__*/ new Vector3();

	const _matrix = /*@__PURE__*/ new Matrix4();
	const _quaternion$3 = /*@__PURE__*/ new Quaternion();

	class Euler {

		constructor( x = 0, y = 0, z = 0, order = Euler.DEFAULT_ORDER ) {

			this.isEuler = true;

			this._x = x;
			this._y = y;
			this._z = z;
			this._order = order;

		}

		get x() {

			return this._x;

		}

		set x( value ) {

			this._x = value;
			this._onChangeCallback();

		}

		get y() {

			return this._y;

		}

		set y( value ) {

			this._y = value;
			this._onChangeCallback();

		}

		get z() {

			return this._z;

		}

		set z( value ) {

			this._z = value;
			this._onChangeCallback();

		}

		get order() {

			return this._order;

		}

		set order( value ) {

			this._order = value;
			this._onChangeCallback();

		}

		set( x, y, z, order = this._order ) {

			this._x = x;
			this._y = y;
			this._z = z;
			this._order = order;

			this._onChangeCallback();

			return this;

		}

		clone() {

			return new this.constructor( this._x, this._y, this._z, this._order );

		}

		copy( euler ) {

			this._x = euler._x;
			this._y = euler._y;
			this._z = euler._z;
			this._order = euler._order;

			this._onChangeCallback();

			return this;

		}

		setFromRotationMatrix( m, order = this._order, update = true ) {

			// assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

			const te = m.elements;
			const m11 = te[ 0 ], m12 = te[ 4 ], m13 = te[ 8 ];
			const m21 = te[ 1 ], m22 = te[ 5 ], m23 = te[ 9 ];
			const m31 = te[ 2 ], m32 = te[ 6 ], m33 = te[ 10 ];

			switch ( order ) {

				case 'XYZ':

					this._y = Math.asin( clamp( m13, - 1, 1 ) );

					if ( Math.abs( m13 ) < 0.9999999 ) {

						this._x = Math.atan2( - m23, m33 );
						this._z = Math.atan2( - m12, m11 );

					} else {

						this._x = Math.atan2( m32, m22 );
						this._z = 0;

					}

					break;

				case 'YXZ':

					this._x = Math.asin( - clamp( m23, - 1, 1 ) );

					if ( Math.abs( m23 ) < 0.9999999 ) {

						this._y = Math.atan2( m13, m33 );
						this._z = Math.atan2( m21, m22 );

					} else {

						this._y = Math.atan2( - m31, m11 );
						this._z = 0;

					}

					break;

				case 'ZXY':

					this._x = Math.asin( clamp( m32, - 1, 1 ) );

					if ( Math.abs( m32 ) < 0.9999999 ) {

						this._y = Math.atan2( - m31, m33 );
						this._z = Math.atan2( - m12, m22 );

					} else {

						this._y = 0;
						this._z = Math.atan2( m21, m11 );

					}

					break;

				case 'ZYX':

					this._y = Math.asin( - clamp( m31, - 1, 1 ) );

					if ( Math.abs( m31 ) < 0.9999999 ) {

						this._x = Math.atan2( m32, m33 );
						this._z = Math.atan2( m21, m11 );

					} else {

						this._x = 0;
						this._z = Math.atan2( - m12, m22 );

					}

					break;

				case 'YZX':

					this._z = Math.asin( clamp( m21, - 1, 1 ) );

					if ( Math.abs( m21 ) < 0.9999999 ) {

						this._x = Math.atan2( - m23, m22 );
						this._y = Math.atan2( - m31, m11 );

					} else {

						this._x = 0;
						this._y = Math.atan2( m13, m33 );

					}

					break;

				case 'XZY':

					this._z = Math.asin( - clamp( m12, - 1, 1 ) );

					if ( Math.abs( m12 ) < 0.9999999 ) {

						this._x = Math.atan2( m32, m22 );
						this._y = Math.atan2( m13, m11 );

					} else {

						this._x = Math.atan2( - m23, m33 );
						this._y = 0;

					}

					break;

				default:

					console.warn( 'THREE.Euler: .setFromRotationMatrix() encountered an unknown order: ' + order );

			}

			this._order = order;

			if ( update === true ) this._onChangeCallback();

			return this;

		}

		setFromQuaternion( q, order, update ) {

			_matrix.makeRotationFromQuaternion( q );

			return this.setFromRotationMatrix( _matrix, order, update );

		}

		setFromVector3( v, order = this._order ) {

			return this.set( v.x, v.y, v.z, order );

		}

		reorder( newOrder ) {

			// WARNING: this discards revolution information -bhouston

			_quaternion$3.setFromEuler( this );

			return this.setFromQuaternion( _quaternion$3, newOrder );

		}

		equals( euler ) {

			return ( euler._x === this._x ) && ( euler._y === this._y ) && ( euler._z === this._z ) && ( euler._order === this._order );

		}

		fromArray( array ) {

			this._x = array[ 0 ];
			this._y = array[ 1 ];
			this._z = array[ 2 ];
			if ( array[ 3 ] !== undefined ) this._order = array[ 3 ];

			this._onChangeCallback();

			return this;

		}

		toArray( array = [], offset = 0 ) {

			array[ offset ] = this._x;
			array[ offset + 1 ] = this._y;
			array[ offset + 2 ] = this._z;
			array[ offset + 3 ] = this._order;

			return array;

		}

		_onChange( callback ) {

			this._onChangeCallback = callback;

			return this;

		}

		_onChangeCallback() {}

		*[ Symbol.iterator ]() {

			yield this._x;
			yield this._y;
			yield this._z;
			yield this._order;

		}

	}

	Euler.DEFAULT_ORDER = 'XYZ';

	class Layers {

		constructor() {

			this.mask = 1 | 0;

		}

		set( channel ) {

			this.mask = ( 1 << channel | 0 ) >>> 0;

		}

		enable( channel ) {

			this.mask |= 1 << channel | 0;

		}

		enableAll() {

			this.mask = 0xffffffff | 0;

		}

		toggle( channel ) {

			this.mask ^= 1 << channel | 0;

		}

		disable( channel ) {

			this.mask &= ~ ( 1 << channel | 0 );

		}

		disableAll() {

			this.mask = 0;

		}

		test( layers ) {

			return ( this.mask & layers.mask ) !== 0;

		}

		isEnabled( channel ) {

			return ( this.mask & ( 1 << channel | 0 ) ) !== 0;

		}

	}

	let _object3DId = 0;

	const _v1$4 = /*@__PURE__*/ new Vector3();
	const _q1 = /*@__PURE__*/ new Quaternion();
	const _m1$1 = /*@__PURE__*/ new Matrix4();
	const _target = /*@__PURE__*/ new Vector3();

	const _position$3 = /*@__PURE__*/ new Vector3();
	const _scale$2 = /*@__PURE__*/ new Vector3();
	const _quaternion$2 = /*@__PURE__*/ new Quaternion();

	const _xAxis = /*@__PURE__*/ new Vector3( 1, 0, 0 );
	const _yAxis = /*@__PURE__*/ new Vector3( 0, 1, 0 );
	const _zAxis = /*@__PURE__*/ new Vector3( 0, 0, 1 );

	const _addedEvent = { type: 'added' };
	const _removedEvent = { type: 'removed' };

	class Object3D extends EventDispatcher {

		constructor() {

			super();

			this.isObject3D = true;

			Object.defineProperty( this, 'id', { value: _object3DId ++ } );

			this.uuid = generateUUID();

			this.name = '';
			this.type = 'Object3D';

			this.parent = null;
			this.children = [];

			this.up = Object3D.DEFAULT_UP.clone();

			const position = new Vector3();
			const rotation = new Euler();
			const quaternion = new Quaternion();
			const scale = new Vector3( 1, 1, 1 );

			function onRotationChange() {

				quaternion.setFromEuler( rotation, false );

			}

			function onQuaternionChange() {

				rotation.setFromQuaternion( quaternion, undefined, false );

			}

			rotation._onChange( onRotationChange );
			quaternion._onChange( onQuaternionChange );

			Object.defineProperties( this, {
				position: {
					configurable: true,
					enumerable: true,
					value: position
				},
				rotation: {
					configurable: true,
					enumerable: true,
					value: rotation
				},
				quaternion: {
					configurable: true,
					enumerable: true,
					value: quaternion
				},
				scale: {
					configurable: true,
					enumerable: true,
					value: scale
				},
				modelViewMatrix: {
					value: new Matrix4()
				},
				normalMatrix: {
					value: new Matrix3()
				}
			} );

			this.matrix = new Matrix4();
			this.matrixWorld = new Matrix4();

			this.matrixAutoUpdate = Object3D.DEFAULT_MATRIX_AUTO_UPDATE;
			this.matrixWorldNeedsUpdate = false;

			this.matrixWorldAutoUpdate = Object3D.DEFAULT_MATRIX_WORLD_AUTO_UPDATE; // checked by the renderer

			this.layers = new Layers();
			this.visible = true;

			this.castShadow = false;
			this.receiveShadow = false;

			this.frustumCulled = true;
			this.renderOrder = 0;

			this.animations = [];

			this.userData = {};

		}

		onBeforeRender( /* renderer, scene, camera, geometry, material, group */ ) {}

		onAfterRender( /* renderer, scene, camera, geometry, material, group */ ) {}

		applyMatrix4( matrix ) {

			if ( this.matrixAutoUpdate ) this.updateMatrix();

			this.matrix.premultiply( matrix );

			this.matrix.decompose( this.position, this.quaternion, this.scale );

		}

		applyQuaternion( q ) {

			this.quaternion.premultiply( q );

			return this;

		}

		setRotationFromAxisAngle( axis, angle ) {

			// assumes axis is normalized

			this.quaternion.setFromAxisAngle( axis, angle );

		}

		setRotationFromEuler( euler ) {

			this.quaternion.setFromEuler( euler, true );

		}

		setRotationFromMatrix( m ) {

			// assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

			this.quaternion.setFromRotationMatrix( m );

		}

		setRotationFromQuaternion( q ) {

			// assumes q is normalized

			this.quaternion.copy( q );

		}

		rotateOnAxis( axis, angle ) {

			// rotate object on axis in object space
			// axis is assumed to be normalized

			_q1.setFromAxisAngle( axis, angle );

			this.quaternion.multiply( _q1 );

			return this;

		}

		rotateOnWorldAxis( axis, angle ) {

			// rotate object on axis in world space
			// axis is assumed to be normalized
			// method assumes no rotated parent

			_q1.setFromAxisAngle( axis, angle );

			this.quaternion.premultiply( _q1 );

			return this;

		}

		rotateX( angle ) {

			return this.rotateOnAxis( _xAxis, angle );

		}

		rotateY( angle ) {

			return this.rotateOnAxis( _yAxis, angle );

		}

		rotateZ( angle ) {

			return this.rotateOnAxis( _zAxis, angle );

		}

		translateOnAxis( axis, distance ) {

			// translate object by distance along axis in object space
			// axis is assumed to be normalized

			_v1$4.copy( axis ).applyQuaternion( this.quaternion );

			this.position.add( _v1$4.multiplyScalar( distance ) );

			return this;

		}

		translateX( distance ) {

			return this.translateOnAxis( _xAxis, distance );

		}

		translateY( distance ) {

			return this.translateOnAxis( _yAxis, distance );

		}

		translateZ( distance ) {

			return this.translateOnAxis( _zAxis, distance );

		}

		localToWorld( vector ) {

			this.updateWorldMatrix( true, false );

			return vector.applyMatrix4( this.matrixWorld );

		}

		worldToLocal( vector ) {

			this.updateWorldMatrix( true, false );

			return vector.applyMatrix4( _m1$1.copy( this.matrixWorld ).invert() );

		}

		lookAt( x, y, z ) {

			// This method does not support objects having non-uniformly-scaled parent(s)

			if ( x.isVector3 ) {

				_target.copy( x );

			} else {

				_target.set( x, y, z );

			}

			const parent = this.parent;

			this.updateWorldMatrix( true, false );

			_position$3.setFromMatrixPosition( this.matrixWorld );

			if ( this.isCamera || this.isLight ) {

				_m1$1.lookAt( _position$3, _target, this.up );

			} else {

				_m1$1.lookAt( _target, _position$3, this.up );

			}

			this.quaternion.setFromRotationMatrix( _m1$1 );

			if ( parent ) {

				_m1$1.extractRotation( parent.matrixWorld );
				_q1.setFromRotationMatrix( _m1$1 );
				this.quaternion.premultiply( _q1.invert() );

			}

		}

		add( object ) {

			if ( arguments.length > 1 ) {

				for ( let i = 0; i < arguments.length; i ++ ) {

					this.add( arguments[ i ] );

				}

				return this;

			}

			if ( object === this ) {

				console.error( 'THREE.Object3D.add: object can\'t be added as a child of itself.', object );
				return this;

			}

			if ( object && object.isObject3D ) {

				if ( object.parent !== null ) {

					object.parent.remove( object );

				}

				object.parent = this;
				this.children.push( object );

				object.dispatchEvent( _addedEvent );

			} else {

				console.error( 'THREE.Object3D.add: object not an instance of THREE.Object3D.', object );

			}

			return this;

		}

		remove( object ) {

			if ( arguments.length > 1 ) {

				for ( let i = 0; i < arguments.length; i ++ ) {

					this.remove( arguments[ i ] );

				}

				return this;

			}

			const index = this.children.indexOf( object );

			if ( index !== - 1 ) {

				object.parent = null;
				this.children.splice( index, 1 );

				object.dispatchEvent( _removedEvent );

			}

			return this;

		}

		removeFromParent() {

			const parent = this.parent;

			if ( parent !== null ) {

				parent.remove( this );

			}

			return this;

		}

		clear() {

			for ( let i = 0; i < this.children.length; i ++ ) {

				const object = this.children[ i ];

				object.parent = null;

				object.dispatchEvent( _removedEvent );

			}

			this.children.length = 0;

			return this;


		}

		attach( object ) {

			// adds object as a child of this, while maintaining the object's world transform

			// Note: This method does not support scene graphs having non-uniformly-scaled nodes(s)

			this.updateWorldMatrix( true, false );

			_m1$1.copy( this.matrixWorld ).invert();

			if ( object.parent !== null ) {

				object.parent.updateWorldMatrix( true, false );

				_m1$1.multiply( object.parent.matrixWorld );

			}

			object.applyMatrix4( _m1$1 );

			this.add( object );

			object.updateWorldMatrix( false, true );

			return this;

		}

		getObjectById( id ) {

			return this.getObjectByProperty( 'id', id );

		}

		getObjectByName( name ) {

			return this.getObjectByProperty( 'name', name );

		}

		getObjectByProperty( name, value ) {

			if ( this[ name ] === value ) return this;

			for ( let i = 0, l = this.children.length; i < l; i ++ ) {

				const child = this.children[ i ];
				const object = child.getObjectByProperty( name, value );

				if ( object !== undefined ) {

					return object;

				}

			}

			return undefined;

		}

		getObjectsByProperty( name, value ) {

			let result = [];

			if ( this[ name ] === value ) result.push( this );

			for ( let i = 0, l = this.children.length; i < l; i ++ ) {

				const childResult = this.children[ i ].getObjectsByProperty( name, value );

				if ( childResult.length > 0 ) {

					result = result.concat( childResult );

				}

			}

			return result;

		}

		getWorldPosition( target ) {

			this.updateWorldMatrix( true, false );

			return target.setFromMatrixPosition( this.matrixWorld );

		}

		getWorldQuaternion( target ) {

			this.updateWorldMatrix( true, false );

			this.matrixWorld.decompose( _position$3, target, _scale$2 );

			return target;

		}

		getWorldScale( target ) {

			this.updateWorldMatrix( true, false );

			this.matrixWorld.decompose( _position$3, _quaternion$2, target );

			return target;

		}

		getWorldDirection( target ) {

			this.updateWorldMatrix( true, false );

			const e = this.matrixWorld.elements;

			return target.set( e[ 8 ], e[ 9 ], e[ 10 ] ).normalize();

		}

		raycast( /* raycaster, intersects */ ) {}

		traverse( callback ) {

			callback( this );

			const children = this.children;

			for ( let i = 0, l = children.length; i < l; i ++ ) {

				children[ i ].traverse( callback );

			}

		}

		traverseVisible( callback ) {

			if ( this.visible === false ) return;

			callback( this );

			const children = this.children;

			for ( let i = 0, l = children.length; i < l; i ++ ) {

				children[ i ].traverseVisible( callback );

			}

		}

		traverseAncestors( callback ) {

			const parent = this.parent;

			if ( parent !== null ) {

				callback( parent );

				parent.traverseAncestors( callback );

			}

		}

		updateMatrix() {

			this.matrix.compose( this.position, this.quaternion, this.scale );

			this.matrixWorldNeedsUpdate = true;

		}

		updateMatrixWorld( force ) {

			if ( this.matrixAutoUpdate ) this.updateMatrix();

			if ( this.matrixWorldNeedsUpdate || force ) {

				if ( this.parent === null ) {

					this.matrixWorld.copy( this.matrix );

				} else {

					this.matrixWorld.multiplyMatrices( this.parent.matrixWorld, this.matrix );

				}

				this.matrixWorldNeedsUpdate = false;

				force = true;

			}

			// update children

			const children = this.children;

			for ( let i = 0, l = children.length; i < l; i ++ ) {

				const child = children[ i ];

				if ( child.matrixWorldAutoUpdate === true || force === true ) {

					child.updateMatrixWorld( force );

				}

			}

		}

		updateWorldMatrix( updateParents, updateChildren ) {

			const parent = this.parent;

			if ( updateParents === true && parent !== null && parent.matrixWorldAutoUpdate === true ) {

				parent.updateWorldMatrix( true, false );

			}

			if ( this.matrixAutoUpdate ) this.updateMatrix();

			if ( this.parent === null ) {

				this.matrixWorld.copy( this.matrix );

			} else {

				this.matrixWorld.multiplyMatrices( this.parent.matrixWorld, this.matrix );

			}

			// update children

			if ( updateChildren === true ) {

				const children = this.children;

				for ( let i = 0, l = children.length; i < l; i ++ ) {

					const child = children[ i ];

					if ( child.matrixWorldAutoUpdate === true ) {

						child.updateWorldMatrix( false, true );

					}

				}

			}

		}

		toJSON( meta ) {

			// meta is a string when called from JSON.stringify
			const isRootObject = ( meta === undefined || typeof meta === 'string' );

			const output = {};

			// meta is a hash used to collect geometries, materials.
			// not providing it implies that this is the root object
			// being serialized.
			if ( isRootObject ) {

				// initialize meta obj
				meta = {
					geometries: {},
					materials: {},
					textures: {},
					images: {},
					shapes: {},
					skeletons: {},
					animations: {},
					nodes: {}
				};

				output.metadata = {
					version: 4.5,
					type: 'Object',
					generator: 'Object3D.toJSON'
				};

			}

			// standard Object3D serialization

			const object = {};

			object.uuid = this.uuid;
			object.type = this.type;

			if ( this.name !== '' ) object.name = this.name;
			if ( this.castShadow === true ) object.castShadow = true;
			if ( this.receiveShadow === true ) object.receiveShadow = true;
			if ( this.visible === false ) object.visible = false;
			if ( this.frustumCulled === false ) object.frustumCulled = false;
			if ( this.renderOrder !== 0 ) object.renderOrder = this.renderOrder;
			if ( Object.keys( this.userData ).length > 0 ) object.userData = this.userData;

			object.layers = this.layers.mask;
			object.matrix = this.matrix.toArray();
			object.up = this.up.toArray();

			if ( this.matrixAutoUpdate === false ) object.matrixAutoUpdate = false;

			// object specific properties

			if ( this.isInstancedMesh ) {

				object.type = 'InstancedMesh';
				object.count = this.count;
				object.instanceMatrix = this.instanceMatrix.toJSON();
				if ( this.instanceColor !== null ) object.instanceColor = this.instanceColor.toJSON();

			}

			//

			function serialize( library, element ) {

				if ( library[ element.uuid ] === undefined ) {

					library[ element.uuid ] = element.toJSON( meta );

				}

				return element.uuid;

			}

			if ( this.isScene ) {

				if ( this.background ) {

					if ( this.background.isColor ) {

						object.background = this.background.toJSON();

					} else if ( this.background.isTexture ) {

						object.background = this.background.toJSON( meta ).uuid;

					}

				}

				if ( this.environment && this.environment.isTexture && this.environment.isRenderTargetTexture !== true ) {

					object.environment = this.environment.toJSON( meta ).uuid;

				}

			} else if ( this.isMesh || this.isLine || this.isPoints ) {

				object.geometry = serialize( meta.geometries, this.geometry );

				const parameters = this.geometry.parameters;

				if ( parameters !== undefined && parameters.shapes !== undefined ) {

					const shapes = parameters.shapes;

					if ( Array.isArray( shapes ) ) {

						for ( let i = 0, l = shapes.length; i < l; i ++ ) {

							const shape = shapes[ i ];

							serialize( meta.shapes, shape );

						}

					} else {

						serialize( meta.shapes, shapes );

					}

				}

			}

			if ( this.isSkinnedMesh ) {

				object.bindMode = this.bindMode;
				object.bindMatrix = this.bindMatrix.toArray();

				if ( this.skeleton !== undefined ) {

					serialize( meta.skeletons, this.skeleton );

					object.skeleton = this.skeleton.uuid;

				}

			}

			if ( this.material !== undefined ) {

				if ( Array.isArray( this.material ) ) {

					const uuids = [];

					for ( let i = 0, l = this.material.length; i < l; i ++ ) {

						uuids.push( serialize( meta.materials, this.material[ i ] ) );

					}

					object.material = uuids;

				} else {

					object.material = serialize( meta.materials, this.material );

				}

			}

			//

			if ( this.children.length > 0 ) {

				object.children = [];

				for ( let i = 0; i < this.children.length; i ++ ) {

					object.children.push( this.children[ i ].toJSON( meta ).object );

				}

			}

			//

			if ( this.animations.length > 0 ) {

				object.animations = [];

				for ( let i = 0; i < this.animations.length; i ++ ) {

					const animation = this.animations[ i ];

					object.animations.push( serialize( meta.animations, animation ) );

				}

			}

			if ( isRootObject ) {

				const geometries = extractFromCache( meta.geometries );
				const materials = extractFromCache( meta.materials );
				const textures = extractFromCache( meta.textures );
				const images = extractFromCache( meta.images );
				const shapes = extractFromCache( meta.shapes );
				const skeletons = extractFromCache( meta.skeletons );
				const animations = extractFromCache( meta.animations );
				const nodes = extractFromCache( meta.nodes );

				if ( geometries.length > 0 ) output.geometries = geometries;
				if ( materials.length > 0 ) output.materials = materials;
				if ( textures.length > 0 ) output.textures = textures;
				if ( images.length > 0 ) output.images = images;
				if ( shapes.length > 0 ) output.shapes = shapes;
				if ( skeletons.length > 0 ) output.skeletons = skeletons;
				if ( animations.length > 0 ) output.animations = animations;
				if ( nodes.length > 0 ) output.nodes = nodes;

			}

			output.object = object;

			return output;

			// extract data from the cache hash
			// remove metadata on each item
			// and return as array
			function extractFromCache( cache ) {

				const values = [];
				for ( const key in cache ) {

					const data = cache[ key ];
					delete data.metadata;
					values.push( data );

				}

				return values;

			}

		}

		clone( recursive ) {

			return new this.constructor().copy( this, recursive );

		}

		copy( source, recursive = true ) {

			this.name = source.name;

			this.up.copy( source.up );

			this.position.copy( source.position );
			this.rotation.order = source.rotation.order;
			this.quaternion.copy( source.quaternion );
			this.scale.copy( source.scale );

			this.matrix.copy( source.matrix );
			this.matrixWorld.copy( source.matrixWorld );

			this.matrixAutoUpdate = source.matrixAutoUpdate;
			this.matrixWorldNeedsUpdate = source.matrixWorldNeedsUpdate;

			this.matrixWorldAutoUpdate = source.matrixWorldAutoUpdate;

			this.layers.mask = source.layers.mask;
			this.visible = source.visible;

			this.castShadow = source.castShadow;
			this.receiveShadow = source.receiveShadow;

			this.frustumCulled = source.frustumCulled;
			this.renderOrder = source.renderOrder;

			this.animations = source.animations;

			this.userData = JSON.parse( JSON.stringify( source.userData ) );

			if ( recursive === true ) {

				for ( let i = 0; i < source.children.length; i ++ ) {

					const child = source.children[ i ];
					this.add( child.clone() );

				}

			}

			return this;

		}

	}

	Object3D.DEFAULT_UP = /*@__PURE__*/ new Vector3( 0, 1, 0 );
	Object3D.DEFAULT_MATRIX_AUTO_UPDATE = true;
	Object3D.DEFAULT_MATRIX_WORLD_AUTO_UPDATE = true;

	const _colorKeywords = { 'aliceblue': 0xF0F8FF, 'antiquewhite': 0xFAEBD7, 'aqua': 0x00FFFF, 'aquamarine': 0x7FFFD4, 'azure': 0xF0FFFF,
		'beige': 0xF5F5DC, 'bisque': 0xFFE4C4, 'black': 0x000000, 'blanchedalmond': 0xFFEBCD, 'blue': 0x0000FF, 'blueviolet': 0x8A2BE2,
		'brown': 0xA52A2A, 'burlywood': 0xDEB887, 'cadetblue': 0x5F9EA0, 'chartreuse': 0x7FFF00, 'chocolate': 0xD2691E, 'coral': 0xFF7F50,
		'cornflowerblue': 0x6495ED, 'cornsilk': 0xFFF8DC, 'crimson': 0xDC143C, 'cyan': 0x00FFFF, 'darkblue': 0x00008B, 'darkcyan': 0x008B8B,
		'darkgoldenrod': 0xB8860B, 'darkgray': 0xA9A9A9, 'darkgreen': 0x006400, 'darkgrey': 0xA9A9A9, 'darkkhaki': 0xBDB76B, 'darkmagenta': 0x8B008B,
		'darkolivegreen': 0x556B2F, 'darkorange': 0xFF8C00, 'darkorchid': 0x9932CC, 'darkred': 0x8B0000, 'darksalmon': 0xE9967A, 'darkseagreen': 0x8FBC8F,
		'darkslateblue': 0x483D8B, 'darkslategray': 0x2F4F4F, 'darkslategrey': 0x2F4F4F, 'darkturquoise': 0x00CED1, 'darkviolet': 0x9400D3,
		'deeppink': 0xFF1493, 'deepskyblue': 0x00BFFF, 'dimgray': 0x696969, 'dimgrey': 0x696969, 'dodgerblue': 0x1E90FF, 'firebrick': 0xB22222,
		'floralwhite': 0xFFFAF0, 'forestgreen': 0x228B22, 'fuchsia': 0xFF00FF, 'gainsboro': 0xDCDCDC, 'ghostwhite': 0xF8F8FF, 'gold': 0xFFD700,
		'goldenrod': 0xDAA520, 'gray': 0x808080, 'green': 0x008000, 'greenyellow': 0xADFF2F, 'grey': 0x808080, 'honeydew': 0xF0FFF0, 'hotpink': 0xFF69B4,
		'indianred': 0xCD5C5C, 'indigo': 0x4B0082, 'ivory': 0xFFFFF0, 'khaki': 0xF0E68C, 'lavender': 0xE6E6FA, 'lavenderblush': 0xFFF0F5, 'lawngreen': 0x7CFC00,
		'lemonchiffon': 0xFFFACD, 'lightblue': 0xADD8E6, 'lightcoral': 0xF08080, 'lightcyan': 0xE0FFFF, 'lightgoldenrodyellow': 0xFAFAD2, 'lightgray': 0xD3D3D3,
		'lightgreen': 0x90EE90, 'lightgrey': 0xD3D3D3, 'lightpink': 0xFFB6C1, 'lightsalmon': 0xFFA07A, 'lightseagreen': 0x20B2AA, 'lightskyblue': 0x87CEFA,
		'lightslategray': 0x778899, 'lightslategrey': 0x778899, 'lightsteelblue': 0xB0C4DE, 'lightyellow': 0xFFFFE0, 'lime': 0x00FF00, 'limegreen': 0x32CD32,
		'linen': 0xFAF0E6, 'magenta': 0xFF00FF, 'maroon': 0x800000, 'mediumaquamarine': 0x66CDAA, 'mediumblue': 0x0000CD, 'mediumorchid': 0xBA55D3,
		'mediumpurple': 0x9370DB, 'mediumseagreen': 0x3CB371, 'mediumslateblue': 0x7B68EE, 'mediumspringgreen': 0x00FA9A, 'mediumturquoise': 0x48D1CC,
		'mediumvioletred': 0xC71585, 'midnightblue': 0x191970, 'mintcream': 0xF5FFFA, 'mistyrose': 0xFFE4E1, 'moccasin': 0xFFE4B5, 'navajowhite': 0xFFDEAD,
		'navy': 0x000080, 'oldlace': 0xFDF5E6, 'olive': 0x808000, 'olivedrab': 0x6B8E23, 'orange': 0xFFA500, 'orangered': 0xFF4500, 'orchid': 0xDA70D6,
		'palegoldenrod': 0xEEE8AA, 'palegreen': 0x98FB98, 'paleturquoise': 0xAFEEEE, 'palevioletred': 0xDB7093, 'papayawhip': 0xFFEFD5, 'peachpuff': 0xFFDAB9,
		'peru': 0xCD853F, 'pink': 0xFFC0CB, 'plum': 0xDDA0DD, 'powderblue': 0xB0E0E6, 'purple': 0x800080, 'rebeccapurple': 0x663399, 'red': 0xFF0000, 'rosybrown': 0xBC8F8F,
		'royalblue': 0x4169E1, 'saddlebrown': 0x8B4513, 'salmon': 0xFA8072, 'sandybrown': 0xF4A460, 'seagreen': 0x2E8B57, 'seashell': 0xFFF5EE,
		'sienna': 0xA0522D, 'silver': 0xC0C0C0, 'skyblue': 0x87CEEB, 'slateblue': 0x6A5ACD, 'slategray': 0x708090, 'slategrey': 0x708090, 'snow': 0xFFFAFA,
		'springgreen': 0x00FF7F, 'steelblue': 0x4682B4, 'tan': 0xD2B48C, 'teal': 0x008080, 'thistle': 0xD8BFD8, 'tomato': 0xFF6347, 'turquoise': 0x40E0D0,
		'violet': 0xEE82EE, 'wheat': 0xF5DEB3, 'white': 0xFFFFFF, 'whitesmoke': 0xF5F5F5, 'yellow': 0xFFFF00, 'yellowgreen': 0x9ACD32 };

	const _hslA = { h: 0, s: 0, l: 0 };
	const _hslB = { h: 0, s: 0, l: 0 };

	function hue2rgb( p, q, t ) {

		if ( t < 0 ) t += 1;
		if ( t > 1 ) t -= 1;
		if ( t < 1 / 6 ) return p + ( q - p ) * 6 * t;
		if ( t < 1 / 2 ) return q;
		if ( t < 2 / 3 ) return p + ( q - p ) * 6 * ( 2 / 3 - t );
		return p;

	}

	class Color {

		constructor( r, g, b ) {

			this.isColor = true;

			this.r = 1;
			this.g = 1;
			this.b = 1;

			if ( g === undefined && b === undefined ) {

				// r is THREE.Color, hex or string
				return this.set( r );

			}

			return this.setRGB( r, g, b );

		}

		set( value ) {

			if ( value && value.isColor ) {

				this.copy( value );

			} else if ( typeof value === 'number' ) {

				this.setHex( value );

			} else if ( typeof value === 'string' ) {

				this.setStyle( value );

			}

			return this;

		}

		setScalar( scalar ) {

			this.r = scalar;
			this.g = scalar;
			this.b = scalar;

			return this;

		}

		setHex( hex, colorSpace = SRGBColorSpace ) {

			hex = Math.floor( hex );

			this.r = ( hex >> 16 & 255 ) / 255;
			this.g = ( hex >> 8 & 255 ) / 255;
			this.b = ( hex & 255 ) / 255;

			ColorManagement.toWorkingColorSpace( this, colorSpace );

			return this;

		}

		setRGB( r, g, b, colorSpace = ColorManagement.workingColorSpace ) {

			this.r = r;
			this.g = g;
			this.b = b;

			ColorManagement.toWorkingColorSpace( this, colorSpace );

			return this;

		}

		setHSL( h, s, l, colorSpace = ColorManagement.workingColorSpace ) {

			// h,s,l ranges are in 0.0 - 1.0
			h = euclideanModulo( h, 1 );
			s = clamp( s, 0, 1 );
			l = clamp( l, 0, 1 );

			if ( s === 0 ) {

				this.r = this.g = this.b = l;

			} else {

				const p = l <= 0.5 ? l * ( 1 + s ) : l + s - ( l * s );
				const q = ( 2 * l ) - p;

				this.r = hue2rgb( q, p, h + 1 / 3 );
				this.g = hue2rgb( q, p, h );
				this.b = hue2rgb( q, p, h - 1 / 3 );

			}

			ColorManagement.toWorkingColorSpace( this, colorSpace );

			return this;

		}

		setStyle( style, colorSpace = SRGBColorSpace ) {

			function handleAlpha( string ) {

				if ( string === undefined ) return;

				if ( parseFloat( string ) < 1 ) {

					console.warn( 'THREE.Color: Alpha component of ' + style + ' will be ignored.' );

				}

			}


			let m;

			if ( m = /^(\w+)\(([^\)]*)\)/.exec( style ) ) {

				// rgb / hsl

				let color;
				const name = m[ 1 ];
				const components = m[ 2 ];

				switch ( name ) {

					case 'rgb':
					case 'rgba':

						if ( color = /^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec( components ) ) {

							// rgb(255,0,0) rgba(255,0,0,0.5)

							handleAlpha( color[ 4 ] );

							return this.setRGB(
								Math.min( 255, parseInt( color[ 1 ], 10 ) ) / 255,
								Math.min( 255, parseInt( color[ 2 ], 10 ) ) / 255,
								Math.min( 255, parseInt( color[ 3 ], 10 ) ) / 255,
								colorSpace
							);

						}

						if ( color = /^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec( components ) ) {

							// rgb(100%,0%,0%) rgba(100%,0%,0%,0.5)

							handleAlpha( color[ 4 ] );

							return this.setRGB(
								Math.min( 100, parseInt( color[ 1 ], 10 ) ) / 100,
								Math.min( 100, parseInt( color[ 2 ], 10 ) ) / 100,
								Math.min( 100, parseInt( color[ 3 ], 10 ) ) / 100,
								colorSpace
							);

						}

						break;

					case 'hsl':
					case 'hsla':

						if ( color = /^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec( components ) ) {

							// hsl(120,50%,50%) hsla(120,50%,50%,0.5)

							handleAlpha( color[ 4 ] );

							return this.setHSL(
								parseFloat( color[ 1 ] ) / 360,
								parseFloat( color[ 2 ] ) / 100,
								parseFloat( color[ 3 ] ) / 100,
								colorSpace
							);

						}

						break;

					default:

						console.warn( 'THREE.Color: Unknown color model ' + style );

				}

			} else if ( m = /^\#([A-Fa-f\d]+)$/.exec( style ) ) {

				// hex color

				const hex = m[ 1 ];
				const size = hex.length;

				if ( size === 3 ) {

					// #ff0
					return this.setRGB(
						parseInt( hex.charAt( 0 ), 16 ) / 15,
						parseInt( hex.charAt( 1 ), 16 ) / 15,
						parseInt( hex.charAt( 2 ), 16 ) / 15,
						colorSpace
					);

				} else if ( size === 6 ) {

					// #ff0000
					return this.setHex( parseInt( hex, 16 ), colorSpace );

				} else {

					console.warn( 'THREE.Color: Invalid hex color ' + style );

				}

			} else if ( style && style.length > 0 ) {

				return this.setColorName( style, colorSpace );

			}

			return this;

		}

		setColorName( style, colorSpace = SRGBColorSpace ) {

			// color keywords
			const hex = _colorKeywords[ style.toLowerCase() ];

			if ( hex !== undefined ) {

				// red
				this.setHex( hex, colorSpace );

			} else {

				// unknown color
				console.warn( 'THREE.Color: Unknown color ' + style );

			}

			return this;

		}

		clone() {

			return new this.constructor( this.r, this.g, this.b );

		}

		copy( color ) {

			this.r = color.r;
			this.g = color.g;
			this.b = color.b;

			return this;

		}

		copySRGBToLinear( color ) {

			this.r = SRGBToLinear( color.r );
			this.g = SRGBToLinear( color.g );
			this.b = SRGBToLinear( color.b );

			return this;

		}

		copyLinearToSRGB( color ) {

			this.r = LinearToSRGB( color.r );
			this.g = LinearToSRGB( color.g );
			this.b = LinearToSRGB( color.b );

			return this;

		}

		convertSRGBToLinear() {

			this.copySRGBToLinear( this );

			return this;

		}

		convertLinearToSRGB() {

			this.copyLinearToSRGB( this );

			return this;

		}

		getHex( colorSpace = SRGBColorSpace ) {

			ColorManagement.fromWorkingColorSpace( _color.copy( this ), colorSpace );

			return Math.round( clamp( _color.r * 255, 0, 255 ) ) * 65536 + Math.round( clamp( _color.g * 255, 0, 255 ) ) * 256 + Math.round( clamp( _color.b * 255, 0, 255 ) );

		}

		getHexString( colorSpace = SRGBColorSpace ) {

			return ( '000000' + this.getHex( colorSpace ).toString( 16 ) ).slice( - 6 );

		}

		getHSL( target, colorSpace = ColorManagement.workingColorSpace ) {

			// h,s,l ranges are in 0.0 - 1.0

			ColorManagement.fromWorkingColorSpace( _color.copy( this ), colorSpace );

			const r = _color.r, g = _color.g, b = _color.b;

			const max = Math.max( r, g, b );
			const min = Math.min( r, g, b );

			let hue, saturation;
			const lightness = ( min + max ) / 2.0;

			if ( min === max ) {

				hue = 0;
				saturation = 0;

			} else {

				const delta = max - min;

				saturation = lightness <= 0.5 ? delta / ( max + min ) : delta / ( 2 - max - min );

				switch ( max ) {

					case r: hue = ( g - b ) / delta + ( g < b ? 6 : 0 ); break;
					case g: hue = ( b - r ) / delta + 2; break;
					case b: hue = ( r - g ) / delta + 4; break;

				}

				hue /= 6;

			}

			target.h = hue;
			target.s = saturation;
			target.l = lightness;

			return target;

		}

		getRGB( target, colorSpace = ColorManagement.workingColorSpace ) {

			ColorManagement.fromWorkingColorSpace( _color.copy( this ), colorSpace );

			target.r = _color.r;
			target.g = _color.g;
			target.b = _color.b;

			return target;

		}

		getStyle( colorSpace = SRGBColorSpace ) {

			ColorManagement.fromWorkingColorSpace( _color.copy( this ), colorSpace );

			const r = _color.r, g = _color.g, b = _color.b;

			if ( colorSpace !== SRGBColorSpace ) {

				// Requires CSS Color Module Level 4 (https://www.w3.org/TR/css-color-4/).
				return `color(${ colorSpace } ${ r.toFixed( 3 ) } ${ g.toFixed( 3 ) } ${ b.toFixed( 3 ) })`;

			}

			return `rgb(${ Math.round( r * 255 ) },${ Math.round( g * 255 ) },${ Math.round( b * 255 ) })`;

		}

		offsetHSL( h, s, l ) {

			this.getHSL( _hslA );

			_hslA.h += h; _hslA.s += s; _hslA.l += l;

			this.setHSL( _hslA.h, _hslA.s, _hslA.l );

			return this;

		}

		add( color ) {

			this.r += color.r;
			this.g += color.g;
			this.b += color.b;

			return this;

		}

		addColors( color1, color2 ) {

			this.r = color1.r + color2.r;
			this.g = color1.g + color2.g;
			this.b = color1.b + color2.b;

			return this;

		}

		addScalar( s ) {

			this.r += s;
			this.g += s;
			this.b += s;

			return this;

		}

		sub( color ) {

			this.r = Math.max( 0, this.r - color.r );
			this.g = Math.max( 0, this.g - color.g );
			this.b = Math.max( 0, this.b - color.b );

			return this;

		}

		multiply( color ) {

			this.r *= color.r;
			this.g *= color.g;
			this.b *= color.b;

			return this;

		}

		multiplyScalar( s ) {

			this.r *= s;
			this.g *= s;
			this.b *= s;

			return this;

		}

		lerp( color, alpha ) {

			this.r += ( color.r - this.r ) * alpha;
			this.g += ( color.g - this.g ) * alpha;
			this.b += ( color.b - this.b ) * alpha;

			return this;

		}

		lerpColors( color1, color2, alpha ) {

			this.r = color1.r + ( color2.r - color1.r ) * alpha;
			this.g = color1.g + ( color2.g - color1.g ) * alpha;
			this.b = color1.b + ( color2.b - color1.b ) * alpha;

			return this;

		}

		lerpHSL( color, alpha ) {

			this.getHSL( _hslA );
			color.getHSL( _hslB );

			const h = lerp( _hslA.h, _hslB.h, alpha );
			const s = lerp( _hslA.s, _hslB.s, alpha );
			const l = lerp( _hslA.l, _hslB.l, alpha );

			this.setHSL( h, s, l );

			return this;

		}

		setFromVector3( v ) {

			this.r = v.x;
			this.g = v.y;
			this.b = v.z;

			return this;

		}

		applyMatrix3( m ) {

			const r = this.r, g = this.g, b = this.b;
			const e = m.elements;

			this.r = e[ 0 ] * r + e[ 3 ] * g + e[ 6 ] * b;
			this.g = e[ 1 ] * r + e[ 4 ] * g + e[ 7 ] * b;
			this.b = e[ 2 ] * r + e[ 5 ] * g + e[ 8 ] * b;

			return this;

		}

		equals( c ) {

			return ( c.r === this.r ) && ( c.g === this.g ) && ( c.b === this.b );

		}

		fromArray( array, offset = 0 ) {

			this.r = array[ offset ];
			this.g = array[ offset + 1 ];
			this.b = array[ offset + 2 ];

			return this;

		}

		toArray( array = [], offset = 0 ) {

			array[ offset ] = this.r;
			array[ offset + 1 ] = this.g;
			array[ offset + 2 ] = this.b;

			return array;

		}

		fromBufferAttribute( attribute, index ) {

			this.r = attribute.getX( index );
			this.g = attribute.getY( index );
			this.b = attribute.getZ( index );

			return this;

		}

		toJSON() {

			return this.getHex();

		}

		*[ Symbol.iterator ]() {

			yield this.r;
			yield this.g;
			yield this.b;

		}

	}

	const _color = /*@__PURE__*/ new Color();

	Color.NAMES = _colorKeywords;

	const _vector$8 = /*@__PURE__*/ new Vector3();
	const _vector2$1 = /*@__PURE__*/ new Vector2();

	class BufferAttribute {

		constructor( array, itemSize, normalized = false ) {

			if ( Array.isArray( array ) ) {

				throw new TypeError( 'THREE.BufferAttribute: array should be a Typed Array.' );

			}

			this.isBufferAttribute = true;

			this.name = '';

			this.array = array;
			this.itemSize = itemSize;
			this.count = array !== undefined ? array.length / itemSize : 0;
			this.normalized = normalized;

			this.usage = StaticDrawUsage;
			this.updateRange = { offset: 0, count: - 1 };

			this.version = 0;

		}

		onUploadCallback() {}

		set needsUpdate( value ) {

			if ( value === true ) this.version ++;

		}

		setUsage( value ) {

			this.usage = value;

			return this;

		}

		copy( source ) {

			this.name = source.name;
			this.array = new source.array.constructor( source.array );
			this.itemSize = source.itemSize;
			this.count = source.count;
			this.normalized = source.normalized;

			this.usage = source.usage;

			return this;

		}

		copyAt( index1, attribute, index2 ) {

			index1 *= this.itemSize;
			index2 *= attribute.itemSize;

			for ( let i = 0, l = this.itemSize; i < l; i ++ ) {

				this.array[ index1 + i ] = attribute.array[ index2 + i ];

			}

			return this;

		}

		copyArray( array ) {

			this.array.set( array );

			return this;

		}

		applyMatrix3( m ) {

			if ( this.itemSize === 2 ) {

				for ( let i = 0, l = this.count; i < l; i ++ ) {

					_vector2$1.fromBufferAttribute( this, i );
					_vector2$1.applyMatrix3( m );

					this.setXY( i, _vector2$1.x, _vector2$1.y );

				}

			} else if ( this.itemSize === 3 ) {

				for ( let i = 0, l = this.count; i < l; i ++ ) {

					_vector$8.fromBufferAttribute( this, i );
					_vector$8.applyMatrix3( m );

					this.setXYZ( i, _vector$8.x, _vector$8.y, _vector$8.z );

				}

			}

			return this;

		}

		applyMatrix4( m ) {

			for ( let i = 0, l = this.count; i < l; i ++ ) {

				_vector$8.fromBufferAttribute( this, i );

				_vector$8.applyMatrix4( m );

				this.setXYZ( i, _vector$8.x, _vector$8.y, _vector$8.z );

			}

			return this;

		}

		applyNormalMatrix( m ) {

			for ( let i = 0, l = this.count; i < l; i ++ ) {

				_vector$8.fromBufferAttribute( this, i );

				_vector$8.applyNormalMatrix( m );

				this.setXYZ( i, _vector$8.x, _vector$8.y, _vector$8.z );

			}

			return this;

		}

		transformDirection( m ) {

			for ( let i = 0, l = this.count; i < l; i ++ ) {

				_vector$8.fromBufferAttribute( this, i );

				_vector$8.transformDirection( m );

				this.setXYZ( i, _vector$8.x, _vector$8.y, _vector$8.z );

			}

			return this;

		}

		set( value, offset = 0 ) {

			// Matching BufferAttribute constructor, do not normalize the array.
			this.array.set( value, offset );

			return this;

		}

		getX( index ) {

			let x = this.array[ index * this.itemSize ];

			if ( this.normalized ) x = denormalize( x, this.array );

			return x;

		}

		setX( index, x ) {

			if ( this.normalized ) x = normalize( x, this.array );

			this.array[ index * this.itemSize ] = x;

			return this;

		}

		getY( index ) {

			let y = this.array[ index * this.itemSize + 1 ];

			if ( this.normalized ) y = denormalize( y, this.array );

			return y;

		}

		setY( index, y ) {

			if ( this.normalized ) y = normalize( y, this.array );

			this.array[ index * this.itemSize + 1 ] = y;

			return this;

		}

		getZ( index ) {

			let z = this.array[ index * this.itemSize + 2 ];

			if ( this.normalized ) z = denormalize( z, this.array );

			return z;

		}

		setZ( index, z ) {

			if ( this.normalized ) z = normalize( z, this.array );

			this.array[ index * this.itemSize + 2 ] = z;

			return this;

		}

		getW( index ) {

			let w = this.array[ index * this.itemSize + 3 ];

			if ( this.normalized ) w = denormalize( w, this.array );

			return w;

		}

		setW( index, w ) {

			if ( this.normalized ) w = normalize( w, this.array );

			this.array[ index * this.itemSize + 3 ] = w;

			return this;

		}

		setXY( index, x, y ) {

			index *= this.itemSize;

			if ( this.normalized ) {

				x = normalize( x, this.array );
				y = normalize( y, this.array );

			}

			this.array[ index + 0 ] = x;
			this.array[ index + 1 ] = y;

			return this;

		}

		setXYZ( index, x, y, z ) {

			index *= this.itemSize;

			if ( this.normalized ) {

				x = normalize( x, this.array );
				y = normalize( y, this.array );
				z = normalize( z, this.array );

			}

			this.array[ index + 0 ] = x;
			this.array[ index + 1 ] = y;
			this.array[ index + 2 ] = z;

			return this;

		}

		setXYZW( index, x, y, z, w ) {

			index *= this.itemSize;

			if ( this.normalized ) {

				x = normalize( x, this.array );
				y = normalize( y, this.array );
				z = normalize( z, this.array );
				w = normalize( w, this.array );

			}

			this.array[ index + 0 ] = x;
			this.array[ index + 1 ] = y;
			this.array[ index + 2 ] = z;
			this.array[ index + 3 ] = w;

			return this;

		}

		onUpload( callback ) {

			this.onUploadCallback = callback;

			return this;

		}

		clone() {

			return new this.constructor( this.array, this.itemSize ).copy( this );

		}

		toJSON() {

			const data = {
				itemSize: this.itemSize,
				type: this.array.constructor.name,
				array: Array.from( this.array ),
				normalized: this.normalized
			};

			if ( this.name !== '' ) data.name = this.name;
			if ( this.usage !== StaticDrawUsage ) data.usage = this.usage;
			if ( this.updateRange.offset !== 0 || this.updateRange.count !== - 1 ) data.updateRange = this.updateRange;

			return data;

		}

		copyColorsArray() { // @deprecated, r144

			console.error( 'THREE.BufferAttribute: copyColorsArray() was removed in r144.' );

		}

		copyVector2sArray() { // @deprecated, r144

			console.error( 'THREE.BufferAttribute: copyVector2sArray() was removed in r144.' );

		}

		copyVector3sArray() { // @deprecated, r144

			console.error( 'THREE.BufferAttribute: copyVector3sArray() was removed in r144.' );

		}

		copyVector4sArray() { // @deprecated, r144

			console.error( 'THREE.BufferAttribute: copyVector4sArray() was removed in r144.' );

		}

	}

	class Uint16BufferAttribute extends BufferAttribute {

		constructor( array, itemSize, normalized ) {

			super( new Uint16Array( array ), itemSize, normalized );

		}

	}

	class Uint32BufferAttribute extends BufferAttribute {

		constructor( array, itemSize, normalized ) {

			super( new Uint32Array( array ), itemSize, normalized );

		}

	}


	class Float32BufferAttribute extends BufferAttribute {

		constructor( array, itemSize, normalized ) {

			super( new Float32Array( array ), itemSize, normalized );

		}

	}

	let _id$1 = 0;

	const _m1 = /*@__PURE__*/ new Matrix4();
	const _obj = /*@__PURE__*/ new Object3D();
	const _offset = /*@__PURE__*/ new Vector3();
	const _box$1 = /*@__PURE__*/ new Box3();
	const _boxMorphTargets = /*@__PURE__*/ new Box3();
	const _vector$7 = /*@__PURE__*/ new Vector3();

	class BufferGeometry extends EventDispatcher {

		constructor() {

			super();

			this.isBufferGeometry = true;

			Object.defineProperty( this, 'id', { value: _id$1 ++ } );

			this.uuid = generateUUID();

			this.name = '';
			this.type = 'BufferGeometry';

			this.index = null;
			this.attributes = {};

			this.morphAttributes = {};
			this.morphTargetsRelative = false;

			this.groups = [];

			this.boundingBox = null;
			this.boundingSphere = null;

			this.drawRange = { start: 0, count: Infinity };

			this.userData = {};

		}

		getIndex() {

			return this.index;

		}

		setIndex( index ) {

			if ( Array.isArray( index ) ) {

				this.index = new ( arrayNeedsUint32( index ) ? Uint32BufferAttribute : Uint16BufferAttribute )( index, 1 );

			} else {

				this.index = index;

			}

			return this;

		}

		getAttribute( name ) {

			return this.attributes[ name ];

		}

		setAttribute( name, attribute ) {

			this.attributes[ name ] = attribute;

			return this;

		}

		deleteAttribute( name ) {

			delete this.attributes[ name ];

			return this;

		}

		hasAttribute( name ) {

			return this.attributes[ name ] !== undefined;

		}

		addGroup( start, count, materialIndex = 0 ) {

			this.groups.push( {

				start: start,
				count: count,
				materialIndex: materialIndex

			} );

		}

		clearGroups() {

			this.groups = [];

		}

		setDrawRange( start, count ) {

			this.drawRange.start = start;
			this.drawRange.count = count;

		}

		applyMatrix4( matrix ) {

			const position = this.attributes.position;

			if ( position !== undefined ) {

				position.applyMatrix4( matrix );

				position.needsUpdate = true;

			}

			const normal = this.attributes.normal;

			if ( normal !== undefined ) {

				const normalMatrix = new Matrix3().getNormalMatrix( matrix );

				normal.applyNormalMatrix( normalMatrix );

				normal.needsUpdate = true;

			}

			const tangent = this.attributes.tangent;

			if ( tangent !== undefined ) {

				tangent.transformDirection( matrix );

				tangent.needsUpdate = true;

			}

			if ( this.boundingBox !== null ) {

				this.computeBoundingBox();

			}

			if ( this.boundingSphere !== null ) {

				this.computeBoundingSphere();

			}

			return this;

		}

		applyQuaternion( q ) {

			_m1.makeRotationFromQuaternion( q );

			this.applyMatrix4( _m1 );

			return this;

		}

		rotateX( angle ) {

			// rotate geometry around world x-axis

			_m1.makeRotationX( angle );

			this.applyMatrix4( _m1 );

			return this;

		}

		rotateY( angle ) {

			// rotate geometry around world y-axis

			_m1.makeRotationY( angle );

			this.applyMatrix4( _m1 );

			return this;

		}

		rotateZ( angle ) {

			// rotate geometry around world z-axis

			_m1.makeRotationZ( angle );

			this.applyMatrix4( _m1 );

			return this;

		}

		translate( x, y, z ) {

			// translate geometry

			_m1.makeTranslation( x, y, z );

			this.applyMatrix4( _m1 );

			return this;

		}

		scale( x, y, z ) {

			// scale geometry

			_m1.makeScale( x, y, z );

			this.applyMatrix4( _m1 );

			return this;

		}

		lookAt( vector ) {

			_obj.lookAt( vector );

			_obj.updateMatrix();

			this.applyMatrix4( _obj.matrix );

			return this;

		}

		center() {

			this.computeBoundingBox();

			this.boundingBox.getCenter( _offset ).negate();

			this.translate( _offset.x, _offset.y, _offset.z );

			return this;

		}

		setFromPoints( points ) {

			const position = [];

			for ( let i = 0, l = points.length; i < l; i ++ ) {

				const point = points[ i ];
				position.push( point.x, point.y, point.z || 0 );

			}

			this.setAttribute( 'position', new Float32BufferAttribute( position, 3 ) );

			return this;

		}

		computeBoundingBox() {

			if ( this.boundingBox === null ) {

				this.boundingBox = new Box3();

			}

			const position = this.attributes.position;
			const morphAttributesPosition = this.morphAttributes.position;

			if ( position && position.isGLBufferAttribute ) {

				console.error( 'THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".', this );

				this.boundingBox.set(
					new Vector3( - Infinity, - Infinity, - Infinity ),
					new Vector3( + Infinity, + Infinity, + Infinity )
				);

				return;

			}

			if ( position !== undefined ) {

				this.boundingBox.setFromBufferAttribute( position );

				// process morph attributes if present

				if ( morphAttributesPosition ) {

					for ( let i = 0, il = morphAttributesPosition.length; i < il; i ++ ) {

						const morphAttribute = morphAttributesPosition[ i ];
						_box$1.setFromBufferAttribute( morphAttribute );

						if ( this.morphTargetsRelative ) {

							_vector$7.addVectors( this.boundingBox.min, _box$1.min );
							this.boundingBox.expandByPoint( _vector$7 );

							_vector$7.addVectors( this.boundingBox.max, _box$1.max );
							this.boundingBox.expandByPoint( _vector$7 );

						} else {

							this.boundingBox.expandByPoint( _box$1.min );
							this.boundingBox.expandByPoint( _box$1.max );

						}

					}

				}

			} else {

				this.boundingBox.makeEmpty();

			}

			if ( isNaN( this.boundingBox.min.x ) || isNaN( this.boundingBox.min.y ) || isNaN( this.boundingBox.min.z ) ) {

				console.error( 'THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.', this );

			}

		}

		computeBoundingSphere() {

			if ( this.boundingSphere === null ) {

				this.boundingSphere = new Sphere();

			}

			const position = this.attributes.position;
			const morphAttributesPosition = this.morphAttributes.position;

			if ( position && position.isGLBufferAttribute ) {

				console.error( 'THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".', this );

				this.boundingSphere.set( new Vector3(), Infinity );

				return;

			}

			if ( position ) {

				// first, find the center of the bounding sphere

				const center = this.boundingSphere.center;

				_box$1.setFromBufferAttribute( position );

				// process morph attributes if present

				if ( morphAttributesPosition ) {

					for ( let i = 0, il = morphAttributesPosition.length; i < il; i ++ ) {

						const morphAttribute = morphAttributesPosition[ i ];
						_boxMorphTargets.setFromBufferAttribute( morphAttribute );

						if ( this.morphTargetsRelative ) {

							_vector$7.addVectors( _box$1.min, _boxMorphTargets.min );
							_box$1.expandByPoint( _vector$7 );

							_vector$7.addVectors( _box$1.max, _boxMorphTargets.max );
							_box$1.expandByPoint( _vector$7 );

						} else {

							_box$1.expandByPoint( _boxMorphTargets.min );
							_box$1.expandByPoint( _boxMorphTargets.max );

						}

					}

				}

				_box$1.getCenter( center );

				// second, try to find a boundingSphere with a radius smaller than the
				// boundingSphere of the boundingBox: sqrt(3) smaller in the best case

				let maxRadiusSq = 0;

				for ( let i = 0, il = position.count; i < il; i ++ ) {

					_vector$7.fromBufferAttribute( position, i );

					maxRadiusSq = Math.max( maxRadiusSq, center.distanceToSquared( _vector$7 ) );

				}

				// process morph attributes if present

				if ( morphAttributesPosition ) {

					for ( let i = 0, il = morphAttributesPosition.length; i < il; i ++ ) {

						const morphAttribute = morphAttributesPosition[ i ];
						const morphTargetsRelative = this.morphTargetsRelative;

						for ( let j = 0, jl = morphAttribute.count; j < jl; j ++ ) {

							_vector$7.fromBufferAttribute( morphAttribute, j );

							if ( morphTargetsRelative ) {

								_offset.fromBufferAttribute( position, j );
								_vector$7.add( _offset );

							}

							maxRadiusSq = Math.max( maxRadiusSq, center.distanceToSquared( _vector$7 ) );

						}

					}

				}

				this.boundingSphere.radius = Math.sqrt( maxRadiusSq );

				if ( isNaN( this.boundingSphere.radius ) ) {

					console.error( 'THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.', this );

				}

			}

		}

		computeTangents() {

			const index = this.index;
			const attributes = this.attributes;

			// based on http://www.terathon.com/code/tangent.html
			// (per vertex tangents)

			if ( index === null ||
				 attributes.position === undefined ||
				 attributes.normal === undefined ||
				 attributes.uv === undefined ) {

				console.error( 'THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)' );
				return;

			}

			const indices = index.array;
			const positions = attributes.position.array;
			const normals = attributes.normal.array;
			const uvs = attributes.uv.array;

			const nVertices = positions.length / 3;

			if ( this.hasAttribute( 'tangent' ) === false ) {

				this.setAttribute( 'tangent', new BufferAttribute( new Float32Array( 4 * nVertices ), 4 ) );

			}

			const tangents = this.getAttribute( 'tangent' ).array;

			const tan1 = [], tan2 = [];

			for ( let i = 0; i < nVertices; i ++ ) {

				tan1[ i ] = new Vector3();
				tan2[ i ] = new Vector3();

			}

			const vA = new Vector3(),
				vB = new Vector3(),
				vC = new Vector3(),

				uvA = new Vector2(),
				uvB = new Vector2(),
				uvC = new Vector2(),

				sdir = new Vector3(),
				tdir = new Vector3();

			function handleTriangle( a, b, c ) {

				vA.fromArray( positions, a * 3 );
				vB.fromArray( positions, b * 3 );
				vC.fromArray( positions, c * 3 );

				uvA.fromArray( uvs, a * 2 );
				uvB.fromArray( uvs, b * 2 );
				uvC.fromArray( uvs, c * 2 );

				vB.sub( vA );
				vC.sub( vA );

				uvB.sub( uvA );
				uvC.sub( uvA );

				const r = 1.0 / ( uvB.x * uvC.y - uvC.x * uvB.y );

				// silently ignore degenerate uv triangles having coincident or colinear vertices

				if ( ! isFinite( r ) ) return;

				sdir.copy( vB ).multiplyScalar( uvC.y ).addScaledVector( vC, - uvB.y ).multiplyScalar( r );
				tdir.copy( vC ).multiplyScalar( uvB.x ).addScaledVector( vB, - uvC.x ).multiplyScalar( r );

				tan1[ a ].add( sdir );
				tan1[ b ].add( sdir );
				tan1[ c ].add( sdir );

				tan2[ a ].add( tdir );
				tan2[ b ].add( tdir );
				tan2[ c ].add( tdir );

			}

			let groups = this.groups;

			if ( groups.length === 0 ) {

				groups = [ {
					start: 0,
					count: indices.length
				} ];

			}

			for ( let i = 0, il = groups.length; i < il; ++ i ) {

				const group = groups[ i ];

				const start = group.start;
				const count = group.count;

				for ( let j = start, jl = start + count; j < jl; j += 3 ) {

					handleTriangle(
						indices[ j + 0 ],
						indices[ j + 1 ],
						indices[ j + 2 ]
					);

				}

			}

			const tmp = new Vector3(), tmp2 = new Vector3();
			const n = new Vector3(), n2 = new Vector3();

			function handleVertex( v ) {

				n.fromArray( normals, v * 3 );
				n2.copy( n );

				const t = tan1[ v ];

				// Gram-Schmidt orthogonalize

				tmp.copy( t );
				tmp.sub( n.multiplyScalar( n.dot( t ) ) ).normalize();

				// Calculate handedness

				tmp2.crossVectors( n2, t );
				const test = tmp2.dot( tan2[ v ] );
				const w = ( test < 0.0 ) ? - 1.0 : 1.0;

				tangents[ v * 4 ] = tmp.x;
				tangents[ v * 4 + 1 ] = tmp.y;
				tangents[ v * 4 + 2 ] = tmp.z;
				tangents[ v * 4 + 3 ] = w;

			}

			for ( let i = 0, il = groups.length; i < il; ++ i ) {

				const group = groups[ i ];

				const start = group.start;
				const count = group.count;

				for ( let j = start, jl = start + count; j < jl; j += 3 ) {

					handleVertex( indices[ j + 0 ] );
					handleVertex( indices[ j + 1 ] );
					handleVertex( indices[ j + 2 ] );

				}

			}

		}

		computeVertexNormals() {

			const index = this.index;
			const positionAttribute = this.getAttribute( 'position' );

			if ( positionAttribute !== undefined ) {

				let normalAttribute = this.getAttribute( 'normal' );

				if ( normalAttribute === undefined ) {

					normalAttribute = new BufferAttribute( new Float32Array( positionAttribute.count * 3 ), 3 );
					this.setAttribute( 'normal', normalAttribute );

				} else {

					// reset existing normals to zero

					for ( let i = 0, il = normalAttribute.count; i < il; i ++ ) {

						normalAttribute.setXYZ( i, 0, 0, 0 );

					}

				}

				const pA = new Vector3(), pB = new Vector3(), pC = new Vector3();
				const nA = new Vector3(), nB = new Vector3(), nC = new Vector3();
				const cb = new Vector3(), ab = new Vector3();

				// indexed elements

				if ( index ) {

					for ( let i = 0, il = index.count; i < il; i += 3 ) {

						const vA = index.getX( i + 0 );
						const vB = index.getX( i + 1 );
						const vC = index.getX( i + 2 );

						pA.fromBufferAttribute( positionAttribute, vA );
						pB.fromBufferAttribute( positionAttribute, vB );
						pC.fromBufferAttribute( positionAttribute, vC );

						cb.subVectors( pC, pB );
						ab.subVectors( pA, pB );
						cb.cross( ab );

						nA.fromBufferAttribute( normalAttribute, vA );
						nB.fromBufferAttribute( normalAttribute, vB );
						nC.fromBufferAttribute( normalAttribute, vC );

						nA.add( cb );
						nB.add( cb );
						nC.add( cb );

						normalAttribute.setXYZ( vA, nA.x, nA.y, nA.z );
						normalAttribute.setXYZ( vB, nB.x, nB.y, nB.z );
						normalAttribute.setXYZ( vC, nC.x, nC.y, nC.z );

					}

				} else {

					// non-indexed elements (unconnected triangle soup)

					for ( let i = 0, il = positionAttribute.count; i < il; i += 3 ) {

						pA.fromBufferAttribute( positionAttribute, i + 0 );
						pB.fromBufferAttribute( positionAttribute, i + 1 );
						pC.fromBufferAttribute( positionAttribute, i + 2 );

						cb.subVectors( pC, pB );
						ab.subVectors( pA, pB );
						cb.cross( ab );

						normalAttribute.setXYZ( i + 0, cb.x, cb.y, cb.z );
						normalAttribute.setXYZ( i + 1, cb.x, cb.y, cb.z );
						normalAttribute.setXYZ( i + 2, cb.x, cb.y, cb.z );

					}

				}

				this.normalizeNormals();

				normalAttribute.needsUpdate = true;

			}

		}

		merge() { // @deprecated, r144

			console.error( 'THREE.BufferGeometry.merge() has been removed. Use THREE.BufferGeometryUtils.mergeGeometries() instead.' );
			return this;

		}

		normalizeNormals() {

			const normals = this.attributes.normal;

			for ( let i = 0, il = normals.count; i < il; i ++ ) {

				_vector$7.fromBufferAttribute( normals, i );

				_vector$7.normalize();

				normals.setXYZ( i, _vector$7.x, _vector$7.y, _vector$7.z );

			}

		}

		toNonIndexed() {

			function convertBufferAttribute( attribute, indices ) {

				const array = attribute.array;
				const itemSize = attribute.itemSize;
				const normalized = attribute.normalized;

				const array2 = new array.constructor( indices.length * itemSize );

				let index = 0, index2 = 0;

				for ( let i = 0, l = indices.length; i < l; i ++ ) {

					if ( attribute.isInterleavedBufferAttribute ) {

						index = indices[ i ] * attribute.data.stride + attribute.offset;

					} else {

						index = indices[ i ] * itemSize;

					}

					for ( let j = 0; j < itemSize; j ++ ) {

						array2[ index2 ++ ] = array[ index ++ ];

					}

				}

				return new BufferAttribute( array2, itemSize, normalized );

			}

			//

			if ( this.index === null ) {

				console.warn( 'THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed.' );
				return this;

			}

			const geometry2 = new BufferGeometry();

			const indices = this.index.array;
			const attributes = this.attributes;

			// attributes

			for ( const name in attributes ) {

				const attribute = attributes[ name ];

				const newAttribute = convertBufferAttribute( attribute, indices );

				geometry2.setAttribute( name, newAttribute );

			}

			// morph attributes

			const morphAttributes = this.morphAttributes;

			for ( const name in morphAttributes ) {

				const morphArray = [];
				const morphAttribute = morphAttributes[ name ]; // morphAttribute: array of Float32BufferAttributes

				for ( let i = 0, il = morphAttribute.length; i < il; i ++ ) {

					const attribute = morphAttribute[ i ];

					const newAttribute = convertBufferAttribute( attribute, indices );

					morphArray.push( newAttribute );

				}

				geometry2.morphAttributes[ name ] = morphArray;

			}

			geometry2.morphTargetsRelative = this.morphTargetsRelative;

			// groups

			const groups = this.groups;

			for ( let i = 0, l = groups.length; i < l; i ++ ) {

				const group = groups[ i ];
				geometry2.addGroup( group.start, group.count, group.materialIndex );

			}

			return geometry2;

		}

		toJSON() {

			const data = {
				metadata: {
					version: 4.5,
					type: 'BufferGeometry',
					generator: 'BufferGeometry.toJSON'
				}
			};

			// standard BufferGeometry serialization

			data.uuid = this.uuid;
			data.type = this.type;
			if ( this.name !== '' ) data.name = this.name;
			if ( Object.keys( this.userData ).length > 0 ) data.userData = this.userData;

			if ( this.parameters !== undefined ) {

				const parameters = this.parameters;

				for ( const key in parameters ) {

					if ( parameters[ key ] !== undefined ) data[ key ] = parameters[ key ];

				}

				return data;

			}

			// for simplicity the code assumes attributes are not shared across geometries, see #15811

			data.data = { attributes: {} };

			const index = this.index;

			if ( index !== null ) {

				data.data.index = {
					type: index.array.constructor.name,
					array: Array.prototype.slice.call( index.array )
				};

			}

			const attributes = this.attributes;

			for ( const key in attributes ) {

				const attribute = attributes[ key ];

				data.data.attributes[ key ] = attribute.toJSON( data.data );

			}

			const morphAttributes = {};
			let hasMorphAttributes = false;

			for ( const key in this.morphAttributes ) {

				const attributeArray = this.morphAttributes[ key ];

				const array = [];

				for ( let i = 0, il = attributeArray.length; i < il; i ++ ) {

					const attribute = attributeArray[ i ];

					array.push( attribute.toJSON( data.data ) );

				}

				if ( array.length > 0 ) {

					morphAttributes[ key ] = array;

					hasMorphAttributes = true;

				}

			}

			if ( hasMorphAttributes ) {

				data.data.morphAttributes = morphAttributes;
				data.data.morphTargetsRelative = this.morphTargetsRelative;

			}

			const groups = this.groups;

			if ( groups.length > 0 ) {

				data.data.groups = JSON.parse( JSON.stringify( groups ) );

			}

			const boundingSphere = this.boundingSphere;

			if ( boundingSphere !== null ) {

				data.data.boundingSphere = {
					center: boundingSphere.center.toArray(),
					radius: boundingSphere.radius
				};

			}

			return data;

		}

		clone() {

			return new this.constructor().copy( this );

		}

		copy( source ) {

			// reset

			this.index = null;
			this.attributes = {};
			this.morphAttributes = {};
			this.groups = [];
			this.boundingBox = null;
			this.boundingSphere = null;

			// used for storing cloned, shared data

			const data = {};

			// name

			this.name = source.name;

			// index

			const index = source.index;

			if ( index !== null ) {

				this.setIndex( index.clone( data ) );

			}

			// attributes

			const attributes = source.attributes;

			for ( const name in attributes ) {

				const attribute = attributes[ name ];
				this.setAttribute( name, attribute.clone( data ) );

			}

			// morph attributes

			const morphAttributes = source.morphAttributes;

			for ( const name in morphAttributes ) {

				const array = [];
				const morphAttribute = morphAttributes[ name ]; // morphAttribute: array of Float32BufferAttributes

				for ( let i = 0, l = morphAttribute.length; i < l; i ++ ) {

					array.push( morphAttribute[ i ].clone( data ) );

				}

				this.morphAttributes[ name ] = array;

			}

			this.morphTargetsRelative = source.morphTargetsRelative;

			// groups

			const groups = source.groups;

			for ( let i = 0, l = groups.length; i < l; i ++ ) {

				const group = groups[ i ];
				this.addGroup( group.start, group.count, group.materialIndex );

			}

			// bounding box

			const boundingBox = source.boundingBox;

			if ( boundingBox !== null ) {

				this.boundingBox = boundingBox.clone();

			}

			// bounding sphere

			const boundingSphere = source.boundingSphere;

			if ( boundingSphere !== null ) {

				this.boundingSphere = boundingSphere.clone();

			}

			// draw range

			this.drawRange.start = source.drawRange.start;
			this.drawRange.count = source.drawRange.count;

			// user data

			this.userData = source.userData;

			return this;

		}

		dispose() {

			this.dispatchEvent( { type: 'dispose' } );

		}

	}

	/**
	 * Extensible curve object.
	 *
	 * Some common of curve methods:
	 * .getPoint( t, optionalTarget ), .getTangent( t, optionalTarget )
	 * .getPointAt( u, optionalTarget ), .getTangentAt( u, optionalTarget )
	 * .getPoints(), .getSpacedPoints()
	 * .getLength()
	 * .updateArcLengths()
	 *
	 * This following curves inherit from THREE.Curve:
	 *
	 * -- 2D curves --
	 * THREE.ArcCurve
	 * THREE.CubicBezierCurve
	 * THREE.EllipseCurve
	 * THREE.LineCurve
	 * THREE.QuadraticBezierCurve
	 * THREE.SplineCurve
	 *
	 * -- 3D curves --
	 * THREE.CatmullRomCurve3
	 * THREE.CubicBezierCurve3
	 * THREE.LineCurve3
	 * THREE.QuadraticBezierCurve3
	 *
	 * A series of curves can be represented as a THREE.CurvePath.
	 *
	 **/

	class Curve {

		constructor() {

			this.type = 'Curve';

			this.arcLengthDivisions = 200;

		}

		// Virtual base class method to overwrite and implement in subclasses
		//	- t [0 .. 1]

		getPoint( /* t, optionalTarget */ ) {

			console.warn( 'THREE.Curve: .getPoint() not implemented.' );
			return null;

		}

		// Get point at relative position in curve according to arc length
		// - u [0 .. 1]

		getPointAt( u, optionalTarget ) {

			const t = this.getUtoTmapping( u );
			return this.getPoint( t, optionalTarget );

		}

		// Get sequence of points using getPoint( t )

		getPoints( divisions = 5 ) {

			const points = [];

			for ( let d = 0; d <= divisions; d ++ ) {

				points.push( this.getPoint( d / divisions ) );

			}

			return points;

		}

		// Get sequence of points using getPointAt( u )

		getSpacedPoints( divisions = 5 ) {

			const points = [];

			for ( let d = 0; d <= divisions; d ++ ) {

				points.push( this.getPointAt( d / divisions ) );

			}

			return points;

		}

		// Get total curve arc length

		getLength() {

			const lengths = this.getLengths();
			return lengths[ lengths.length - 1 ];

		}

		// Get list of cumulative segment lengths

		getLengths( divisions = this.arcLengthDivisions ) {

			if ( this.cacheArcLengths &&
				( this.cacheArcLengths.length === divisions + 1 ) &&
				! this.needsUpdate ) {

				return this.cacheArcLengths;

			}

			this.needsUpdate = false;

			const cache = [];
			let current, last = this.getPoint( 0 );
			let sum = 0;

			cache.push( 0 );

			for ( let p = 1; p <= divisions; p ++ ) {

				current = this.getPoint( p / divisions );
				sum += current.distanceTo( last );
				cache.push( sum );
				last = current;

			}

			this.cacheArcLengths = cache;

			return cache; // { sums: cache, sum: sum }; Sum is in the last element.

		}

		updateArcLengths() {

			this.needsUpdate = true;
			this.getLengths();

		}

		// Given u ( 0 .. 1 ), get a t to find p. This gives you points which are equidistant

		getUtoTmapping( u, distance ) {

			const arcLengths = this.getLengths();

			let i = 0;
			const il = arcLengths.length;

			let targetArcLength; // The targeted u distance value to get

			if ( distance ) {

				targetArcLength = distance;

			} else {

				targetArcLength = u * arcLengths[ il - 1 ];

			}

			// binary search for the index with largest value smaller than target u distance

			let low = 0, high = il - 1, comparison;

			while ( low <= high ) {

				i = Math.floor( low + ( high - low ) / 2 ); // less likely to overflow, though probably not issue here, JS doesn't really have integers, all numbers are floats

				comparison = arcLengths[ i ] - targetArcLength;

				if ( comparison < 0 ) {

					low = i + 1;

				} else if ( comparison > 0 ) {

					high = i - 1;

				} else {

					high = i;
					break;

					// DONE

				}

			}

			i = high;

			if ( arcLengths[ i ] === targetArcLength ) {

				return i / ( il - 1 );

			}

			// we could get finer grain at lengths, or use simple interpolation between two points

			const lengthBefore = arcLengths[ i ];
			const lengthAfter = arcLengths[ i + 1 ];

			const segmentLength = lengthAfter - lengthBefore;

			// determine where we are between the 'before' and 'after' points

			const segmentFraction = ( targetArcLength - lengthBefore ) / segmentLength;

			// add that fractional amount to t

			const t = ( i + segmentFraction ) / ( il - 1 );

			return t;

		}

		// Returns a unit vector tangent at t
		// In case any sub curve does not implement its tangent derivation,
		// 2 points a small delta apart will be used to find its gradient
		// which seems to give a reasonable approximation

		getTangent( t, optionalTarget ) {

			const delta = 0.0001;
			let t1 = t - delta;
			let t2 = t + delta;

			// Capping in case of danger

			if ( t1 < 0 ) t1 = 0;
			if ( t2 > 1 ) t2 = 1;

			const pt1 = this.getPoint( t1 );
			const pt2 = this.getPoint( t2 );

			const tangent = optionalTarget || ( ( pt1.isVector2 ) ? new Vector2() : new Vector3() );

			tangent.copy( pt2 ).sub( pt1 ).normalize();

			return tangent;

		}

		getTangentAt( u, optionalTarget ) {

			const t = this.getUtoTmapping( u );
			return this.getTangent( t, optionalTarget );

		}

		computeFrenetFrames( segments, closed ) {

			// see http://www.cs.indiana.edu/pub/techreports/TR425.pdf

			const normal = new Vector3();

			const tangents = [];
			const normals = [];
			const binormals = [];

			const vec = new Vector3();
			const mat = new Matrix4();

			// compute the tangent vectors for each segment on the curve

			for ( let i = 0; i <= segments; i ++ ) {

				const u = i / segments;

				tangents[ i ] = this.getTangentAt( u, new Vector3() );

			}

			// select an initial normal vector perpendicular to the first tangent vector,
			// and in the direction of the minimum tangent xyz component

			normals[ 0 ] = new Vector3();
			binormals[ 0 ] = new Vector3();
			let min = Number.MAX_VALUE;
			const tx = Math.abs( tangents[ 0 ].x );
			const ty = Math.abs( tangents[ 0 ].y );
			const tz = Math.abs( tangents[ 0 ].z );

			if ( tx <= min ) {

				min = tx;
				normal.set( 1, 0, 0 );

			}

			if ( ty <= min ) {

				min = ty;
				normal.set( 0, 1, 0 );

			}

			if ( tz <= min ) {

				normal.set( 0, 0, 1 );

			}

			vec.crossVectors( tangents[ 0 ], normal ).normalize();

			normals[ 0 ].crossVectors( tangents[ 0 ], vec );
			binormals[ 0 ].crossVectors( tangents[ 0 ], normals[ 0 ] );


			// compute the slowly-varying normal and binormal vectors for each segment on the curve

			for ( let i = 1; i <= segments; i ++ ) {

				normals[ i ] = normals[ i - 1 ].clone();

				binormals[ i ] = binormals[ i - 1 ].clone();

				vec.crossVectors( tangents[ i - 1 ], tangents[ i ] );

				if ( vec.length() > Number.EPSILON ) {

					vec.normalize();

					const theta = Math.acos( clamp( tangents[ i - 1 ].dot( tangents[ i ] ), - 1, 1 ) ); // clamp for floating pt errors

					normals[ i ].applyMatrix4( mat.makeRotationAxis( vec, theta ) );

				}

				binormals[ i ].crossVectors( tangents[ i ], normals[ i ] );

			}

			// if the curve is closed, postprocess the vectors so the first and last normal vectors are the same

			if ( closed === true ) {

				let theta = Math.acos( clamp( normals[ 0 ].dot( normals[ segments ] ), - 1, 1 ) );
				theta /= segments;

				if ( tangents[ 0 ].dot( vec.crossVectors( normals[ 0 ], normals[ segments ] ) ) > 0 ) {

					theta = - theta;

				}

				for ( let i = 1; i <= segments; i ++ ) {

					// twist a little...
					normals[ i ].applyMatrix4( mat.makeRotationAxis( tangents[ i ], theta * i ) );
					binormals[ i ].crossVectors( tangents[ i ], normals[ i ] );

				}

			}

			return {
				tangents: tangents,
				normals: normals,
				binormals: binormals
			};

		}

		clone() {

			return new this.constructor().copy( this );

		}

		copy( source ) {

			this.arcLengthDivisions = source.arcLengthDivisions;

			return this;

		}

		toJSON() {

			const data = {
				metadata: {
					version: 4.5,
					type: 'Curve',
					generator: 'Curve.toJSON'
				}
			};

			data.arcLengthDivisions = this.arcLengthDivisions;
			data.type = this.type;

			return data;

		}

		fromJSON( json ) {

			this.arcLengthDivisions = json.arcLengthDivisions;

			return this;

		}

	}

	class EllipseCurve extends Curve {

		constructor( aX = 0, aY = 0, xRadius = 1, yRadius = 1, aStartAngle = 0, aEndAngle = Math.PI * 2, aClockwise = false, aRotation = 0 ) {

			super();

			this.isEllipseCurve = true;

			this.type = 'EllipseCurve';

			this.aX = aX;
			this.aY = aY;

			this.xRadius = xRadius;
			this.yRadius = yRadius;

			this.aStartAngle = aStartAngle;
			this.aEndAngle = aEndAngle;

			this.aClockwise = aClockwise;

			this.aRotation = aRotation;

		}

		getPoint( t, optionalTarget ) {

			const point = optionalTarget || new Vector2();

			const twoPi = Math.PI * 2;
			let deltaAngle = this.aEndAngle - this.aStartAngle;
			const samePoints = Math.abs( deltaAngle ) < Number.EPSILON;

			// ensures that deltaAngle is 0 .. 2 PI
			while ( deltaAngle < 0 ) deltaAngle += twoPi;
			while ( deltaAngle > twoPi ) deltaAngle -= twoPi;

			if ( deltaAngle < Number.EPSILON ) {

				if ( samePoints ) {

					deltaAngle = 0;

				} else {

					deltaAngle = twoPi;

				}

			}

			if ( this.aClockwise === true && ! samePoints ) {

				if ( deltaAngle === twoPi ) {

					deltaAngle = - twoPi;

				} else {

					deltaAngle = deltaAngle - twoPi;

				}

			}

			const angle = this.aStartAngle + t * deltaAngle;
			let x = this.aX + this.xRadius * Math.cos( angle );
			let y = this.aY + this.yRadius * Math.sin( angle );

			if ( this.aRotation !== 0 ) {

				const cos = Math.cos( this.aRotation );
				const sin = Math.sin( this.aRotation );

				const tx = x - this.aX;
				const ty = y - this.aY;

				// Rotate the point about the center of the ellipse.
				x = tx * cos - ty * sin + this.aX;
				y = tx * sin + ty * cos + this.aY;

			}

			return point.set( x, y );

		}

		copy( source ) {

			super.copy( source );

			this.aX = source.aX;
			this.aY = source.aY;

			this.xRadius = source.xRadius;
			this.yRadius = source.yRadius;

			this.aStartAngle = source.aStartAngle;
			this.aEndAngle = source.aEndAngle;

			this.aClockwise = source.aClockwise;

			this.aRotation = source.aRotation;

			return this;

		}

		toJSON() {

			const data = super.toJSON();

			data.aX = this.aX;
			data.aY = this.aY;

			data.xRadius = this.xRadius;
			data.yRadius = this.yRadius;

			data.aStartAngle = this.aStartAngle;
			data.aEndAngle = this.aEndAngle;

			data.aClockwise = this.aClockwise;

			data.aRotation = this.aRotation;

			return data;

		}

		fromJSON( json ) {

			super.fromJSON( json );

			this.aX = json.aX;
			this.aY = json.aY;

			this.xRadius = json.xRadius;
			this.yRadius = json.yRadius;

			this.aStartAngle = json.aStartAngle;
			this.aEndAngle = json.aEndAngle;

			this.aClockwise = json.aClockwise;

			this.aRotation = json.aRotation;

			return this;

		}

	}

	class ArcCurve extends EllipseCurve {

		constructor( aX, aY, aRadius, aStartAngle, aEndAngle, aClockwise ) {

			super( aX, aY, aRadius, aRadius, aStartAngle, aEndAngle, aClockwise );

			this.isArcCurve = true;

			this.type = 'ArcCurve';

		}

	}

	/**
	 * Centripetal CatmullRom Curve - which is useful for avoiding
	 * cusps and self-intersections in non-uniform catmull rom curves.
	 * http://www.cemyuksel.com/research/catmullrom_param/catmullrom.pdf
	 *
	 * curve.type accepts centripetal(default), chordal and catmullrom
	 * curve.tension is used for catmullrom which defaults to 0.5
	 */


	/*
	Based on an optimized c++ solution in
	 - http://stackoverflow.com/questions/9489736/catmull-rom-curve-with-no-cusps-and-no-self-intersections/
	 - http://ideone.com/NoEbVM

	This CubicPoly class could be used for reusing some variables and calculations,
	but for three.js curve use, it could be possible inlined and flatten into a single function call
	which can be placed in CurveUtils.
	*/

	function CubicPoly() {

		let c0 = 0, c1 = 0, c2 = 0, c3 = 0;

		/*
		 * Compute coefficients for a cubic polynomial
		 *   p(s) = c0 + c1*s + c2*s^2 + c3*s^3
		 * such that
		 *   p(0) = x0, p(1) = x1
		 *  and
		 *   p'(0) = t0, p'(1) = t1.
		 */
		function init( x0, x1, t0, t1 ) {

			c0 = x0;
			c1 = t0;
			c2 = - 3 * x0 + 3 * x1 - 2 * t0 - t1;
			c3 = 2 * x0 - 2 * x1 + t0 + t1;

		}

		return {

			initCatmullRom: function ( x0, x1, x2, x3, tension ) {

				init( x1, x2, tension * ( x2 - x0 ), tension * ( x3 - x1 ) );

			},

			initNonuniformCatmullRom: function ( x0, x1, x2, x3, dt0, dt1, dt2 ) {

				// compute tangents when parameterized in [t1,t2]
				let t1 = ( x1 - x0 ) / dt0 - ( x2 - x0 ) / ( dt0 + dt1 ) + ( x2 - x1 ) / dt1;
				let t2 = ( x2 - x1 ) / dt1 - ( x3 - x1 ) / ( dt1 + dt2 ) + ( x3 - x2 ) / dt2;

				// rescale tangents for parametrization in [0,1]
				t1 *= dt1;
				t2 *= dt1;

				init( x1, x2, t1, t2 );

			},

			calc: function ( t ) {

				const t2 = t * t;
				const t3 = t2 * t;
				return c0 + c1 * t + c2 * t2 + c3 * t3;

			}

		};

	}

	//

	const tmp = /*@__PURE__*/ new Vector3();
	const px = /*@__PURE__*/ new CubicPoly();
	const py = /*@__PURE__*/ new CubicPoly();
	const pz = /*@__PURE__*/ new CubicPoly();

	class CatmullRomCurve3 extends Curve {

		constructor( points = [], closed = false, curveType = 'centripetal', tension = 0.5 ) {

			super();

			this.isCatmullRomCurve3 = true;

			this.type = 'CatmullRomCurve3';

			this.points = points;
			this.closed = closed;
			this.curveType = curveType;
			this.tension = tension;

		}

		getPoint( t, optionalTarget = new Vector3() ) {

			const point = optionalTarget;

			const points = this.points;
			const l = points.length;

			const p = ( l - ( this.closed ? 0 : 1 ) ) * t;
			let intPoint = Math.floor( p );
			let weight = p - intPoint;

			if ( this.closed ) {

				intPoint += intPoint > 0 ? 0 : ( Math.floor( Math.abs( intPoint ) / l ) + 1 ) * l;

			} else if ( weight === 0 && intPoint === l - 1 ) {

				intPoint = l - 2;
				weight = 1;

			}

			let p0, p3; // 4 points (p1 & p2 defined below)

			if ( this.closed || intPoint > 0 ) {

				p0 = points[ ( intPoint - 1 ) % l ];

			} else {

				// extrapolate first point
				tmp.subVectors( points[ 0 ], points[ 1 ] ).add( points[ 0 ] );
				p0 = tmp;

			}

			const p1 = points[ intPoint % l ];
			const p2 = points[ ( intPoint + 1 ) % l ];

			if ( this.closed || intPoint + 2 < l ) {

				p3 = points[ ( intPoint + 2 ) % l ];

			} else {

				// extrapolate last point
				tmp.subVectors( points[ l - 1 ], points[ l - 2 ] ).add( points[ l - 1 ] );
				p3 = tmp;

			}

			if ( this.curveType === 'centripetal' || this.curveType === 'chordal' ) {

				// init Centripetal / Chordal Catmull-Rom
				const pow = this.curveType === 'chordal' ? 0.5 : 0.25;
				let dt0 = Math.pow( p0.distanceToSquared( p1 ), pow );
				let dt1 = Math.pow( p1.distanceToSquared( p2 ), pow );
				let dt2 = Math.pow( p2.distanceToSquared( p3 ), pow );

				// safety check for repeated points
				if ( dt1 < 1e-4 ) dt1 = 1.0;
				if ( dt0 < 1e-4 ) dt0 = dt1;
				if ( dt2 < 1e-4 ) dt2 = dt1;

				px.initNonuniformCatmullRom( p0.x, p1.x, p2.x, p3.x, dt0, dt1, dt2 );
				py.initNonuniformCatmullRom( p0.y, p1.y, p2.y, p3.y, dt0, dt1, dt2 );
				pz.initNonuniformCatmullRom( p0.z, p1.z, p2.z, p3.z, dt0, dt1, dt2 );

			} else if ( this.curveType === 'catmullrom' ) {

				px.initCatmullRom( p0.x, p1.x, p2.x, p3.x, this.tension );
				py.initCatmullRom( p0.y, p1.y, p2.y, p3.y, this.tension );
				pz.initCatmullRom( p0.z, p1.z, p2.z, p3.z, this.tension );

			}

			point.set(
				px.calc( weight ),
				py.calc( weight ),
				pz.calc( weight )
			);

			return point;

		}

		copy( source ) {

			super.copy( source );

			this.points = [];

			for ( let i = 0, l = source.points.length; i < l; i ++ ) {

				const point = source.points[ i ];

				this.points.push( point.clone() );

			}

			this.closed = source.closed;
			this.curveType = source.curveType;
			this.tension = source.tension;

			return this;

		}

		toJSON() {

			const data = super.toJSON();

			data.points = [];

			for ( let i = 0, l = this.points.length; i < l; i ++ ) {

				const point = this.points[ i ];
				data.points.push( point.toArray() );

			}

			data.closed = this.closed;
			data.curveType = this.curveType;
			data.tension = this.tension;

			return data;

		}

		fromJSON( json ) {

			super.fromJSON( json );

			this.points = [];

			for ( let i = 0, l = json.points.length; i < l; i ++ ) {

				const point = json.points[ i ];
				this.points.push( new Vector3().fromArray( point ) );

			}

			this.closed = json.closed;
			this.curveType = json.curveType;
			this.tension = json.tension;

			return this;

		}

	}

	/**
	 * Bezier Curves formulas obtained from
	 * https://en.wikipedia.org/wiki/B%C3%A9zier_curve
	 */

	function CatmullRom( t, p0, p1, p2, p3 ) {

		const v0 = ( p2 - p0 ) * 0.5;
		const v1 = ( p3 - p1 ) * 0.5;
		const t2 = t * t;
		const t3 = t * t2;
		return ( 2 * p1 - 2 * p2 + v0 + v1 ) * t3 + ( - 3 * p1 + 3 * p2 - 2 * v0 - v1 ) * t2 + v0 * t + p1;

	}

	//

	function QuadraticBezierP0( t, p ) {

		const k = 1 - t;
		return k * k * p;

	}

	function QuadraticBezierP1( t, p ) {

		return 2 * ( 1 - t ) * t * p;

	}

	function QuadraticBezierP2( t, p ) {

		return t * t * p;

	}

	function QuadraticBezier( t, p0, p1, p2 ) {

		return QuadraticBezierP0( t, p0 ) + QuadraticBezierP1( t, p1 ) +
			QuadraticBezierP2( t, p2 );

	}

	//

	function CubicBezierP0( t, p ) {

		const k = 1 - t;
		return k * k * k * p;

	}

	function CubicBezierP1( t, p ) {

		const k = 1 - t;
		return 3 * k * k * t * p;

	}

	function CubicBezierP2( t, p ) {

		return 3 * ( 1 - t ) * t * t * p;

	}

	function CubicBezierP3( t, p ) {

		return t * t * t * p;

	}

	function CubicBezier( t, p0, p1, p2, p3 ) {

		return CubicBezierP0( t, p0 ) + CubicBezierP1( t, p1 ) + CubicBezierP2( t, p2 ) +
			CubicBezierP3( t, p3 );

	}

	class CubicBezierCurve extends Curve {

		constructor( v0 = new Vector2(), v1 = new Vector2(), v2 = new Vector2(), v3 = new Vector2() ) {

			super();

			this.isCubicBezierCurve = true;

			this.type = 'CubicBezierCurve';

			this.v0 = v0;
			this.v1 = v1;
			this.v2 = v2;
			this.v3 = v3;

		}

		getPoint( t, optionalTarget = new Vector2() ) {

			const point = optionalTarget;

			const v0 = this.v0, v1 = this.v1, v2 = this.v2, v3 = this.v3;

			point.set(
				CubicBezier( t, v0.x, v1.x, v2.x, v3.x ),
				CubicBezier( t, v0.y, v1.y, v2.y, v3.y )
			);

			return point;

		}

		copy( source ) {

			super.copy( source );

			this.v0.copy( source.v0 );
			this.v1.copy( source.v1 );
			this.v2.copy( source.v2 );
			this.v3.copy( source.v3 );

			return this;

		}

		toJSON() {

			const data = super.toJSON();

			data.v0 = this.v0.toArray();
			data.v1 = this.v1.toArray();
			data.v2 = this.v2.toArray();
			data.v3 = this.v3.toArray();

			return data;

		}

		fromJSON( json ) {

			super.fromJSON( json );

			this.v0.fromArray( json.v0 );
			this.v1.fromArray( json.v1 );
			this.v2.fromArray( json.v2 );
			this.v3.fromArray( json.v3 );

			return this;

		}

	}

	class CubicBezierCurve3 extends Curve {

		constructor( v0 = new Vector3(), v1 = new Vector3(), v2 = new Vector3(), v3 = new Vector3() ) {

			super();

			this.isCubicBezierCurve3 = true;

			this.type = 'CubicBezierCurve3';

			this.v0 = v0;
			this.v1 = v1;
			this.v2 = v2;
			this.v3 = v3;

		}

		getPoint( t, optionalTarget = new Vector3() ) {

			const point = optionalTarget;

			const v0 = this.v0, v1 = this.v1, v2 = this.v2, v3 = this.v3;

			point.set(
				CubicBezier( t, v0.x, v1.x, v2.x, v3.x ),
				CubicBezier( t, v0.y, v1.y, v2.y, v3.y ),
				CubicBezier( t, v0.z, v1.z, v2.z, v3.z )
			);

			return point;

		}

		copy( source ) {

			super.copy( source );

			this.v0.copy( source.v0 );
			this.v1.copy( source.v1 );
			this.v2.copy( source.v2 );
			this.v3.copy( source.v3 );

			return this;

		}

		toJSON() {

			const data = super.toJSON();

			data.v0 = this.v0.toArray();
			data.v1 = this.v1.toArray();
			data.v2 = this.v2.toArray();
			data.v3 = this.v3.toArray();

			return data;

		}

		fromJSON( json ) {

			super.fromJSON( json );

			this.v0.fromArray( json.v0 );
			this.v1.fromArray( json.v1 );
			this.v2.fromArray( json.v2 );
			this.v3.fromArray( json.v3 );

			return this;

		}

	}

	class LineCurve extends Curve {

		constructor( v1 = new Vector2(), v2 = new Vector2() ) {

			super();

			this.isLineCurve = true;

			this.type = 'LineCurve';

			this.v1 = v1;
			this.v2 = v2;

		}

		getPoint( t, optionalTarget = new Vector2() ) {

			const point = optionalTarget;

			if ( t === 1 ) {

				point.copy( this.v2 );

			} else {

				point.copy( this.v2 ).sub( this.v1 );
				point.multiplyScalar( t ).add( this.v1 );

			}

			return point;

		}

		// Line curve is linear, so we can overwrite default getPointAt
		getPointAt( u, optionalTarget ) {

			return this.getPoint( u, optionalTarget );

		}

		getTangent( t, optionalTarget = new Vector2() ) {

			return optionalTarget.subVectors( this.v2, this.v1 ).normalize();

		}

		getTangentAt( u, optionalTarget ) {

			return this.getTangent( u, optionalTarget );

		}

		copy( source ) {

			super.copy( source );

			this.v1.copy( source.v1 );
			this.v2.copy( source.v2 );

			return this;

		}

		toJSON() {

			const data = super.toJSON();

			data.v1 = this.v1.toArray();
			data.v2 = this.v2.toArray();

			return data;

		}

		fromJSON( json ) {

			super.fromJSON( json );

			this.v1.fromArray( json.v1 );
			this.v2.fromArray( json.v2 );

			return this;

		}

	}

	class LineCurve3 extends Curve {

		constructor( v1 = new Vector3(), v2 = new Vector3() ) {

			super();

			this.isLineCurve3 = true;

			this.type = 'LineCurve3';

			this.v1 = v1;
			this.v2 = v2;

		}
		getPoint( t, optionalTarget = new Vector3() ) {

			const point = optionalTarget;

			if ( t === 1 ) {

				point.copy( this.v2 );

			} else {

				point.copy( this.v2 ).sub( this.v1 );
				point.multiplyScalar( t ).add( this.v1 );

			}

			return point;

		}
		// Line curve is linear, so we can overwrite default getPointAt
		getPointAt( u, optionalTarget ) {

			return this.getPoint( u, optionalTarget );

		}

		getTangent( t, optionalTarget = new Vector3() ) {

			return optionalTarget.subVectors( this.v2, this.v1 ).normalize();

		}

		getTangentAt( u, optionalTarget ) {

			return this.getTangent( u, optionalTarget );

		}

		copy( source ) {

			super.copy( source );

			this.v1.copy( source.v1 );
			this.v2.copy( source.v2 );

			return this;

		}
		toJSON() {

			const data = super.toJSON();

			data.v1 = this.v1.toArray();
			data.v2 = this.v2.toArray();

			return data;

		}
		fromJSON( json ) {

			super.fromJSON( json );

			this.v1.fromArray( json.v1 );
			this.v2.fromArray( json.v2 );

			return this;

		}

	}

	class QuadraticBezierCurve extends Curve {

		constructor( v0 = new Vector2(), v1 = new Vector2(), v2 = new Vector2() ) {

			super();

			this.isQuadraticBezierCurve = true;

			this.type = 'QuadraticBezierCurve';

			this.v0 = v0;
			this.v1 = v1;
			this.v2 = v2;

		}

		getPoint( t, optionalTarget = new Vector2() ) {

			const point = optionalTarget;

			const v0 = this.v0, v1 = this.v1, v2 = this.v2;

			point.set(
				QuadraticBezier( t, v0.x, v1.x, v2.x ),
				QuadraticBezier( t, v0.y, v1.y, v2.y )
			);

			return point;

		}

		copy( source ) {

			super.copy( source );

			this.v0.copy( source.v0 );
			this.v1.copy( source.v1 );
			this.v2.copy( source.v2 );

			return this;

		}

		toJSON() {

			const data = super.toJSON();

			data.v0 = this.v0.toArray();
			data.v1 = this.v1.toArray();
			data.v2 = this.v2.toArray();

			return data;

		}

		fromJSON( json ) {

			super.fromJSON( json );

			this.v0.fromArray( json.v0 );
			this.v1.fromArray( json.v1 );
			this.v2.fromArray( json.v2 );

			return this;

		}

	}

	class QuadraticBezierCurve3 extends Curve {

		constructor( v0 = new Vector3(), v1 = new Vector3(), v2 = new Vector3() ) {

			super();

			this.isQuadraticBezierCurve3 = true;

			this.type = 'QuadraticBezierCurve3';

			this.v0 = v0;
			this.v1 = v1;
			this.v2 = v2;

		}

		getPoint( t, optionalTarget = new Vector3() ) {

			const point = optionalTarget;

			const v0 = this.v0, v1 = this.v1, v2 = this.v2;

			point.set(
				QuadraticBezier( t, v0.x, v1.x, v2.x ),
				QuadraticBezier( t, v0.y, v1.y, v2.y ),
				QuadraticBezier( t, v0.z, v1.z, v2.z )
			);

			return point;

		}

		copy( source ) {

			super.copy( source );

			this.v0.copy( source.v0 );
			this.v1.copy( source.v1 );
			this.v2.copy( source.v2 );

			return this;

		}

		toJSON() {

			const data = super.toJSON();

			data.v0 = this.v0.toArray();
			data.v1 = this.v1.toArray();
			data.v2 = this.v2.toArray();

			return data;

		}

		fromJSON( json ) {

			super.fromJSON( json );

			this.v0.fromArray( json.v0 );
			this.v1.fromArray( json.v1 );
			this.v2.fromArray( json.v2 );

			return this;

		}

	}

	class SplineCurve extends Curve {

		constructor( points = [] ) {

			super();

			this.isSplineCurve = true;

			this.type = 'SplineCurve';

			this.points = points;

		}

		getPoint( t, optionalTarget = new Vector2() ) {

			const point = optionalTarget;

			const points = this.points;
			const p = ( points.length - 1 ) * t;

			const intPoint = Math.floor( p );
			const weight = p - intPoint;

			const p0 = points[ intPoint === 0 ? intPoint : intPoint - 1 ];
			const p1 = points[ intPoint ];
			const p2 = points[ intPoint > points.length - 2 ? points.length - 1 : intPoint + 1 ];
			const p3 = points[ intPoint > points.length - 3 ? points.length - 1 : intPoint + 2 ];

			point.set(
				CatmullRom( weight, p0.x, p1.x, p2.x, p3.x ),
				CatmullRom( weight, p0.y, p1.y, p2.y, p3.y )
			);

			return point;

		}

		copy( source ) {

			super.copy( source );

			this.points = [];

			for ( let i = 0, l = source.points.length; i < l; i ++ ) {

				const point = source.points[ i ];

				this.points.push( point.clone() );

			}

			return this;

		}

		toJSON() {

			const data = super.toJSON();

			data.points = [];

			for ( let i = 0, l = this.points.length; i < l; i ++ ) {

				const point = this.points[ i ];
				data.points.push( point.toArray() );

			}

			return data;

		}

		fromJSON( json ) {

			super.fromJSON( json );

			this.points = [];

			for ( let i = 0, l = json.points.length; i < l; i ++ ) {

				const point = json.points[ i ];
				this.points.push( new Vector2().fromArray( point ) );

			}

			return this;

		}

	}

	var Curves = /*#__PURE__*/Object.freeze({
		__proto__: null,
		ArcCurve: ArcCurve,
		CatmullRomCurve3: CatmullRomCurve3,
		CubicBezierCurve: CubicBezierCurve,
		CubicBezierCurve3: CubicBezierCurve3,
		EllipseCurve: EllipseCurve,
		LineCurve: LineCurve,
		LineCurve3: LineCurve3,
		QuadraticBezierCurve: QuadraticBezierCurve,
		QuadraticBezierCurve3: QuadraticBezierCurve3,
		SplineCurve: SplineCurve
	});

	/**************************************************************
	 *	Curved Path - a curve path is simply a array of connected
	 *  curves, but retains the api of a curve
	 **************************************************************/

	class CurvePath extends Curve {

		constructor() {

			super();

			this.type = 'CurvePath';

			this.curves = [];
			this.autoClose = false; // Automatically closes the path

		}

		add( curve ) {

			this.curves.push( curve );

		}

		closePath() {

			// Add a line curve if start and end of lines are not connected
			const startPoint = this.curves[ 0 ].getPoint( 0 );
			const endPoint = this.curves[ this.curves.length - 1 ].getPoint( 1 );

			if ( ! startPoint.equals( endPoint ) ) {

				this.curves.push( new LineCurve( endPoint, startPoint ) );

			}

		}

		// To get accurate point with reference to
		// entire path distance at time t,
		// following has to be done:

		// 1. Length of each sub path have to be known
		// 2. Locate and identify type of curve
		// 3. Get t for the curve
		// 4. Return curve.getPointAt(t')

		getPoint( t, optionalTarget ) {

			const d = t * this.getLength();
			const curveLengths = this.getCurveLengths();
			let i = 0;

			// To think about boundaries points.

			while ( i < curveLengths.length ) {

				if ( curveLengths[ i ] >= d ) {

					const diff = curveLengths[ i ] - d;
					const curve = this.curves[ i ];

					const segmentLength = curve.getLength();
					const u = segmentLength === 0 ? 0 : 1 - diff / segmentLength;

					return curve.getPointAt( u, optionalTarget );

				}

				i ++;

			}

			return null;

			// loop where sum != 0, sum > d , sum+1 <d

		}

		// We cannot use the default THREE.Curve getPoint() with getLength() because in
		// THREE.Curve, getLength() depends on getPoint() but in THREE.CurvePath
		// getPoint() depends on getLength

		getLength() {

			const lens = this.getCurveLengths();
			return lens[ lens.length - 1 ];

		}

		// cacheLengths must be recalculated.
		updateArcLengths() {

			this.needsUpdate = true;
			this.cacheLengths = null;
			this.getCurveLengths();

		}

		// Compute lengths and cache them
		// We cannot overwrite getLengths() because UtoT mapping uses it.

		getCurveLengths() {

			// We use cache values if curves and cache array are same length

			if ( this.cacheLengths && this.cacheLengths.length === this.curves.length ) {

				return this.cacheLengths;

			}

			// Get length of sub-curve
			// Push sums into cached array

			const lengths = [];
			let sums = 0;

			for ( let i = 0, l = this.curves.length; i < l; i ++ ) {

				sums += this.curves[ i ].getLength();
				lengths.push( sums );

			}

			this.cacheLengths = lengths;

			return lengths;

		}

		getSpacedPoints( divisions = 40 ) {

			const points = [];

			for ( let i = 0; i <= divisions; i ++ ) {

				points.push( this.getPoint( i / divisions ) );

			}

			if ( this.autoClose ) {

				points.push( points[ 0 ] );

			}

			return points;

		}

		getPoints( divisions = 12 ) {

			const points = [];
			let last;

			for ( let i = 0, curves = this.curves; i < curves.length; i ++ ) {

				const curve = curves[ i ];
				const resolution = curve.isEllipseCurve ? divisions * 2
					: ( curve.isLineCurve || curve.isLineCurve3 ) ? 1
						: curve.isSplineCurve ? divisions * curve.points.length
							: divisions;

				const pts = curve.getPoints( resolution );

				for ( let j = 0; j < pts.length; j ++ ) {

					const point = pts[ j ];

					if ( last && last.equals( point ) ) continue; // ensures no consecutive points are duplicates

					points.push( point );
					last = point;

				}

			}

			if ( this.autoClose && points.length > 1 && ! points[ points.length - 1 ].equals( points[ 0 ] ) ) {

				points.push( points[ 0 ] );

			}

			return points;

		}

		copy( source ) {

			super.copy( source );

			this.curves = [];

			for ( let i = 0, l = source.curves.length; i < l; i ++ ) {

				const curve = source.curves[ i ];

				this.curves.push( curve.clone() );

			}

			this.autoClose = source.autoClose;

			return this;

		}

		toJSON() {

			const data = super.toJSON();

			data.autoClose = this.autoClose;
			data.curves = [];

			for ( let i = 0, l = this.curves.length; i < l; i ++ ) {

				const curve = this.curves[ i ];
				data.curves.push( curve.toJSON() );

			}

			return data;

		}

		fromJSON( json ) {

			super.fromJSON( json );

			this.autoClose = json.autoClose;
			this.curves = [];

			for ( let i = 0, l = json.curves.length; i < l; i ++ ) {

				const curve = json.curves[ i ];
				this.curves.push( new Curves[ curve.type ]().fromJSON( curve ) );

			}

			return this;

		}

	}

	class Path extends CurvePath {

		constructor( points ) {

			super();

			this.type = 'Path';

			this.currentPoint = new Vector2();

			if ( points ) {

				this.setFromPoints( points );

			}

		}

		setFromPoints( points ) {

			this.moveTo( points[ 0 ].x, points[ 0 ].y );

			for ( let i = 1, l = points.length; i < l; i ++ ) {

				this.lineTo( points[ i ].x, points[ i ].y );

			}

			return this;

		}

		moveTo( x, y ) {

			this.currentPoint.set( x, y ); // TODO consider referencing vectors instead of copying?

			return this;

		}

		lineTo( x, y ) {

			const curve = new LineCurve( this.currentPoint.clone(), new Vector2( x, y ) );
			this.curves.push( curve );

			this.currentPoint.set( x, y );

			return this;

		}

		quadraticCurveTo( aCPx, aCPy, aX, aY ) {

			const curve = new QuadraticBezierCurve(
				this.currentPoint.clone(),
				new Vector2( aCPx, aCPy ),
				new Vector2( aX, aY )
			);

			this.curves.push( curve );

			this.currentPoint.set( aX, aY );

			return this;

		}

		bezierCurveTo( aCP1x, aCP1y, aCP2x, aCP2y, aX, aY ) {

			const curve = new CubicBezierCurve(
				this.currentPoint.clone(),
				new Vector2( aCP1x, aCP1y ),
				new Vector2( aCP2x, aCP2y ),
				new Vector2( aX, aY )
			);

			this.curves.push( curve );

			this.currentPoint.set( aX, aY );

			return this;

		}

		splineThru( pts /*Array of Vector*/ ) {

			const npts = [ this.currentPoint.clone() ].concat( pts );

			const curve = new SplineCurve( npts );
			this.curves.push( curve );

			this.currentPoint.copy( pts[ pts.length - 1 ] );

			return this;

		}

		arc( aX, aY, aRadius, aStartAngle, aEndAngle, aClockwise ) {

			const x0 = this.currentPoint.x;
			const y0 = this.currentPoint.y;

			this.absarc( aX + x0, aY + y0, aRadius,
				aStartAngle, aEndAngle, aClockwise );

			return this;

		}

		absarc( aX, aY, aRadius, aStartAngle, aEndAngle, aClockwise ) {

			this.absellipse( aX, aY, aRadius, aRadius, aStartAngle, aEndAngle, aClockwise );

			return this;

		}

		ellipse( aX, aY, xRadius, yRadius, aStartAngle, aEndAngle, aClockwise, aRotation ) {

			const x0 = this.currentPoint.x;
			const y0 = this.currentPoint.y;

			this.absellipse( aX + x0, aY + y0, xRadius, yRadius, aStartAngle, aEndAngle, aClockwise, aRotation );

			return this;

		}

		absellipse( aX, aY, xRadius, yRadius, aStartAngle, aEndAngle, aClockwise, aRotation ) {

			const curve = new EllipseCurve( aX, aY, xRadius, yRadius, aStartAngle, aEndAngle, aClockwise, aRotation );

			if ( this.curves.length > 0 ) {

				// if a previous curve is present, attempt to join
				const firstPoint = curve.getPoint( 0 );

				if ( ! firstPoint.equals( this.currentPoint ) ) {

					this.lineTo( firstPoint.x, firstPoint.y );

				}

			}

			this.curves.push( curve );

			const lastPoint = curve.getPoint( 1 );
			this.currentPoint.copy( lastPoint );

			return this;

		}

		copy( source ) {

			super.copy( source );

			this.currentPoint.copy( source.currentPoint );

			return this;

		}

		toJSON() {

			const data = super.toJSON();

			data.currentPoint = this.currentPoint.toArray();

			return data;

		}

		fromJSON( json ) {

			super.fromJSON( json );

			this.currentPoint.fromArray( json.currentPoint );

			return this;

		}

	}

	class Shape extends Path {

		constructor( points ) {

			super( points );

			this.uuid = generateUUID();

			this.type = 'Shape';

			this.holes = [];

		}

		getPointsHoles( divisions ) {

			const holesPts = [];

			for ( let i = 0, l = this.holes.length; i < l; i ++ ) {

				holesPts[ i ] = this.holes[ i ].getPoints( divisions );

			}

			return holesPts;

		}

		// get points of shape and holes (keypoints based on segments parameter)

		extractPoints( divisions ) {

			return {

				shape: this.getPoints( divisions ),
				holes: this.getPointsHoles( divisions )

			};

		}

		copy( source ) {

			super.copy( source );

			this.holes = [];

			for ( let i = 0, l = source.holes.length; i < l; i ++ ) {

				const hole = source.holes[ i ];

				this.holes.push( hole.clone() );

			}

			return this;

		}

		toJSON() {

			const data = super.toJSON();

			data.uuid = this.uuid;
			data.holes = [];

			for ( let i = 0, l = this.holes.length; i < l; i ++ ) {

				const hole = this.holes[ i ];
				data.holes.push( hole.toJSON() );

			}

			return data;

		}

		fromJSON( json ) {

			super.fromJSON( json );

			this.uuid = json.uuid;
			this.holes = [];

			for ( let i = 0, l = json.holes.length; i < l; i ++ ) {

				const hole = json.holes[ i ];
				this.holes.push( new Path().fromJSON( hole ) );

			}

			return this;

		}

	}

	/**
	 * Port from https://github.com/mapbox/earcut (v2.2.4)
	 */

	const Earcut = {

		triangulate: function ( data, holeIndices, dim = 2 ) {

			const hasHoles = holeIndices && holeIndices.length;
			const outerLen = hasHoles ? holeIndices[ 0 ] * dim : data.length;
			let outerNode = linkedList( data, 0, outerLen, dim, true );
			const triangles = [];

			if ( ! outerNode || outerNode.next === outerNode.prev ) return triangles;

			let minX, minY, maxX, maxY, x, y, invSize;

			if ( hasHoles ) outerNode = eliminateHoles( data, holeIndices, outerNode, dim );

			// if the shape is not too simple, we'll use z-order curve hash later; calculate polygon bbox
			if ( data.length > 80 * dim ) {

				minX = maxX = data[ 0 ];
				minY = maxY = data[ 1 ];

				for ( let i = dim; i < outerLen; i += dim ) {

					x = data[ i ];
					y = data[ i + 1 ];
					if ( x < minX ) minX = x;
					if ( y < minY ) minY = y;
					if ( x > maxX ) maxX = x;
					if ( y > maxY ) maxY = y;

				}

				// minX, minY and invSize are later used to transform coords into integers for z-order calculation
				invSize = Math.max( maxX - minX, maxY - minY );
				invSize = invSize !== 0 ? 32767 / invSize : 0;

			}

			earcutLinked( outerNode, triangles, dim, minX, minY, invSize, 0 );

			return triangles;

		}

	};

	// create a circular doubly linked list from polygon points in the specified winding order
	function linkedList( data, start, end, dim, clockwise ) {

		let i, last;

		if ( clockwise === ( signedArea( data, start, end, dim ) > 0 ) ) {

			for ( i = start; i < end; i += dim ) last = insertNode( i, data[ i ], data[ i + 1 ], last );

		} else {

			for ( i = end - dim; i >= start; i -= dim ) last = insertNode( i, data[ i ], data[ i + 1 ], last );

		}

		if ( last && equals( last, last.next ) ) {

			removeNode( last );
			last = last.next;

		}

		return last;

	}

	// eliminate colinear or duplicate points
	function filterPoints( start, end ) {

		if ( ! start ) return start;
		if ( ! end ) end = start;

		let p = start,
			again;
		do {

			again = false;

			if ( ! p.steiner && ( equals( p, p.next ) || area( p.prev, p, p.next ) === 0 ) ) {

				removeNode( p );
				p = end = p.prev;
				if ( p === p.next ) break;
				again = true;

			} else {

				p = p.next;

			}

		} while ( again || p !== end );

		return end;

	}

	// main ear slicing loop which triangulates a polygon (given as a linked list)
	function earcutLinked( ear, triangles, dim, minX, minY, invSize, pass ) {

		if ( ! ear ) return;

		// interlink polygon nodes in z-order
		if ( ! pass && invSize ) indexCurve( ear, minX, minY, invSize );

		let stop = ear,
			prev, next;

		// iterate through ears, slicing them one by one
		while ( ear.prev !== ear.next ) {

			prev = ear.prev;
			next = ear.next;

			if ( invSize ? isEarHashed( ear, minX, minY, invSize ) : isEar( ear ) ) {

				// cut off the triangle
				triangles.push( prev.i / dim | 0 );
				triangles.push( ear.i / dim | 0 );
				triangles.push( next.i / dim | 0 );

				removeNode( ear );

				// skipping the next vertex leads to less sliver triangles
				ear = next.next;
				stop = next.next;

				continue;

			}

			ear = next;

			// if we looped through the whole remaining polygon and can't find any more ears
			if ( ear === stop ) {

				// try filtering points and slicing again
				if ( ! pass ) {

					earcutLinked( filterPoints( ear ), triangles, dim, minX, minY, invSize, 1 );

					// if this didn't work, try curing all small self-intersections locally

				} else if ( pass === 1 ) {

					ear = cureLocalIntersections( filterPoints( ear ), triangles, dim );
					earcutLinked( ear, triangles, dim, minX, minY, invSize, 2 );

					// as a last resort, try splitting the remaining polygon into two

				} else if ( pass === 2 ) {

					splitEarcut( ear, triangles, dim, minX, minY, invSize );

				}

				break;

			}

		}

	}

	// check whether a polygon node forms a valid ear with adjacent nodes
	function isEar( ear ) {

		const a = ear.prev,
			b = ear,
			c = ear.next;

		if ( area( a, b, c ) >= 0 ) return false; // reflex, can't be an ear

		// now make sure we don't have other points inside the potential ear
		const ax = a.x, bx = b.x, cx = c.x, ay = a.y, by = b.y, cy = c.y;

		// triangle bbox; min & max are calculated like this for speed
		const x0 = ax < bx ? ( ax < cx ? ax : cx ) : ( bx < cx ? bx : cx ),
			y0 = ay < by ? ( ay < cy ? ay : cy ) : ( by < cy ? by : cy ),
			x1 = ax > bx ? ( ax > cx ? ax : cx ) : ( bx > cx ? bx : cx ),
			y1 = ay > by ? ( ay > cy ? ay : cy ) : ( by > cy ? by : cy );

		let p = c.next;
		while ( p !== a ) {

			if ( p.x >= x0 && p.x <= x1 && p.y >= y0 && p.y <= y1 &&
				pointInTriangle( ax, ay, bx, by, cx, cy, p.x, p.y ) &&
				area( p.prev, p, p.next ) >= 0 ) return false;
			p = p.next;

		}

		return true;

	}

	function isEarHashed( ear, minX, minY, invSize ) {

		const a = ear.prev,
			b = ear,
			c = ear.next;

		if ( area( a, b, c ) >= 0 ) return false; // reflex, can't be an ear

		const ax = a.x, bx = b.x, cx = c.x, ay = a.y, by = b.y, cy = c.y;

		// triangle bbox; min & max are calculated like this for speed
		const x0 = ax < bx ? ( ax < cx ? ax : cx ) : ( bx < cx ? bx : cx ),
			y0 = ay < by ? ( ay < cy ? ay : cy ) : ( by < cy ? by : cy ),
			x1 = ax > bx ? ( ax > cx ? ax : cx ) : ( bx > cx ? bx : cx ),
			y1 = ay > by ? ( ay > cy ? ay : cy ) : ( by > cy ? by : cy );

		// z-order range for the current triangle bbox;
		const minZ = zOrder( x0, y0, minX, minY, invSize ),
			maxZ = zOrder( x1, y1, minX, minY, invSize );

		let p = ear.prevZ,
			n = ear.nextZ;

		// look for points inside the triangle in both directions
		while ( p && p.z >= minZ && n && n.z <= maxZ ) {

			if ( p.x >= x0 && p.x <= x1 && p.y >= y0 && p.y <= y1 && p !== a && p !== c &&
				pointInTriangle( ax, ay, bx, by, cx, cy, p.x, p.y ) && area( p.prev, p, p.next ) >= 0 ) return false;
			p = p.prevZ;

			if ( n.x >= x0 && n.x <= x1 && n.y >= y0 && n.y <= y1 && n !== a && n !== c &&
				pointInTriangle( ax, ay, bx, by, cx, cy, n.x, n.y ) && area( n.prev, n, n.next ) >= 0 ) return false;
			n = n.nextZ;

		}

		// look for remaining points in decreasing z-order
		while ( p && p.z >= minZ ) {

			if ( p.x >= x0 && p.x <= x1 && p.y >= y0 && p.y <= y1 && p !== a && p !== c &&
				pointInTriangle( ax, ay, bx, by, cx, cy, p.x, p.y ) && area( p.prev, p, p.next ) >= 0 ) return false;
			p = p.prevZ;

		}

		// look for remaining points in increasing z-order
		while ( n && n.z <= maxZ ) {

			if ( n.x >= x0 && n.x <= x1 && n.y >= y0 && n.y <= y1 && n !== a && n !== c &&
				pointInTriangle( ax, ay, bx, by, cx, cy, n.x, n.y ) && area( n.prev, n, n.next ) >= 0 ) return false;
			n = n.nextZ;

		}

		return true;

	}

	// go through all polygon nodes and cure small local self-intersections
	function cureLocalIntersections( start, triangles, dim ) {

		let p = start;
		do {

			const a = p.prev,
				b = p.next.next;

			if ( ! equals( a, b ) && intersects( a, p, p.next, b ) && locallyInside( a, b ) && locallyInside( b, a ) ) {

				triangles.push( a.i / dim | 0 );
				triangles.push( p.i / dim | 0 );
				triangles.push( b.i / dim | 0 );

				// remove two nodes involved
				removeNode( p );
				removeNode( p.next );

				p = start = b;

			}

			p = p.next;

		} while ( p !== start );

		return filterPoints( p );

	}

	// try splitting polygon into two and triangulate them independently
	function splitEarcut( start, triangles, dim, minX, minY, invSize ) {

		// look for a valid diagonal that divides the polygon into two
		let a = start;
		do {

			let b = a.next.next;
			while ( b !== a.prev ) {

				if ( a.i !== b.i && isValidDiagonal( a, b ) ) {

					// split the polygon in two by the diagonal
					let c = splitPolygon( a, b );

					// filter colinear points around the cuts
					a = filterPoints( a, a.next );
					c = filterPoints( c, c.next );

					// run earcut on each half
					earcutLinked( a, triangles, dim, minX, minY, invSize, 0 );
					earcutLinked( c, triangles, dim, minX, minY, invSize, 0 );
					return;

				}

				b = b.next;

			}

			a = a.next;

		} while ( a !== start );

	}

	// link every hole into the outer loop, producing a single-ring polygon without holes
	function eliminateHoles( data, holeIndices, outerNode, dim ) {

		const queue = [];
		let i, len, start, end, list;

		for ( i = 0, len = holeIndices.length; i < len; i ++ ) {

			start = holeIndices[ i ] * dim;
			end = i < len - 1 ? holeIndices[ i + 1 ] * dim : data.length;
			list = linkedList( data, start, end, dim, false );
			if ( list === list.next ) list.steiner = true;
			queue.push( getLeftmost( list ) );

		}

		queue.sort( compareX );

		// process holes from left to right
		for ( i = 0; i < queue.length; i ++ ) {

			outerNode = eliminateHole( queue[ i ], outerNode );

		}

		return outerNode;

	}

	function compareX( a, b ) {

		return a.x - b.x;

	}

	// find a bridge between vertices that connects hole with an outer ring and link it
	function eliminateHole( hole, outerNode ) {

		const bridge = findHoleBridge( hole, outerNode );
		if ( ! bridge ) {

			return outerNode;

		}

		const bridgeReverse = splitPolygon( bridge, hole );

		// filter collinear points around the cuts
		filterPoints( bridgeReverse, bridgeReverse.next );
		return filterPoints( bridge, bridge.next );

	}

	// David Eberly's algorithm for finding a bridge between hole and outer polygon
	function findHoleBridge( hole, outerNode ) {

		let p = outerNode,
			qx = - Infinity,
			m;

		const hx = hole.x, hy = hole.y;

		// find a segment intersected by a ray from the hole's leftmost point to the left;
		// segment's endpoint with lesser x will be potential connection point
		do {

			if ( hy <= p.y && hy >= p.next.y && p.next.y !== p.y ) {

				const x = p.x + ( hy - p.y ) * ( p.next.x - p.x ) / ( p.next.y - p.y );
				if ( x <= hx && x > qx ) {

					qx = x;
					m = p.x < p.next.x ? p : p.next;
					if ( x === hx ) return m; // hole touches outer segment; pick leftmost endpoint

				}

			}

			p = p.next;

		} while ( p !== outerNode );

		if ( ! m ) return null;

		// look for points inside the triangle of hole point, segment intersection and endpoint;
		// if there are no points found, we have a valid connection;
		// otherwise choose the point of the minimum angle with the ray as connection point

		const stop = m,
			mx = m.x,
			my = m.y;
		let tanMin = Infinity, tan;

		p = m;

		do {

			if ( hx >= p.x && p.x >= mx && hx !== p.x &&
					pointInTriangle( hy < my ? hx : qx, hy, mx, my, hy < my ? qx : hx, hy, p.x, p.y ) ) {

				tan = Math.abs( hy - p.y ) / ( hx - p.x ); // tangential

				if ( locallyInside( p, hole ) && ( tan < tanMin || ( tan === tanMin && ( p.x > m.x || ( p.x === m.x && sectorContainsSector( m, p ) ) ) ) ) ) {

					m = p;
					tanMin = tan;

				}

			}

			p = p.next;

		} while ( p !== stop );

		return m;

	}

	// whether sector in vertex m contains sector in vertex p in the same coordinates
	function sectorContainsSector( m, p ) {

		return area( m.prev, m, p.prev ) < 0 && area( p.next, m, m.next ) < 0;

	}

	// interlink polygon nodes in z-order
	function indexCurve( start, minX, minY, invSize ) {

		let p = start;
		do {

			if ( p.z === 0 ) p.z = zOrder( p.x, p.y, minX, minY, invSize );
			p.prevZ = p.prev;
			p.nextZ = p.next;
			p = p.next;

		} while ( p !== start );

		p.prevZ.nextZ = null;
		p.prevZ = null;

		sortLinked( p );

	}

	// Simon Tatham's linked list merge sort algorithm
	// http://www.chiark.greenend.org.uk/~sgtatham/algorithms/listsort.html
	function sortLinked( list ) {

		let i, p, q, e, tail, numMerges, pSize, qSize,
			inSize = 1;

		do {

			p = list;
			list = null;
			tail = null;
			numMerges = 0;

			while ( p ) {

				numMerges ++;
				q = p;
				pSize = 0;
				for ( i = 0; i < inSize; i ++ ) {

					pSize ++;
					q = q.nextZ;
					if ( ! q ) break;

				}

				qSize = inSize;

				while ( pSize > 0 || ( qSize > 0 && q ) ) {

					if ( pSize !== 0 && ( qSize === 0 || ! q || p.z <= q.z ) ) {

						e = p;
						p = p.nextZ;
						pSize --;

					} else {

						e = q;
						q = q.nextZ;
						qSize --;

					}

					if ( tail ) tail.nextZ = e;
					else list = e;

					e.prevZ = tail;
					tail = e;

				}

				p = q;

			}

			tail.nextZ = null;
			inSize *= 2;

		} while ( numMerges > 1 );

		return list;

	}

	// z-order of a point given coords and inverse of the longer side of data bbox
	function zOrder( x, y, minX, minY, invSize ) {

		// coords are transformed into non-negative 15-bit integer range
		x = ( x - minX ) * invSize | 0;
		y = ( y - minY ) * invSize | 0;

		x = ( x | ( x << 8 ) ) & 0x00FF00FF;
		x = ( x | ( x << 4 ) ) & 0x0F0F0F0F;
		x = ( x | ( x << 2 ) ) & 0x33333333;
		x = ( x | ( x << 1 ) ) & 0x55555555;

		y = ( y | ( y << 8 ) ) & 0x00FF00FF;
		y = ( y | ( y << 4 ) ) & 0x0F0F0F0F;
		y = ( y | ( y << 2 ) ) & 0x33333333;
		y = ( y | ( y << 1 ) ) & 0x55555555;

		return x | ( y << 1 );

	}

	// find the leftmost node of a polygon ring
	function getLeftmost( start ) {

		let p = start,
			leftmost = start;
		do {

			if ( p.x < leftmost.x || ( p.x === leftmost.x && p.y < leftmost.y ) ) leftmost = p;
			p = p.next;

		} while ( p !== start );

		return leftmost;

	}

	// check if a point lies within a convex triangle
	function pointInTriangle( ax, ay, bx, by, cx, cy, px, py ) {

		return ( cx - px ) * ( ay - py ) >= ( ax - px ) * ( cy - py ) &&
	           ( ax - px ) * ( by - py ) >= ( bx - px ) * ( ay - py ) &&
	           ( bx - px ) * ( cy - py ) >= ( cx - px ) * ( by - py );

	}

	// check if a diagonal between two polygon nodes is valid (lies in polygon interior)
	function isValidDiagonal( a, b ) {

		return a.next.i !== b.i && a.prev.i !== b.i && ! intersectsPolygon( a, b ) && // dones't intersect other edges
	           ( locallyInside( a, b ) && locallyInside( b, a ) && middleInside( a, b ) && // locally visible
	            ( area( a.prev, a, b.prev ) || area( a, b.prev, b ) ) || // does not create opposite-facing sectors
	            equals( a, b ) && area( a.prev, a, a.next ) > 0 && area( b.prev, b, b.next ) > 0 ); // special zero-length case

	}

	// signed area of a triangle
	function area( p, q, r ) {

		return ( q.y - p.y ) * ( r.x - q.x ) - ( q.x - p.x ) * ( r.y - q.y );

	}

	// check if two points are equal
	function equals( p1, p2 ) {

		return p1.x === p2.x && p1.y === p2.y;

	}

	// check if two segments intersect
	function intersects( p1, q1, p2, q2 ) {

		const o1 = sign( area( p1, q1, p2 ) );
		const o2 = sign( area( p1, q1, q2 ) );
		const o3 = sign( area( p2, q2, p1 ) );
		const o4 = sign( area( p2, q2, q1 ) );

		if ( o1 !== o2 && o3 !== o4 ) return true; // general case

		if ( o1 === 0 && onSegment( p1, p2, q1 ) ) return true; // p1, q1 and p2 are collinear and p2 lies on p1q1
		if ( o2 === 0 && onSegment( p1, q2, q1 ) ) return true; // p1, q1 and q2 are collinear and q2 lies on p1q1
		if ( o3 === 0 && onSegment( p2, p1, q2 ) ) return true; // p2, q2 and p1 are collinear and p1 lies on p2q2
		if ( o4 === 0 && onSegment( p2, q1, q2 ) ) return true; // p2, q2 and q1 are collinear and q1 lies on p2q2

		return false;

	}

	// for collinear points p, q, r, check if point q lies on segment pr
	function onSegment( p, q, r ) {

		return q.x <= Math.max( p.x, r.x ) && q.x >= Math.min( p.x, r.x ) && q.y <= Math.max( p.y, r.y ) && q.y >= Math.min( p.y, r.y );

	}

	function sign( num ) {

		return num > 0 ? 1 : num < 0 ? - 1 : 0;

	}

	// check if a polygon diagonal intersects any polygon segments
	function intersectsPolygon( a, b ) {

		let p = a;
		do {

			if ( p.i !== a.i && p.next.i !== a.i && p.i !== b.i && p.next.i !== b.i &&
				intersects( p, p.next, a, b ) ) return true;
			p = p.next;

		} while ( p !== a );

		return false;

	}

	// check if a polygon diagonal is locally inside the polygon
	function locallyInside( a, b ) {

		return area( a.prev, a, a.next ) < 0 ?
			area( a, b, a.next ) >= 0 && area( a, a.prev, b ) >= 0 :
			area( a, b, a.prev ) < 0 || area( a, a.next, b ) < 0;

	}

	// check if the middle point of a polygon diagonal is inside the polygon
	function middleInside( a, b ) {

		let p = a,
			inside = false;
		const px = ( a.x + b.x ) / 2,
			py = ( a.y + b.y ) / 2;
		do {

			if ( ( ( p.y > py ) !== ( p.next.y > py ) ) && p.next.y !== p.y &&
				( px < ( p.next.x - p.x ) * ( py - p.y ) / ( p.next.y - p.y ) + p.x ) )
				inside = ! inside;
			p = p.next;

		} while ( p !== a );

		return inside;

	}

	// link two polygon vertices with a bridge; if the vertices belong to the same ring, it splits polygon into two;
	// if one belongs to the outer ring and another to a hole, it merges it into a single ring
	function splitPolygon( a, b ) {

		const a2 = new Node( a.i, a.x, a.y ),
			b2 = new Node( b.i, b.x, b.y ),
			an = a.next,
			bp = b.prev;

		a.next = b;
		b.prev = a;

		a2.next = an;
		an.prev = a2;

		b2.next = a2;
		a2.prev = b2;

		bp.next = b2;
		b2.prev = bp;

		return b2;

	}

	// create a node and optionally link it with previous one (in a circular doubly linked list)
	function insertNode( i, x, y, last ) {

		const p = new Node( i, x, y );

		if ( ! last ) {

			p.prev = p;
			p.next = p;

		} else {

			p.next = last.next;
			p.prev = last;
			last.next.prev = p;
			last.next = p;

		}

		return p;

	}

	function removeNode( p ) {

		p.next.prev = p.prev;
		p.prev.next = p.next;

		if ( p.prevZ ) p.prevZ.nextZ = p.nextZ;
		if ( p.nextZ ) p.nextZ.prevZ = p.prevZ;

	}

	function Node( i, x, y ) {

		// vertex index in coordinates array
		this.i = i;

		// vertex coordinates
		this.x = x;
		this.y = y;

		// previous and next vertex nodes in a polygon ring
		this.prev = null;
		this.next = null;

		// z-order curve value
		this.z = 0;

		// previous and next nodes in z-order
		this.prevZ = null;
		this.nextZ = null;

		// indicates whether this is a steiner point
		this.steiner = false;

	}

	function signedArea( data, start, end, dim ) {

		let sum = 0;
		for ( let i = start, j = end - dim; i < end; i += dim ) {

			sum += ( data[ j ] - data[ i ] ) * ( data[ i + 1 ] + data[ j + 1 ] );
			j = i;

		}

		return sum;

	}

	class ShapeUtils {

		// calculate area of the contour polygon

		static area( contour ) {

			const n = contour.length;
			let a = 0.0;

			for ( let p = n - 1, q = 0; q < n; p = q ++ ) {

				a += contour[ p ].x * contour[ q ].y - contour[ q ].x * contour[ p ].y;

			}

			return a * 0.5;

		}

		static isClockWise( pts ) {

			return ShapeUtils.area( pts ) < 0;

		}

		static triangulateShape( contour, holes ) {

			const vertices = []; // flat array of vertices like [ x0,y0, x1,y1, x2,y2, ... ]
			const holeIndices = []; // array of hole indices
			const faces = []; // final array of vertex indices like [ [ a,b,d ], [ b,c,d ] ]

			removeDupEndPts( contour );
			addContour( vertices, contour );

			//

			let holeIndex = contour.length;

			holes.forEach( removeDupEndPts );

			for ( let i = 0; i < holes.length; i ++ ) {

				holeIndices.push( holeIndex );
				holeIndex += holes[ i ].length;
				addContour( vertices, holes[ i ] );

			}

			//

			const triangles = Earcut.triangulate( vertices, holeIndices );

			//

			for ( let i = 0; i < triangles.length; i += 3 ) {

				faces.push( triangles.slice( i, i + 3 ) );

			}

			return faces;

		}

	}

	function removeDupEndPts( points ) {

		const l = points.length;

		if ( l > 2 && points[ l - 1 ].equals( points[ 0 ] ) ) {

			points.pop();

		}

	}

	function addContour( vertices, contour ) {

		for ( let i = 0; i < contour.length; i ++ ) {

			vertices.push( contour[ i ].x );
			vertices.push( contour[ i ].y );

		}

	}

	const Cache = {

		enabled: false,

		files: {},

		add: function ( key, file ) {

			if ( this.enabled === false ) return;

			// console.log( 'THREE.Cache', 'Adding key:', key );

			this.files[ key ] = file;

		},

		get: function ( key ) {

			if ( this.enabled === false ) return;

			// console.log( 'THREE.Cache', 'Checking key:', key );

			return this.files[ key ];

		},

		remove: function ( key ) {

			delete this.files[ key ];

		},

		clear: function () {

			this.files = {};

		}

	};

	class LoadingManager {

		constructor( onLoad, onProgress, onError ) {

			const scope = this;

			let isLoading = false;
			let itemsLoaded = 0;
			let itemsTotal = 0;
			let urlModifier = undefined;
			const handlers = [];

			// Refer to #5689 for the reason why we don't set .onStart
			// in the constructor

			this.onStart = undefined;
			this.onLoad = onLoad;
			this.onProgress = onProgress;
			this.onError = onError;

			this.itemStart = function ( url ) {

				itemsTotal ++;

				if ( isLoading === false ) {

					if ( scope.onStart !== undefined ) {

						scope.onStart( url, itemsLoaded, itemsTotal );

					}

				}

				isLoading = true;

			};

			this.itemEnd = function ( url ) {

				itemsLoaded ++;

				if ( scope.onProgress !== undefined ) {

					scope.onProgress( url, itemsLoaded, itemsTotal );

				}

				if ( itemsLoaded === itemsTotal ) {

					isLoading = false;

					if ( scope.onLoad !== undefined ) {

						scope.onLoad();

					}

				}

			};

			this.itemError = function ( url ) {

				if ( scope.onError !== undefined ) {

					scope.onError( url );

				}

			};

			this.resolveURL = function ( url ) {

				if ( urlModifier ) {

					return urlModifier( url );

				}

				return url;

			};

			this.setURLModifier = function ( transform ) {

				urlModifier = transform;

				return this;

			};

			this.addHandler = function ( regex, loader ) {

				handlers.push( regex, loader );

				return this;

			};

			this.removeHandler = function ( regex ) {

				const index = handlers.indexOf( regex );

				if ( index !== - 1 ) {

					handlers.splice( index, 2 );

				}

				return this;

			};

			this.getHandler = function ( file ) {

				for ( let i = 0, l = handlers.length; i < l; i += 2 ) {

					const regex = handlers[ i ];
					const loader = handlers[ i + 1 ];

					if ( regex.global ) regex.lastIndex = 0; // see #17920

					if ( regex.test( file ) ) {

						return loader;

					}

				}

				return null;

			};

		}

	}

	const DefaultLoadingManager = /*@__PURE__*/ new LoadingManager();

	class Loader {

		constructor( manager ) {

			this.manager = ( manager !== undefined ) ? manager : DefaultLoadingManager;

			this.crossOrigin = 'anonymous';
			this.withCredentials = false;
			this.path = '';
			this.resourcePath = '';
			this.requestHeader = {};

		}

		load( /* url, onLoad, onProgress, onError */ ) {}

		loadAsync( url, onProgress ) {

			const scope = this;

			return new Promise( function ( resolve, reject ) {

				scope.load( url, resolve, onProgress, reject );

			} );

		}

		parse( /* data */ ) {}

		setCrossOrigin( crossOrigin ) {

			this.crossOrigin = crossOrigin;
			return this;

		}

		setWithCredentials( value ) {

			this.withCredentials = value;
			return this;

		}

		setPath( path ) {

			this.path = path;
			return this;

		}

		setResourcePath( resourcePath ) {

			this.resourcePath = resourcePath;
			return this;

		}

		setRequestHeader( requestHeader ) {

			this.requestHeader = requestHeader;
			return this;

		}

	}

	const loading = {};

	class HttpError extends Error {

		constructor( message, response ) {

			super( message );
			this.response = response;

		}

	}

	class FileLoader extends Loader {

		constructor( manager ) {

			super( manager );

		}

		load( url, onLoad, onProgress, onError ) {

			if ( url === undefined ) url = '';

			if ( this.path !== undefined ) url = this.path + url;

			url = this.manager.resolveURL( url );

			const cached = Cache.get( url );

			if ( cached !== undefined ) {

				this.manager.itemStart( url );

				setTimeout( () => {

					if ( onLoad ) onLoad( cached );

					this.manager.itemEnd( url );

				}, 0 );

				return cached;

			}

			// Check if request is duplicate

			if ( loading[ url ] !== undefined ) {

				loading[ url ].push( {

					onLoad: onLoad,
					onProgress: onProgress,
					onError: onError

				} );

				return;

			}

			// Initialise array for duplicate requests
			loading[ url ] = [];

			loading[ url ].push( {
				onLoad: onLoad,
				onProgress: onProgress,
				onError: onError,
			} );

			// create request
			const req = new Request( url, {
				headers: new Headers( this.requestHeader ),
				credentials: this.withCredentials ? 'include' : 'same-origin',
				// An abort controller could be added within a future PR
			} );

			// record states ( avoid data race )
			const mimeType = this.mimeType;
			const responseType = this.responseType;

			// start the fetch
			fetch( req )
				.then( response => {

					if ( response.status === 200 || response.status === 0 ) {

						// Some browsers return HTTP Status 0 when using non-http protocol
						// e.g. 'file://' or 'data://'. Handle as success.

						if ( response.status === 0 ) {

							console.warn( 'THREE.FileLoader: HTTP Status 0 received.' );

						}

						// Workaround: Checking if response.body === undefined for Alipay browser #23548

						if ( typeof ReadableStream === 'undefined' || response.body === undefined || response.body.getReader === undefined ) {

							return response;

						}

						const callbacks = loading[ url ];
						const reader = response.body.getReader();

						// Nginx needs X-File-Size check
						// https://serverfault.com/questions/482875/why-does-nginx-remove-content-length-header-for-chunked-content
						const contentLength = response.headers.get( 'Content-Length' ) || response.headers.get( 'X-File-Size' );
						const total = contentLength ? parseInt( contentLength ) : 0;
						const lengthComputable = total !== 0;
						let loaded = 0;

						// periodically read data into the new stream tracking while download progress
						const stream = new ReadableStream( {
							start( controller ) {

								readData();

								function readData() {

									reader.read().then( ( { done, value } ) => {

										if ( done ) {

											controller.close();

										} else {

											loaded += value.byteLength;

											const event = new ProgressEvent( 'progress', { lengthComputable, loaded, total } );
											for ( let i = 0, il = callbacks.length; i < il; i ++ ) {

												const callback = callbacks[ i ];
												if ( callback.onProgress ) callback.onProgress( event );

											}

											controller.enqueue( value );
											readData();

										}

									} );

								}

							}

						} );

						return new Response( stream );

					} else {

						throw new HttpError( `fetch for "${response.url}" responded with ${response.status}: ${response.statusText}`, response );

					}

				} )
				.then( response => {

					switch ( responseType ) {

						case 'arraybuffer':

							return response.arrayBuffer();

						case 'blob':

							return response.blob();

						case 'document':

							return response.text()
								.then( text => {

									const parser = new DOMParser();
									return parser.parseFromString( text, mimeType );

								} );

						case 'json':

							return response.json();

						default:

							if ( mimeType === undefined ) {

								return response.text();

							} else {

								// sniff encoding
								const re = /charset="?([^;"\s]*)"?/i;
								const exec = re.exec( mimeType );
								const label = exec && exec[ 1 ] ? exec[ 1 ].toLowerCase() : undefined;
								const decoder = new TextDecoder( label );
								return response.arrayBuffer().then( ab => decoder.decode( ab ) );

							}

					}

				} )
				.then( data => {

					// Add to cache only on HTTP success, so that we do not cache
					// error response bodies as proper responses to requests.
					Cache.add( url, data );

					const callbacks = loading[ url ];
					delete loading[ url ];

					for ( let i = 0, il = callbacks.length; i < il; i ++ ) {

						const callback = callbacks[ i ];
						if ( callback.onLoad ) callback.onLoad( data );

					}

				} )
				.catch( err => {

					// Abort errors and other errors are handled the same

					const callbacks = loading[ url ];

					if ( callbacks === undefined ) {

						// When onLoad was called and url was deleted in `loading`
						this.manager.itemError( url );
						throw err;

					}

					delete loading[ url ];

					for ( let i = 0, il = callbacks.length; i < il; i ++ ) {

						const callback = callbacks[ i ];
						if ( callback.onError ) callback.onError( err );

					}

					this.manager.itemError( url );

				} )
				.finally( () => {

					this.manager.itemEnd( url );

				} );

			this.manager.itemStart( url );

		}

		setResponseType( value ) {

			this.responseType = value;
			return this;

		}

		setMimeType( value ) {

			this.mimeType = value;
			return this;

		}

	}

	const _vector$4 = /*@__PURE__*/ new Vector2();

	class Box2 {

		constructor( min = new Vector2( + Infinity, + Infinity ), max = new Vector2( - Infinity, - Infinity ) ) {

			this.isBox2 = true;

			this.min = min;
			this.max = max;

		}

		set( min, max ) {

			this.min.copy( min );
			this.max.copy( max );

			return this;

		}

		setFromPoints( points ) {

			this.makeEmpty();

			for ( let i = 0, il = points.length; i < il; i ++ ) {

				this.expandByPoint( points[ i ] );

			}

			return this;

		}

		setFromCenterAndSize( center, size ) {

			const halfSize = _vector$4.copy( size ).multiplyScalar( 0.5 );
			this.min.copy( center ).sub( halfSize );
			this.max.copy( center ).add( halfSize );

			return this;

		}

		clone() {

			return new this.constructor().copy( this );

		}

		copy( box ) {

			this.min.copy( box.min );
			this.max.copy( box.max );

			return this;

		}

		makeEmpty() {

			this.min.x = this.min.y = + Infinity;
			this.max.x = this.max.y = - Infinity;

			return this;

		}

		isEmpty() {

			// this is a more robust check for empty than ( volume <= 0 ) because volume can get positive with two negative axes

			return ( this.max.x < this.min.x ) || ( this.max.y < this.min.y );

		}

		getCenter( target ) {

			return this.isEmpty() ? target.set( 0, 0 ) : target.addVectors( this.min, this.max ).multiplyScalar( 0.5 );

		}

		getSize( target ) {

			return this.isEmpty() ? target.set( 0, 0 ) : target.subVectors( this.max, this.min );

		}

		expandByPoint( point ) {

			this.min.min( point );
			this.max.max( point );

			return this;

		}

		expandByVector( vector ) {

			this.min.sub( vector );
			this.max.add( vector );

			return this;

		}

		expandByScalar( scalar ) {

			this.min.addScalar( - scalar );
			this.max.addScalar( scalar );

			return this;

		}

		containsPoint( point ) {

			return point.x < this.min.x || point.x > this.max.x ||
				point.y < this.min.y || point.y > this.max.y ? false : true;

		}

		containsBox( box ) {

			return this.min.x <= box.min.x && box.max.x <= this.max.x &&
				this.min.y <= box.min.y && box.max.y <= this.max.y;

		}

		getParameter( point, target ) {

			// This can potentially have a divide by zero if the box
			// has a size dimension of 0.

			return target.set(
				( point.x - this.min.x ) / ( this.max.x - this.min.x ),
				( point.y - this.min.y ) / ( this.max.y - this.min.y )
			);

		}

		intersectsBox( box ) {

			// using 4 splitting planes to rule out intersections

			return box.max.x < this.min.x || box.min.x > this.max.x ||
				box.max.y < this.min.y || box.min.y > this.max.y ? false : true;

		}

		clampPoint( point, target ) {

			return target.copy( point ).clamp( this.min, this.max );

		}

		distanceToPoint( point ) {

			return this.clampPoint( point, _vector$4 ).distanceTo( point );

		}

		intersect( box ) {

			this.min.max( box.min );
			this.max.min( box.max );

			if ( this.isEmpty() ) this.makeEmpty();

			return this;

		}

		union( box ) {

			this.min.min( box.min );
			this.max.max( box.max );

			return this;

		}

		translate( offset ) {

			this.min.add( offset );
			this.max.add( offset );

			return this;

		}

		equals( box ) {

			return box.min.equals( this.min ) && box.max.equals( this.max );

		}

	}

	class ShapePath {

		constructor() {

			this.type = 'ShapePath';

			this.color = new Color();

			this.subPaths = [];
			this.currentPath = null;

		}

		moveTo( x, y ) {

			this.currentPath = new Path();
			this.subPaths.push( this.currentPath );
			this.currentPath.moveTo( x, y );

			return this;

		}

		lineTo( x, y ) {

			this.currentPath.lineTo( x, y );

			return this;

		}

		quadraticCurveTo( aCPx, aCPy, aX, aY ) {

			this.currentPath.quadraticCurveTo( aCPx, aCPy, aX, aY );

			return this;

		}

		bezierCurveTo( aCP1x, aCP1y, aCP2x, aCP2y, aX, aY ) {

			this.currentPath.bezierCurveTo( aCP1x, aCP1y, aCP2x, aCP2y, aX, aY );

			return this;

		}

		splineThru( pts ) {

			this.currentPath.splineThru( pts );

			return this;

		}

		toShapes( isCCW ) {

			function toShapesNoHoles( inSubpaths ) {

				const shapes = [];

				for ( let i = 0, l = inSubpaths.length; i < l; i ++ ) {

					const tmpPath = inSubpaths[ i ];

					const tmpShape = new Shape();
					tmpShape.curves = tmpPath.curves;

					shapes.push( tmpShape );

				}

				return shapes;

			}

			function isPointInsidePolygon( inPt, inPolygon ) {

				const polyLen = inPolygon.length;

				// inPt on polygon contour => immediate success    or
				// toggling of inside/outside at every single! intersection point of an edge
				//  with the horizontal line through inPt, left of inPt
				//  not counting lowerY endpoints of edges and whole edges on that line
				let inside = false;
				for ( let p = polyLen - 1, q = 0; q < polyLen; p = q ++ ) {

					let edgeLowPt = inPolygon[ p ];
					let edgeHighPt = inPolygon[ q ];

					let edgeDx = edgeHighPt.x - edgeLowPt.x;
					let edgeDy = edgeHighPt.y - edgeLowPt.y;

					if ( Math.abs( edgeDy ) > Number.EPSILON ) {

						// not parallel
						if ( edgeDy < 0 ) {

							edgeLowPt = inPolygon[ q ]; edgeDx = - edgeDx;
							edgeHighPt = inPolygon[ p ]; edgeDy = - edgeDy;

						}

						if ( ( inPt.y < edgeLowPt.y ) || ( inPt.y > edgeHighPt.y ) ) 		continue;

						if ( inPt.y === edgeLowPt.y ) {

							if ( inPt.x === edgeLowPt.x )		return	true;		// inPt is on contour ?
							// continue;				// no intersection or edgeLowPt => doesn't count !!!

						} else {

							const perpEdge = edgeDy * ( inPt.x - edgeLowPt.x ) - edgeDx * ( inPt.y - edgeLowPt.y );
							if ( perpEdge === 0 )				return	true;		// inPt is on contour ?
							if ( perpEdge < 0 ) 				continue;
							inside = ! inside;		// true intersection left of inPt

						}

					} else {

						// parallel or collinear
						if ( inPt.y !== edgeLowPt.y ) 		continue;			// parallel
						// edge lies on the same horizontal line as inPt
						if ( ( ( edgeHighPt.x <= inPt.x ) && ( inPt.x <= edgeLowPt.x ) ) ||
							 ( ( edgeLowPt.x <= inPt.x ) && ( inPt.x <= edgeHighPt.x ) ) )		return	true;	// inPt: Point on contour !
						// continue;

					}

				}

				return	inside;

			}

			const isClockWise = ShapeUtils.isClockWise;

			const subPaths = this.subPaths;
			if ( subPaths.length === 0 ) return [];

			let solid, tmpPath, tmpShape;
			const shapes = [];

			if ( subPaths.length === 1 ) {

				tmpPath = subPaths[ 0 ];
				tmpShape = new Shape();
				tmpShape.curves = tmpPath.curves;
				shapes.push( tmpShape );
				return shapes;

			}

			let holesFirst = ! isClockWise( subPaths[ 0 ].getPoints() );
			holesFirst = isCCW ? ! holesFirst : holesFirst;

			// console.log("Holes first", holesFirst);

			const betterShapeHoles = [];
			const newShapes = [];
			let newShapeHoles = [];
			let mainIdx = 0;
			let tmpPoints;

			newShapes[ mainIdx ] = undefined;
			newShapeHoles[ mainIdx ] = [];

			for ( let i = 0, l = subPaths.length; i < l; i ++ ) {

				tmpPath = subPaths[ i ];
				tmpPoints = tmpPath.getPoints();
				solid = isClockWise( tmpPoints );
				solid = isCCW ? ! solid : solid;

				if ( solid ) {

					if ( ( ! holesFirst ) && ( newShapes[ mainIdx ] ) )	mainIdx ++;

					newShapes[ mainIdx ] = { s: new Shape(), p: tmpPoints };
					newShapes[ mainIdx ].s.curves = tmpPath.curves;

					if ( holesFirst )	mainIdx ++;
					newShapeHoles[ mainIdx ] = [];

					//console.log('cw', i);

				} else {

					newShapeHoles[ mainIdx ].push( { h: tmpPath, p: tmpPoints[ 0 ] } );

					//console.log('ccw', i);

				}

			}

			// only Holes? -> probably all Shapes with wrong orientation
			if ( ! newShapes[ 0 ] )	return	toShapesNoHoles( subPaths );


			if ( newShapes.length > 1 ) {

				let ambiguous = false;
				let toChange = 0;

				for ( let sIdx = 0, sLen = newShapes.length; sIdx < sLen; sIdx ++ ) {

					betterShapeHoles[ sIdx ] = [];

				}

				for ( let sIdx = 0, sLen = newShapes.length; sIdx < sLen; sIdx ++ ) {

					const sho = newShapeHoles[ sIdx ];

					for ( let hIdx = 0; hIdx < sho.length; hIdx ++ ) {

						const ho = sho[ hIdx ];
						let hole_unassigned = true;

						for ( let s2Idx = 0; s2Idx < newShapes.length; s2Idx ++ ) {

							if ( isPointInsidePolygon( ho.p, newShapes[ s2Idx ].p ) ) {

								if ( sIdx !== s2Idx )	toChange ++;

								if ( hole_unassigned ) {

									hole_unassigned = false;
									betterShapeHoles[ s2Idx ].push( ho );

								} else {

									ambiguous = true;

								}

							}

						}

						if ( hole_unassigned ) {

							betterShapeHoles[ sIdx ].push( ho );

						}

					}

				}

				if ( toChange > 0 && ambiguous === false ) {

					newShapeHoles = betterShapeHoles;

				}

			}

			let tmpHoles;

			for ( let i = 0, il = newShapes.length; i < il; i ++ ) {

				tmpShape = newShapes[ i ].s;
				shapes.push( tmpShape );
				tmpHoles = newShapeHoles[ i ];

				for ( let j = 0, jl = tmpHoles.length; j < jl; j ++ ) {

					tmpShape.holes.push( tmpHoles[ j ].h );

				}

			}

			//console.log("shape", shapes);

			return shapes;

		}

	}

	if ( typeof __THREE_DEVTOOLS__ !== 'undefined' ) {

		__THREE_DEVTOOLS__.dispatchEvent( new CustomEvent( 'register', { detail: {
			revision: REVISION,
		} } ) );

	}

	if ( typeof window !== 'undefined' ) {

		if ( window.__THREE__ ) {

			console.warn( 'WARNING: Multiple instances of Three.js being imported.' );

		} else {

			window.__THREE__ = REVISION;

		}

	}

	const COLOR_SPACE_SVG = SRGBColorSpace;

	class SVGLoader extends Loader {

		constructor( manager ) {

			super( manager );

			// Default dots per inch
			this.defaultDPI = 90;

			// Accepted units: 'mm', 'cm', 'in', 'pt', 'pc', 'px'
			this.defaultUnit = 'px';

		}

		load( url, onLoad, onProgress, onError ) {

			const scope = this;

			const loader = new FileLoader( scope.manager );
			loader.setPath( scope.path );
			loader.setRequestHeader( scope.requestHeader );
			loader.setWithCredentials( scope.withCredentials );
			loader.load( url, function ( text ) {

				try {

					onLoad( scope.parse( text ) );

				} catch ( e ) {

					if ( onError ) {

						onError( e );

					} else {

						console.error( e );

					}

					scope.manager.itemError( url );

				}

			}, onProgress, onError );

		}

		parse( text ) {

			const scope = this;

			function parseNode( node, style ) {

				if ( node.nodeType !== 1 ) return;

				const transform = getNodeTransform( node );

				let isDefsNode = false;

				let path = null;

				switch ( node.nodeName ) {

					case 'svg':
						style = parseStyle( node, style );
						break;

					case 'style':
						parseCSSStylesheet( node );
						break;

					case 'g':
						style = parseStyle( node, style );
						break;

					case 'path':
						style = parseStyle( node, style );
						if ( node.hasAttribute( 'd' ) ) path = parsePathNode( node );
						break;

					case 'rect':
						style = parseStyle( node, style );
						path = parseRectNode( node );
						break;

					case 'polygon':
						style = parseStyle( node, style );
						path = parsePolygonNode( node );
						break;

					case 'polyline':
						style = parseStyle( node, style );
						path = parsePolylineNode( node );
						break;

					case 'circle':
						style = parseStyle( node, style );
						path = parseCircleNode( node );
						break;

					case 'ellipse':
						style = parseStyle( node, style );
						path = parseEllipseNode( node );
						break;

					case 'line':
						style = parseStyle( node, style );
						path = parseLineNode( node );
						break;

					case 'defs':
						isDefsNode = true;
						break;

					case 'use':
						style = parseStyle( node, style );

						const href = node.getAttributeNS( 'http://www.w3.org/1999/xlink', 'href' ) || '';
						const usedNodeId = href.substring( 1 );
						const usedNode = node.viewportElement.getElementById( usedNodeId );
						if ( usedNode ) {

							parseNode( usedNode, style );

						} else {

							console.warn( 'SVGLoader: \'use node\' references non-existent node id: ' + usedNodeId );

						}

						break;
						// console.log( node );

				}

				if ( path ) {

					if ( style.fill !== undefined && style.fill !== 'none' ) {

						path.color.setStyle( style.fill, COLOR_SPACE_SVG );

					}

					transformPath( path, currentTransform );

					paths.push( path );

					path.userData = { node: node, style: style };

				}

				const childNodes = node.childNodes;

				for ( let i = 0; i < childNodes.length; i ++ ) {

					const node = childNodes[ i ];

					if ( isDefsNode && node.nodeName !== 'style' && node.nodeName !== 'defs' ) {

						// Ignore everything in defs except CSS style definitions
						// and nested defs, because it is OK by the standard to have
						// <style/> there.
						continue;

					}

					parseNode( node, style );

				}


				if ( transform ) {

					transformStack.pop();

					if ( transformStack.length > 0 ) {

						currentTransform.copy( transformStack[ transformStack.length - 1 ] );

					} else {

						currentTransform.identity();

					}

				}

			}

			function parsePathNode( node ) {

				const path = new ShapePath();

				const point = new Vector2();
				const control = new Vector2();

				const firstPoint = new Vector2();
				let isFirstPoint = true;
				let doSetFirstPoint = false;

				const d = node.getAttribute( 'd' );

				if ( d === '' || d === 'none' ) return null;

				// console.log( d );

				const commands = d.match( /[a-df-z][^a-df-z]*/ig );

				for ( let i = 0, l = commands.length; i < l; i ++ ) {

					const command = commands[ i ];

					const type = command.charAt( 0 );
					const data = command.slice( 1 ).trim();

					if ( isFirstPoint === true ) {

						doSetFirstPoint = true;
						isFirstPoint = false;

					}

					let numbers;

					switch ( type ) {

						case 'M':
							numbers = parseFloats( data );
							for ( let j = 0, jl = numbers.length; j < jl; j += 2 ) {

								point.x = numbers[ j + 0 ];
								point.y = numbers[ j + 1 ];
								control.x = point.x;
								control.y = point.y;

								if ( j === 0 ) {

									path.moveTo( point.x, point.y );

								} else {

									path.lineTo( point.x, point.y );

								}

								if ( j === 0 ) firstPoint.copy( point );

							}

							break;

						case 'H':
							numbers = parseFloats( data );

							for ( let j = 0, jl = numbers.length; j < jl; j ++ ) {

								point.x = numbers[ j ];
								control.x = point.x;
								control.y = point.y;
								path.lineTo( point.x, point.y );

								if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );

							}

							break;

						case 'V':
							numbers = parseFloats( data );

							for ( let j = 0, jl = numbers.length; j < jl; j ++ ) {

								point.y = numbers[ j ];
								control.x = point.x;
								control.y = point.y;
								path.lineTo( point.x, point.y );

								if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );

							}

							break;

						case 'L':
							numbers = parseFloats( data );

							for ( let j = 0, jl = numbers.length; j < jl; j += 2 ) {

								point.x = numbers[ j + 0 ];
								point.y = numbers[ j + 1 ];
								control.x = point.x;
								control.y = point.y;
								path.lineTo( point.x, point.y );

								if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );

							}

							break;

						case 'C':
							numbers = parseFloats( data );

							for ( let j = 0, jl = numbers.length; j < jl; j += 6 ) {

								path.bezierCurveTo(
									numbers[ j + 0 ],
									numbers[ j + 1 ],
									numbers[ j + 2 ],
									numbers[ j + 3 ],
									numbers[ j + 4 ],
									numbers[ j + 5 ]
								);
								control.x = numbers[ j + 2 ];
								control.y = numbers[ j + 3 ];
								point.x = numbers[ j + 4 ];
								point.y = numbers[ j + 5 ];

								if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );

							}

							break;

						case 'S':
							numbers = parseFloats( data );

							for ( let j = 0, jl = numbers.length; j < jl; j += 4 ) {

								path.bezierCurveTo(
									getReflection( point.x, control.x ),
									getReflection( point.y, control.y ),
									numbers[ j + 0 ],
									numbers[ j + 1 ],
									numbers[ j + 2 ],
									numbers[ j + 3 ]
								);
								control.x = numbers[ j + 0 ];
								control.y = numbers[ j + 1 ];
								point.x = numbers[ j + 2 ];
								point.y = numbers[ j + 3 ];

								if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );

							}

							break;

						case 'Q':
							numbers = parseFloats( data );

							for ( let j = 0, jl = numbers.length; j < jl; j += 4 ) {

								path.quadraticCurveTo(
									numbers[ j + 0 ],
									numbers[ j + 1 ],
									numbers[ j + 2 ],
									numbers[ j + 3 ]
								);
								control.x = numbers[ j + 0 ];
								control.y = numbers[ j + 1 ];
								point.x = numbers[ j + 2 ];
								point.y = numbers[ j + 3 ];

								if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );

							}

							break;

						case 'T':
							numbers = parseFloats( data );

							for ( let j = 0, jl = numbers.length; j < jl; j += 2 ) {

								const rx = getReflection( point.x, control.x );
								const ry = getReflection( point.y, control.y );
								path.quadraticCurveTo(
									rx,
									ry,
									numbers[ j + 0 ],
									numbers[ j + 1 ]
								);
								control.x = rx;
								control.y = ry;
								point.x = numbers[ j + 0 ];
								point.y = numbers[ j + 1 ];

								if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );

							}

							break;

						case 'A':
							numbers = parseFloats( data, [ 3, 4 ], 7 );

							for ( let j = 0, jl = numbers.length; j < jl; j += 7 ) {

								// skip command if start point == end point
								if ( numbers[ j + 5 ] == point.x && numbers[ j + 6 ] == point.y ) continue;

								const start = point.clone();
								point.x = numbers[ j + 5 ];
								point.y = numbers[ j + 6 ];
								control.x = point.x;
								control.y = point.y;
								parseArcCommand(
									path, numbers[ j ], numbers[ j + 1 ], numbers[ j + 2 ], numbers[ j + 3 ], numbers[ j + 4 ], start, point
								);

								if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );

							}

							break;

						case 'm':
							numbers = parseFloats( data );

							for ( let j = 0, jl = numbers.length; j < jl; j += 2 ) {

								point.x += numbers[ j + 0 ];
								point.y += numbers[ j + 1 ];
								control.x = point.x;
								control.y = point.y;

								if ( j === 0 ) {

									path.moveTo( point.x, point.y );

								} else {

									path.lineTo( point.x, point.y );

								}

								if ( j === 0 ) firstPoint.copy( point );

							}

							break;

						case 'h':
							numbers = parseFloats( data );

							for ( let j = 0, jl = numbers.length; j < jl; j ++ ) {

								point.x += numbers[ j ];
								control.x = point.x;
								control.y = point.y;
								path.lineTo( point.x, point.y );

								if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );

							}

							break;

						case 'v':
							numbers = parseFloats( data );

							for ( let j = 0, jl = numbers.length; j < jl; j ++ ) {

								point.y += numbers[ j ];
								control.x = point.x;
								control.y = point.y;
								path.lineTo( point.x, point.y );

								if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );

							}

							break;

						case 'l':
							numbers = parseFloats( data );

							for ( let j = 0, jl = numbers.length; j < jl; j += 2 ) {

								point.x += numbers[ j + 0 ];
								point.y += numbers[ j + 1 ];
								control.x = point.x;
								control.y = point.y;
								path.lineTo( point.x, point.y );

								if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );

							}

							break;

						case 'c':
							numbers = parseFloats( data );

							for ( let j = 0, jl = numbers.length; j < jl; j += 6 ) {

								path.bezierCurveTo(
									point.x + numbers[ j + 0 ],
									point.y + numbers[ j + 1 ],
									point.x + numbers[ j + 2 ],
									point.y + numbers[ j + 3 ],
									point.x + numbers[ j + 4 ],
									point.y + numbers[ j + 5 ]
								);
								control.x = point.x + numbers[ j + 2 ];
								control.y = point.y + numbers[ j + 3 ];
								point.x += numbers[ j + 4 ];
								point.y += numbers[ j + 5 ];

								if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );

							}

							break;

						case 's':
							numbers = parseFloats( data );

							for ( let j = 0, jl = numbers.length; j < jl; j += 4 ) {

								path.bezierCurveTo(
									getReflection( point.x, control.x ),
									getReflection( point.y, control.y ),
									point.x + numbers[ j + 0 ],
									point.y + numbers[ j + 1 ],
									point.x + numbers[ j + 2 ],
									point.y + numbers[ j + 3 ]
								);
								control.x = point.x + numbers[ j + 0 ];
								control.y = point.y + numbers[ j + 1 ];
								point.x += numbers[ j + 2 ];
								point.y += numbers[ j + 3 ];

								if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );

							}

							break;

						case 'q':
							numbers = parseFloats( data );

							for ( let j = 0, jl = numbers.length; j < jl; j += 4 ) {

								path.quadraticCurveTo(
									point.x + numbers[ j + 0 ],
									point.y + numbers[ j + 1 ],
									point.x + numbers[ j + 2 ],
									point.y + numbers[ j + 3 ]
								);
								control.x = point.x + numbers[ j + 0 ];
								control.y = point.y + numbers[ j + 1 ];
								point.x += numbers[ j + 2 ];
								point.y += numbers[ j + 3 ];

								if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );

							}

							break;

						case 't':
							numbers = parseFloats( data );

							for ( let j = 0, jl = numbers.length; j < jl; j += 2 ) {

								const rx = getReflection( point.x, control.x );
								const ry = getReflection( point.y, control.y );
								path.quadraticCurveTo(
									rx,
									ry,
									point.x + numbers[ j + 0 ],
									point.y + numbers[ j + 1 ]
								);
								control.x = rx;
								control.y = ry;
								point.x = point.x + numbers[ j + 0 ];
								point.y = point.y + numbers[ j + 1 ];

								if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );

							}

							break;

						case 'a':
							numbers = parseFloats( data, [ 3, 4 ], 7 );

							for ( let j = 0, jl = numbers.length; j < jl; j += 7 ) {

								// skip command if no displacement
								if ( numbers[ j + 5 ] == 0 && numbers[ j + 6 ] == 0 ) continue;

								const start = point.clone();
								point.x += numbers[ j + 5 ];
								point.y += numbers[ j + 6 ];
								control.x = point.x;
								control.y = point.y;
								parseArcCommand(
									path, numbers[ j ], numbers[ j + 1 ], numbers[ j + 2 ], numbers[ j + 3 ], numbers[ j + 4 ], start, point
								);

								if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );

							}

							break;

						case 'Z':
						case 'z':
							path.currentPath.autoClose = true;

							if ( path.currentPath.curves.length > 0 ) {

								// Reset point to beginning of Path
								point.copy( firstPoint );
								path.currentPath.currentPoint.copy( point );
								isFirstPoint = true;

							}

							break;

						default:
							console.warn( command );

					}

					// console.log( type, parseFloats( data ), parseFloats( data ).length  )

					doSetFirstPoint = false;

				}

				return path;

			}

			function parseCSSStylesheet( node ) {

				if ( ! node.sheet || ! node.sheet.cssRules || ! node.sheet.cssRules.length ) return;

				for ( let i = 0; i < node.sheet.cssRules.length; i ++ ) {

					const stylesheet = node.sheet.cssRules[ i ];

					if ( stylesheet.type !== 1 ) continue;

					const selectorList = stylesheet.selectorText
						.split( /,/gm )
						.filter( Boolean )
						.map( i => i.trim() );

					for ( let j = 0; j < selectorList.length; j ++ ) {

						// Remove empty rules
						const definitions = Object.fromEntries(
							Object.entries( stylesheet.style ).filter( ( [ , v ] ) => v !== '' )
						);

						stylesheets[ selectorList[ j ] ] = Object.assign(
							stylesheets[ selectorList[ j ] ] || {},
							definitions
						);

					}

				}

			}

			/**
			 * https://www.w3.org/TR/SVG/implnote.html#ArcImplementationNotes
			 * https://mortoray.com/2017/02/16/rendering-an-svg-elliptical-arc-as-bezier-curves/ Appendix: Endpoint to center arc conversion
			 * From
			 * rx ry x-axis-rotation large-arc-flag sweep-flag x y
			 * To
			 * aX, aY, xRadius, yRadius, aStartAngle, aEndAngle, aClockwise, aRotation
			 */

			function parseArcCommand( path, rx, ry, x_axis_rotation, large_arc_flag, sweep_flag, start, end ) {

				if ( rx == 0 || ry == 0 ) {

					// draw a line if either of the radii == 0
					path.lineTo( end.x, end.y );
					return;

				}

				x_axis_rotation = x_axis_rotation * Math.PI / 180;

				// Ensure radii are positive
				rx = Math.abs( rx );
				ry = Math.abs( ry );

				// Compute (x1', y1')
				const dx2 = ( start.x - end.x ) / 2.0;
				const dy2 = ( start.y - end.y ) / 2.0;
				const x1p = Math.cos( x_axis_rotation ) * dx2 + Math.sin( x_axis_rotation ) * dy2;
				const y1p = - Math.sin( x_axis_rotation ) * dx2 + Math.cos( x_axis_rotation ) * dy2;

				// Compute (cx', cy')
				let rxs = rx * rx;
				let rys = ry * ry;
				const x1ps = x1p * x1p;
				const y1ps = y1p * y1p;

				// Ensure radii are large enough
				const cr = x1ps / rxs + y1ps / rys;

				if ( cr > 1 ) {

					// scale up rx,ry equally so cr == 1
					const s = Math.sqrt( cr );
					rx = s * rx;
					ry = s * ry;
					rxs = rx * rx;
					rys = ry * ry;

				}

				const dq = ( rxs * y1ps + rys * x1ps );
				const pq = ( rxs * rys - dq ) / dq;
				let q = Math.sqrt( Math.max( 0, pq ) );
				if ( large_arc_flag === sweep_flag ) q = - q;
				const cxp = q * rx * y1p / ry;
				const cyp = - q * ry * x1p / rx;

				// Step 3: Compute (cx, cy) from (cx', cy')
				const cx = Math.cos( x_axis_rotation ) * cxp - Math.sin( x_axis_rotation ) * cyp + ( start.x + end.x ) / 2;
				const cy = Math.sin( x_axis_rotation ) * cxp + Math.cos( x_axis_rotation ) * cyp + ( start.y + end.y ) / 2;

				// Step 4: Compute θ1 and Δθ
				const theta = svgAngle( 1, 0, ( x1p - cxp ) / rx, ( y1p - cyp ) / ry );
				const delta = svgAngle( ( x1p - cxp ) / rx, ( y1p - cyp ) / ry, ( - x1p - cxp ) / rx, ( - y1p - cyp ) / ry ) % ( Math.PI * 2 );

				path.currentPath.absellipse( cx, cy, rx, ry, theta, theta + delta, sweep_flag === 0, x_axis_rotation );

			}

			function svgAngle( ux, uy, vx, vy ) {

				const dot = ux * vx + uy * vy;
				const len = Math.sqrt( ux * ux + uy * uy ) * Math.sqrt( vx * vx + vy * vy );
				let ang = Math.acos( Math.max( - 1, Math.min( 1, dot / len ) ) ); // floating point precision, slightly over values appear
				if ( ( ux * vy - uy * vx ) < 0 ) ang = - ang;
				return ang;

			}

			/*
			* According to https://www.w3.org/TR/SVG/shapes.html#RectElementRXAttribute
			* rounded corner should be rendered to elliptical arc, but bezier curve does the job well enough
			*/
			function parseRectNode( node ) {

				const x = parseFloatWithUnits( node.getAttribute( 'x' ) || 0 );
				const y = parseFloatWithUnits( node.getAttribute( 'y' ) || 0 );
				const rx = parseFloatWithUnits( node.getAttribute( 'rx' ) || node.getAttribute( 'ry' ) || 0 );
				const ry = parseFloatWithUnits( node.getAttribute( 'ry' ) || node.getAttribute( 'rx' ) || 0 );
				const w = parseFloatWithUnits( node.getAttribute( 'width' ) );
				const h = parseFloatWithUnits( node.getAttribute( 'height' ) );

				// Ellipse arc to Bezier approximation Coefficient (Inversed). See:
				// https://spencermortensen.com/articles/bezier-circle/
				const bci = 1 - 0.551915024494;

				const path = new ShapePath();

				// top left
				path.moveTo( x + rx, y );

				// top right
				path.lineTo( x + w - rx, y );
				if ( rx !== 0 || ry !== 0 ) {

					path.bezierCurveTo(
						x + w - rx * bci,
						y,
						x + w,
						y + ry * bci,
						x + w,
						y + ry
					);

				}

				// bottom right
				path.lineTo( x + w, y + h - ry );
				if ( rx !== 0 || ry !== 0 ) {

					path.bezierCurveTo(
						x + w,
						y + h - ry * bci,
						x + w - rx * bci,
						y + h,
						x + w - rx,
						y + h
					);

				}

				// bottom left
				path.lineTo( x + rx, y + h );
				if ( rx !== 0 || ry !== 0 ) {

					path.bezierCurveTo(
						x + rx * bci,
						y + h,
						x,
						y + h - ry * bci,
						x,
						y + h - ry
					);

				}

				// back to top left
				path.lineTo( x, y + ry );
				if ( rx !== 0 || ry !== 0 ) {

					path.bezierCurveTo( x, y + ry * bci, x + rx * bci, y, x + rx, y );

				}

				return path;

			}

			function parsePolygonNode( node ) {

				function iterator( match, a, b ) {

					const x = parseFloatWithUnits( a );
					const y = parseFloatWithUnits( b );

					if ( index === 0 ) {

						path.moveTo( x, y );

					} else {

						path.lineTo( x, y );

					}

					index ++;

				}

				const regex = /([+-]?\d*\.?\d+(?:e[+-]?\d+)?)(?:,|\s)([+-]?\d*\.?\d+(?:e[+-]?\d+)?)/g;

				const path = new ShapePath();

				let index = 0;

				node.getAttribute( 'points' ).replace( regex, iterator );

				path.currentPath.autoClose = true;

				return path;

			}

			function parsePolylineNode( node ) {

				function iterator( match, a, b ) {

					const x = parseFloatWithUnits( a );
					const y = parseFloatWithUnits( b );

					if ( index === 0 ) {

						path.moveTo( x, y );

					} else {

						path.lineTo( x, y );

					}

					index ++;

				}

				const regex = /([+-]?\d*\.?\d+(?:e[+-]?\d+)?)(?:,|\s)([+-]?\d*\.?\d+(?:e[+-]?\d+)?)/g;

				const path = new ShapePath();

				let index = 0;

				node.getAttribute( 'points' ).replace( regex, iterator );

				path.currentPath.autoClose = false;

				return path;

			}

			function parseCircleNode( node ) {

				const x = parseFloatWithUnits( node.getAttribute( 'cx' ) || 0 );
				const y = parseFloatWithUnits( node.getAttribute( 'cy' ) || 0 );
				const r = parseFloatWithUnits( node.getAttribute( 'r' ) || 0 );

				const subpath = new Path();
				subpath.absarc( x, y, r, 0, Math.PI * 2 );

				const path = new ShapePath();
				path.subPaths.push( subpath );

				return path;

			}

			function parseEllipseNode( node ) {

				const x = parseFloatWithUnits( node.getAttribute( 'cx' ) || 0 );
				const y = parseFloatWithUnits( node.getAttribute( 'cy' ) || 0 );
				const rx = parseFloatWithUnits( node.getAttribute( 'rx' ) || 0 );
				const ry = parseFloatWithUnits( node.getAttribute( 'ry' ) || 0 );

				const subpath = new Path();
				subpath.absellipse( x, y, rx, ry, 0, Math.PI * 2 );

				const path = new ShapePath();
				path.subPaths.push( subpath );

				return path;

			}

			function parseLineNode( node ) {

				const x1 = parseFloatWithUnits( node.getAttribute( 'x1' ) || 0 );
				const y1 = parseFloatWithUnits( node.getAttribute( 'y1' ) || 0 );
				const x2 = parseFloatWithUnits( node.getAttribute( 'x2' ) || 0 );
				const y2 = parseFloatWithUnits( node.getAttribute( 'y2' ) || 0 );

				const path = new ShapePath();
				path.moveTo( x1, y1 );
				path.lineTo( x2, y2 );
				path.currentPath.autoClose = false;

				return path;

			}

			//

			function parseStyle( node, style ) {

				style = Object.assign( {}, style ); // clone style

				let stylesheetStyles = {};

				if ( node.hasAttribute( 'class' ) ) {

					const classSelectors = node.getAttribute( 'class' )
						.split( /\s/ )
						.filter( Boolean )
						.map( i => i.trim() );

					for ( let i = 0; i < classSelectors.length; i ++ ) {

						stylesheetStyles = Object.assign( stylesheetStyles, stylesheets[ '.' + classSelectors[ i ] ] );

					}

				}

				if ( node.hasAttribute( 'id' ) ) {

					stylesheetStyles = Object.assign( stylesheetStyles, stylesheets[ '#' + node.getAttribute( 'id' ) ] );

				}

				function addStyle( svgName, jsName, adjustFunction ) {

					if ( adjustFunction === undefined ) adjustFunction = function copy( v ) {

						if ( v.startsWith( 'url' ) ) console.warn( 'SVGLoader: url access in attributes is not implemented.' );

						return v;

					};

					if ( node.hasAttribute( svgName ) ) style[ jsName ] = adjustFunction( node.getAttribute( svgName ) );
					if ( stylesheetStyles[ svgName ] ) style[ jsName ] = adjustFunction( stylesheetStyles[ svgName ] );
					if ( node.style && node.style[ svgName ] !== '' ) style[ jsName ] = adjustFunction( node.style[ svgName ] );

				}

				function clamp( v ) {

					return Math.max( 0, Math.min( 1, parseFloatWithUnits( v ) ) );

				}

				function positive( v ) {

					return Math.max( 0, parseFloatWithUnits( v ) );

				}

				addStyle( 'fill', 'fill' );
				addStyle( 'fill-opacity', 'fillOpacity', clamp );
				addStyle( 'fill-rule', 'fillRule' );
				addStyle( 'opacity', 'opacity', clamp );
				addStyle( 'stroke', 'stroke' );
				addStyle( 'stroke-opacity', 'strokeOpacity', clamp );
				addStyle( 'stroke-width', 'strokeWidth', positive );
				addStyle( 'stroke-linejoin', 'strokeLineJoin' );
				addStyle( 'stroke-linecap', 'strokeLineCap' );
				addStyle( 'stroke-miterlimit', 'strokeMiterLimit', positive );
				addStyle( 'visibility', 'visibility' );

				return style;

			}

			// http://www.w3.org/TR/SVG11/implnote.html#PathElementImplementationNotes

			function getReflection( a, b ) {

				return a - ( b - a );

			}

			// from https://github.com/ppvg/svg-numbers (MIT License)

			function parseFloats( input, flags, stride ) {

				if ( typeof input !== 'string' ) {

					throw new TypeError( 'Invalid input: ' + typeof input );

				}

				// Character groups
				const RE = {
					SEPARATOR: /[ \t\r\n\,.\-+]/,
					WHITESPACE: /[ \t\r\n]/,
					DIGIT: /[\d]/,
					SIGN: /[-+]/,
					POINT: /\./,
					COMMA: /,/,
					EXP: /e/i,
					FLAGS: /[01]/
				};

				// States
				const SEP = 0;
				const INT = 1;
				const FLOAT = 2;
				const EXP = 3;

				let state = SEP;
				let seenComma = true;
				let number = '', exponent = '';
				const result = [];

				function throwSyntaxError( current, i, partial ) {

					const error = new SyntaxError( 'Unexpected character "' + current + '" at index ' + i + '.' );
					error.partial = partial;
					throw error;

				}

				function newNumber() {

					if ( number !== '' ) {

						if ( exponent === '' ) result.push( Number( number ) );
						else result.push( Number( number ) * Math.pow( 10, Number( exponent ) ) );

					}

					number = '';
					exponent = '';

				}

				let current;
				const length = input.length;

				for ( let i = 0; i < length; i ++ ) {

					current = input[ i ];

					// check for flags
					if ( Array.isArray( flags ) && flags.includes( result.length % stride ) && RE.FLAGS.test( current ) ) {

						state = INT;
						number = current;
						newNumber();
						continue;

					}

					// parse until next number
					if ( state === SEP ) {

						// eat whitespace
						if ( RE.WHITESPACE.test( current ) ) {

							continue;

						}

						// start new number
						if ( RE.DIGIT.test( current ) || RE.SIGN.test( current ) ) {

							state = INT;
							number = current;
							continue;

						}

						if ( RE.POINT.test( current ) ) {

							state = FLOAT;
							number = current;
							continue;

						}

						// throw on double commas (e.g. "1, , 2")
						if ( RE.COMMA.test( current ) ) {

							if ( seenComma ) {

								throwSyntaxError( current, i, result );

							}

							seenComma = true;

						}

					}

					// parse integer part
					if ( state === INT ) {

						if ( RE.DIGIT.test( current ) ) {

							number += current;
							continue;

						}

						if ( RE.POINT.test( current ) ) {

							number += current;
							state = FLOAT;
							continue;

						}

						if ( RE.EXP.test( current ) ) {

							state = EXP;
							continue;

						}

						// throw on double signs ("-+1"), but not on sign as separator ("-1-2")
						if ( RE.SIGN.test( current )
								&& number.length === 1
								&& RE.SIGN.test( number[ 0 ] ) ) {

							throwSyntaxError( current, i, result );

						}

					}

					// parse decimal part
					if ( state === FLOAT ) {

						if ( RE.DIGIT.test( current ) ) {

							number += current;
							continue;

						}

						if ( RE.EXP.test( current ) ) {

							state = EXP;
							continue;

						}

						// throw on double decimal points (e.g. "1..2")
						if ( RE.POINT.test( current ) && number[ number.length - 1 ] === '.' ) {

							throwSyntaxError( current, i, result );

						}

					}

					// parse exponent part
					if ( state === EXP ) {

						if ( RE.DIGIT.test( current ) ) {

							exponent += current;
							continue;

						}

						if ( RE.SIGN.test( current ) ) {

							if ( exponent === '' ) {

								exponent += current;
								continue;

							}

							if ( exponent.length === 1 && RE.SIGN.test( exponent ) ) {

								throwSyntaxError( current, i, result );

							}

						}

					}


					// end of number
					if ( RE.WHITESPACE.test( current ) ) {

						newNumber();
						state = SEP;
						seenComma = false;

					} else if ( RE.COMMA.test( current ) ) {

						newNumber();
						state = SEP;
						seenComma = true;

					} else if ( RE.SIGN.test( current ) ) {

						newNumber();
						state = INT;
						number = current;

					} else if ( RE.POINT.test( current ) ) {

						newNumber();
						state = FLOAT;
						number = current;

					} else {

						throwSyntaxError( current, i, result );

					}

				}

				// add the last number found (if any)
				newNumber();

				return result;

			}

			// Units

			const units = [ 'mm', 'cm', 'in', 'pt', 'pc', 'px' ];

			// Conversion: [ fromUnit ][ toUnit ] (-1 means dpi dependent)
			const unitConversion = {

				'mm': {
					'mm': 1,
					'cm': 0.1,
					'in': 1 / 25.4,
					'pt': 72 / 25.4,
					'pc': 6 / 25.4,
					'px': - 1
				},
				'cm': {
					'mm': 10,
					'cm': 1,
					'in': 1 / 2.54,
					'pt': 72 / 2.54,
					'pc': 6 / 2.54,
					'px': - 1
				},
				'in': {
					'mm': 25.4,
					'cm': 2.54,
					'in': 1,
					'pt': 72,
					'pc': 6,
					'px': - 1
				},
				'pt': {
					'mm': 25.4 / 72,
					'cm': 2.54 / 72,
					'in': 1 / 72,
					'pt': 1,
					'pc': 6 / 72,
					'px': - 1
				},
				'pc': {
					'mm': 25.4 / 6,
					'cm': 2.54 / 6,
					'in': 1 / 6,
					'pt': 72 / 6,
					'pc': 1,
					'px': - 1
				},
				'px': {
					'px': 1
				}

			};

			function parseFloatWithUnits( string ) {

				let theUnit = 'px';

				if ( typeof string === 'string' || string instanceof String ) {

					for ( let i = 0, n = units.length; i < n; i ++ ) {

						const u = units[ i ];

						if ( string.endsWith( u ) ) {

							theUnit = u;
							string = string.substring( 0, string.length - u.length );
							break;

						}

					}

				}

				let scale = undefined;

				if ( theUnit === 'px' && scope.defaultUnit !== 'px' ) {

					// Conversion scale from  pixels to inches, then to default units

					scale = unitConversion[ 'in' ][ scope.defaultUnit ] / scope.defaultDPI;

				} else {

					scale = unitConversion[ theUnit ][ scope.defaultUnit ];

					if ( scale < 0 ) {

						// Conversion scale to pixels

						scale = unitConversion[ theUnit ][ 'in' ] * scope.defaultDPI;

					}

				}

				return scale * parseFloat( string );

			}

			// Transforms

			function getNodeTransform( node ) {

				if ( ! ( node.hasAttribute( 'transform' ) || ( node.nodeName === 'use' && ( node.hasAttribute( 'x' ) || node.hasAttribute( 'y' ) ) ) ) ) {

					return null;

				}

				const transform = parseNodeTransform( node );

				if ( transformStack.length > 0 ) {

					transform.premultiply( transformStack[ transformStack.length - 1 ] );

				}

				currentTransform.copy( transform );
				transformStack.push( transform );

				return transform;

			}

			function parseNodeTransform( node ) {

				const transform = new Matrix3();
				const currentTransform = tempTransform0;

				if ( node.nodeName === 'use' && ( node.hasAttribute( 'x' ) || node.hasAttribute( 'y' ) ) ) {

					const tx = parseFloatWithUnits( node.getAttribute( 'x' ) );
					const ty = parseFloatWithUnits( node.getAttribute( 'y' ) );

					transform.translate( tx, ty );

				}

				if ( node.hasAttribute( 'transform' ) ) {

					const transformsTexts = node.getAttribute( 'transform' ).split( ')' );

					for ( let tIndex = transformsTexts.length - 1; tIndex >= 0; tIndex -- ) {

						const transformText = transformsTexts[ tIndex ].trim();

						if ( transformText === '' ) continue;

						const openParPos = transformText.indexOf( '(' );
						const closeParPos = transformText.length;

						if ( openParPos > 0 && openParPos < closeParPos ) {

							const transformType = transformText.slice( 0, openParPos );

							const array = parseFloats( transformText.slice( openParPos + 1 ) );

							currentTransform.identity();

							switch ( transformType ) {

								case 'translate':

									if ( array.length >= 1 ) {

										const tx = array[ 0 ];
										let ty = 0;

										if ( array.length >= 2 ) {

											ty = array[ 1 ];

										}

										currentTransform.translate( tx, ty );

									}

									break;

								case 'rotate':

									if ( array.length >= 1 ) {

										let angle = 0;
										let cx = 0;
										let cy = 0;

										// Angle
										angle = array[ 0 ] * Math.PI / 180;

										if ( array.length >= 3 ) {

											// Center x, y
											cx = array[ 1 ];
											cy = array[ 2 ];

										}

										// Rotate around center (cx, cy)
										tempTransform1.makeTranslation( - cx, - cy );
										tempTransform2.makeRotation( angle );
										tempTransform3.multiplyMatrices( tempTransform2, tempTransform1 );
										tempTransform1.makeTranslation( cx, cy );
										currentTransform.multiplyMatrices( tempTransform1, tempTransform3 );

									}

									break;

								case 'scale':

									if ( array.length >= 1 ) {

										const scaleX = array[ 0 ];
										let scaleY = scaleX;

										if ( array.length >= 2 ) {

											scaleY = array[ 1 ];

										}

										currentTransform.scale( scaleX, scaleY );

									}

									break;

								case 'skewX':

									if ( array.length === 1 ) {

										currentTransform.set(
											1, Math.tan( array[ 0 ] * Math.PI / 180 ), 0,
											0, 1, 0,
											0, 0, 1
										);

									}

									break;

								case 'skewY':

									if ( array.length === 1 ) {

										currentTransform.set(
											1, 0, 0,
											Math.tan( array[ 0 ] * Math.PI / 180 ), 1, 0,
											0, 0, 1
										);

									}

									break;

								case 'matrix':

									if ( array.length === 6 ) {

										currentTransform.set(
											array[ 0 ], array[ 2 ], array[ 4 ],
											array[ 1 ], array[ 3 ], array[ 5 ],
											0, 0, 1
										);

									}

									break;

							}

						}

						transform.premultiply( currentTransform );

					}

				}

				return transform;

			}

			function transformPath( path, m ) {

				function transfVec2( v2 ) {

					tempV3.set( v2.x, v2.y, 1 ).applyMatrix3( m );

					v2.set( tempV3.x, tempV3.y );

				}

				function transfEllipseGeneric( curve ) {

					// For math description see:
					// https://math.stackexchange.com/questions/4544164

					const a = curve.xRadius;
					const b = curve.yRadius;

					const cosTheta = Math.cos( curve.aRotation );
					const sinTheta = Math.sin( curve.aRotation );

					const v1 = new Vector3( a * cosTheta, a * sinTheta, 0 );
					const v2 = new Vector3( - b * sinTheta, b * cosTheta, 0 );

					const f1 = v1.applyMatrix3( m );
					const f2 = v2.applyMatrix3( m );

					const mF = tempTransform0.set(
						f1.x, f2.x, 0,
						f1.y, f2.y, 0,
						0, 0, 1,
					);

					const mFInv = tempTransform1.copy( mF ).invert();
					const mFInvT = tempTransform2.copy( mFInv ).transpose();
					const mQ = mFInvT.multiply( mFInv );
					const mQe = mQ.elements;

					const ed = eigenDecomposition( mQe[ 0 ], mQe[ 1 ], mQe[ 4 ] );
					const rt1sqrt = Math.sqrt( ed.rt1 );
					const rt2sqrt = Math.sqrt( ed.rt2 );

					curve.xRadius = 1 / rt1sqrt;
					curve.yRadius = 1 / rt2sqrt;
					curve.aRotation = Math.atan2( ed.sn, ed.cs );

					const isFullEllipse =
						( curve.aEndAngle - curve.aStartAngle ) % ( 2 * Math.PI ) < Number.EPSILON;

					// Do not touch angles of a full ellipse because after transformation they
					// would converge to a sinle value effectively removing the whole curve

					if ( ! isFullEllipse ) {

						const mDsqrt = tempTransform1.set(
							rt1sqrt, 0, 0,
							0, rt2sqrt, 0,
							0, 0, 1,
						);

						const mRT = tempTransform2.set(
							ed.cs, ed.sn, 0,
							- ed.sn, ed.cs, 0,
							0, 0, 1,
						);

						const mDRF = mDsqrt.multiply( mRT ).multiply( mF );

						const transformAngle = phi => {

							const { x: cosR, y: sinR } =
								new Vector3( Math.cos( phi ), Math.sin( phi ), 0 ).applyMatrix3( mDRF );

							return Math.atan2( sinR, cosR );

						};

						curve.aStartAngle = transformAngle( curve.aStartAngle );
						curve.aEndAngle = transformAngle( curve.aEndAngle );

						if ( isTransformFlipped( m ) ) {

							curve.aClockwise = ! curve.aClockwise;

						}

					}

				}

				function transfEllipseNoSkew( curve ) {

					// Faster shortcut if no skew is applied
					// (e.g, a euclidean transform of a group containing the ellipse)

					const sx = getTransformScaleX( m );
					const sy = getTransformScaleY( m );

					curve.xRadius *= sx;
					curve.yRadius *= sy;

					// Extract rotation angle from the matrix of form:
					//
					//  | cosθ sx   -sinθ sy |
					//  | sinθ sx    cosθ sy |
					//
					// Remembering that tanθ = sinθ / cosθ; and that
					// `sx`, `sy`, or both might be zero.
					const theta =
						sx > Number.EPSILON
							? Math.atan2( m.elements[ 1 ], m.elements[ 0 ] )
							: Math.atan2( - m.elements[ 3 ], m.elements[ 4 ] );

					curve.aRotation += theta;

					if ( isTransformFlipped( m ) ) {

						curve.aStartAngle *= - 1;
						curve.aEndAngle *= - 1;
						curve.aClockwise = ! curve.aClockwise;

					}

				}

				const subPaths = path.subPaths;

				for ( let i = 0, n = subPaths.length; i < n; i ++ ) {

					const subPath = subPaths[ i ];
					const curves = subPath.curves;

					for ( let j = 0; j < curves.length; j ++ ) {

						const curve = curves[ j ];

						if ( curve.isLineCurve ) {

							transfVec2( curve.v1 );
							transfVec2( curve.v2 );

						} else if ( curve.isCubicBezierCurve ) {

							transfVec2( curve.v0 );
							transfVec2( curve.v1 );
							transfVec2( curve.v2 );
							transfVec2( curve.v3 );

						} else if ( curve.isQuadraticBezierCurve ) {

							transfVec2( curve.v0 );
							transfVec2( curve.v1 );
							transfVec2( curve.v2 );

						} else if ( curve.isEllipseCurve ) {

							// Transform ellipse center point

							tempV2.set( curve.aX, curve.aY );
							transfVec2( tempV2 );
							curve.aX = tempV2.x;
							curve.aY = tempV2.y;

							// Transform ellipse shape parameters

							if ( isTransformSkewed( m ) ) {

								transfEllipseGeneric( curve );

							} else {

								transfEllipseNoSkew( curve );

							}

						}

					}

				}

			}

			function isTransformFlipped( m ) {

				const te = m.elements;
				return te[ 0 ] * te[ 4 ] - te[ 1 ] * te[ 3 ] < 0;

			}

			function isTransformSkewed( m ) {

				const te = m.elements;
				const basisDot = te[ 0 ] * te[ 3 ] + te[ 1 ] * te[ 4 ];

				// Shortcut for trivial rotations and transformations
				if ( basisDot === 0 ) return false;

				const sx = getTransformScaleX( m );
				const sy = getTransformScaleY( m );

				return Math.abs( basisDot / ( sx * sy ) ) > Number.EPSILON;

			}

			function getTransformScaleX( m ) {

				const te = m.elements;
				return Math.sqrt( te[ 0 ] * te[ 0 ] + te[ 1 ] * te[ 1 ] );

			}

			function getTransformScaleY( m ) {

				const te = m.elements;
				return Math.sqrt( te[ 3 ] * te[ 3 ] + te[ 4 ] * te[ 4 ] );

			}

			// Calculates the eigensystem of a real symmetric 2x2 matrix
			//    [ A  B ]
			//    [ B  C ]
			// in the form
			//    [ A  B ]  =  [ cs  -sn ] [ rt1   0  ] [  cs  sn ]
			//    [ B  C ]     [ sn   cs ] [  0   rt2 ] [ -sn  cs ]
			// where rt1 >= rt2.
			//
			// Adapted from: https://www.mpi-hd.mpg.de/personalhomes/globes/3x3/index.html
			// -> Algorithms for real symmetric matrices -> Analytical (2x2 symmetric)
			function eigenDecomposition( A, B, C ) {

				let rt1, rt2, cs, sn, t;
				const sm = A + C;
				const df = A - C;
				const rt = Math.sqrt( df * df + 4 * B * B );

				if ( sm > 0 ) {

					rt1 = 0.5 * ( sm + rt );
					t = 1 / rt1;
					rt2 = A * t * C - B * t * B;

				} else if ( sm < 0 ) {

					rt2 = 0.5 * ( sm - rt );

				} else {

					// This case needs to be treated separately to avoid div by 0

					rt1 = 0.5 * rt;
					rt2 = - 0.5 * rt;

				}

				// Calculate eigenvectors

				if ( df > 0 ) {

					cs = df + rt;

				} else {

					cs = df - rt;

				}

				if ( Math.abs( cs ) > 2 * Math.abs( B ) ) {

					t = - 2 * B / cs;
					sn = 1 / Math.sqrt( 1 + t * t );
					cs = t * sn;

				} else if ( Math.abs( B ) === 0 ) {

					cs = 1;
					sn = 0;

				} else {

					t = - 0.5 * cs / B;
					cs = 1 / Math.sqrt( 1 + t * t );
					sn = t * cs;

				}

				if ( df > 0 ) {

					t = cs;
					cs = - sn;
					sn = t;

				}

				return { rt1, rt2, cs, sn };

			}

			//

			const paths = [];
			const stylesheets = {};

			const transformStack = [];

			const tempTransform0 = new Matrix3();
			const tempTransform1 = new Matrix3();
			const tempTransform2 = new Matrix3();
			const tempTransform3 = new Matrix3();
			const tempV2 = new Vector2();
			const tempV3 = new Vector3();

			const currentTransform = new Matrix3();

			const xml = new DOMParser().parseFromString( text, 'image/svg+xml' ); // application/xml

			parseNode( xml.documentElement, {
				fill: '#000',
				fillOpacity: 1,
				strokeOpacity: 1,
				strokeWidth: 1,
				strokeLineJoin: 'miter',
				strokeLineCap: 'butt',
				strokeMiterLimit: 4
			} );

			const data = { paths: paths, xml: xml.documentElement };

			// console.log( paths );
			return data;

		}

		static createShapes( shapePath ) {

			// Param shapePath: a shapepath as returned by the parse function of this class
			// Returns Shape object

			const BIGNUMBER = 999999999;

			const IntersectionLocationType = {
				ORIGIN: 0,
				DESTINATION: 1,
				BETWEEN: 2,
				LEFT: 3,
				RIGHT: 4,
				BEHIND: 5,
				BEYOND: 6
			};

			const classifyResult = {
				loc: IntersectionLocationType.ORIGIN,
				t: 0
			};

			function findEdgeIntersection( a0, a1, b0, b1 ) {

				const x1 = a0.x;
				const x2 = a1.x;
				const x3 = b0.x;
				const x4 = b1.x;
				const y1 = a0.y;
				const y2 = a1.y;
				const y3 = b0.y;
				const y4 = b1.y;
				const nom1 = ( x4 - x3 ) * ( y1 - y3 ) - ( y4 - y3 ) * ( x1 - x3 );
				const nom2 = ( x2 - x1 ) * ( y1 - y3 ) - ( y2 - y1 ) * ( x1 - x3 );
				const denom = ( y4 - y3 ) * ( x2 - x1 ) - ( x4 - x3 ) * ( y2 - y1 );
				const t1 = nom1 / denom;
				const t2 = nom2 / denom;

				if ( ( ( denom === 0 ) && ( nom1 !== 0 ) ) || ( t1 <= 0 ) || ( t1 >= 1 ) || ( t2 < 0 ) || ( t2 > 1 ) ) {

					//1. lines are parallel or edges don't intersect

					return null;

				} else if ( ( nom1 === 0 ) && ( denom === 0 ) ) {

					//2. lines are colinear

					//check if endpoints of edge2 (b0-b1) lies on edge1 (a0-a1)
					for ( let i = 0; i < 2; i ++ ) {

						classifyPoint( i === 0 ? b0 : b1, a0, a1 );
						//find position of this endpoints relatively to edge1
						if ( classifyResult.loc == IntersectionLocationType.ORIGIN ) {

							const point = ( i === 0 ? b0 : b1 );
							return { x: point.x, y: point.y, t: classifyResult.t };

						} else if ( classifyResult.loc == IntersectionLocationType.BETWEEN ) {

							const x = + ( ( x1 + classifyResult.t * ( x2 - x1 ) ).toPrecision( 10 ) );
							const y = + ( ( y1 + classifyResult.t * ( y2 - y1 ) ).toPrecision( 10 ) );
							return { x: x, y: y, t: classifyResult.t, };

						}

					}

					return null;

				} else {

					//3. edges intersect

					for ( let i = 0; i < 2; i ++ ) {

						classifyPoint( i === 0 ? b0 : b1, a0, a1 );

						if ( classifyResult.loc == IntersectionLocationType.ORIGIN ) {

							const point = ( i === 0 ? b0 : b1 );
							return { x: point.x, y: point.y, t: classifyResult.t };

						}

					}

					const x = + ( ( x1 + t1 * ( x2 - x1 ) ).toPrecision( 10 ) );
					const y = + ( ( y1 + t1 * ( y2 - y1 ) ).toPrecision( 10 ) );
					return { x: x, y: y, t: t1 };

				}

			}

			function classifyPoint( p, edgeStart, edgeEnd ) {

				const ax = edgeEnd.x - edgeStart.x;
				const ay = edgeEnd.y - edgeStart.y;
				const bx = p.x - edgeStart.x;
				const by = p.y - edgeStart.y;
				const sa = ax * by - bx * ay;

				if ( ( p.x === edgeStart.x ) && ( p.y === edgeStart.y ) ) {

					classifyResult.loc = IntersectionLocationType.ORIGIN;
					classifyResult.t = 0;
					return;

				}

				if ( ( p.x === edgeEnd.x ) && ( p.y === edgeEnd.y ) ) {

					classifyResult.loc = IntersectionLocationType.DESTINATION;
					classifyResult.t = 1;
					return;

				}

				if ( sa < - Number.EPSILON ) {

					classifyResult.loc = IntersectionLocationType.LEFT;
					return;

				}

				if ( sa > Number.EPSILON ) {

					classifyResult.loc = IntersectionLocationType.RIGHT;
					return;


				}

				if ( ( ( ax * bx ) < 0 ) || ( ( ay * by ) < 0 ) ) {

					classifyResult.loc = IntersectionLocationType.BEHIND;
					return;

				}

				if ( ( Math.sqrt( ax * ax + ay * ay ) ) < ( Math.sqrt( bx * bx + by * by ) ) ) {

					classifyResult.loc = IntersectionLocationType.BEYOND;
					return;

				}

				let t;

				if ( ax !== 0 ) {

					t = bx / ax;

				} else {

					t = by / ay;

				}

				classifyResult.loc = IntersectionLocationType.BETWEEN;
				classifyResult.t = t;

			}

			function getIntersections( path1, path2 ) {

				const intersectionsRaw = [];
				const intersections = [];

				for ( let index = 1; index < path1.length; index ++ ) {

					const path1EdgeStart = path1[ index - 1 ];
					const path1EdgeEnd = path1[ index ];

					for ( let index2 = 1; index2 < path2.length; index2 ++ ) {

						const path2EdgeStart = path2[ index2 - 1 ];
						const path2EdgeEnd = path2[ index2 ];

						const intersection = findEdgeIntersection( path1EdgeStart, path1EdgeEnd, path2EdgeStart, path2EdgeEnd );

						if ( intersection !== null && intersectionsRaw.find( i => i.t <= intersection.t + Number.EPSILON && i.t >= intersection.t - Number.EPSILON ) === undefined ) {

							intersectionsRaw.push( intersection );
							intersections.push( new Vector2( intersection.x, intersection.y ) );

						}

					}

				}

				return intersections;

			}

			function getScanlineIntersections( scanline, boundingBox, paths ) {

				const center = new Vector2();
				boundingBox.getCenter( center );

				const allIntersections = [];

				paths.forEach( path => {

					// check if the center of the bounding box is in the bounding box of the paths.
					// this is a pruning method to limit the search of intersections in paths that can't envelop of the current path.
					// if a path envelops another path. The center of that oter path, has to be inside the bounding box of the enveloping path.
					if ( path.boundingBox.containsPoint( center ) ) {

						const intersections = getIntersections( scanline, path.points );

						intersections.forEach( p => {

							allIntersections.push( { identifier: path.identifier, isCW: path.isCW, point: p } );

						} );

					}

				} );

				allIntersections.sort( ( i1, i2 ) => {

					return i1.point.x - i2.point.x;

				} );

				return allIntersections;

			}

			function isHoleTo( simplePath, allPaths, scanlineMinX, scanlineMaxX, _fillRule ) {

				if ( _fillRule === null || _fillRule === undefined || _fillRule === '' ) {

					_fillRule = 'nonzero';

				}

				const centerBoundingBox = new Vector2();
				simplePath.boundingBox.getCenter( centerBoundingBox );

				const scanline = [ new Vector2( scanlineMinX, centerBoundingBox.y ), new Vector2( scanlineMaxX, centerBoundingBox.y ) ];

				const scanlineIntersections = getScanlineIntersections( scanline, simplePath.boundingBox, allPaths );

				scanlineIntersections.sort( ( i1, i2 ) => {

					return i1.point.x - i2.point.x;

				} );

				const baseIntersections = [];
				const otherIntersections = [];

				scanlineIntersections.forEach( i => {

					if ( i.identifier === simplePath.identifier ) {

						baseIntersections.push( i );

					} else {

						otherIntersections.push( i );

					}

				} );

				const firstXOfPath = baseIntersections[ 0 ].point.x;

				// build up the path hierarchy
				const stack = [];
				let i = 0;

				while ( i < otherIntersections.length && otherIntersections[ i ].point.x < firstXOfPath ) {

					if ( stack.length > 0 && stack[ stack.length - 1 ] === otherIntersections[ i ].identifier ) {

						stack.pop();

					} else {

						stack.push( otherIntersections[ i ].identifier );

					}

					i ++;

				}

				stack.push( simplePath.identifier );

				if ( _fillRule === 'evenodd' ) {

					const isHole = stack.length % 2 === 0 ? true : false;
					const isHoleFor = stack[ stack.length - 2 ];

					return { identifier: simplePath.identifier, isHole: isHole, for: isHoleFor };

				} else if ( _fillRule === 'nonzero' ) {

					// check if path is a hole by counting the amount of paths with alternating rotations it has to cross.
					let isHole = true;
					let isHoleFor = null;
					let lastCWValue = null;

					for ( let i = 0; i < stack.length; i ++ ) {

						const identifier = stack[ i ];
						if ( isHole ) {

							lastCWValue = allPaths[ identifier ].isCW;
							isHole = false;
							isHoleFor = identifier;

						} else if ( lastCWValue !== allPaths[ identifier ].isCW ) {

							lastCWValue = allPaths[ identifier ].isCW;
							isHole = true;

						}

					}

					return { identifier: simplePath.identifier, isHole: isHole, for: isHoleFor };

				} else {

					console.warn( 'fill-rule: "' + _fillRule + '" is currently not implemented.' );

				}

			}

			// check for self intersecting paths
			// TODO

			// check intersecting paths
			// TODO

			// prepare paths for hole detection
			let scanlineMinX = BIGNUMBER;
			let scanlineMaxX = - BIGNUMBER;

			let simplePaths = shapePath.subPaths.map( p => {

				const points = p.getPoints();
				let maxY = - BIGNUMBER;
				let minY = BIGNUMBER;
				let maxX = - BIGNUMBER;
				let minX = BIGNUMBER;

		      	//points.forEach(p => p.y *= -1);

				for ( let i = 0; i < points.length; i ++ ) {

					const p = points[ i ];

					if ( p.y > maxY ) {

						maxY = p.y;

					}

					if ( p.y < minY ) {

						minY = p.y;

					}

					if ( p.x > maxX ) {

						maxX = p.x;

					}

					if ( p.x < minX ) {

						minX = p.x;

					}

				}

				//
				if ( scanlineMaxX <= maxX ) {

					scanlineMaxX = maxX + 1;

				}

				if ( scanlineMinX >= minX ) {

					scanlineMinX = minX - 1;

				}

				return { curves: p.curves, points: points, isCW: ShapeUtils.isClockWise( points ), identifier: - 1, boundingBox: new Box2( new Vector2( minX, minY ), new Vector2( maxX, maxY ) ) };

			} );

			simplePaths = simplePaths.filter( sp => sp.points.length > 1 );

			for ( let identifier = 0; identifier < simplePaths.length; identifier ++ ) {

				simplePaths[ identifier ].identifier = identifier;

			}

			// check if path is solid or a hole
			const isAHole = simplePaths.map( p => isHoleTo( p, simplePaths, scanlineMinX, scanlineMaxX, ( shapePath.userData ? shapePath.userData.style.fillRule : undefined ) ) );


			const shapesToReturn = [];
			simplePaths.forEach( p => {

				const amIAHole = isAHole[ p.identifier ];

				if ( ! amIAHole.isHole ) {

					const shape = new Shape();
					shape.curves = p.curves;
					const holes = isAHole.filter( h => h.isHole && h.for === p.identifier );
					holes.forEach( h => {

						const hole = simplePaths[ h.identifier ];
						const path = new Path();
						path.curves = hole.curves;
						shape.holes.push( path );

					} );
					shapesToReturn.push( shape );

				}

			} );

			return shapesToReturn;

		}

		static getStrokeStyle( width, color, lineJoin, lineCap, miterLimit ) {

			// Param width: Stroke width
			// Param color: As returned by THREE.Color.getStyle()
			// Param lineJoin: One of "round", "bevel", "miter" or "miter-limit"
			// Param lineCap: One of "round", "square" or "butt"
			// Param miterLimit: Maximum join length, in multiples of the "width" parameter (join is truncated if it exceeds that distance)
			// Returns style object

			width = width !== undefined ? width : 1;
			color = color !== undefined ? color : '#000';
			lineJoin = lineJoin !== undefined ? lineJoin : 'miter';
			lineCap = lineCap !== undefined ? lineCap : 'butt';
			miterLimit = miterLimit !== undefined ? miterLimit : 4;

			return {
				strokeColor: color,
				strokeWidth: width,
				strokeLineJoin: lineJoin,
				strokeLineCap: lineCap,
				strokeMiterLimit: miterLimit
			};

		}

		static pointsToStroke( points, style, arcDivisions, minDistance ) {

			// Generates a stroke with some width around the given path.
			// The path can be open or closed (last point equals to first point)
			// Param points: Array of Vector2D (the path). Minimum 2 points.
			// Param style: Object with SVG properties as returned by SVGLoader.getStrokeStyle(), or SVGLoader.parse() in the path.userData.style object
			// Params arcDivisions: Arc divisions for round joins and endcaps. (Optional)
			// Param minDistance: Points closer to this distance will be merged. (Optional)
			// Returns BufferGeometry with stroke triangles (In plane z = 0). UV coordinates are generated ('u' along path. 'v' across it, from left to right)

			const vertices = [];
			const normals = [];
			const uvs = [];

			if ( SVGLoader.pointsToStrokeWithBuffers( points, style, arcDivisions, minDistance, vertices, normals, uvs ) === 0 ) {

				return null;

			}

			const geometry = new BufferGeometry();
			geometry.setAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) );
			geometry.setAttribute( 'normal', new Float32BufferAttribute( normals, 3 ) );
			geometry.setAttribute( 'uv', new Float32BufferAttribute( uvs, 2 ) );

			return geometry;

		}

		static pointsToStrokeWithBuffers( points, style, arcDivisions, minDistance, vertices, normals, uvs, vertexOffset ) {

			// This function can be called to update existing arrays or buffers.
			// Accepts same parameters as pointsToStroke, plus the buffers and optional offset.
			// Param vertexOffset: Offset vertices to start writing in the buffers (3 elements/vertex for vertices and normals, and 2 elements/vertex for uvs)
			// Returns number of written vertices / normals / uvs pairs
			// if 'vertices' parameter is undefined no triangles will be generated, but the returned vertices count will still be valid (useful to preallocate the buffers)
			// 'normals' and 'uvs' buffers are optional

			const tempV2_1 = new Vector2();
			const tempV2_2 = new Vector2();
			const tempV2_3 = new Vector2();
			const tempV2_4 = new Vector2();
			const tempV2_5 = new Vector2();
			const tempV2_6 = new Vector2();
			const tempV2_7 = new Vector2();
			const lastPointL = new Vector2();
			const lastPointR = new Vector2();
			const point0L = new Vector2();
			const point0R = new Vector2();
			const currentPointL = new Vector2();
			const currentPointR = new Vector2();
			const nextPointL = new Vector2();
			const nextPointR = new Vector2();
			const innerPoint = new Vector2();
			const outerPoint = new Vector2();

			arcDivisions = arcDivisions !== undefined ? arcDivisions : 12;
			minDistance = minDistance !== undefined ? minDistance : 0.001;
			vertexOffset = vertexOffset !== undefined ? vertexOffset : 0;

			// First ensure there are no duplicated points
			points = removeDuplicatedPoints( points );

			const numPoints = points.length;

			if ( numPoints < 2 ) return 0;

			const isClosed = points[ 0 ].equals( points[ numPoints - 1 ] );

			let currentPoint;
			let previousPoint = points[ 0 ];
			let nextPoint;

			const strokeWidth2 = style.strokeWidth / 2;

			const deltaU = 1 / ( numPoints - 1 );
			let u0 = 0, u1;

			let innerSideModified;
			let joinIsOnLeftSide;
			let isMiter;
			let initialJoinIsOnLeftSide = false;

			let numVertices = 0;
			let currentCoordinate = vertexOffset * 3;
			let currentCoordinateUV = vertexOffset * 2;

			// Get initial left and right stroke points
			getNormal( points[ 0 ], points[ 1 ], tempV2_1 ).multiplyScalar( strokeWidth2 );
			lastPointL.copy( points[ 0 ] ).sub( tempV2_1 );
			lastPointR.copy( points[ 0 ] ).add( tempV2_1 );
			point0L.copy( lastPointL );
			point0R.copy( lastPointR );

			for ( let iPoint = 1; iPoint < numPoints; iPoint ++ ) {

				currentPoint = points[ iPoint ];

				// Get next point
				if ( iPoint === numPoints - 1 ) {

					if ( isClosed ) {

						// Skip duplicated initial point
						nextPoint = points[ 1 ];

					} else nextPoint = undefined;

				} else {

					nextPoint = points[ iPoint + 1 ];

				}

				// Normal of previous segment in tempV2_1
				const normal1 = tempV2_1;
				getNormal( previousPoint, currentPoint, normal1 );

				tempV2_3.copy( normal1 ).multiplyScalar( strokeWidth2 );
				currentPointL.copy( currentPoint ).sub( tempV2_3 );
				currentPointR.copy( currentPoint ).add( tempV2_3 );

				u1 = u0 + deltaU;

				innerSideModified = false;

				if ( nextPoint !== undefined ) {

					// Normal of next segment in tempV2_2
					getNormal( currentPoint, nextPoint, tempV2_2 );

					tempV2_3.copy( tempV2_2 ).multiplyScalar( strokeWidth2 );
					nextPointL.copy( currentPoint ).sub( tempV2_3 );
					nextPointR.copy( currentPoint ).add( tempV2_3 );

					joinIsOnLeftSide = true;
					tempV2_3.subVectors( nextPoint, previousPoint );
					if ( normal1.dot( tempV2_3 ) < 0 ) {

						joinIsOnLeftSide = false;

					}

					if ( iPoint === 1 ) initialJoinIsOnLeftSide = joinIsOnLeftSide;

					tempV2_3.subVectors( nextPoint, currentPoint );
					tempV2_3.normalize();
					const dot = Math.abs( normal1.dot( tempV2_3 ) );

					// If path is straight, don't create join
					if ( dot > Number.EPSILON ) {

						// Compute inner and outer segment intersections
						const miterSide = strokeWidth2 / dot;
						tempV2_3.multiplyScalar( - miterSide );
						tempV2_4.subVectors( currentPoint, previousPoint );
						tempV2_5.copy( tempV2_4 ).setLength( miterSide ).add( tempV2_3 );
						innerPoint.copy( tempV2_5 ).negate();
						const miterLength2 = tempV2_5.length();
						const segmentLengthPrev = tempV2_4.length();
						tempV2_4.divideScalar( segmentLengthPrev );
						tempV2_6.subVectors( nextPoint, currentPoint );
						const segmentLengthNext = tempV2_6.length();
						tempV2_6.divideScalar( segmentLengthNext );
						// Check that previous and next segments doesn't overlap with the innerPoint of intersection
						if ( tempV2_4.dot( innerPoint ) < segmentLengthPrev && tempV2_6.dot( innerPoint ) < segmentLengthNext ) {

							innerSideModified = true;

						}

						outerPoint.copy( tempV2_5 ).add( currentPoint );
						innerPoint.add( currentPoint );

						isMiter = false;

						if ( innerSideModified ) {

							if ( joinIsOnLeftSide ) {

								nextPointR.copy( innerPoint );
								currentPointR.copy( innerPoint );

							} else {

								nextPointL.copy( innerPoint );
								currentPointL.copy( innerPoint );

							}

						} else {

							// The segment triangles are generated here if there was overlapping

							makeSegmentTriangles();

						}

						switch ( style.strokeLineJoin ) {

							case 'bevel':

								makeSegmentWithBevelJoin( joinIsOnLeftSide, innerSideModified, u1 );

								break;

							case 'round':

								// Segment triangles

								createSegmentTrianglesWithMiddleSection( joinIsOnLeftSide, innerSideModified );

								// Join triangles

								if ( joinIsOnLeftSide ) {

									makeCircularSector( currentPoint, currentPointL, nextPointL, u1, 0 );

								} else {

									makeCircularSector( currentPoint, nextPointR, currentPointR, u1, 1 );

								}

								break;

							case 'miter':
							case 'miter-clip':
							default:

								const miterFraction = ( strokeWidth2 * style.strokeMiterLimit ) / miterLength2;

								if ( miterFraction < 1 ) {

									// The join miter length exceeds the miter limit

									if ( style.strokeLineJoin !== 'miter-clip' ) {

										makeSegmentWithBevelJoin( joinIsOnLeftSide, innerSideModified, u1 );
										break;

									} else {

										// Segment triangles

										createSegmentTrianglesWithMiddleSection( joinIsOnLeftSide, innerSideModified );

										// Miter-clip join triangles

										if ( joinIsOnLeftSide ) {

											tempV2_6.subVectors( outerPoint, currentPointL ).multiplyScalar( miterFraction ).add( currentPointL );
											tempV2_7.subVectors( outerPoint, nextPointL ).multiplyScalar( miterFraction ).add( nextPointL );

											addVertex( currentPointL, u1, 0 );
											addVertex( tempV2_6, u1, 0 );
											addVertex( currentPoint, u1, 0.5 );

											addVertex( currentPoint, u1, 0.5 );
											addVertex( tempV2_6, u1, 0 );
											addVertex( tempV2_7, u1, 0 );

											addVertex( currentPoint, u1, 0.5 );
											addVertex( tempV2_7, u1, 0 );
											addVertex( nextPointL, u1, 0 );

										} else {

											tempV2_6.subVectors( outerPoint, currentPointR ).multiplyScalar( miterFraction ).add( currentPointR );
											tempV2_7.subVectors( outerPoint, nextPointR ).multiplyScalar( miterFraction ).add( nextPointR );

											addVertex( currentPointR, u1, 1 );
											addVertex( tempV2_6, u1, 1 );
											addVertex( currentPoint, u1, 0.5 );

											addVertex( currentPoint, u1, 0.5 );
											addVertex( tempV2_6, u1, 1 );
											addVertex( tempV2_7, u1, 1 );

											addVertex( currentPoint, u1, 0.5 );
											addVertex( tempV2_7, u1, 1 );
											addVertex( nextPointR, u1, 1 );

										}

									}

								} else {

									// Miter join segment triangles

									if ( innerSideModified ) {

										// Optimized segment + join triangles

										if ( joinIsOnLeftSide ) {

											addVertex( lastPointR, u0, 1 );
											addVertex( lastPointL, u0, 0 );
											addVertex( outerPoint, u1, 0 );

											addVertex( lastPointR, u0, 1 );
											addVertex( outerPoint, u1, 0 );
											addVertex( innerPoint, u1, 1 );

										} else {

											addVertex( lastPointR, u0, 1 );
											addVertex( lastPointL, u0, 0 );
											addVertex( outerPoint, u1, 1 );

											addVertex( lastPointL, u0, 0 );
											addVertex( innerPoint, u1, 0 );
											addVertex( outerPoint, u1, 1 );

										}


										if ( joinIsOnLeftSide ) {

											nextPointL.copy( outerPoint );

										} else {

											nextPointR.copy( outerPoint );

										}


									} else {

										// Add extra miter join triangles

										if ( joinIsOnLeftSide ) {

											addVertex( currentPointL, u1, 0 );
											addVertex( outerPoint, u1, 0 );
											addVertex( currentPoint, u1, 0.5 );

											addVertex( currentPoint, u1, 0.5 );
											addVertex( outerPoint, u1, 0 );
											addVertex( nextPointL, u1, 0 );

										} else {

											addVertex( currentPointR, u1, 1 );
											addVertex( outerPoint, u1, 1 );
											addVertex( currentPoint, u1, 0.5 );

											addVertex( currentPoint, u1, 0.5 );
											addVertex( outerPoint, u1, 1 );
											addVertex( nextPointR, u1, 1 );

										}

									}

									isMiter = true;

								}

								break;

						}

					} else {

						// The segment triangles are generated here when two consecutive points are collinear

						makeSegmentTriangles();

					}

				} else {

					// The segment triangles are generated here if it is the ending segment

					makeSegmentTriangles();

				}

				if ( ! isClosed && iPoint === numPoints - 1 ) {

					// Start line endcap
					addCapGeometry( points[ 0 ], point0L, point0R, joinIsOnLeftSide, true, u0 );

				}

				// Increment loop variables

				u0 = u1;

				previousPoint = currentPoint;

				lastPointL.copy( nextPointL );
				lastPointR.copy( nextPointR );

			}

			if ( ! isClosed ) {

				// Ending line endcap
				addCapGeometry( currentPoint, currentPointL, currentPointR, joinIsOnLeftSide, false, u1 );

			} else if ( innerSideModified && vertices ) {

				// Modify path first segment vertices to adjust to the segments inner and outer intersections

				let lastOuter = outerPoint;
				let lastInner = innerPoint;

				if ( initialJoinIsOnLeftSide !== joinIsOnLeftSide ) {

					lastOuter = innerPoint;
					lastInner = outerPoint;

				}

				if ( joinIsOnLeftSide ) {

					if ( isMiter || initialJoinIsOnLeftSide ) {

						lastInner.toArray( vertices, 0 * 3 );
						lastInner.toArray( vertices, 3 * 3 );

						if ( isMiter ) {

							lastOuter.toArray( vertices, 1 * 3 );

						}

					}

				} else {

					if ( isMiter || ! initialJoinIsOnLeftSide ) {

						lastInner.toArray( vertices, 1 * 3 );
						lastInner.toArray( vertices, 3 * 3 );

						if ( isMiter ) {

							lastOuter.toArray( vertices, 0 * 3 );

						}

					}

				}

			}

			return numVertices;

			// -- End of algorithm

			// -- Functions

			function getNormal( p1, p2, result ) {

				result.subVectors( p2, p1 );
				return result.set( - result.y, result.x ).normalize();

			}

			function addVertex( position, u, v ) {

				if ( vertices ) {

					vertices[ currentCoordinate ] = position.x;
					vertices[ currentCoordinate + 1 ] = position.y;
					vertices[ currentCoordinate + 2 ] = 0;

					if ( normals ) {

						normals[ currentCoordinate ] = 0;
						normals[ currentCoordinate + 1 ] = 0;
						normals[ currentCoordinate + 2 ] = 1;

					}

					currentCoordinate += 3;

					if ( uvs ) {

						uvs[ currentCoordinateUV ] = u;
						uvs[ currentCoordinateUV + 1 ] = v;

						currentCoordinateUV += 2;

					}

				}

				numVertices += 3;

			}

			function makeCircularSector( center, p1, p2, u, v ) {

				// param p1, p2: Points in the circle arc.
				// p1 and p2 are in clockwise direction.

				tempV2_1.copy( p1 ).sub( center ).normalize();
				tempV2_2.copy( p2 ).sub( center ).normalize();

				let angle = Math.PI;
				const dot = tempV2_1.dot( tempV2_2 );
				if ( Math.abs( dot ) < 1 ) angle = Math.abs( Math.acos( dot ) );

				angle /= arcDivisions;

				tempV2_3.copy( p1 );

				for ( let i = 0, il = arcDivisions - 1; i < il; i ++ ) {

					tempV2_4.copy( tempV2_3 ).rotateAround( center, angle );

					addVertex( tempV2_3, u, v );
					addVertex( tempV2_4, u, v );
					addVertex( center, u, 0.5 );

					tempV2_3.copy( tempV2_4 );

				}

				addVertex( tempV2_4, u, v );
				addVertex( p2, u, v );
				addVertex( center, u, 0.5 );

			}

			function makeSegmentTriangles() {

				addVertex( lastPointR, u0, 1 );
				addVertex( lastPointL, u0, 0 );
				addVertex( currentPointL, u1, 0 );

				addVertex( lastPointR, u0, 1 );
				addVertex( currentPointL, u1, 1 );
				addVertex( currentPointR, u1, 0 );

			}

			function makeSegmentWithBevelJoin( joinIsOnLeftSide, innerSideModified, u ) {

				if ( innerSideModified ) {

					// Optimized segment + bevel triangles

					if ( joinIsOnLeftSide ) {

						// Path segments triangles

						addVertex( lastPointR, u0, 1 );
						addVertex( lastPointL, u0, 0 );
						addVertex( currentPointL, u1, 0 );

						addVertex( lastPointR, u0, 1 );
						addVertex( currentPointL, u1, 0 );
						addVertex( innerPoint, u1, 1 );

						// Bevel join triangle

						addVertex( currentPointL, u, 0 );
						addVertex( nextPointL, u, 0 );
						addVertex( innerPoint, u, 0.5 );

					} else {

						// Path segments triangles

						addVertex( lastPointR, u0, 1 );
						addVertex( lastPointL, u0, 0 );
						addVertex( currentPointR, u1, 1 );

						addVertex( lastPointL, u0, 0 );
						addVertex( innerPoint, u1, 0 );
						addVertex( currentPointR, u1, 1 );

						// Bevel join triangle

						addVertex( currentPointR, u, 1 );
						addVertex( nextPointR, u, 0 );
						addVertex( innerPoint, u, 0.5 );

					}

				} else {

					// Bevel join triangle. The segment triangles are done in the main loop

					if ( joinIsOnLeftSide ) {

						addVertex( currentPointL, u, 0 );
						addVertex( nextPointL, u, 0 );
						addVertex( currentPoint, u, 0.5 );

					} else {

						addVertex( currentPointR, u, 1 );
						addVertex( nextPointR, u, 0 );
						addVertex( currentPoint, u, 0.5 );

					}

				}

			}

			function createSegmentTrianglesWithMiddleSection( joinIsOnLeftSide, innerSideModified ) {

				if ( innerSideModified ) {

					if ( joinIsOnLeftSide ) {

						addVertex( lastPointR, u0, 1 );
						addVertex( lastPointL, u0, 0 );
						addVertex( currentPointL, u1, 0 );

						addVertex( lastPointR, u0, 1 );
						addVertex( currentPointL, u1, 0 );
						addVertex( innerPoint, u1, 1 );

						addVertex( currentPointL, u0, 0 );
						addVertex( currentPoint, u1, 0.5 );
						addVertex( innerPoint, u1, 1 );

						addVertex( currentPoint, u1, 0.5 );
						addVertex( nextPointL, u0, 0 );
						addVertex( innerPoint, u1, 1 );

					} else {

						addVertex( lastPointR, u0, 1 );
						addVertex( lastPointL, u0, 0 );
						addVertex( currentPointR, u1, 1 );

						addVertex( lastPointL, u0, 0 );
						addVertex( innerPoint, u1, 0 );
						addVertex( currentPointR, u1, 1 );

						addVertex( currentPointR, u0, 1 );
						addVertex( innerPoint, u1, 0 );
						addVertex( currentPoint, u1, 0.5 );

						addVertex( currentPoint, u1, 0.5 );
						addVertex( innerPoint, u1, 0 );
						addVertex( nextPointR, u0, 1 );

					}

				}

			}

			function addCapGeometry( center, p1, p2, joinIsOnLeftSide, start, u ) {

				// param center: End point of the path
				// param p1, p2: Left and right cap points

				switch ( style.strokeLineCap ) {

					case 'round':

						if ( start ) {

							makeCircularSector( center, p2, p1, u, 0.5 );

						} else {

							makeCircularSector( center, p1, p2, u, 0.5 );

						}

						break;

					case 'square':

						if ( start ) {

							tempV2_1.subVectors( p1, center );
							tempV2_2.set( tempV2_1.y, - tempV2_1.x );

							tempV2_3.addVectors( tempV2_1, tempV2_2 ).add( center );
							tempV2_4.subVectors( tempV2_2, tempV2_1 ).add( center );

							// Modify already existing vertices
							if ( joinIsOnLeftSide ) {

								tempV2_3.toArray( vertices, 1 * 3 );
								tempV2_4.toArray( vertices, 0 * 3 );
								tempV2_4.toArray( vertices, 3 * 3 );

							} else {

								tempV2_3.toArray( vertices, 1 * 3 );
								tempV2_3.toArray( vertices, 3 * 3 );
								tempV2_4.toArray( vertices, 0 * 3 );

							}

						} else {

							tempV2_1.subVectors( p2, center );
							tempV2_2.set( tempV2_1.y, - tempV2_1.x );

							tempV2_3.addVectors( tempV2_1, tempV2_2 ).add( center );
							tempV2_4.subVectors( tempV2_2, tempV2_1 ).add( center );

							const vl = vertices.length;

							// Modify already existing vertices
							if ( joinIsOnLeftSide ) {

								tempV2_3.toArray( vertices, vl - 1 * 3 );
								tempV2_4.toArray( vertices, vl - 2 * 3 );
								tempV2_4.toArray( vertices, vl - 4 * 3 );

							} else {

								tempV2_3.toArray( vertices, vl - 2 * 3 );
								tempV2_4.toArray( vertices, vl - 1 * 3 );
								tempV2_4.toArray( vertices, vl - 4 * 3 );

							}

						}

						break;

				}

			}

			function removeDuplicatedPoints( points ) {

				// Creates a new array if necessary with duplicated points removed.
				// This does not remove duplicated initial and ending points of a closed path.

				let dupPoints = false;
				for ( let i = 1, n = points.length - 1; i < n; i ++ ) {

					if ( points[ i ].distanceTo( points[ i + 1 ] ) < minDistance ) {

						dupPoints = true;
						break;

					}

				}

				if ( ! dupPoints ) return points;

				const newPoints = [];
				newPoints.push( points[ 0 ] );

				for ( let i = 1, n = points.length - 1; i < n; i ++ ) {

					if ( points[ i ].distanceTo( points[ i + 1 ] ) >= minDistance ) {

						newPoints.push( points[ i ] );

					}

				}

				newPoints.push( points[ points.length - 1 ] );

				return newPoints;

			}

		}


	}

	class Particle {
	  constructor(options) {
	    this.options = Object.assign(this.getDefaultOptions(), options);
	    this.initLayout();
	  }

	  /**
	   * 初始化布局
	   */
	  initLayout() {
	    this.container = document.createElement("div");
	    this.canvas = document.createElement("canvas");
	    this.container.appendChild(this.canvas);
	    this.canvas.width = this.options.width;
	    this.canvas.height = this.options.height;
	  }

	  /**
	   * 添加到容器
	   * @param {*} parent 
	   */
	  async addTo(parent) {
	    if (typeof parent == "string") {
	      parent = document.querySelector(`#${parent}`);
	    }
	    parent.appendChild(this.container);
	    await this.initZr();
	    await this.start();
	  }

	  /**
	   * 初始化zrender并添加粒子
	   */
	  async initZr() {
	    let zr = this.zr = zrender.init(this.canvas);
	    let svg = await this.svg2Vector(this.options.svgUrl, this.options.lerpSpace);
	    let shps = svg.shps;
	    let svgWidth = svg.width;
	    let svgHeight = svg.height;
	    this.matrix = zrender.matrix.scale(zrender.matrix.create(), zrender.matrix.create(), [this.options.width / svgWidth, this.options.height / svgHeight]);
	    this.vectors = [];
	    let count = 0;
	    let lineGroup = this.lineGroup = new zrender.Group();
	    zr.add(lineGroup);
	    for (let i = 0; i < shps.length; i++) {
	      let shp = shps[i];
	      let points = [];
	      for (let j = shp.vectors.length - 1; j >= 0; j--) {
	        let v = shp.vectors[j];
	        v = this.project(v);
	        points.push([v[0], v[1]]);
	      }
	      let polyline = new zrender.Polyline({
	        shape: {
	          points: points,
	          smooth: 1
	        },
	        style: {
	          stroke: this.options.lineColor
	        }
	      });
	      lineGroup.add(polyline);
	      count += shp.vectors.length;
	      this.vectors = this.vectors.concat(shp.vectors);
	    }
	    this.count = count;
	    let group = this.group = new zrender.Group();
	    zr.add(group);
	    for (let i = 0, len = this.options.particleCount; i < len; i++) {
	      let circle = new zrender.Circle({
	        shape: {
	          cx: 0,
	          cy: 0,
	          r: 0
	        },
	        style: {
	          fill: this.options.particleColor,
	          shadowColor: this.options.particleShadowColor,
	          shadowBlur: this.options.shadowBlur
	          // blend: "overlay"
	        },

	        z: len - i
	      });
	      group.add(circle);
	    }
	  }

	  /**
	   * 坐标转换
	   * @param {*} vector 
	   * @returns 
	   */
	  project(vector) {
	    return this.matrix && zrender.vector.applyTransform(zrender.vector.create(), zrender.vector.create(vector.x, vector.y), this.matrix);
	  }

	  /**
	   * 主循环
	   * @param {*} param 
	   */
	  render(param) {
	    this.renderHandler = requestAnimationFrame(this.render.bind(this));
	    this.frame(param);
	  }

	  /**
	   * 每帧执行处理
	   * @param {*} param 
	   */
	  frame(param) {
	    let index = Math.ceil(param / 1000 * this.options.speed);
	    let pos = this.getPos(index);
	    let count = this.options.particleCount;

	    //更新每个粒子位置及半径
	    for (let i = count - 1; i >= 0; i--) {
	      let circle = this.group.childAt(i);
	      let p = pos[i];
	      p = this.project(p);
	      circle.shape.cx = p[0];
	      circle.shape.cy = p[1];
	      circle.shape.r = this.exponentialDecay(count - i, this.options.radius, this.options.decay);
	      circle.style.shadowBlur = this.options.shadowBlur;
	      circle.style.fill = this.options.particleColor;
	      circle.dirty();
	    }
	  }

	  /**
	   * 指数衰减函数模拟水滴切面曲线
	   * @param {*} x 
	   * @param {*} a 
	   * @param {*} b 
	   * @returns 
	   */
	  exponentialDecay(x, a, b) {
	    return a * Math.exp(-b * x);
	  }

	  /**
	   * 获取当前点位以前的点位坐标
	   * @param {*} firstPosIndex 
	   * @returns 
	   */
	  getPos(firstPosIndex) {
	    firstPosIndex = firstPosIndex % this.count;
	    if (firstPosIndex - this.options.particleCount < 0) {
	      let arr = new Array(this.options.particleCount - firstPosIndex);
	      arr.fill(this.vectors[0]);
	      return arr.concat(this.vectors.slice(0, firstPosIndex));
	    } else {
	      return this.vectors.slice(firstPosIndex - this.options.particleCount, firstPosIndex);
	    }
	  }

	  /**
	   * 开始播放
	   * @returns 
	   */
	  start() {
	    this.index = 0;
	    if (this.count <= this.options.particleCount) {
	      console.log("例子总数太少");
	      return;
	    }
	    this.renderHandler = requestAnimationFrame(this.render.bind(this));
	  }

	  /**
	   * 停止播放
	   */
	  stop() {
	    cancelAnimationFrame(this.renderHandler);
	  }

	  /**
	   * resize
	   */
	  resize() {}

	  /**
	   * 销毁
	   */
	  destroy() {
	    cancelAnimationFrame(this.renderHandler);
	    this.zr.dispose();
	  }

	  /**
	   * 将svg转换为二维坐标序列
	   * @param {*} svg 
	   * @param {*} svgCount 
	   * @returns 
	   */
	  async svg2Vector(svg, svgCount) {
	    let svgPromise = this.loadSvg(svg);
	    return svgPromise.then(e => {
	      let width = e.xml.width.baseVal.value;
	      let height = e.xml.height.baseVal.value;
	      if (!width || !height) {
	        let viewBox = e.xml.viewBox.baseVal;
	        width = viewBox.width;
	        height = viewBox.height;
	      }
	      let paths = e.paths;
	      let mergeShps = [];
	      for (let i = 0; i < paths.length; i++) {
	        let shps = paths[i].toShapes();
	        for (let j = 0; j < shps.length; j++) {
	          shps[j].getLength() > 0 && mergeShps.push(shps[j]);
	        }
	      }
	      let shps = [],
	        firstLen = 0,
	        firstvectorCount = svgCount || 100;
	      for (let i = 0; i < mergeShps.length; i++) {
	        let shp = mergeShps[i];
	        if (i === 0) {
	          firstLen = shp.getLength();
	          shps.push({
	            length: firstLen,
	            vectors: shp.getSpacedPoints(firstvectorCount)
	          });
	        } else {
	          shps.push({
	            length: shp.getLength(),
	            vectors: shp.getSpacedPoints(Math.ceil(shp.getLength() / firstLen) * firstvectorCount)
	          });
	        }
	      }
	      return {
	        width,
	        height,
	        shps
	      };
	    });
	  }

	  /**
	   * 使用three.js SVGLoader 加载/解析svg
	   * @param {*} svg 
	   * @returns 
	   */
	  loadSvg(svg) {
	    const loader = new SVGLoader();
	    return new Promise((resolve, reject) => {
	      loader.load(svg, function (data) {
	        resolve(data);
	      }, function () {}, function (error) {
	        reject(0);
	      });
	    });
	  }

	  /**
	   * 获取默认配置项
	   * @returns 
	   */
	  getDefaultOptions() {
	    return {
	      svgUrl: "assets/method-draw-image.svg",
	      width: 1600,
	      lerpSpace: 1000,
	      height: 800,
	      particleCount: 130,
	      speed: 100,
	      lineColor: "rgba(0,255,255,1)",
	      particleColor: "rgba(0,255,255,1)",
	      particleShadowColor: "rgba(0,255,255,0.6)",
	      radius: 8,
	      decay: 0.1,
	      shadowBlur: 14
	    };
	  }
	}

	/**
	 * lil-gui
	 * https://lil-gui.georgealways.com
	 * @version 0.18.1
	 * @author George Michael Brower
	 * @license MIT
	 */

	/**
	 * Base class for all controllers.
	 */
	class Controller {

		constructor( parent, object, property, className, widgetTag = 'div' ) {

			/**
			 * The GUI that contains this controller.
			 * @type {GUI}
			 */
			this.parent = parent;

			/**
			 * The object this controller will modify.
			 * @type {object}
			 */
			this.object = object;

			/**
			 * The name of the property to control.
			 * @type {string}
			 */
			this.property = property;

			/**
			 * Used to determine if the controller is disabled.
			 * Use `controller.disable( true|false )` to modify this value
			 * @type {boolean}
			 */
			this._disabled = false;

			/**
			 * Used to determine if the Controller is hidden.
			 * Use `controller.show()` or `controller.hide()` to change this.
			 * @type {boolean}
			 */
			this._hidden = false;

			/**
			 * The value of `object[ property ]` when the controller was created.
			 * @type {any}
			 */
			this.initialValue = this.getValue();

			/**
			 * The outermost container DOM element for this controller.
			 * @type {HTMLElement}
			 */
			this.domElement = document.createElement( 'div' );
			this.domElement.classList.add( 'controller' );
			this.domElement.classList.add( className );

			/**
			 * The DOM element that contains the controller's name.
			 * @type {HTMLElement}
			 */
			this.$name = document.createElement( 'div' );
			this.$name.classList.add( 'name' );

			Controller.nextNameID = Controller.nextNameID || 0;
			this.$name.id = `lil-gui-name-${++Controller.nextNameID}`;

			/**
			 * The DOM element that contains the controller's "widget" (which differs by controller type).
			 * @type {HTMLElement}
			 */
			this.$widget = document.createElement( widgetTag );
			this.$widget.classList.add( 'widget' );

			/**
			 * The DOM element that receives the disabled attribute when using disable()
			 * @type {HTMLElement}
			 */
			this.$disable = this.$widget;

			this.domElement.appendChild( this.$name );
			this.domElement.appendChild( this.$widget );

			this.parent.children.push( this );
			this.parent.controllers.push( this );

			this.parent.$children.appendChild( this.domElement );

			this._listenCallback = this._listenCallback.bind( this );

			this.name( property );

		}

		/**
		 * Sets the name of the controller and its label in the GUI.
		 * @param {string} name
		 * @returns {this}
		 */
		name( name ) {
			/**
			 * The controller's name. Use `controller.name( 'Name' )` to modify this value.
			 * @type {string}
			 */
			this._name = name;
			this.$name.innerHTML = name;
			return this;
		}

		/**
		 * Pass a function to be called whenever the value is modified by this controller.
		 * The function receives the new value as its first parameter. The value of `this` will be the
		 * controller.
		 *
		 * For function controllers, the `onChange` callback will be fired on click, after the function
		 * executes.
		 * @param {Function} callback
		 * @returns {this}
		 * @example
		 * const controller = gui.add( object, 'property' );
		 *
		 * controller.onChange( function( v ) {
		 * 	console.log( 'The value is now ' + v );
		 * 	console.assert( this === controller );
		 * } );
		 */
		onChange( callback ) {
			/**
			 * Used to access the function bound to `onChange` events. Don't modify this value directly.
			 * Use the `controller.onChange( callback )` method instead.
			 * @type {Function}
			 */
			this._onChange = callback;
			return this;
		}

		/**
		 * Calls the onChange methods of this controller and its parent GUI.
		 * @protected
		 */
		_callOnChange() {

			this.parent._callOnChange( this );

			if ( this._onChange !== undefined ) {
				this._onChange.call( this, this.getValue() );
			}

			this._changed = true;

		}

		/**
		 * Pass a function to be called after this controller has been modified and loses focus.
		 * @param {Function} callback
		 * @returns {this}
		 * @example
		 * const controller = gui.add( object, 'property' );
		 *
		 * controller.onFinishChange( function( v ) {
		 * 	console.log( 'Changes complete: ' + v );
		 * 	console.assert( this === controller );
		 * } );
		 */
		onFinishChange( callback ) {
			/**
			 * Used to access the function bound to `onFinishChange` events. Don't modify this value
			 * directly. Use the `controller.onFinishChange( callback )` method instead.
			 * @type {Function}
			 */
			this._onFinishChange = callback;
			return this;
		}

		/**
		 * Should be called by Controller when its widgets lose focus.
		 * @protected
		 */
		_callOnFinishChange() {

			if ( this._changed ) {

				this.parent._callOnFinishChange( this );

				if ( this._onFinishChange !== undefined ) {
					this._onFinishChange.call( this, this.getValue() );
				}

			}

			this._changed = false;

		}

		/**
		 * Sets the controller back to its initial value.
		 * @returns {this}
		 */
		reset() {
			this.setValue( this.initialValue );
			this._callOnFinishChange();
			return this;
		}

		/**
		 * Enables this controller.
		 * @param {boolean} enabled
		 * @returns {this}
		 * @example
		 * controller.enable();
		 * controller.enable( false ); // disable
		 * controller.enable( controller._disabled ); // toggle
		 */
		enable( enabled = true ) {
			return this.disable( !enabled );
		}

		/**
		 * Disables this controller.
		 * @param {boolean} disabled
		 * @returns {this}
		 * @example
		 * controller.disable();
		 * controller.disable( false ); // enable
		 * controller.disable( !controller._disabled ); // toggle
		 */
		disable( disabled = true ) {

			if ( disabled === this._disabled ) return this;

			this._disabled = disabled;

			this.domElement.classList.toggle( 'disabled', disabled );
			this.$disable.toggleAttribute( 'disabled', disabled );

			return this;

		}

		/**
		 * Shows the Controller after it's been hidden.
		 * @param {boolean} show
		 * @returns {this}
		 * @example
		 * controller.show();
		 * controller.show( false ); // hide
		 * controller.show( controller._hidden ); // toggle
		 */
		show( show = true ) {

			this._hidden = !show;

			this.domElement.style.display = this._hidden ? 'none' : '';

			return this;

		}

		/**
		 * Hides the Controller.
		 * @returns {this}
		 */
		hide() {
			return this.show( false );
		}

		/**
		 * Destroys this controller and replaces it with a new option controller. Provided as a more
		 * descriptive syntax for `gui.add`, but primarily for compatibility with dat.gui.
		 *
		 * Use caution, as this method will destroy old references to this controller. It will also
		 * change controller order if called out of sequence, moving the option controller to the end of
		 * the GUI.
		 * @example
		 * // safe usage
		 *
		 * gui.add( object1, 'property' ).options( [ 'a', 'b', 'c' ] );
		 * gui.add( object2, 'property' );
		 *
		 * // danger
		 *
		 * const c = gui.add( object1, 'property' );
		 * gui.add( object2, 'property' );
		 *
		 * c.options( [ 'a', 'b', 'c' ] );
		 * // controller is now at the end of the GUI even though it was added first
		 *
		 * assert( c.parent.children.indexOf( c ) === -1 )
		 * // c references a controller that no longer exists
		 *
		 * @param {object|Array} options
		 * @returns {Controller}
		 */
		options( options ) {
			const controller = this.parent.add( this.object, this.property, options );
			controller.name( this._name );
			this.destroy();
			return controller;
		}

		/**
		 * Sets the minimum value. Only works on number controllers.
		 * @param {number} min
		 * @returns {this}
		 */
		min( min ) {
			return this;
		}

		/**
		 * Sets the maximum value. Only works on number controllers.
		 * @param {number} max
		 * @returns {this}
		 */
		max( max ) {
			return this;
		}

		/**
		 * Values set by this controller will be rounded to multiples of `step`. Only works on number
		 * controllers.
		 * @param {number} step
		 * @returns {this}
		 */
		step( step ) {
			return this;
		}

		/**
		 * Rounds the displayed value to a fixed number of decimals, without affecting the actual value
		 * like `step()`. Only works on number controllers.
		 * @example
		 * gui.add( object, 'property' ).listen().decimals( 4 );
		 * @param {number} decimals
		 * @returns {this}
		 */
		decimals( decimals ) {
			return this;
		}

		/**
		 * Calls `updateDisplay()` every animation frame. Pass `false` to stop listening.
		 * @param {boolean} listen
		 * @returns {this}
		 */
		listen( listen = true ) {

			/**
			 * Used to determine if the controller is currently listening. Don't modify this value
			 * directly. Use the `controller.listen( true|false )` method instead.
			 * @type {boolean}
			 */
			this._listening = listen;

			if ( this._listenCallbackID !== undefined ) {
				cancelAnimationFrame( this._listenCallbackID );
				this._listenCallbackID = undefined;
			}

			if ( this._listening ) {
				this._listenCallback();
			}

			return this;

		}

		_listenCallback() {

			this._listenCallbackID = requestAnimationFrame( this._listenCallback );

			// To prevent framerate loss, make sure the value has changed before updating the display.
			// Note: save() is used here instead of getValue() only because of ColorController. The !== operator
			// won't work for color objects or arrays, but ColorController.save() always returns a string.

			const curValue = this.save();

			if ( curValue !== this._listenPrevValue ) {
				this.updateDisplay();
			}

			this._listenPrevValue = curValue;

		}

		/**
		 * Returns `object[ property ]`.
		 * @returns {any}
		 */
		getValue() {
			return this.object[ this.property ];
		}

		/**
		 * Sets the value of `object[ property ]`, invokes any `onChange` handlers and updates the display.
		 * @param {any} value
		 * @returns {this}
		 */
		setValue( value ) {
			this.object[ this.property ] = value;
			this._callOnChange();
			this.updateDisplay();
			return this;
		}

		/**
		 * Updates the display to keep it in sync with the current value. Useful for updating your
		 * controllers when their values have been modified outside of the GUI.
		 * @returns {this}
		 */
		updateDisplay() {
			return this;
		}

		load( value ) {
			this.setValue( value );
			this._callOnFinishChange();
			return this;
		}

		save() {
			return this.getValue();
		}

		/**
		 * Destroys this controller and removes it from the parent GUI.
		 */
		destroy() {
			this.listen( false );
			this.parent.children.splice( this.parent.children.indexOf( this ), 1 );
			this.parent.controllers.splice( this.parent.controllers.indexOf( this ), 1 );
			this.parent.$children.removeChild( this.domElement );
		}

	}

	class BooleanController extends Controller {

		constructor( parent, object, property ) {

			super( parent, object, property, 'boolean', 'label' );

			this.$input = document.createElement( 'input' );
			this.$input.setAttribute( 'type', 'checkbox' );
			this.$input.setAttribute( 'aria-labelledby', this.$name.id );

			this.$widget.appendChild( this.$input );

			this.$input.addEventListener( 'change', () => {
				this.setValue( this.$input.checked );
				this._callOnFinishChange();
			} );

			this.$disable = this.$input;

			this.updateDisplay();

		}

		updateDisplay() {
			this.$input.checked = this.getValue();
			return this;
		}

	}

	function normalizeColorString( string ) {

		let match, result;

		if ( match = string.match( /(#|0x)?([a-f0-9]{6})/i ) ) {

			result = match[ 2 ];

		} else if ( match = string.match( /rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/ ) ) {

			result = parseInt( match[ 1 ] ).toString( 16 ).padStart( 2, 0 )
				+ parseInt( match[ 2 ] ).toString( 16 ).padStart( 2, 0 )
				+ parseInt( match[ 3 ] ).toString( 16 ).padStart( 2, 0 );

		} else if ( match = string.match( /^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i ) ) {

			result = match[ 1 ] + match[ 1 ] + match[ 2 ] + match[ 2 ] + match[ 3 ] + match[ 3 ];

		}

		if ( result ) {
			return '#' + result;
		}

		return false;

	}

	const STRING = {
		isPrimitive: true,
		match: v => typeof v === 'string',
		fromHexString: normalizeColorString,
		toHexString: normalizeColorString
	};

	const INT = {
		isPrimitive: true,
		match: v => typeof v === 'number',
		fromHexString: string => parseInt( string.substring( 1 ), 16 ),
		toHexString: value => '#' + value.toString( 16 ).padStart( 6, 0 )
	};

	const ARRAY = {
		isPrimitive: false,
		
		// The arrow function is here to appease tree shakers like esbuild or webpack.
		// See https://esbuild.github.io/api/#tree-shaking
		match: v => Array.isArray( v ),
		
		fromHexString( string, target, rgbScale = 1 ) {

			const int = INT.fromHexString( string );

			target[ 0 ] = ( int >> 16 & 255 ) / 255 * rgbScale;
			target[ 1 ] = ( int >> 8 & 255 ) / 255 * rgbScale;
			target[ 2 ] = ( int & 255 ) / 255 * rgbScale;

		},
		toHexString( [ r, g, b ], rgbScale = 1 ) {

			rgbScale = 255 / rgbScale;

			const int = ( r * rgbScale ) << 16 ^
				( g * rgbScale ) << 8 ^
				( b * rgbScale ) << 0;

			return INT.toHexString( int );

		}
	};

	const OBJECT = {
		isPrimitive: false,
		match: v => Object( v ) === v,
		fromHexString( string, target, rgbScale = 1 ) {

			const int = INT.fromHexString( string );

			target.r = ( int >> 16 & 255 ) / 255 * rgbScale;
			target.g = ( int >> 8 & 255 ) / 255 * rgbScale;
			target.b = ( int & 255 ) / 255 * rgbScale;

		},
		toHexString( { r, g, b }, rgbScale = 1 ) {

			rgbScale = 255 / rgbScale;

			const int = ( r * rgbScale ) << 16 ^
				( g * rgbScale ) << 8 ^
				( b * rgbScale ) << 0;

			return INT.toHexString( int );

		}
	};

	const FORMATS = [ STRING, INT, ARRAY, OBJECT ];

	function getColorFormat( value ) {
		return FORMATS.find( format => format.match( value ) );
	}

	class ColorController extends Controller {

		constructor( parent, object, property, rgbScale ) {

			super( parent, object, property, 'color' );

			this.$input = document.createElement( 'input' );
			this.$input.setAttribute( 'type', 'color' );
			this.$input.setAttribute( 'tabindex', -1 );
			this.$input.setAttribute( 'aria-labelledby', this.$name.id );

			this.$text = document.createElement( 'input' );
			this.$text.setAttribute( 'type', 'text' );
			this.$text.setAttribute( 'spellcheck', 'false' );
			this.$text.setAttribute( 'aria-labelledby', this.$name.id );

			this.$display = document.createElement( 'div' );
			this.$display.classList.add( 'display' );

			this.$display.appendChild( this.$input );
			this.$widget.appendChild( this.$display );
			this.$widget.appendChild( this.$text );

			this._format = getColorFormat( this.initialValue );
			this._rgbScale = rgbScale;

			this._initialValueHexString = this.save();
			this._textFocused = false;

			this.$input.addEventListener( 'input', () => {
				this._setValueFromHexString( this.$input.value );
			} );

			this.$input.addEventListener( 'blur', () => {
				this._callOnFinishChange();
			} );

			this.$text.addEventListener( 'input', () => {
				const tryParse = normalizeColorString( this.$text.value );
				if ( tryParse ) {
					this._setValueFromHexString( tryParse );
				}
			} );

			this.$text.addEventListener( 'focus', () => {
				this._textFocused = true;
				this.$text.select();
			} );

			this.$text.addEventListener( 'blur', () => {
				this._textFocused = false;
				this.updateDisplay();
				this._callOnFinishChange();
			} );

			this.$disable = this.$text;

			this.updateDisplay();

		}

		reset() {
			this._setValueFromHexString( this._initialValueHexString );
			return this;
		}

		_setValueFromHexString( value ) {

			if ( this._format.isPrimitive ) {

				const newValue = this._format.fromHexString( value );
				this.setValue( newValue );

			} else {

				this._format.fromHexString( value, this.getValue(), this._rgbScale );
				this._callOnChange();
				this.updateDisplay();

			}

		}

		save() {
			return this._format.toHexString( this.getValue(), this._rgbScale );
		}

		load( value ) {
			this._setValueFromHexString( value );
			this._callOnFinishChange();
			return this;
		}

		updateDisplay() {
			this.$input.value = this._format.toHexString( this.getValue(), this._rgbScale );
			if ( !this._textFocused ) {
				this.$text.value = this.$input.value.substring( 1 );
			}
			this.$display.style.backgroundColor = this.$input.value;
			return this;
		}

	}

	class FunctionController extends Controller {

		constructor( parent, object, property ) {

			super( parent, object, property, 'function' );

			// Buttons are the only case where widget contains name
			this.$button = document.createElement( 'button' );
			this.$button.appendChild( this.$name );
			this.$widget.appendChild( this.$button );

			this.$button.addEventListener( 'click', e => {
				e.preventDefault();
				this.getValue().call( this.object );
				this._callOnChange();
			} );

			// enables :active pseudo class on mobile
			this.$button.addEventListener( 'touchstart', () => {}, { passive: true } );

			this.$disable = this.$button;

		}

	}

	class NumberController extends Controller {

		constructor( parent, object, property, min, max, step ) {

			super( parent, object, property, 'number' );

			this._initInput();

			this.min( min );
			this.max( max );

			const stepExplicit = step !== undefined;
			this.step( stepExplicit ? step : this._getImplicitStep(), stepExplicit );

			this.updateDisplay();

		}

		decimals( decimals ) {
			this._decimals = decimals;
			this.updateDisplay();
			return this;
		}

		min( min ) {
			this._min = min;
			this._onUpdateMinMax();
			return this;
		}

		max( max ) {
			this._max = max;
			this._onUpdateMinMax();
			return this;
		}

		step( step, explicit = true ) {
			this._step = step;
			this._stepExplicit = explicit;
			return this;
		}

		updateDisplay() {

			const value = this.getValue();

			if ( this._hasSlider ) {

				let percent = ( value - this._min ) / ( this._max - this._min );
				percent = Math.max( 0, Math.min( percent, 1 ) );

				this.$fill.style.width = percent * 100 + '%';

			}

			if ( !this._inputFocused ) {
				this.$input.value = this._decimals === undefined ? value : value.toFixed( this._decimals );
			}

			return this;

		}

		_initInput() {

			this.$input = document.createElement( 'input' );
			this.$input.setAttribute( 'type', 'number' );
			this.$input.setAttribute( 'step', 'any' );
			this.$input.setAttribute( 'aria-labelledby', this.$name.id );

			this.$widget.appendChild( this.$input );

			this.$disable = this.$input;

			const onInput = () => {

				let value = parseFloat( this.$input.value );

				if ( isNaN( value ) ) return;

				if ( this._stepExplicit ) {
					value = this._snap( value );
				}

				this.setValue( this._clamp( value ) );

			};

			// Keys & mouse wheel
			// ---------------------------------------------------------------------

			const increment = delta => {

				const value = parseFloat( this.$input.value );

				if ( isNaN( value ) ) return;

				this._snapClampSetValue( value + delta );

				// Force the input to updateDisplay when it's focused
				this.$input.value = this.getValue();

			};

			const onKeyDown = e => {
				if ( e.code === 'Enter' ) {
					this.$input.blur();
				}
				if ( e.code === 'ArrowUp' ) {
					e.preventDefault();
					increment( this._step * this._arrowKeyMultiplier( e ) );
				}
				if ( e.code === 'ArrowDown' ) {
					e.preventDefault();
					increment( this._step * this._arrowKeyMultiplier( e ) * -1 );
				}
			};

			const onWheel = e => {
				if ( this._inputFocused ) {
					e.preventDefault();
					increment( this._step * this._normalizeMouseWheel( e ) );
				}
			};

			// Vertical drag
			// ---------------------------------------------------------------------

			let testingForVerticalDrag = false,
				initClientX,
				initClientY,
				prevClientY,
				initValue,
				dragDelta;

			// Once the mouse is dragged more than DRAG_THRESH px on any axis, we decide
			// on the user's intent: horizontal means highlight, vertical means drag.
			const DRAG_THRESH = 5;

			const onMouseDown = e => {

				initClientX = e.clientX;
				initClientY = prevClientY = e.clientY;
				testingForVerticalDrag = true;

				initValue = this.getValue();
				dragDelta = 0;

				window.addEventListener( 'mousemove', onMouseMove );
				window.addEventListener( 'mouseup', onMouseUp );

			};

			const onMouseMove = e => {

				if ( testingForVerticalDrag ) {

					const dx = e.clientX - initClientX;
					const dy = e.clientY - initClientY;

					if ( Math.abs( dy ) > DRAG_THRESH ) {

						e.preventDefault();
						this.$input.blur();
						testingForVerticalDrag = false;
						this._setDraggingStyle( true, 'vertical' );

					} else if ( Math.abs( dx ) > DRAG_THRESH ) {

						onMouseUp();

					}

				}

				// This isn't an else so that the first move counts towards dragDelta
				if ( !testingForVerticalDrag ) {

					const dy = e.clientY - prevClientY;

					dragDelta -= dy * this._step * this._arrowKeyMultiplier( e );

					// Clamp dragDelta so we don't have 'dead space' after dragging past bounds.
					// We're okay with the fact that bounds can be undefined here.
					if ( initValue + dragDelta > this._max ) {
						dragDelta = this._max - initValue;
					} else if ( initValue + dragDelta < this._min ) {
						dragDelta = this._min - initValue;
					}

					this._snapClampSetValue( initValue + dragDelta );

				}

				prevClientY = e.clientY;

			};

			const onMouseUp = () => {
				this._setDraggingStyle( false, 'vertical' );
				this._callOnFinishChange();
				window.removeEventListener( 'mousemove', onMouseMove );
				window.removeEventListener( 'mouseup', onMouseUp );
			};

			// Focus state & onFinishChange
			// ---------------------------------------------------------------------

			const onFocus = () => {
				this._inputFocused = true;
			};

			const onBlur = () => {
				this._inputFocused = false;
				this.updateDisplay();
				this._callOnFinishChange();
			};

			this.$input.addEventListener( 'input', onInput );
			this.$input.addEventListener( 'keydown', onKeyDown );
			this.$input.addEventListener( 'wheel', onWheel, { passive: false } );
			this.$input.addEventListener( 'mousedown', onMouseDown );
			this.$input.addEventListener( 'focus', onFocus );
			this.$input.addEventListener( 'blur', onBlur );

		}

		_initSlider() {

			this._hasSlider = true;

			// Build DOM
			// ---------------------------------------------------------------------

			this.$slider = document.createElement( 'div' );
			this.$slider.classList.add( 'slider' );

			this.$fill = document.createElement( 'div' );
			this.$fill.classList.add( 'fill' );

			this.$slider.appendChild( this.$fill );
			this.$widget.insertBefore( this.$slider, this.$input );

			this.domElement.classList.add( 'hasSlider' );

			// Map clientX to value
			// ---------------------------------------------------------------------

			const map = ( v, a, b, c, d ) => {
				return ( v - a ) / ( b - a ) * ( d - c ) + c;
			};

			const setValueFromX = clientX => {
				const rect = this.$slider.getBoundingClientRect();
				let value = map( clientX, rect.left, rect.right, this._min, this._max );
				this._snapClampSetValue( value );
			};

			// Mouse drag
			// ---------------------------------------------------------------------

			const mouseDown = e => {
				this._setDraggingStyle( true );
				setValueFromX( e.clientX );
				window.addEventListener( 'mousemove', mouseMove );
				window.addEventListener( 'mouseup', mouseUp );
			};

			const mouseMove = e => {
				setValueFromX( e.clientX );
			};

			const mouseUp = () => {
				this._callOnFinishChange();
				this._setDraggingStyle( false );
				window.removeEventListener( 'mousemove', mouseMove );
				window.removeEventListener( 'mouseup', mouseUp );
			};

			// Touch drag
			// ---------------------------------------------------------------------

			let testingForScroll = false, prevClientX, prevClientY;

			const beginTouchDrag = e => {
				e.preventDefault();
				this._setDraggingStyle( true );
				setValueFromX( e.touches[ 0 ].clientX );
				testingForScroll = false;
			};

			const onTouchStart = e => {

				if ( e.touches.length > 1 ) return;

				// If we're in a scrollable container, we should wait for the first
				// touchmove to see if the user is trying to slide or scroll.
				if ( this._hasScrollBar ) {

					prevClientX = e.touches[ 0 ].clientX;
					prevClientY = e.touches[ 0 ].clientY;
					testingForScroll = true;

				} else {

					// Otherwise, we can set the value straight away on touchstart.
					beginTouchDrag( e );

				}

				window.addEventListener( 'touchmove', onTouchMove, { passive: false } );
				window.addEventListener( 'touchend', onTouchEnd );

			};

			const onTouchMove = e => {

				if ( testingForScroll ) {

					const dx = e.touches[ 0 ].clientX - prevClientX;
					const dy = e.touches[ 0 ].clientY - prevClientY;

					if ( Math.abs( dx ) > Math.abs( dy ) ) {

						// We moved horizontally, set the value and stop checking.
						beginTouchDrag( e );

					} else {

						// This was, in fact, an attempt to scroll. Abort.
						window.removeEventListener( 'touchmove', onTouchMove );
						window.removeEventListener( 'touchend', onTouchEnd );

					}

				} else {

					e.preventDefault();
					setValueFromX( e.touches[ 0 ].clientX );

				}

			};

			const onTouchEnd = () => {
				this._callOnFinishChange();
				this._setDraggingStyle( false );
				window.removeEventListener( 'touchmove', onTouchMove );
				window.removeEventListener( 'touchend', onTouchEnd );
			};

			// Mouse wheel
			// ---------------------------------------------------------------------

			// We have to use a debounced function to call onFinishChange because
			// there's no way to tell when the user is "done" mouse-wheeling.
			const callOnFinishChange = this._callOnFinishChange.bind( this );
			const WHEEL_DEBOUNCE_TIME = 400;
			let wheelFinishChangeTimeout;

			const onWheel = e => {

				// ignore vertical wheels if there's a scrollbar
				const isVertical = Math.abs( e.deltaX ) < Math.abs( e.deltaY );
				if ( isVertical && this._hasScrollBar ) return;

				e.preventDefault();

				// set value
				const delta = this._normalizeMouseWheel( e ) * this._step;
				this._snapClampSetValue( this.getValue() + delta );

				// force the input to updateDisplay when it's focused
				this.$input.value = this.getValue();

				// debounce onFinishChange
				clearTimeout( wheelFinishChangeTimeout );
				wheelFinishChangeTimeout = setTimeout( callOnFinishChange, WHEEL_DEBOUNCE_TIME );

			};

			this.$slider.addEventListener( 'mousedown', mouseDown );
			this.$slider.addEventListener( 'touchstart', onTouchStart, { passive: false } );
			this.$slider.addEventListener( 'wheel', onWheel, { passive: false } );

		}

		_setDraggingStyle( active, axis = 'horizontal' ) {
			if ( this.$slider ) {
				this.$slider.classList.toggle( 'active', active );
			}
			document.body.classList.toggle( 'lil-gui-dragging', active );
			document.body.classList.toggle( `lil-gui-${axis}`, active );
		}

		_getImplicitStep() {

			if ( this._hasMin && this._hasMax ) {
				return ( this._max - this._min ) / 1000;
			}

			return 0.1;

		}

		_onUpdateMinMax() {

			if ( !this._hasSlider && this._hasMin && this._hasMax ) {

				// If this is the first time we're hearing about min and max
				// and we haven't explicitly stated what our step is, let's
				// update that too.
				if ( !this._stepExplicit ) {
					this.step( this._getImplicitStep(), false );
				}

				this._initSlider();
				this.updateDisplay();

			}

		}

		_normalizeMouseWheel( e ) {

			let { deltaX, deltaY } = e;

			// Safari and Chrome report weird non-integral values for a notched wheel,
			// but still expose actual lines scrolled via wheelDelta. Notched wheels
			// should behave the same way as arrow keys.
			if ( Math.floor( e.deltaY ) !== e.deltaY && e.wheelDelta ) {
				deltaX = 0;
				deltaY = -e.wheelDelta / 120;
				deltaY *= this._stepExplicit ? 1 : 10;
			}

			const wheel = deltaX + -deltaY;

			return wheel;

		}

		_arrowKeyMultiplier( e ) {

			let mult = this._stepExplicit ? 1 : 10;

			if ( e.shiftKey ) {
				mult *= 10;
			} else if ( e.altKey ) {
				mult /= 10;
			}

			return mult;

		}

		_snap( value ) {

			// This would be the logical way to do things, but floating point errors.
			// return Math.round( value / this._step ) * this._step;

			// Using inverse step solves a lot of them, but not all
			// const inverseStep = 1 / this._step;
			// return Math.round( value * inverseStep ) / inverseStep;

			// Not happy about this, but haven't seen it break.
			const r = Math.round( value / this._step ) * this._step;
			return parseFloat( r.toPrecision( 15 ) );

		}

		_clamp( value ) {
			// either condition is false if min or max is undefined
			if ( value < this._min ) value = this._min;
			if ( value > this._max ) value = this._max;
			return value;
		}

		_snapClampSetValue( value ) {
			this.setValue( this._clamp( this._snap( value ) ) );
		}

		get _hasScrollBar() {
			const root = this.parent.root.$children;
			return root.scrollHeight > root.clientHeight;
		}

		get _hasMin() {
			return this._min !== undefined;
		}

		get _hasMax() {
			return this._max !== undefined;
		}

	}

	class OptionController extends Controller {

		constructor( parent, object, property, options ) {

			super( parent, object, property, 'option' );

			this.$select = document.createElement( 'select' );
			this.$select.setAttribute( 'aria-labelledby', this.$name.id );

			this.$display = document.createElement( 'div' );
			this.$display.classList.add( 'display' );

			this._values = Array.isArray( options ) ? options : Object.values( options );
			this._names = Array.isArray( options ) ? options : Object.keys( options );

			this._names.forEach( name => {
				const $option = document.createElement( 'option' );
				$option.innerHTML = name;
				this.$select.appendChild( $option );
			} );

			this.$select.addEventListener( 'change', () => {
				this.setValue( this._values[ this.$select.selectedIndex ] );
				this._callOnFinishChange();
			} );

			this.$select.addEventListener( 'focus', () => {
				this.$display.classList.add( 'focus' );
			} );

			this.$select.addEventListener( 'blur', () => {
				this.$display.classList.remove( 'focus' );
			} );

			this.$widget.appendChild( this.$select );
			this.$widget.appendChild( this.$display );

			this.$disable = this.$select;

			this.updateDisplay();

		}

		updateDisplay() {
			const value = this.getValue();
			const index = this._values.indexOf( value );
			this.$select.selectedIndex = index;
			this.$display.innerHTML = index === -1 ? value : this._names[ index ];
			return this;
		}

	}

	class StringController extends Controller {

		constructor( parent, object, property ) {

			super( parent, object, property, 'string' );

			this.$input = document.createElement( 'input' );
			this.$input.setAttribute( 'type', 'text' );
			this.$input.setAttribute( 'aria-labelledby', this.$name.id );

			this.$input.addEventListener( 'input', () => {
				this.setValue( this.$input.value );
			} );

			this.$input.addEventListener( 'keydown', e => {
				if ( e.code === 'Enter' ) {
					this.$input.blur();
				}
			} );

			this.$input.addEventListener( 'blur', () => {
				this._callOnFinishChange();
			} );

			this.$widget.appendChild( this.$input );

			this.$disable = this.$input;

			this.updateDisplay();

		}

		updateDisplay() {
			this.$input.value = this.getValue();
			return this;
		}

	}

	const stylesheet = `.lil-gui {
  font-family: var(--font-family);
  font-size: var(--font-size);
  line-height: 1;
  font-weight: normal;
  font-style: normal;
  text-align: left;
  background-color: var(--background-color);
  color: var(--text-color);
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  --background-color: #1f1f1f;
  --text-color: #ebebeb;
  --title-background-color: #111111;
  --title-text-color: #ebebeb;
  --widget-color: #424242;
  --hover-color: #4f4f4f;
  --focus-color: #595959;
  --number-color: #2cc9ff;
  --string-color: #a2db3c;
  --font-size: 11px;
  --input-font-size: 11px;
  --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
  --font-family-mono: Menlo, Monaco, Consolas, "Droid Sans Mono", monospace;
  --padding: 4px;
  --spacing: 4px;
  --widget-height: 20px;
  --title-height: calc(var(--widget-height) + var(--spacing) * 1.25);
  --name-width: 45%;
  --slider-knob-width: 2px;
  --slider-input-width: 27%;
  --color-input-width: 27%;
  --slider-input-min-width: 45px;
  --color-input-min-width: 45px;
  --folder-indent: 7px;
  --widget-padding: 0 0 0 3px;
  --widget-border-radius: 2px;
  --checkbox-size: calc(0.75 * var(--widget-height));
  --scrollbar-width: 5px;
}
.lil-gui, .lil-gui * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
.lil-gui.root {
  width: var(--width, 245px);
  display: flex;
  flex-direction: column;
}
.lil-gui.root > .title {
  background: var(--title-background-color);
  color: var(--title-text-color);
}
.lil-gui.root > .children {
  overflow-x: hidden;
  overflow-y: auto;
}
.lil-gui.root > .children::-webkit-scrollbar {
  width: var(--scrollbar-width);
  height: var(--scrollbar-width);
  background: var(--background-color);
}
.lil-gui.root > .children::-webkit-scrollbar-thumb {
  border-radius: var(--scrollbar-width);
  background: var(--focus-color);
}
@media (pointer: coarse) {
  .lil-gui.allow-touch-styles {
    --widget-height: 28px;
    --padding: 6px;
    --spacing: 6px;
    --font-size: 13px;
    --input-font-size: 16px;
    --folder-indent: 10px;
    --scrollbar-width: 7px;
    --slider-input-min-width: 50px;
    --color-input-min-width: 65px;
  }
}
.lil-gui.force-touch-styles {
  --widget-height: 28px;
  --padding: 6px;
  --spacing: 6px;
  --font-size: 13px;
  --input-font-size: 16px;
  --folder-indent: 10px;
  --scrollbar-width: 7px;
  --slider-input-min-width: 50px;
  --color-input-min-width: 65px;
}
.lil-gui.autoPlace {
  max-height: 100%;
  position: fixed;
  top: 0;
  right: 15px;
  z-index: 1001;
}

.lil-gui .controller {
  display: flex;
  align-items: center;
  padding: 0 var(--padding);
  margin: var(--spacing) 0;
}
.lil-gui .controller.disabled {
  opacity: 0.5;
}
.lil-gui .controller.disabled, .lil-gui .controller.disabled * {
  pointer-events: none !important;
}
.lil-gui .controller > .name {
  min-width: var(--name-width);
  flex-shrink: 0;
  white-space: pre;
  padding-right: var(--spacing);
  line-height: var(--widget-height);
}
.lil-gui .controller .widget {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  min-height: var(--widget-height);
}
.lil-gui .controller.string input {
  color: var(--string-color);
}
.lil-gui .controller.boolean .widget {
  cursor: pointer;
}
.lil-gui .controller.color .display {
  width: 100%;
  height: var(--widget-height);
  border-radius: var(--widget-border-radius);
  position: relative;
}
@media (hover: hover) {
  .lil-gui .controller.color .display:hover:before {
    content: " ";
    display: block;
    position: absolute;
    border-radius: var(--widget-border-radius);
    border: 1px solid #fff9;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
}
.lil-gui .controller.color input[type=color] {
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}
.lil-gui .controller.color input[type=text] {
  margin-left: var(--spacing);
  font-family: var(--font-family-mono);
  min-width: var(--color-input-min-width);
  width: var(--color-input-width);
  flex-shrink: 0;
}
.lil-gui .controller.option select {
  opacity: 0;
  position: absolute;
  width: 100%;
  max-width: 100%;
}
.lil-gui .controller.option .display {
  position: relative;
  pointer-events: none;
  border-radius: var(--widget-border-radius);
  height: var(--widget-height);
  line-height: var(--widget-height);
  max-width: 100%;
  overflow: hidden;
  word-break: break-all;
  padding-left: 0.55em;
  padding-right: 1.75em;
  background: var(--widget-color);
}
@media (hover: hover) {
  .lil-gui .controller.option .display.focus {
    background: var(--focus-color);
  }
}
.lil-gui .controller.option .display.active {
  background: var(--focus-color);
}
.lil-gui .controller.option .display:after {
  font-family: "lil-gui";
  content: "↕";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  padding-right: 0.375em;
}
.lil-gui .controller.option .widget,
.lil-gui .controller.option select {
  cursor: pointer;
}
@media (hover: hover) {
  .lil-gui .controller.option .widget:hover .display {
    background: var(--hover-color);
  }
}
.lil-gui .controller.number input {
  color: var(--number-color);
}
.lil-gui .controller.number.hasSlider input {
  margin-left: var(--spacing);
  width: var(--slider-input-width);
  min-width: var(--slider-input-min-width);
  flex-shrink: 0;
}
.lil-gui .controller.number .slider {
  width: 100%;
  height: var(--widget-height);
  background-color: var(--widget-color);
  border-radius: var(--widget-border-radius);
  padding-right: var(--slider-knob-width);
  overflow: hidden;
  cursor: ew-resize;
  touch-action: pan-y;
}
@media (hover: hover) {
  .lil-gui .controller.number .slider:hover {
    background-color: var(--hover-color);
  }
}
.lil-gui .controller.number .slider.active {
  background-color: var(--focus-color);
}
.lil-gui .controller.number .slider.active .fill {
  opacity: 0.95;
}
.lil-gui .controller.number .fill {
  height: 100%;
  border-right: var(--slider-knob-width) solid var(--number-color);
  box-sizing: content-box;
}

.lil-gui-dragging .lil-gui {
  --hover-color: var(--widget-color);
}
.lil-gui-dragging * {
  cursor: ew-resize !important;
}

.lil-gui-dragging.lil-gui-vertical * {
  cursor: ns-resize !important;
}

.lil-gui .title {
  height: var(--title-height);
  line-height: calc(var(--title-height) - 4px);
  font-weight: 600;
  padding: 0 var(--padding);
  -webkit-tap-highlight-color: transparent;
  cursor: pointer;
  outline: none;
  text-decoration-skip: objects;
}
.lil-gui .title:before {
  font-family: "lil-gui";
  content: "▾";
  padding-right: 2px;
  display: inline-block;
}
.lil-gui .title:active {
  background: var(--title-background-color);
  opacity: 0.75;
}
@media (hover: hover) {
  body:not(.lil-gui-dragging) .lil-gui .title:hover {
    background: var(--title-background-color);
    opacity: 0.85;
  }
  .lil-gui .title:focus {
    text-decoration: underline var(--focus-color);
  }
}
.lil-gui.root > .title:focus {
  text-decoration: none !important;
}
.lil-gui.closed > .title:before {
  content: "▸";
}
.lil-gui.closed > .children {
  transform: translateY(-7px);
  opacity: 0;
}
.lil-gui.closed:not(.transition) > .children {
  display: none;
}
.lil-gui.transition > .children {
  transition-duration: 300ms;
  transition-property: height, opacity, transform;
  transition-timing-function: cubic-bezier(0.2, 0.6, 0.35, 1);
  overflow: hidden;
  pointer-events: none;
}
.lil-gui .children:empty:before {
  content: "Empty";
  padding: 0 var(--padding);
  margin: var(--spacing) 0;
  display: block;
  height: var(--widget-height);
  font-style: italic;
  line-height: var(--widget-height);
  opacity: 0.5;
}
.lil-gui.root > .children > .lil-gui > .title {
  border: 0 solid var(--widget-color);
  border-width: 1px 0;
  transition: border-color 300ms;
}
.lil-gui.root > .children > .lil-gui.closed > .title {
  border-bottom-color: transparent;
}
.lil-gui + .controller {
  border-top: 1px solid var(--widget-color);
  margin-top: 0;
  padding-top: var(--spacing);
}
.lil-gui .lil-gui .lil-gui > .title {
  border: none;
}
.lil-gui .lil-gui .lil-gui > .children {
  border: none;
  margin-left: var(--folder-indent);
  border-left: 2px solid var(--widget-color);
}
.lil-gui .lil-gui .controller {
  border: none;
}

.lil-gui input {
  -webkit-tap-highlight-color: transparent;
  border: 0;
  outline: none;
  font-family: var(--font-family);
  font-size: var(--input-font-size);
  border-radius: var(--widget-border-radius);
  height: var(--widget-height);
  background: var(--widget-color);
  color: var(--text-color);
  width: 100%;
}
@media (hover: hover) {
  .lil-gui input:hover {
    background: var(--hover-color);
  }
  .lil-gui input:active {
    background: var(--focus-color);
  }
}
.lil-gui input:disabled {
  opacity: 1;
}
.lil-gui input[type=text],
.lil-gui input[type=number] {
  padding: var(--widget-padding);
}
.lil-gui input[type=text]:focus,
.lil-gui input[type=number]:focus {
  background: var(--focus-color);
}
.lil-gui input::-webkit-outer-spin-button,
.lil-gui input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.lil-gui input[type=number] {
  -moz-appearance: textfield;
}
.lil-gui input[type=checkbox] {
  appearance: none;
  -webkit-appearance: none;
  height: var(--checkbox-size);
  width: var(--checkbox-size);
  border-radius: var(--widget-border-radius);
  text-align: center;
  cursor: pointer;
}
.lil-gui input[type=checkbox]:checked:before {
  font-family: "lil-gui";
  content: "✓";
  font-size: var(--checkbox-size);
  line-height: var(--checkbox-size);
}
@media (hover: hover) {
  .lil-gui input[type=checkbox]:focus {
    box-shadow: inset 0 0 0 1px var(--focus-color);
  }
}
.lil-gui button {
  -webkit-tap-highlight-color: transparent;
  outline: none;
  cursor: pointer;
  font-family: var(--font-family);
  font-size: var(--font-size);
  color: var(--text-color);
  width: 100%;
  height: var(--widget-height);
  text-transform: none;
  background: var(--widget-color);
  border-radius: var(--widget-border-radius);
  border: 1px solid var(--widget-color);
  text-align: center;
  line-height: calc(var(--widget-height) - 4px);
}
@media (hover: hover) {
  .lil-gui button:hover {
    background: var(--hover-color);
    border-color: var(--hover-color);
  }
  .lil-gui button:focus {
    border-color: var(--focus-color);
  }
}
.lil-gui button:active {
  background: var(--focus-color);
}

@font-face {
  font-family: "lil-gui";
  src: url("data:application/font-woff;charset=utf-8;base64,d09GRgABAAAAAAUsAAsAAAAACJwAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABHU1VCAAABCAAAAH4AAADAImwmYE9TLzIAAAGIAAAAPwAAAGBKqH5SY21hcAAAAcgAAAD0AAACrukyyJBnbHlmAAACvAAAAF8AAACEIZpWH2hlYWQAAAMcAAAAJwAAADZfcj2zaGhlYQAAA0QAAAAYAAAAJAC5AHhobXR4AAADXAAAABAAAABMAZAAAGxvY2EAAANsAAAAFAAAACgCEgIybWF4cAAAA4AAAAAeAAAAIAEfABJuYW1lAAADoAAAASIAAAIK9SUU/XBvc3QAAATEAAAAZgAAAJCTcMc2eJxVjbEOgjAURU+hFRBK1dGRL+ALnAiToyMLEzFpnPz/eAshwSa97517c/MwwJmeB9kwPl+0cf5+uGPZXsqPu4nvZabcSZldZ6kfyWnomFY/eScKqZNWupKJO6kXN3K9uCVoL7iInPr1X5baXs3tjuMqCtzEuagm/AAlzQgPAAB4nGNgYRBlnMDAysDAYM/gBiT5oLQBAwuDJAMDEwMrMwNWEJDmmsJwgCFeXZghBcjlZMgFCzOiKOIFAB71Bb8AeJy1kjFuwkAQRZ+DwRAwBtNQRUGKQ8OdKCAWUhAgKLhIuAsVSpWz5Bbkj3dEgYiUIszqWdpZe+Z7/wB1oCYmIoboiwiLT2WjKl/jscrHfGg/pKdMkyklC5Zs2LEfHYpjcRoPzme9MWWmk3dWbK9ObkWkikOetJ554fWyoEsmdSlt+uR0pCJR34b6t/TVg1SY3sYvdf8vuiKrpyaDXDISiegp17p7579Gp3p++y7HPAiY9pmTibljrr85qSidtlg4+l25GLCaS8e6rRxNBmsnERunKbaOObRz7N72ju5vdAjYpBXHgJylOAVsMseDAPEP8LYoUHicY2BiAAEfhiAGJgZWBgZ7RnFRdnVJELCQlBSRlATJMoLV2DK4glSYs6ubq5vbKrJLSbGrgEmovDuDJVhe3VzcXFwNLCOILB/C4IuQ1xTn5FPilBTj5FPmBAB4WwoqAHicY2BkYGAA4sk1sR/j+W2+MnAzpDBgAyEMQUCSg4EJxAEAwUgFHgB4nGNgZGBgSGFggJMhDIwMqEAYAByHATJ4nGNgAIIUNEwmAABl3AGReJxjYAACIQYlBiMGJ3wQAEcQBEV4nGNgZGBgEGZgY2BiAAEQyQWEDAz/wXwGAAsPATIAAHicXdBNSsNAHAXwl35iA0UQXYnMShfS9GPZA7T7LgIu03SSpkwzYTIt1BN4Ak/gKTyAeCxfw39jZkjymzcvAwmAW/wgwHUEGDb36+jQQ3GXGot79L24jxCP4gHzF/EIr4jEIe7wxhOC3g2TMYy4Q7+Lu/SHuEd/ivt4wJd4wPxbPEKMX3GI5+DJFGaSn4qNzk8mcbKSR6xdXdhSzaOZJGtdapd4vVPbi6rP+cL7TGXOHtXKll4bY1Xl7EGnPtp7Xy2n00zyKLVHfkHBa4IcJ2oD3cgggWvt/V/FbDrUlEUJhTn/0azVWbNTNr0Ens8de1tceK9xZmfB1CPjOmPH4kitmvOubcNpmVTN3oFJyjzCvnmrwhJTzqzVj9jiSX911FjeAAB4nG3HMRKCMBBA0f0giiKi4DU8k0V2GWbIZDOh4PoWWvq6J5V8If9NVNQcaDhyouXMhY4rPTcG7jwYmXhKq8Wz+p762aNaeYXom2n3m2dLTVgsrCgFJ7OTmIkYbwIbC6vIB7WmFfAAAA==") format("woff");
}`;

	function _injectStyles( cssContent ) {
		const injected = document.createElement( 'style' );
		injected.innerHTML = cssContent;
		const before = document.querySelector( 'head link[rel=stylesheet], head style' );
		if ( before ) {
			document.head.insertBefore( injected, before );
		} else {
			document.head.appendChild( injected );
		}
	}

	let stylesInjected = false;

	class GUI {

		/**
		 * Creates a panel that holds controllers.
		 * @example
		 * new GUI();
		 * new GUI( { container: document.getElementById( 'custom' ) } );
		 *
		 * @param {object} [options]
		 * @param {boolean} [options.autoPlace=true]
		 * Adds the GUI to `document.body` and fixes it to the top right of the page.
		 *
		 * @param {HTMLElement} [options.container]
		 * Adds the GUI to this DOM element. Overrides `autoPlace`.
		 *
		 * @param {number} [options.width=245]
		 * Width of the GUI in pixels, usually set when name labels become too long. Note that you can make
		 * name labels wider in CSS with `.lil‑gui { ‑‑name‑width: 55% }`
		 *
		 * @param {string} [options.title=Controls]
		 * Name to display in the title bar.
		 *
		 * @param {boolean} [options.closeFolders=false]
		 * Pass `true` to close all folders in this GUI by default.
		 *
		 * @param {boolean} [options.injectStyles=true]
		 * Injects the default stylesheet into the page if this is the first GUI.
		 * Pass `false` to use your own stylesheet.
		 *
		 * @param {number} [options.touchStyles=true]
		 * Makes controllers larger on touch devices. Pass `false` to disable touch styles.
		 *
		 * @param {GUI} [options.parent]
		 * Adds this GUI as a child in another GUI. Usually this is done for you by `addFolder()`.
		 *
		 */
		constructor( {
			parent,
			autoPlace = parent === undefined,
			container,
			width,
			title = 'Controls',
			closeFolders = false,
			injectStyles = true,
			touchStyles = true
		} = {} ) {

			/**
			 * The GUI containing this folder, or `undefined` if this is the root GUI.
			 * @type {GUI}
			 */
			this.parent = parent;

			/**
			 * The top level GUI containing this folder, or `this` if this is the root GUI.
			 * @type {GUI}
			 */
			this.root = parent ? parent.root : this;

			/**
			 * The list of controllers and folders contained by this GUI.
			 * @type {Array<GUI|Controller>}
			 */
			this.children = [];

			/**
			 * The list of controllers contained by this GUI.
			 * @type {Array<Controller>}
			 */
			this.controllers = [];

			/**
			 * The list of folders contained by this GUI.
			 * @type {Array<GUI>}
			 */
			this.folders = [];

			/**
			 * Used to determine if the GUI is closed. Use `gui.open()` or `gui.close()` to change this.
			 * @type {boolean}
			 */
			this._closed = false;

			/**
			 * Used to determine if the GUI is hidden. Use `gui.show()` or `gui.hide()` to change this.
			 * @type {boolean}
			 */
			this._hidden = false;

			/**
			 * The outermost container element.
			 * @type {HTMLElement}
			 */
			this.domElement = document.createElement( 'div' );
			this.domElement.classList.add( 'lil-gui' );

			/**
			 * The DOM element that contains the title.
			 * @type {HTMLElement}
			 */
			this.$title = document.createElement( 'div' );
			this.$title.classList.add( 'title' );
			this.$title.setAttribute( 'role', 'button' );
			this.$title.setAttribute( 'aria-expanded', true );
			this.$title.setAttribute( 'tabindex', 0 );

			this.$title.addEventListener( 'click', () => this.openAnimated( this._closed ) );
			this.$title.addEventListener( 'keydown', e => {
				if ( e.code === 'Enter' || e.code === 'Space' ) {
					e.preventDefault();
					this.$title.click();
				}
			} );

			// enables :active pseudo class on mobile
			this.$title.addEventListener( 'touchstart', () => {}, { passive: true } );

			/**
			 * The DOM element that contains children.
			 * @type {HTMLElement}
			 */
			this.$children = document.createElement( 'div' );
			this.$children.classList.add( 'children' );

			this.domElement.appendChild( this.$title );
			this.domElement.appendChild( this.$children );

			this.title( title );

			if ( touchStyles ) {
				this.domElement.classList.add( 'allow-touch-styles' );
			}

			if ( this.parent ) {

				this.parent.children.push( this );
				this.parent.folders.push( this );

				this.parent.$children.appendChild( this.domElement );

				// Stop the constructor early, everything onward only applies to root GUI's
				return;

			}

			this.domElement.classList.add( 'root' );

			// Inject stylesheet if we haven't done that yet
			if ( !stylesInjected && injectStyles ) {
				_injectStyles( stylesheet );
				stylesInjected = true;
			}

			if ( container ) {

				container.appendChild( this.domElement );

			} else if ( autoPlace ) {

				this.domElement.classList.add( 'autoPlace' );
				document.body.appendChild( this.domElement );

			}

			if ( width ) {
				this.domElement.style.setProperty( '--width', width + 'px' );
			}

			this._closeFolders = closeFolders;

			// Don't fire global key events while typing in the GUI:
			this.domElement.addEventListener( 'keydown', e => e.stopPropagation() );
			this.domElement.addEventListener( 'keyup', e => e.stopPropagation() );

		}

		/**
		 * Adds a controller to the GUI, inferring controller type using the `typeof` operator.
		 * @example
		 * gui.add( object, 'property' );
		 * gui.add( object, 'number', 0, 100, 1 );
		 * gui.add( object, 'options', [ 1, 2, 3 ] );
		 *
		 * @param {object} object The object the controller will modify.
		 * @param {string} property Name of the property to control.
		 * @param {number|object|Array} [$1] Minimum value for number controllers, or the set of
		 * selectable values for a dropdown.
		 * @param {number} [max] Maximum value for number controllers.
		 * @param {number} [step] Step value for number controllers.
		 * @returns {Controller}
		 */
		add( object, property, $1, max, step ) {

			if ( Object( $1 ) === $1 ) {

				return new OptionController( this, object, property, $1 );

			}

			const initialValue = object[ property ];

			switch ( typeof initialValue ) {

				case 'number':

					return new NumberController( this, object, property, $1, max, step );

				case 'boolean':

					return new BooleanController( this, object, property );

				case 'string':

					return new StringController( this, object, property );

				case 'function':

					return new FunctionController( this, object, property );

			}

			console.error( `gui.add failed
	property:`, property, `
	object:`, object, `
	value:`, initialValue );

		}

		/**
		 * Adds a color controller to the GUI.
		 * @example
		 * params = {
		 * 	cssColor: '#ff00ff',
		 * 	rgbColor: { r: 0, g: 0.2, b: 0.4 },
		 * 	customRange: [ 0, 127, 255 ],
		 * };
		 *
		 * gui.addColor( params, 'cssColor' );
		 * gui.addColor( params, 'rgbColor' );
		 * gui.addColor( params, 'customRange', 255 );
		 *
		 * @param {object} object The object the controller will modify.
		 * @param {string} property Name of the property to control.
		 * @param {number} rgbScale Maximum value for a color channel when using an RGB color. You may
		 * need to set this to 255 if your colors are too bright.
		 * @returns {Controller}
		 */
		addColor( object, property, rgbScale = 1 ) {
			return new ColorController( this, object, property, rgbScale );
		}

		/**
		 * Adds a folder to the GUI, which is just another GUI. This method returns
		 * the nested GUI so you can add controllers to it.
		 * @example
		 * const folder = gui.addFolder( 'Position' );
		 * folder.add( position, 'x' );
		 * folder.add( position, 'y' );
		 * folder.add( position, 'z' );
		 *
		 * @param {string} title Name to display in the folder's title bar.
		 * @returns {GUI}
		 */
		addFolder( title ) {
			const folder = new GUI( { parent: this, title } );
			if ( this.root._closeFolders ) folder.close();
			return folder;
		}

		/**
		 * Recalls values that were saved with `gui.save()`.
		 * @param {object} obj
		 * @param {boolean} recursive Pass false to exclude folders descending from this GUI.
		 * @returns {this}
		 */
		load( obj, recursive = true ) {

			if ( obj.controllers ) {

				this.controllers.forEach( c => {

					if ( c instanceof FunctionController ) return;

					if ( c._name in obj.controllers ) {
						c.load( obj.controllers[ c._name ] );
					}

				} );

			}

			if ( recursive && obj.folders ) {

				this.folders.forEach( f => {

					if ( f._title in obj.folders ) {
						f.load( obj.folders[ f._title ] );
					}

				} );

			}

			return this;

		}

		/**
		 * Returns an object mapping controller names to values. The object can be passed to `gui.load()` to
		 * recall these values.
		 * @example
		 * {
		 * 	controllers: {
		 * 		prop1: 1,
		 * 		prop2: 'value',
		 * 		...
		 * 	},
		 * 	folders: {
		 * 		folderName1: { controllers, folders },
		 * 		folderName2: { controllers, folders }
		 * 		...
		 * 	}
		 * }
		 *
		 * @param {boolean} recursive Pass false to exclude folders descending from this GUI.
		 * @returns {object}
		 */
		save( recursive = true ) {

			const obj = {
				controllers: {},
				folders: {}
			};

			this.controllers.forEach( c => {

				if ( c instanceof FunctionController ) return;

				if ( c._name in obj.controllers ) {
					throw new Error( `Cannot save GUI with duplicate property "${c._name}"` );
				}

				obj.controllers[ c._name ] = c.save();

			} );

			if ( recursive ) {

				this.folders.forEach( f => {

					if ( f._title in obj.folders ) {
						throw new Error( `Cannot save GUI with duplicate folder "${f._title}"` );
					}

					obj.folders[ f._title ] = f.save();

				} );

			}

			return obj;

		}

		/**
		 * Opens a GUI or folder. GUI and folders are open by default.
		 * @param {boolean} open Pass false to close
		 * @returns {this}
		 * @example
		 * gui.open(); // open
		 * gui.open( false ); // close
		 * gui.open( gui._closed ); // toggle
		 */
		open( open = true ) {

			this._setClosed( !open );

			this.$title.setAttribute( 'aria-expanded', !this._closed );
			this.domElement.classList.toggle( 'closed', this._closed );

			return this;

		}

		/**
		 * Closes the GUI.
		 * @returns {this}
		 */
		close() {
			return this.open( false );
		}

		_setClosed( closed ) {
			if ( this._closed === closed ) return;
			this._closed = closed;
			this._callOnOpenClose( this );
		}

		/**
		 * Shows the GUI after it's been hidden.
		 * @param {boolean} show
		 * @returns {this}
		 * @example
		 * gui.show();
		 * gui.show( false ); // hide
		 * gui.show( gui._hidden ); // toggle
		 */
		show( show = true ) {

			this._hidden = !show;

			this.domElement.style.display = this._hidden ? 'none' : '';

			return this;

		}

		/**
		 * Hides the GUI.
		 * @returns {this}
		 */
		hide() {
			return this.show( false );
		}

		openAnimated( open = true ) {

			// set state immediately
			this._setClosed( !open );

			this.$title.setAttribute( 'aria-expanded', !this._closed );

			// wait for next frame to measure $children
			requestAnimationFrame( () => {

				// explicitly set initial height for transition
				const initialHeight = this.$children.clientHeight;
				this.$children.style.height = initialHeight + 'px';

				this.domElement.classList.add( 'transition' );

				const onTransitionEnd = e => {
					if ( e.target !== this.$children ) return;
					this.$children.style.height = '';
					this.domElement.classList.remove( 'transition' );
					this.$children.removeEventListener( 'transitionend', onTransitionEnd );
				};

				this.$children.addEventListener( 'transitionend', onTransitionEnd );

				// todo: this is wrong if children's scrollHeight makes for a gui taller than maxHeight
				const targetHeight = !open ? 0 : this.$children.scrollHeight;

				this.domElement.classList.toggle( 'closed', !open );

				requestAnimationFrame( () => {
					this.$children.style.height = targetHeight + 'px';
				} );

			} );

			return this;

		}

		/**
		 * Change the title of this GUI.
		 * @param {string} title
		 * @returns {this}
		 */
		title( title ) {
			/**
			 * Current title of the GUI. Use `gui.title( 'Title' )` to modify this value.
			 * @type {string}
			 */
			this._title = title;
			this.$title.innerHTML = title;
			return this;
		}

		/**
		 * Resets all controllers to their initial values.
		 * @param {boolean} recursive Pass false to exclude folders descending from this GUI.
		 * @returns {this}
		 */
		reset( recursive = true ) {
			const controllers = recursive ? this.controllersRecursive() : this.controllers;
			controllers.forEach( c => c.reset() );
			return this;
		}

		/**
		 * Pass a function to be called whenever a controller in this GUI changes.
		 * @param {function({object:object, property:string, value:any, controller:Controller})} callback
		 * @returns {this}
		 * @example
		 * gui.onChange( event => {
		 * 	event.object     // object that was modified
		 * 	event.property   // string, name of property
		 * 	event.value      // new value of controller
		 * 	event.controller // controller that was modified
		 * } );
		 */
		onChange( callback ) {
			/**
			 * Used to access the function bound to `onChange` events. Don't modify this value
			 * directly. Use the `gui.onChange( callback )` method instead.
			 * @type {Function}
			 */
			this._onChange = callback;
			return this;
		}

		_callOnChange( controller ) {

			if ( this.parent ) {
				this.parent._callOnChange( controller );
			}

			if ( this._onChange !== undefined ) {
				this._onChange.call( this, {
					object: controller.object,
					property: controller.property,
					value: controller.getValue(),
					controller
				} );
			}
		}

		/**
		 * Pass a function to be called whenever a controller in this GUI has finished changing.
		 * @param {function({object:object, property:string, value:any, controller:Controller})} callback
		 * @returns {this}
		 * @example
		 * gui.onFinishChange( event => {
		 * 	event.object     // object that was modified
		 * 	event.property   // string, name of property
		 * 	event.value      // new value of controller
		 * 	event.controller // controller that was modified
		 * } );
		 */
		onFinishChange( callback ) {
			/**
			 * Used to access the function bound to `onFinishChange` events. Don't modify this value
			 * directly. Use the `gui.onFinishChange( callback )` method instead.
			 * @type {Function}
			 */
			this._onFinishChange = callback;
			return this;
		}

		_callOnFinishChange( controller ) {

			if ( this.parent ) {
				this.parent._callOnFinishChange( controller );
			}

			if ( this._onFinishChange !== undefined ) {
				this._onFinishChange.call( this, {
					object: controller.object,
					property: controller.property,
					value: controller.getValue(),
					controller
				} );
			}
		}

		/**
		 * Pass a function to be called when this GUI or its descendants are opened or closed.
		 * @param {function(GUI)} callback
		 * @returns {this}
		 * @example
		 * gui.onOpenClose( changedGUI => {
		 * 	console.log( changedGUI._closed );
		 * } );
		 */
		onOpenClose( callback ) {
			this._onOpenClose = callback;
			return this;
		}

		_callOnOpenClose( changedGUI ) {
			if ( this.parent ) {
				this.parent._callOnOpenClose( changedGUI );
			}

			if ( this._onOpenClose !== undefined ) {
				this._onOpenClose.call( this, changedGUI );
			}
		}

		/**
		 * Destroys all DOM elements and event listeners associated with this GUI
		 */
		destroy() {

			if ( this.parent ) {
				this.parent.children.splice( this.parent.children.indexOf( this ), 1 );
				this.parent.folders.splice( this.parent.folders.indexOf( this ), 1 );
			}

			if ( this.domElement.parentElement ) {
				this.domElement.parentElement.removeChild( this.domElement );
			}

			Array.from( this.children ).forEach( c => c.destroy() );

		}

		/**
		 * Returns an array of controllers contained by this GUI and its descendents.
		 * @returns {Controller[]}
		 */
		controllersRecursive() {
			let controllers = Array.from( this.controllers );
			this.folders.forEach( f => {
				controllers = controllers.concat( f.controllersRecursive() );
			} );
			return controllers;
		}

		/**
		 * Returns an array of folders contained by this GUI and its descendents.
		 * @returns {GUI[]}
		 */
		foldersRecursive() {
			let folders = Array.from( this.folders );
			this.folders.forEach( f => {
				folders = folders.concat( f.foldersRecursive() );
			} );
			return folders;
		}

	}

	var GUI$1 = GUI;

	async function onload() {
	  let particle = window.particle = new Particle({
	    svgUrl: "assets/method-draw-image.svg",
	    width: 1600,
	    lerpSpace: 2200,
	    height: 800,
	    particleCount: 130,
	    speed: 100,
	    lineColor: "rgba(0,255,255,1)",
	    particleColor: "rgba(0,255,255,1)",
	    particleShadowColor: "rgba(0,255,255,0.6)",
	    radius: 6.3,
	    decay: 0.017,
	    shadowBlur: 35.85
	  });
	  particle.addTo("container");
	  let gui = new GUI$1();
	  gui.add(particle.options, "speed", 0.0, 1000).name("速度");
	  gui.add(particle.options, "radius", 0.0, 20).name("粒子半径");
	  gui.add(particle.options, "decay", 0.0, 1).name("粒子拖尾衰减");
	  gui.add(particle.options, "shadowBlur", 0.0, 50).name("粒子辉光");
	}

	exports.onload = onload;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=index.js.map
