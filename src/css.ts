export const transforms = {

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
