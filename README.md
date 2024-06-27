# Gilded
Gilded is a JS animation and styling library to add some shine to your website!

# Installation
This is a browser (not Node.js) module and needs to be bundled with tools such as Webpack or Rollup.   
Gilded is available on NPM:
```
$ npm install gilded
```

Then you'll be able to import the Gilded module and access its API like so:
```js
import g from "gilded"
```

# What stands out
- Discrete CSS transforms.
- Concise syntax.
- Full use of Promises.
- Low learning curve - It's as simple as it gets.

# Docs

- [Static methods](#static-methods)
    - [transition](#gtr)
    - [time](#gtime)
    - [math](#gtransition)
        - [rand](#gmrand)
        - [avg](#gmavg)
        - [clamp](#gmclamp)
        - [slide](#gmslide)
        - [toHex](#gmtoHex)
        - [hexToRgb](#gmhexToRgb)
        - [rgbToHex](#gmrgbToHex)
        - [hexTransform](#gmhexTransform)
        - [rgbTransform](#gmrgbTransform)
    - [easing](#easing)
- [Dynamic methods](#dynamic-methods)
    - [forEach](#gforEach)
    - [addClass](#gaddclass)
    - [removeClass](#gremoveclass)
    - [toggleClass](#gtoggleclass)
    - [on](#gon)
    - [off](#goff)
    - [css](#css)
        - [transform](#gcssstyle)
        - [transform](#gcsstransform)
        - [toInline](#gcsstoInline)
        - [var](#gcssvar)

# Static methods

## `g.tr()`
Creates a transition of specified length (in milliseconds) and calls a callback function
for each animation frame. A promise is returned and can be awaited to sequence multiple 
transitions together, with an optional `overlap` parameter that specifies a custom resolve time
to allow for overlapping transitions.
```ts
// Move div1 box by 100px
await g.tr(1000, t => div1.style.left = `${100*t}px`)

// Resolve div1 after it's just 50% done and start playing div2 immediately:
await g.tr(1000, 500, t => div1.style.left = `${100*t}px`)
await g.tr(1000,      t => div2.style.left = `${100*t}px`)

// Apply an easing function:
await g.tr(1000, g.f.easeInQuad, t => div1.style.left = `${100*t}px`)

// Combine easing with overlaps:
await g.tr(1000, 300, g.f.easeInQuad, t => div1.style.left = `${100*t}px`)
await g.tr(1000,      g.f.easeInQuad, t => div2.style.left = `${100*t}px`)

```

## `g.time()`
Returns a promise resolved after a specified amount of time for use in animation
sequences to create time gaps.

Accepts an optional callback function for use in the same way as regular `setTimeout`,
but with swapped parameters for better readability.
```js
// Create a time gap inside an async function:
console.log('start')
await g.time(1000) 
console.log('end')

// Or use as a readable `setTimeout` replacement:
g.time(1000, () => {
    console.log('finished')
})
```

## Math
The math (`m`) object holds a number of mathematical and color manipulation methods.

### `g.m.rand()`
Returns a random number within boundaries set by `min` and `max`.
```js
g.m.rand(1, 100) // -> 32, 11, 29, 85, 69, etc...
```

### `g.m.avg()`
Calculates the average from an array of numbers.
```js
m.avg([20, 40, 60]) // -> 40
```

### `g.m.clamp()`
Caps the value in a range specified by `min` and `max`.   
This method is a rough implementation of the CSS `clamp()` function.
```js
m.clamp(0, -5, 10) // 0
m.clamp(0, 5, 10)  // 5
m.clamp(0, 15, 10) // 10
```

### `g.m.slide()`
Takes the time `t` and maps it onto a transition between `from` and `to`.
```js
m.slide(0.5, 20, 70)  // -> 45
m.slide(0.5, 0, -100) // -> -50
```

### `g.m.toHex()`
Works the same as `int.toString(16)` while making sure that the output string is at least 2
characters long and works nicely when put together into a hex color code.
```js
m.toHex(1)   // -> 01 (number.toString(16) would leave a single "1")
m.toHex(128) // -. 80
```

### `g.m.hexToRgb()`
Takes a hex color code and converts it into the RGB CSS function format.  
Long & shorthand syntax is supported.
```js
m.hexToRGB('#4cddca')   // -> rgb(75, 221, 201) 
m.hexToRGB('#4cddca80') // -> rgba(75, 221, 201, 0.5) 
m.hexToRGB('#fff')      // -> rgb(255, 255, 255) 
m.hexToRGB('#fff8')     // -> rgba(255, 255, 255, 0.53) 
``` 

### `g.m.rgbToHex()`
Takes an RGB color function and returns a hex code.
```js
m.rgbToHex('rgb(75, 221, 201)')       // -> #4cddca
m.rgbToHex('rgba(75, 221, 201, 0.5)') // -> #4cddca88
```

### `g.m.hexTransform()`
Returns a transition value between two hex color codes based on the progress `t`.  
Both long and shorthand hex codes are supported, as well as alpha values.
```js
// Using long syntax
m.hexTransform(0.5, '#000000', '#ffffff') // -> #808080

// Using shorthand syntax:
m.hexTransform(0.5, '#000', '#fff') // -> #808080

// Using alpha channel:
m.hexTransform(0.5, '#000000ff', '#ffffff00') // -> #80808080

// Mixing:
// If one of the parameters is an alpha channel, the other one will be treated
// as if it also had an alpha channel, but with opacity set to 1.
m.hexTransform(0.5, '#000000aa', '#888888') // -> #444444d5

// Mixing (long & short syntax):
m.hexTransform(0.5, '#0004', '#888888') // -> #444444a2
```

### `g.m.rgbTransform()`
Returns a transition value between two `rgb`/`rgba` color functions based on the progress `t`.  
Both RGB and RGBA CSS functions can be used interchangeably.
```js
// Using RGB:
m.rgbTransform(0.5, 'rgb(0, 0, 0)', 'rgb(255, 255, 255)') // -> rgb(128, 128, 128)

// Using RGBA:
m.rgbTransform(0.5, 'rgba(0, 0, 0, 1)', 'rgba(255, 255, 255, 0)') // -> rgba(128, 128, 128, 0.5)

// Mixing: 
// If one of the parameters is an RGBA function, the other one will also be 
// treated as RGBA with opacity of 1.
m.rgbTransform(0.5, 'rgb(0, 0, 0)', 'rgba(255, 255, 255, 0)') // -> rgba(128, 128, 128, 0.5)
```

## Easing
Gilded exports a set of easing functions letting you change the behavior of a transition.

Available methods include:

- `easeInQuad`
- `easeInCubic`
- `easeInQuart`
- `easeInQuint`
- `easeInCirc`
- `easeInExpo`
- `easeOutQuad`
- `easeOutCubic`
- `easeOutQuart`
- `easeOutQuint`
- `easeOutCirc`
- `easeOutExpo`
- `easeInOutQuad`
- `easeInOutCubic`
- `easeInOutQuart`
- `easeInOutQuint`
- `easeInOutCirc`
- `easeInOutExpo`
- `easeOutElastic`
- `easeOutBounce`

These methods are can be used to modify the transition curve of the `transition` method and can be accessed like so:
```js
const eox = g.f.easeOutExpo
g.transition(1000, eox, t => button.style.left = `${t*100}px`)
```

# Dynamic methods
The dynamic methods are accessible only after instantiating a `Gilded` selector.
That's because these methods aren't simple utility functions. They all produce side-effects
on the selected DOM elements. They manipulate element classes, styles and CSS variables.

You can easily select a number of items like you would when using JQuery.
Additionally, type-safety is provided for all known HTML and SVG element tags like `button`, `input`, `clipPath`, `circle`, etc:
```js
const inputs = g('input')
for (let input of inputs) {
    // Won't need type casting, as the type is already set to "HTMLInputElement":
    input.value
}
```

You can wrap existing elements and `NodeMaps`:
```js
const button = document.getElementById("#myButton")
g(button).addClass('my-class')

const items = document.querySelectorAll("*")
g(items).addClass('my-class')
```

## `g().forEach()`
Performs the specified action for each selected element. 
Direct alias to `Array.forEach`.
```js
g('input').forEach((element, index, array) => {
    console.log(element, index. array)
})
```

Optionally, Gilded implements an iterator for use in `for of` loops:
```js
for (let input of g('input')) {
    console.log(input.value)
}
```

## `g().addClass()`
Adds a class name to all selected elements.
```js
g('button').addClass('my-class')
```

## `g().removeClass()`
Removes a class name from selected elements.
```js
g('button').removeClass('my-class')
```

## `g().toggleClass()`
Toggles a class name on all selected elements.
```js
g('button').toggleClass('my-class')
```

## `g().on()`
Applies one or more event listeners to all selected elements.
```js
g('button').on('click', (e) => ...)
// or
g('button').on(['mouseenter', 'mouseleave'], (e) => ...)
```

## `g().off()`
Removes one or more event listeners from all selected elements.
```js
g('button').off('click', callback)
// or
g('button').off(['mouseenter', 'mouseleave'], callback)
```

## CSS
The `css` Object holds various CSS manipulation methods.

### `g().css.style()`
Applies an inline CSS property to every selected element.
```js
g('button').css.style('color', '#000')
g('button').css.style('border-radius', '10px')
```

### `g().css.transform()`
Applies a transform function to all selected elements.
Unlike `element.style.transform`, it does not affect the already existing transforms,
meaning that changing a property like `translateX` won't reset `translateY`.

**Note**: For this method to work properly, all the transforms of the target elements
must be transferred over to an inline `style` tag.
```js
g('button').css.toInline('transform')
g('button').css.transform('translateX', '100px')
```

### `g().css.toInline()`
Transfers the specified computed CSS styles of the target element into its inline
style tag. The main use of this method is to avoid bugs when performing transform 
transitions on elements with external CSS styling.

Example:
```js
// Transfer the computed "transform" style into the
// inline style tag before using "g.transform":
g('button').css.toInline('transform')
g('button').css.transform('translateX', '100px')
```

### `g().css.var()`
Sets a CSS variable on the target elements.   
Starting double-dash (`--`) can be omitted and will be handled automatically.
```jsx
g('button').css.var('size', '20px')
// Would result in
<button style="--size: 20px;"></button>

// Or if you need to set a global variable:
g(document.documentElement).css.var('theme-color', '#ffffff')
```
