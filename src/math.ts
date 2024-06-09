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

export const rand = (min: number, max: number) => 
    Math.floor(Math.random() * (max - min + 1) + min)

export const avg = (numbers: number[]): number => { 
    let x = 0 
    for (let i = 0; i < numbers.length; i++) x += numbers[i]
    return x / numbers.length
}

export const clamp = (min: number, value: number, max: number): number => 
    value < min ? min : value > max ? max : value

export const slide = (t: number, from: number, to: number): number => 
    from + ((to - from) * t)

export const toHex = (int: number): string => {
    let hex = int.toString(16)
    return hex.length === 1 ? `0${hex}` : `${hex}`
}

// TODO: Update to use regex-only parsing
export const hexToRgb = (hex: string): string => {
    // Remove potential hash at the start of the color code
    if (hex[0] === '#') hex = hex.substring(1)

    let hexParts = hex.match(/.{1,2}/g) as RegExpMatchArray
    let hexPartsNum: (number|string)[] = []
    for (let i = 0; i < 3; i++) hexPartsNum[i] = parseInt(hexParts[i], 16)
    if (hexParts.length === 4) hexPartsNum[3] = (parseInt(hexParts[3]) / 255).toString().substring(0,5)
    return hexPartsNum.length === 3 ? `rgb(${hexPartsNum.join(', ')})` : `rgba(${hexPartsNum.join(', ')})`
}

// TODO: Update to use regex-only parsing
export const rgbToHex = (string: string): string => {
    let _string = string.replace(/rgba|rgb|\(|\)| /g, '').split(',')
    for (let i = 0; i < 3; i++) _string[i] = toHex(parseInt(_string[i]))
    if (_string.length === 4) _string[3] = (parseFloat(_string[3]) * 255).toString(16).split('.')[0]
    return `#${_string.join('')}`
}

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