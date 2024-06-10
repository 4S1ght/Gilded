// easeOutElastic
const c4 = (2 * Math.PI) / 3
// easeOutBounce
const n1 = 7.5625
const d1 = 2.75

export const easeInQuad =  (t: number) => t*t
export const easeInCubic = (t: number) => t*t*t
export const easeInQuart = (t: number) => t*t*t*t
export const easeInQuint = (t: number) => t*t*t*t*t
export const easeInCirc =  (t: number) => 1 - Math.sqrt(1 - Math.pow(t, 2))
export const easeInExpo =  (t: number) => t === 0 ? 0 : Math.pow(2, 10 * t - 10)

export const easeOutQuad =  (t: number) => t*(2-t)
export const easeOutCubic = (t: number) => (--t)*t*t+1
export const easeOutQuart = (t: number) => 1-(--t)*t*t*t
export const easeOutQuint = (t: number) => 1+(--t)*t*t*t*t
export const easeOutCirc =  (t: number) => Math.sqrt(1 - Math.pow(t - 1, 2))
export const easeOutExpo =  (t: number) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t)

export const easeInOutQuad =  (t: number) => t<.5 ? 2*t*t : -1+(4-2*t)*t
export const easeInOutCubic = (t: number) => t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1
export const easeInOutQuart = (t: number) => t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t
export const easeInOutQuint = (t: number) => t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t
export const easeInOutCirc =  (t: number) => t<.5 ?(1-Math.sqrt(1-Math.pow(2*t,2)))/2 : (Math.sqrt(1-Math.pow(-2*t+2,2))+1)/2
export const easeInOutExpo =  (t: number) => t === 0 ? 0 : t === 1 ? 1 : t < 0.5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2

export const easeOutElastic = (t: number) => t === 0 ? 0 : t === 1? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1
export const easeOutBounce =  (t: number) => t < 1/d1 ? n1*t*t : t<2/d1?n1*(t-=1.5/d1)*t+.75 : t<2.5/d1?n1*(t-=2.25/d1)*t+.9375 : n1*(t-=2.625/d1)*t+.984375


export function time(delay: number, callback?: Function) {
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

// Transition timing function
type EasingFunc = (t: number) => number
type EasingCallback = (t: number) => any

export function transition(duration: number,                  cb: EasingCallback): Promise<void>
export function transition(duration: number, overlap: number, cb: EasingCallback): Promise<void>
export function transition(duration: number, f: EasingFunc,   cb: EasingCallback): Promise<void>
export function transition(duration: number, overlap: number, f: EasingFunc, cb: EasingCallback): Promise<void>

export function transition(...params: (number|EasingFunc|EasingCallback)[]): Promise<void> {
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
