
// Imports ====================================================================

import * as math from './math.js'
import * as timing from './timing.js'

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

type CSSTransformFunction =
  | 'translate'
  | 'translateX'
  | 'translateY'
  | 'translateZ'
  | 'translate3d'
  | 'scale'
  | 'scaleX'
  | 'scaleY'
  | 'scaleZ'
  | 'scale3d'
  | 'rotate'
  | 'rotateX'
  | 'rotateY'
  | 'rotateZ'
  | 'rotate3d'
  | 'skew'
  | 'skewX'
  | 'skewY'
  | 'matrix'
  | 'matrix3d'
  | 'perspective'


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
            event.forEach(e => {
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
            event.forEach(e => {
                item.removeEventListener(e, callback)
            })
        })
        return this
    }

    // ========================================
    // CSS 
    // ========================================

    #transforms: Record<CSSTransformFunction, (s: string, v: string | number) => string> = {

        translate:      (s: string, v: string|number) => { if (!s.match(/translate/i))   s += 'translate()';   s = s.replace(/translate\((.*)\)/gmi,   `translate(${v})`);   return s; },
        translateX:     (s: string, v: string|number) => { if (!s.match(/translateX/i))  s += 'translateX()';  s = s.replace(/translateX\((.*)\)/gmi,  `translateX(${v})`);  return s; },
        translateY:     (s: string, v: string|number) => { if (!s.match(/translateY/i))  s += 'translateY()';  s = s.replace(/translateY\((.*)\)/gmi,  `translateY(${v})`);  return s; },
        translateZ:     (s: string, v: string|number) => { if (!s.match(/translateZ/i))  s += 'translateZ()';  s = s.replace(/translateZ\((.*)\)/gmi,  `translateZ(${v})`);  return s; },
        translate3d:    (s: string, v: string|number) => { if (!s.match(/translate3d/i)) s += 'translate3d()'; s = s.replace(/translate3d\((.*)\)/gmi, `translate3d(${v})`); return s; },

        rotate:         (s: string, v: string|number) => { if (!s.match(/rotate/i))   s += 'rotate()';   s = s.replace(/rotate\((.*)\)/gmi,   `rotate(${v})`);    return s; },
        rotateX:        (s: string, v: string|number) => { if (!s.match(/rotateX/i))  s += 'rotateX()';  s = s.replace(/rotateX\((.*)\)/gmi,  `rotateX(${v})`);   return s; },
        rotateY:        (s: string, v: string|number) => { if (!s.match(/rotateY/i))  s += 'rotateY()';  s = s.replace(/rotateY\((.*)\)/gmi,  `rotateY(${v})`);   return s; },
        rotateZ:        (s: string, v: string|number) => { if (!s.match(/rotateZ/i))  s += 'rotateZ()';  s = s.replace(/rotateZ\((.*)\)/gmi,  `rotateZ(${v})`);   return s; },
        rotate3d:       (s: string, v: string|number) => { if (!s.match(/rotate3d/i)) s += 'rotate3d()'; s = s.replace(/rotate3d\((.*)\)/gmi, `rotate3d(${v})`);  return s; },

        scale:          (s: string, v: string|number) => { if (!s.match(/scale/i))   s += 'scale()';   s = s.replace(/scale\((.*)\)/gmi,   `scale(${v})`);   return s; },
        scaleX:         (s: string, v: string|number) => { if (!s.match(/scaleX/i))  s += 'scaleX()';  s = s.replace(/scaleX\((.*)\)/gmi,  `scaleX(${v})`);  return s; },
        scaleY:         (s: string, v: string|number) => { if (!s.match(/scaleY/i))  s += 'scaleY()';  s = s.replace(/scaleY\((.*)\)/gmi,  `scaleY(${v})`);  return s; },
        scaleZ:         (s: string, v: string|number) => { if (!s.match(/scaleZ/i))  s += 'scaleZ()';  s = s.replace(/scaleZ\((.*)\)/gmi,  `scaleZ(${v})`);  return s; },
        scale3d:        (s: string, v: string|number) => { if (!s.match(/scale3d/i)) s += 'scale3d()'; s = s.replace(/scale3d\((.*)\)/gmi, `scale3d(${v})`); return s; },

        skew:           (s: string, v: string|number) => { if (!s.match(/skew/i))  s += 'skew()';  s = s.replace(/skew\((.*)\)/gmi,  `skew(${v})`);  return s; },
        skewX:          (s: string, v: string|number) => { if (!s.match(/skewX/i)) s += 'skewX()'; s = s.replace(/skewX\((.*)\)/gmi, `skewX(${v})`); return s; },
        skewY:          (s: string, v: string|number) => { if (!s.match(/skewY/i)) s += 'skewY()'; s = s.replace(/skewY\((.*)\)/gmi, `skewY(${v})`); return s; },

        perspective:    (s: string, v: string|number) => { if (!s.match(/perspective/i)) s += 'perspective()'; s = s.replace(/perspective\((.*)\)/gmi, `perspective(${v})`); return s; },
        matrix:         (s: string, v: string|number) => { if (!s.match(/matrix/i))      s += 'matrix()';      s = s.replace(/matrix\((.*)\)/gmi,      `matrix(${v})`);      return s; },
        matrix3d:       (s: string, v: string|number) => { if (!s.match(/matrix3d/i))    s += 'matrix3d()';    s = s.replace(/matrix3d\((.*)\)/gmi,    `matrix3d(${v})`);    return s; }

    }

    transform(property: CSSTransformFunction, value: string | number): this {
        for (let i = 0; i < this.#items.length; i++) {
            const item = this.#items[i] as any as HTMLElement;
            item.style.transform = this.#transforms[property](item.style.transform, value)
        }
        return this
    }


}