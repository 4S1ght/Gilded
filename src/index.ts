
// Imports ====================================================================

import * as math from './math.js'

// Types ======================================================================

type TGildedSelectorValue = string
    | NodeList 
    | HTMLElementTagNameMap[keyof HTMLElementTagNameMap]
    | SVGElementTagNameMap[keyof SVGElementTagNameMap]
    | MathMLElementTagNameMap[keyof MathMLElementTagNameMap]

type TGildedSelector = TGildedSelectorValue | Array<TGildedSelectorValue>

type S<K extends Element> = K | K[] | NodeListOf<K>


// Static =====================================================================

/**
 * Gilded API entry point.  
 * Holds all the statically accessible library methods, grouped under their respective categories.
 * Returns a class instance with DOM manipulation methods when called,
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

// easeOutElastic
const c4 = (2 * Math.PI) / 3
// easeOutBounce
const n1 = 7.5625
const d1 = 2.75

/** Holds a list of predefined animation timing functions. */
g.f = {

    easeInQuad: (t: number) =>  t*t,
    easeInCubic: (t: number) => t*t*t,
    easeInQuart: (t: number) => t*t*t*t,
    easeInQuint: (t: number) => t*t*t*t*t,
    easeInCirc: (t: number) =>  1 - Math.sqrt(1 - Math.pow(t, 2)),
    easeInExpo: (t: number) =>  t === 0 ? 0 : Math.pow(2, 10 * t - 10),

    easeOutQuad: (t: number) =>  t*(2-t),
    easeOutCubic: (t: number) => (--t)*t*t+1,
    easeOutQuart: (t: number) => 1-(--t)*t*t*t,
    easeOutQuint: (t: number) => 1+(--t)*t*t*t*t,
    easeOutCirc: (t: number) =>  Math.sqrt(1 - Math.pow(t - 1, 2)),
    easeOutExpo: (t: number) =>  t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
    
    easeInOutQuad: (t: number) =>  t<.5 ? 2*t*t : -1+(4-2*t)*t,
    easeInOutCubic: (t: number) => t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1,
    easeInOutQuart: (t: number) => t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t,
    easeInOutQuint: (t: number) => t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t,
    easeInOutCirc: (t: number) =>  t<.5 ?(1-Math.sqrt(1-Math.pow(2*t,2)))/2 : (Math.sqrt(1-Math.pow(-2*t+2,2))+1)/2,
    easeInOutExpo: (t: number) =>  t === 0 ? 0 : t === 1 ? 1 : t < 0.5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2,

    easeOutElastic: (t: number) => t === 0 ? 0 : t === 1? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1,
    easeOutBounce: (t: number) =>  t < 1/d1 ? n1*t*t : t<2/d1?n1*(t-=1.5/d1)*t+.75 : t<2.5/d1?n1*(t-=2.25/d1)*t+.9375 : n1*(t-=2.625/d1)*t+.984375
    
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
g.time = (delay: number, callback?: Function) => {
    return new Promise<void>((resolve, reject) => {
        window.setTimeout(() => {
            try {
                if (callback) callback()
                resolve()
            } 
            catch (error) {
                reject(error)
            }
        }, delay)
    })
};

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

    // ========================================
    // Class manipulation 
    // ========================================

    /**
     * Adds a class name to all selected elements.
     * ```js
     * g('button.class#id').addClass('my-class')
     * ```
     */
    public addClass(className: string | string[]): this {
        for (let i = 0; i < this.#items.length; i++) this.#items[i].classList.add(...className)
        return this
    }

    /**
     * Removes a class name from selected elements.
     * ```js
     * g('button.class#id').removeClass('my-class')
     * ```
     */
    public removeClass(className: string | string[]): this {
        for (let i = 0; i < this.#items.length; i++) this.#items[i].classList.add(...className)
        return this
    }

    /**
     * Toggles a class name on all selected elements.
     * ```js
     * g('button.class#id').toggleClass('my-class')
     * ```
     */
    public toggleClass(className: string): this {
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
    public on(event: string | string[], callback: (e: Event) => void) {
        if (typeof event === 'string') event = [event]
        this.#items.forEach(item => {
            event.forEach(e => {
                item.addEventListener(e, callback)
            })
        })
    }

    /**
     * Removes one or more event listeners to all selected elements.
     * ```js
     * g('.itemClass').off('click', callback)
     * ```
     * Or
     * ```js
     * g('.itemClass').off(['mouseenter', 'mouseleave'], callback)
     * ```
     */
    public off(event: string | string[], callback: (e: Event) => void) {
        if (typeof event === 'string') event = [event]
        this.#items.forEach(item => {
            event.forEach(e => {
                item.removeEventListener(e, callback)
            })
        })
    }

    // ========================================
    // CSS 
    // ========================================


}