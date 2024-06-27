// Imports ====================================================================

import transforms from './transforms.js'
import easing from './easing.js'

// Types ======================================================================

// Selector value
type TGildedSelectorValue = string
    | NodeList 
    | HTMLElementTagNameMap[keyof HTMLElementTagNameMap]
    | SVGElementTagNameMap[keyof SVGElementTagNameMap]
    | MathMLElementTagNameMap[keyof MathMLElementTagNameMap]

// String query selector
type TGildedSelector = TGildedSelectorValue | Array<TGildedSelectorValue>

// Element selector
type S<K extends Element> = K | K[] | NodeListOf<K>

// CSS style props for .toInline()
type CSSStyleProperty = keyof Omit<
    CSSStyleDeclaration, 
    "getPropertyPriority"
    | "getPropertyValue" 
    | "item" 
    | "removeProperty" 
    | "setProperty" 
    | "parentRule" 
    | "length"
    | typeof Symbol.iterator 
    | number
>

// Timing function
type EasingFunc = (t: number) => number
// Transition callback function
type EasingCallback = (t: number) => any


// Helpers ====================================================================

const REG_RGB_CSS_FUNCTION = /rgba?\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})(?:,\s*([0-1](?:\.\d+)?))?\)/i
const REG_HEX_REGULAR =      /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i
const REG_HEX_SHORT =        /^#?([a-f\d])([a-f\d])([a-f\d])([a-f\d])?$/i

const toLongHex = (hex: string) => {
    const match = hex.match(REG_HEX_SHORT)
    if (!match) return hex
    return `#${match[1]}${match[1]}${match[2]}${match[2]}${match[3]}${match[3]}` 
        + (match[4] ? `${match[4]}${match[4]}` : 'ff')
}

// Static =====================================================================

/**
 * Gilded API entry point.  
 * Holds all the statically accessible library methods, grouped under their respective categories.
 * Returns a class instance with DOM manipulation methods when called.
 * ```js
 * // Access a static method
 * g.m.rand(1, 100)
 * 
 * // or query for DOM elements to add a class
 * g('div').addClass('my-div-class')
 * 
 * // or iterate over the queried entities
 * for (const a of g('a')) {
 *     console.log(a.href)
 * }
 * ```
 */
export function g<K extends Element>                        (selector: S<K>):               GildedInstance<K>;
export function g<K extends keyof HTMLElementTagNameMap>    (selector: K):                  GildedInstance<HTMLElementTagNameMap[K]>;
export function g<K extends keyof SVGElementTagNameMap>     (selector: K):                  GildedInstance<SVGElementTagNameMap[K]>;
export function g<K extends keyof MathMLElementTagNameMap>  (selector: K):                  GildedInstance<MathMLElementTagNameMap[K]>;
export function g<TGildedSelector>                          (selector: TGildedSelector):    GildedInstance<Element>;

export function g(selector: TGildedSelector): GildedInstance<Element> {

    let items: any[] = []
    if (typeof selector === 'string')      items = Array.from(document.querySelectorAll(selector))
    else if (selector instanceof NodeList) items = Array.from(selector)
    else if (selector instanceof Element)  items = [selector]
    else if (selector instanceof Array)    items = selector
    else throw new Error(`[Gilded] Invalid selector: ${selector} / typeof ${typeof selector}.`)

    return new GildedInstance(items)

}

// ========================================
// Mathematical methods
// ========================================

export declare namespace g {
    /** Holds mathematical and color manipulation methods. */
    const m: typeof math
}

const math = {

    /**
     * Returns a random number within boundaries set by `min` and `max`.
     */
    rand: (min: number, max: number) => 
        Math.floor(Math.random() * (max - min + 1) + min),

    /**
     * Calculates the average from an array of numbers.
     * ```js
     * m.avg([20, 40, 60]) // -> 40
     * ```
     */
    avg: (numbers: number[]): number => { 
        let x = 0 
        for (let i = 0; i < numbers.length; i++) x += numbers[i]
        return x / numbers.length
    },

    /**
     * Caps the value in a range specified by `min` and `max`.
     * ```js
     * m.clamp(0, -5, 10) // 0
     * m.clamp(0, 5, 10)  // 5
     * m.clamp(0, 15, 10) // 10
     * ```
     */
    clamp: (min: number, value: number, max: number): number => 
        value < min ? min : value > max ? max : value,

    /**
     * Takes the time `t` and maps it onto a transition between `from` and `to`.
     * ```js
     * m.slide(0.5, 20, 70)  // -> 45
     * m.slide(0.5, 0, -100) // -> -50
     * ```
     */
    slide: (t: number, from: number, to: number): number => 
        from + ((to - from) * t),

    /**
     * Works the same as `int.toString(16)` while making sure that the output string is at least 2
     * characters long and works nicely when put together into a hex color code.
     * ```js
     * m.toHex(1)   // -> 01 (number.toString(16) would leave a single "1")
     * m.toHex(128) // -. 80
     * ```
     */
    toHex: (int: number): string => {
        let hex = int.toString(16)
        return hex.length === 1 ? `0${hex}` : `${hex}`
    },

    /**
     * Takes a hex color code and converts it into the RGB CSS function format.
     * Long & shorthand syntax is supported.
     * ```js
     * m.hexToRGB('#4cddca')     // -> rgb(75, 221, 201) 
     * m.hexToRGB('#4cddca80')   // -> rgba(75, 221, 201, 0.5) 
     * m.hexToRGB('#fff')        // -> rgb(255, 255, 255) 
     * m.hexToRGB('#fff8')       // -> rgba(255, 255, 255, 0.53) 
     * ``` 
     */
    hexToRgb: (hex: string): string => {

        const match = toLongHex(hex).match(REG_HEX_REGULAR) as RegExpMatchArray
        const v: number[] = []

        for (let i = 1; i < 4; i++) v.push(parseInt(match[i], 16))
        
        return hex.length === 5 || hex.length === 9 
            ? `rgba(${v[0]}, ${v[1]}, ${v[2]}, ${parseInt(match[4], 16) / 255})`
            : `rgb(${v.join(', ')})`

    },

    /**
     * Takes an RGB color function and returns a hex code.
     * ```js
     * m.rgbToHex('rgb(75, 221, 201)') // #4cddca
     * ```
     */
    rgbToHex: (string: string): string => {
        let _string = string.replace(/rgba|rgb|\(|\)| /g, '').split(',')
        for (let i = 0; i < 3; i++) _string[i] = g.m.toHex(parseInt(_string[i]))
        if (_string.length === 4) _string[3] = (parseFloat(_string[3]) * 255).toString(16).split('.')[0]
        return `#${_string.join('')}`
    },

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
     * // If one of the parameters is an alpha channel, the other one will be treated
     * // as if it also had an alpha channel, but with opacity set to 1.
     * m.hexTransform(0.5, '#000000aa', '#888888') // #444444d5
     * 
     * // Mixing (long & short syntax):
     * m.hexTransform(0.5, '#0004', '#888888') // #444444a2
     * ```
     */
    hexTransform: (t: number, from: string, to: string) => {
    
        const fromMatch = toLongHex(from).match(REG_HEX_REGULAR) as RegExpMatchArray
        const toMatch   = toLongHex(to).match(REG_HEX_REGULAR)   as RegExpMatchArray
    
        const v: string[] = []
    
        for (let i = 1; i < 4; i++)
            v.push(g.m.toHex(Math.round(g.m.slide(t, parseInt(fromMatch[i], 16), parseInt(toMatch[i], 16)))))
    
        return from.length === 5 || from.length === 9 || to.length === 5 || to.length === 9
            ? `#${v[0]}${v[1]}${v[2]}${g.m.toHex(Math.round(g.m.slide(t, parseInt(fromMatch[4] || 'ff', 16), parseInt(toMatch[4] || 'ff', 16))))}`
            : `#${v.join('')}`
    
    },

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
     * // treated as RGBA with opacity of 1.
     * m.rgbTransform(0.5, 'rgb(0, 0, 0)', 'rgba(255, 255, 255, 0)') // -> rgba(128, 128, 128, 0.5)
     * ```
     */
    rgbTransform: (t: number, from: string, to: string) => {

        const fromMatch = from.match(REG_RGB_CSS_FUNCTION) as RegExpMatchArray
        const toMatch   = to.match(REG_RGB_CSS_FUNCTION)   as RegExpMatchArray
    
        const v: number[] = []
    
        for (let i = 1; i < 4; i++) 
            v.push(Math.round(g.m.slide(t, parseInt(fromMatch[i]), parseInt(toMatch[i]))))
    
        return from.includes('rgba') || to.includes('rgba')
            ? `rgba(${v[0]}, ${v[1]}, ${v[2]}, ${g.m.slide(t, parseInt(fromMatch[4] || '1'), parseInt(toMatch[4] || '1'))})`
            : `rgb(${v.join(', ')})`
    
    }

}

// @ts-ignore
g.m = math

// ========================================
// Timing & animation
// ========================================

export declare namespace g {
    /** Holds a list of ready to use animation timing functions. */
    const f: typeof easing
}

// @ts-ignore
g.f = easing


export declare namespace g {
    /**
     * Returns a promise resolved after a specified amount of time for use in animation
     * sequences to create time gaps.
     * 
     * Accepts an optional callback function for use in the same way as regular `setTimeout`,
     * but with swapped parameters for better readability.
     * ```js
     * // Create a time gap inside an async function:
     * console.log('start')
     * await g.time(1000) 
     * console.log('end')
     * 
     * // Use as a `setTimeout` replacement:
     * g.time(1000, () => {
     *     console.log('finished')
     * })
     * ```
     */
    function time(delay: number): Promise<void>
    function time(delay: number, callback: Function): void
}

function time(delay: number, callback?: Function): any {
    if (callback) {
        setTimeout(callback, delay)
    }
    else {
        return new Promise<void>(resolve => {
            setTimeout(() => resolve(), delay)
        })
    }
};

g.time = time


export declare namespace g { 
    /**
     * Creates a transition of specified length (in milliseconds) and calls a callback function
     * for each animation frame. A promise is returned which can be awaited to sequence multiple 
     * transitions together, with an optional `overlap` parameter that specifies a custom resolve 
     * time to allow for overlapping transitions.
     * ```ts
     * // Move div1 box by 100px
     * await g.trans(1000, t => div1.style.left = `${100*t}px`)
     * 
     * // Resolve div1 after it's 50% done and start playing div2 immediately:
     * await g.trans(1000, 500, t => div1.style.left = `${100*t}px`)
     * await g.trans(1000,      t => div2.style.left = `${100*t}px`)
     * 
     * // Apply an easing function:
     * await g.trans(1000, g.f.easeInQuad, t => div1.style.left = `${100*t}px`)
     * 
     * // Combine easing with overlaps:
     * await g.trans(1000, 300, g.f.easeInQuad, t => div1.style.left = `${100*t}px`)
     * await g.trans(1000,      g.f.easeInQuad, t => div2.style.left = `${100*t}px`)
     * 
     * ```
     */
    function tr(duration: number,                  cb: EasingCallback): Promise<void>
    function tr(duration: number, overlap: number, cb: EasingCallback): Promise<void>
    function tr(duration: number, f: EasingFunc,   cb: EasingCallback): Promise<void>
    function tr(duration: number, overlap: number, f: EasingFunc, cb: EasingCallback): Promise<void>
}

function transition(...params: (number|EasingFunc|EasingCallback)[]): Promise<void> {
    return new Promise<void>(resolve => {

        let startTime: number | null = null
        let [$duration, $overlap] = params.filter(item => typeof item === 'number')   as [number, number | undefined]
        let [$easing, $callback]  = params.filter(item => typeof item === 'function') as [EasingFunc | EasingCallback, EasingCallback | undefined]

        const duration: number         = $duration
        const overlap:  number         = $overlap || 0
        const easing:   EasingFunc     = $callback ? $easing : (t: number) => t
        const callback: EasingCallback = $callback ? $callback : $easing
        let resolved = false

        function frame(currentTime: number) {

            if (!startTime) startTime = currentTime;
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1)

            callback(easing(progress))

            // Resolve the promise earlier than the animation to allow for overlaps
            if (!resolved && overlap && elapsedTime >= overlap) {
                resolve()
                resolved = true
            }

            // Continue animation or finish it
            if (progress < 1) requestAnimationFrame(frame)
            else !resolved && resolve()

        }

        requestAnimationFrame(frame)

    })
}

g.tr = transition


// Instance ===================================================================

class GildedInstance<E extends Element> {

    #items: E[]

    constructor(items: E[]) {
        this.#items = items
    }  

    [Symbol.iterator]() {
        let self = this, index = 0
        return {
            next: () => index < self.#items.length
                ? { value: self.#items[index + 1], done: false }
                : { done: true }
        }
    }
    
    /**
     * Performs the specified action for each selected element. 
     * Direct alias to `Array.forEach`.
     * @param callback 
     * @returns 
     */
    forEach(callback: (value: E, index: number, array: E[]) => any): GildedInstance<E> {
        this.#items.forEach(callback)
        return this
    }

    // ========================================
    // Class manipulation 
    // ========================================

    /**
     * Adds a class name to all selected elements.
     * ```js
     * g('button.class#id').addClass('my-class')
     * ```
     */
    addClass(className: string | string[]): GildedInstance<E> {
        for (let i = 0; i < this.#items.length; i++) this.#items[i].classList.add(...className)
        return this
    }

    /**
     * Removes a class name from selected elements.
     * ```js
     * g('button.class#id').removeClass('my-class')
     * ```
     */
    removeClass(className: string | string[]): GildedInstance<E> {
        for (let i = 0; i < this.#items.length; i++) this.#items[i].classList.add(...className)
        return this
    }

    /**
     * Toggles a class name on all selected elements.
     * ```js
     * g('button.class#id').toggleClass('my-class')
     * ```
     */
    toggleClass(className: string): GildedInstance<E> {
        for (let i = 0; i < this.#items.length; i++) this.#items[i].classList.toggle(className)
        return this
    }

    // ========================================
    // Events
    // ========================================

    /**
     * Applies one or more event listeners to all selected elements.
     * ```js
     * g('.itemClass').on('click', (e) => ...)
     * // or
     * g('.itemClass').on(['mouseenter', 'mouseleave'], (e) => ...)
     * ```
     */
    on(event: string | string[], callback: (e: Event) => void): GildedInstance<E> {
        if (typeof event === 'string') event = [event]
        this.#items.forEach(item => {
            (event as string[]).forEach(e => {
                item.addEventListener(e, callback)
            })
        })
        return this
    }

    /**
     * Removes one or more event listeners from all selected elements.
     * ```js
     * g('.itemClass').off('click', callback)
     * // or
     * g('.itemClass').off(['mouseenter', 'mouseleave'], callback)
     * ```
     */
    off(event: string | string[], callback: (e: Event) => void): GildedInstance<E> {
        if (typeof event === 'string') event = [event]
        this.#items.forEach(item => {
            (event as string[]).forEach(e => {
                item.removeEventListener(e, callback)
            })
        })
        return this
    }

    // ========================================
    // CSS 
    // ========================================

    /** Holds various CSS manipulation methods. */
    css = {

        /**
         * Applies a transform function to all selected elements.
         * Unlike `element.style.transform`, it does not affect the already existing transforms,
         * meaning that changing a property like `translateX` won't reset `translateY`.
         * 
         * **Note**: For this method to work properly, all the transforms of the target elements
         * must be transferred over to an inline `style` tag.
         * ```js
         * g('button').css.toInline('transform')
         * g('button').css.transform('translateX', '100px')
         * ```
         * @param property transform function name
         * @param value transform value
         */
        transform: (property: keyof typeof transforms, value: string | number): GildedInstance<E> => {
            for (let i = 0; i < this.#items.length; i++) {
                const item = this.#items[i] as any as HTMLElement;
                item.style.transform = transforms[property](item.style.transform, value)
            }
            return this
        },

        /**
         * Transfers the specified computed CSS styles of the target element into its inline
         * style tag. The main use of this method is to avoid bugs when performing transform 
         * transitions on elements with external CSS styling.
         * 
         * Example:
         * ```js
         * // Transfer the computed "transform" style into the
         * // inline style tag before using "g.transform":
         * g('button').css.toInline('transform')
         * g('button').css.transform('translateX', '100px')
         * ```
         * @param properties CSS property names
         */
        toInline: (...properties: CSSStyleProperty[]): GildedInstance<E> => {
            this.#items.forEach(element => {
                properties.forEach(prop => {
                    const value = window.getComputedStyle(element)[prop] as string
                    if (!['none', null].includes(value)) {
                        (element as any as HTMLElement).style[prop] = value
                    }
                })
            })
            return this
        },

        /**
         * Sets CSS a variable on the target elements.
         * 
         * Starting double-dash (`--`) can be omitted and will be handled automatically.
         * ```jsx
         * g('button').css.var('size', '20px')
         * // Would result in
         * <button style="--size: 20px;"></button>
         * 
         * // Or if you need to set a global variable:
         * g(document.documentElement).css.var('theme-color', '#ffffff')
         * ```
         * @param variableName 
         * @param value 
         * @returns 
         */
        var: (variableName: string, value: string): GildedInstance<E> => {
            if (variableName.indexOf('--') !== 0) variableName = `--${variableName}`
            for (let i = 0; i < this.#items.length; i++) {
                const item = this.#items[i] as any as HTMLElement
                item.style.setProperty(variableName, value)
            }
            return this
        }

    }

}
