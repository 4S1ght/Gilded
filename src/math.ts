/**
 * Returns random number between two given input values.   
 * Makes use of `Math.random()`.
 */
export const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min)

/**
 * Returns the average value from an array of numbers.
 */
export const avg = (numbers: number[]): number => { 
    let x = 0 
    for (let i = 0; i < numbers.length; i++) x += numbers[i]
    return x / numbers.length
}


/**
 * **Utility method.**   
 * 
 * Works similarly to `int.toString(16)`.
 * Replaces empty char with a zero for use in other library methods.
 */
export const hex = (int: number): string => {
    let hex = int.toString(16)
    return hex.length < 2 ? `0${hex}` : `${hex}`
}

/**
 * Caps the value in a range specified by `min` and `max`.
 * ```js
 * ASync.m.minMax(0, -5, 10) // 0
 * ASync.m.minMax(0, 5, 10)  // 5
 * ASync.m.minMax(0, 15, 10) // 10
 * ```
 */
export const cap = (min: number, value: number, max: number): number => value < min ? min : value > max ? max : value

/**
 * Returns a transition from two numbers, based on `t`.
 * ```js
 * ASync.m.fromTo(0.5, 20, 70) // 45
 * ```
 */
export const slide = (t: number, from: number, to: number): number => from + ((to - from) * t)

/**
 * Takes a hex color code and returns an RGB CSS function.
 * ```js
 * ASync.m.rgbToHex('rgb(75, 221, 201)') // #4cddca
 * ``` 
 */
const hexToRGB = (hex: string): string => {
    // Remove potential hash at the start of the color code
    if (hex[0] === '#') hex = hex.substring(1)

    let hexParts = hex.match(/.{1,2}/g) as RegExpMatchArray
    let hexPartsNum: number[] = []
    for (let i = 0; i < 3; i++) hexPartsNum[i] = parseInt(hexParts[i], 16)
    if (hexParts.length === 4) hexPartsNum[3] = (parseInt(hexParts[3] as unknown as string) / 255).toString().substring(0,5) as unknown as number
    return hexPartsNum.length === 3 ? `rgb(${hexPartsNum.join(', ')})` : `rgba(${hexPartsNum.join(', ')})`
}

/**
 * Takes an RGB color function and returns a hex code.
 * ```js
 * ASync.m.rgbToHex('rgb(75, 221, 201)') // #4cddca
 * ```
 */
export const RGBToHex = (string: string): string => {
    let _string = string.replace(/rgba|rgb|\(|\)| /g, '').split(',')
    for (let i = 0; i < 3; i++) _string[i] = hex(parseInt(_string[i]))
    if (_string.length === 4) _string[3] = (parseFloat(_string[3]) * 255).toString(16).split('.')[0]
    return `#${_string.join('')}`
}

/**
 * Returns a value between two hex colors based on the progress of a transition `t`. 
 * ```js
 * ASync.m.hexTransform(0.5, '000000', 'ffffff') // 888888
 * ```
 */
export const hexTransform = (t: number, from: string, to: string): string => {
    let _from = from.match(/.{1,2}/g) as RegExpMatchArray,
        _to = to.match(/.{1,2}/g) as RegExpMatchArray, 
        __from: number[] = [],
        __to: number[] = []
    for (let i = 0; i < _from.length; i++) {
        __from[i] = parseInt(_from[i], 16)
        __to[i] = parseInt(_to[i], 16)
    }
    for (let i = 0; i < __to.length; i++) _to[i] = hex(Math.floor(slide(t, __from[i], __to[i])))
    return _to.join('') 
}