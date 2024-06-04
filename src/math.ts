// Constants ==================================================================

const REG_RGB_CSS_FUNCTION = /rgba?\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})(?:,\s*([0-1](?:\.\d+)?))?\)/i
const REG_HEX_REGULAR =      /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i
const REG_HEX_SHORT =        /^#?([a-f\d])([a-f\d])([a-f\d])([a-f\d])?$/i

// Helpers ====================================================================

const toLongHex = (hex: string) => {
    
    const match = hex.match(REG_HEX_SHORT)
    if (!match) return hex
    
    return `#${match[1]}${match[1]}${match[2]}${match[2]}${match[3]}${match[3]}` 
        + (match[4] ? `${match[4]}${match[4]}` : 'ff')

}

// Methods ====================================================================

/**
 * Returns random number within boundaries set by `min` and `max`.
 */
export const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min)

/**
 * Calculates the average from an array of numbers.
 * ```js
 * m.avg([20, 40, 60]) // -> 40
 * ```
 */
export const avg = (numbers: number[]): number => { 
    let x = 0 
    for (let i = 0; i < numbers.length; i++) x += numbers[i]
    return x / numbers.length
}

/**
 * Caps the value in a range specified by `min` and `max`.
 * ```js
 * m.clamp(0, -5, 10) // 0
 * m.clamp(0, 5, 10)  // 5
 * m.clamp(0, 15, 10) // 10
 * ```
 */
export const clamp = (min: number, value: number, max: number): number => value < min ? min : value > max ? max : value

/**
 * Returns a transition value between two numbers based on time `t`.
 * ```js
 * m.slide(0.5, 20, 70) // -> 45
 * ```
 */
export const slide = (t: number, from: number, to: number): number => from + ((to - from) * t)

/**
 * Works the same as `int.toString(16)` while making sure that the output string is at least 2
 * characters long and works nicely when put together into a hex color code.
 * ```js
 * m.toHex(1)   // -> 01 (number.toString(16) would leave a single "1")
 * m.toHex(128) // -. 80
 * ```
 */
export const toHex = (int: number): string => {
    let hex = int.toString(16)
    return hex.length === 1 ? `0${hex}` : `${hex}`
}

/**
 * Takes a hex color code and converts it into the RGB CSS function format.
 * ```js
 * m.hexToRGB('#4cddca')   // -> rgb(75, 221, 201) 
 * m.hexToRGB('#4cddca88') // -> rgba(75, 221, 201, 0.5) 
 * ``` 
 */
export const hexToRgb = (hex: string): string => {
    // Remove potential hash at the start of the color code
    if (hex[0] === '#') hex = hex.substring(1)

    let hexParts = hex.match(/.{1,2}/g) as RegExpMatchArray
    let hexPartsNum: (number|string)[] = []
    for (let i = 0; i < 3; i++) hexPartsNum[i] = parseInt(hexParts[i], 16)
    if (hexParts.length === 4) hexPartsNum[3] = (parseInt(hexParts[3]) / 255).toString().substring(0,5)
    return hexPartsNum.length === 3 ? `rgb(${hexPartsNum.join(', ')})` : `rgba(${hexPartsNum.join(', ')})`
}

/**
 * Takes an RGB color function and returns a hex code.
 * ```js
 * m.rgbToHex('rgb(75, 221, 201)') // #4cddca
 * ```
 */
export const rgbToHex = (string: string): string => {
    let _string = string.replace(/rgba|rgb|\(|\)| /g, '').split(',')
    for (let i = 0; i < 3; i++) _string[i] = toHex(parseInt(_string[i]))
    if (_string.length === 4) _string[3] = (parseFloat(_string[3]) * 255).toString(16).split('.')[0]
    return `#${_string.join('')}`
}

/**
 * Returns a transition value between two hex color codes based on the progress `t`.  
 * Both long and shorthand hex codes are supported, as well as alpha values.
 * ```js
 * // Using long syntax
 * m.hexTransform(0.5, '#000000', '#ffffff') // #808080
 * 
 * // Using shorthand syntax:
 * m.hexTransform(0.5, '#000', '#fff') // #808080
 * 
 * // Using alpha channel:
 * m.hexTransform(0.5, '#000000ff', '#ffffff00') // #80808080
 * 
 * // Mixing:
 * // If one of the parameters is an alpha channel, the other one will also be 
 * // treated as if it had one with opacity of 1. The resulting string will also
 * // contain the alpha channel:
 * m.hexTransform(0.5, '#000000aa', '#888888') // #444444d5
 * 
 * // Mixing (long & short syntax):
 * m.hexTransform(0.5, '#0004', '#888888') // #444444a2
 * ```
 */
export const hexTransform = (t: number, from: string, to: string) => {

    const fromMatch = toLongHex(from).match(REG_HEX_REGULAR) as RegExpMatchArray
    const toMatch   = toLongHex(to).match(REG_HEX_REGULAR)   as RegExpMatchArray

    const v: string[] = []

    for (let i = 1; i < 4; i++)
        v.push(toHex(Math.round(slide(t, parseInt(fromMatch[i], 16), parseInt(toMatch[i], 16)))))

    return from.length === 5 || from.length === 9 || to.length === 5 || to.length === 9
        ? `#${v[0]}${v[1]}${v[2]}${toHex(Math.round(slide(t, parseInt(fromMatch[4] || 'ff', 16), parseInt(toMatch[4] || 'ff', 16))))}`
        : `#${v.join('')}`

}

/**
 * Returns a transition value between two `rgb`/`rgba` color functions based on the progress `t`.  
 * Both RGB and RGBA CSS functions can be used interchangeably.
 * ```js
 * // Using RGB:
 * m.rgbTransform(0.5, 'rgb(0, 0, 0)', 'rgb(255, 255, 255)') // -> rgb(128, 128, 128)
 * 
 * // Using RGBA:
 * m.rgbTransform(0.5, 'rgba(0, 0, 0, 1)', 'rgba(255, 255, 255, 0)') // -> rgba(128, 128, 128, 0.5)
 * 
 * // Mixing: 
 * // If one of the parameters is an RGBA function, the other one will also be 
 * // treated as RGBA with opacity of 1. The resulting string will also be in 
 * // the RGBA format.
 * m.rgbTransform(0.5, 'rgb(0, 0, 0)', 'rgba(255, 255, 255, 0)') // -> rgba(128, 128, 128, 0.5)
 * ```
 */
export const rgbTransform = (t: number, from: string, to: string) => {

    const fromMatch = from.match(REG_RGB_CSS_FUNCTION) as RegExpMatchArray
    const toMatch   = to.match(REG_RGB_CSS_FUNCTION)   as RegExpMatchArray

    const v: number[] = []

    for (let i = 1; i < 4; i++) 
        v.push(Math.round(slide(t, parseInt(fromMatch[i]), parseInt(toMatch[i]))))

    return from.includes('rgba') || to.includes('rgba')
        ? `rgba(${v[0]}, ${v[1]}, ${v[2]}, ${slide(t, parseInt(fromMatch[4] || '1'), parseInt(toMatch[4] || '1'))})`
        : `rgb(${v.join(', ')})`

}