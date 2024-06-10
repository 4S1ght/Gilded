
// Imports ====================================================================

import * as math from './math.js'
import * as timing from './timing.js'
import * as css from './css.js'

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
    "getPropertyPriority" |
    "getPropertyValue" | 
    "item" | 
    "removeProperty" | 
    "setProperty" | 
    "parentRule" | 
    "length" |
    typeof Symbol.iterator | 
    number
>


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
export function g<K extends Element>                        (selector: S<K>): GildedInstance<K>;
export function g<K extends keyof HTMLElementTagNameMap>    (selector: K):    GildedInstance<HTMLElementTagNameMap[K]>;
export function g<K extends keyof SVGElementTagNameMap>     (selector: K):    GildedInstance<SVGElementTagNameMap[K]>;
export function g<K extends keyof MathMLElementTagNameMap>  (selector: K):    GildedInstance<MathMLElementTagNameMap[K]>;

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

/** Holds mathematical and color manipulation methods. */
g.m = {

    /**
     * Returns random number within boundaries set by `min` and `max`.
     */
    rand: math.rand,

    /**
     * Calculates the average from an array of numbers.
     * ```js
     * m.avg([20, 40, 60]) // -> 40
     * ```
     */
    avg: math.avg,


    /**
     * Caps the value in a range specified by `min` and `max`.
     * ```js
     * m.clamp(0, -5, 10) // 0
     * m.clamp(0, 5, 10)  // 5
     * m.clamp(0, 15, 10) // 10
     * ```
     */
    clamp: math.clamp,

    /**
     * Returns a transition value between two numbers based on time `t`.
     * ```js
     * m.slide(0.5, 20, 70) // -> 45
     * ```
     */
    slide: math.slide,

    /**
     * Works the same as `int.toString(16)` while making sure that the output string is at least 2
     * characters long and works nicely when put together into a hex color code.
     * ```js
     * m.toHex(1)   // -> 01 (number.toString(16) would leave a single "1")
     * m.toHex(128) // -. 80
     * ```
     */
    toHex: math.toHex,

    /**
     * Takes a hex color code and converts it into the RGB CSS function format.
     * ```js
     * m.hexToRGB('#4cddca')   // -> rgb(75, 221, 201) 
     * m.hexToRGB('#4cddca88') // -> rgba(75, 221, 201, 0.5) 
     * ``` 
     */
    hexToRgb: math.hexToRgb,

    /**
     * Takes an RGB color function and returns a hex code.
     * ```js
     * m.rgbToHex('rgb(75, 221, 201)') // #4cddca
     * ```
     */
    rgbToHex: math.rgbToHex,

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
    hexTransform: math.hexTransform,

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
    rgbTransform: math.rgbTransform

}

// ========================================
// Timing & animation
// ========================================

/** Holds a list of ready to use animation timing functions. */
g.f = {

    easeInQuad: timing.easeInQuad,
    easeInCubic: timing.easeInCubic,
    easeInQuart: timing.easeInQuart,
    easeInQuint: timing.easeInQuint,
    easeInCirc: timing.easeInCirc,
    easeInExpo: timing.easeInExpo,

    easeOutQuad: timing.easeOutQuad,
    easeOutCubic: timing.easeOutCubic,
    easeOutQuart: timing.easeOutQuart,
    easeOutQuint: timing.easeOutQuint,
    easeOutCirc: timing.easeOutCirc,
    easeOutExpo: timing.easeOutExpo,

    easeInOutQuad: timing.easeInOutQuad,
    easeInOutCubic: timing.easeInOutCubic,
    easeInOutQuart: timing.easeInOutQuart,
    easeInOutQuint: timing.easeInOutQuint,
    easeInOutCirc: timing.easeInOutCirc,
    easeInOutExpo: timing.easeInOutExpo,

    easeOutElastic: timing.easeOutElastic,
    easeOutBounce: timing.easeOutBounce

}


/**
 * Can be used exactly like native `setTimeout` but with swapped parameters for readability.   
 * Returns a promise that is resolved after the callback fires, which can be used to easily   
 * implement delays in existing code like so:
 * ```js
 * console.log('start')
 * await ASync.time(1000) // 1s
 * console.log('end')
 * ```
 */
g.time = timing.time

/**
 * Creates a transition of specified length (in milliseconds) and calls a callback function
 * for each animation frame. A promise is returned which can be awaited to sequence multiple 
 * transitions, with an optional `overlap` parameter that specifies a custom resolve time
 * to allow for overlapping transitions.
 * ```ts
 * // Definition:
 * transition(duration, overlap?, easing? callback)
 * 
 * // Move div1 box by 100px
 * await g.transition(1000, t => div1.style.left = `${100*t}px`)
 * 
 * // Play div2 animation once div1 is half-finished:
 * await g.transition(1000, 500, t => div1.style.left = `${100*t}px`)
 * await g.transition(1000,      t => div2.style.left = `${100*t}px`)
 * 
 * // Apply an easing function:
 * await g.transition(1000, g.f.easeInQuad, t => div1.style.left = `${100*t}px`)
 * 
 * // Combine easing with overlaps:
 * await g.transition(1000, 300, g.f.easeInQuad, t => div1.style.left = `${100*t}px`)
 * await g.transition(1000,      g.f.easeInQuad, t => div2.style.left = `${100*t}px`)
 * 
 * ```
 */
g.transition = timing.transition

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
    forEach(callback: (value: E, index: number, array: E[]) => any): this {
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
    addClass(className: string | string[]): this {
        for (let i = 0; i < this.#items.length; i++) this.#items[i].classList.add(...className)
        return this
    }

    /**
     * Removes a class name from selected elements.
     * ```js
     * g('button.class#id').removeClass('my-class')
     * ```
     */
    removeClass(className: string | string[]): this {
        for (let i = 0; i < this.#items.length; i++) this.#items[i].classList.add(...className)
        return this
    }

    /**
     * Toggles a class name on all selected elements.
     * ```js
     * g('button.class#id').toggleClass('my-class')
     * ```
     */
    toggleClass(className: string): this {
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
    on(event: string | string[], callback: (e: Event) => void): this {
        if (typeof event === 'string') event = [event]
        this.#items.forEach(item => {
            (event as string[]).forEach(e => {
                item.addEventListener(e, callback)
            })
        })
        return this
    }

    /**
     * Removes one or more event listeners to all selected elements.
     * ```js
     * g('.itemClass').off('click', callback)
     * // or
     * g('.itemClass').off(['mouseenter', 'mouseleave'], callback)
     * ```
     */
    off(event: string | string[], callback: (e: Event) => void): this {
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
         * g('button').transform('translateX', '100px')
         * ```
         * @param property transform function name
         * @param value transform value
         */
        transform: (property: keyof typeof css.transforms, value: string | number): this => {
            for (let i = 0; i < this.#items.length; i++) {
                const item = this.#items[i] as any as HTMLElement;
                item.style.transform = css.transforms[property](item.style.transform, value)
            }
            return this
        },

        /**
         * Transfers the specified computed CSS styles of the target element into it's inline
         * style tag. The main use of this method is to avoid bugs when performing transform 
         * transitions on elements with external CSS styling.
         * 
         * Example:
         * ```js
         * // Transfer the computed "transform" style into the
         * // inline style tag before using "g.transform":
         * g('button').css.toInline('transform')
         * g('button').transform('translateX', '100px')
         * ```
         * @param properties CSS property names
         */
        toInline: (...properties: CSSStyleProperty[]): this => {
            this.#items.forEach(element => {
                properties.forEach(prop => {
                    const value = window.getComputedStyle(element)[prop] as string
                    if (['none', null].includes(value)) {
                        (element as any as HTMLElement).style[prop] = value
                    }
                })
            })
            return this
        },

        /**
         * Sets a variable on the target elements.
         * ```jsx
         * g('button').css.var('size', '20px')
         * // Would result in
         * <button style="--size: 20px;"></button>
         * ```
         * @param variableName 
         * @param value 
         * @returns 
         */
        var: (variableName: string, value: string): this => {
            if (variableName.indexOf('--') !== 0) variableName = `--${variableName}`
            for (let i = 0; i < this.#items.length; i++) {
                const item = this.#items[i] as any as HTMLElement
                item.style.setProperty(variableName, value)
            }
            return this
        }

    }

}