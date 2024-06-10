
// easeOutElastic
const c4 = (2 * Math.PI) / 3
// easeOutBounce
const n1 = 7.5625
const d1 = 2.75

export default {

    easeInQuad:  (t: number) => t*t,
    easeInCubic: (t: number) => t*t*t,
    easeInQuart: (t: number) => t*t*t*t,
    easeInQuint: (t: number) => t*t*t*t*t,
    easeInCirc:  (t: number) => 1 - Math.sqrt(1 - Math.pow(t, 2)),
    easeInExpo:  (t: number) => t === 0 ? 0 : Math.pow(2, 10 * t - 10),

    easeOutQuad:  (t: number) => t*(2-t),
    easeOutCubic: (t: number) => (--t)*t*t+1,
    easeOutQuart: (t: number) => 1-(--t)*t*t*t,
    easeOutQuint: (t: number) => 1+(--t)*t*t*t*t,
    easeOutCirc:  (t: number) => Math.sqrt(1 - Math.pow(t - 1, 2)),
    easeOutExpo:  (t: number) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),

    easeInOutQuad:  (t: number) => t<.5 ? 2*t*t : -1+(4-2*t)*t,
    easeInOutCubic: (t: number) => t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1,
    easeInOutQuart: (t: number) => t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t,
    easeInOutQuint: (t: number) => t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t,
    easeInOutCirc:  (t: number) => t<.5 ?(1-Math.sqrt(1-Math.pow(2*t,2)))/2 : (Math.sqrt(1-Math.pow(-2*t+2,2))+1)/2,
    easeInOutExpo:  (t: number) => t === 0 ? 0 : t === 1 ? 1 : t < 0.5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2,

    easeOutElastic: (t: number) => t === 0 ? 0 : t === 1? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1,
    easeOutBounce:  (t: number) => t < 1/d1 ? n1*t*t : t<2/d1?n1*(t-=1.5/d1)*t+.75 : t<2.5/d1?n1*(t-=2.25/d1)*t+.9375 : n1*(t-=2.625/d1)*t+.984375

}