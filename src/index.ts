
type TGildedSelectorValue = string
    | NodeList 
    | HTMLElementTagNameMap[keyof HTMLElementTagNameMap]
    | SVGElementTagNameMap[keyof SVGElementTagNameMap]
    | MathMLElementTagNameMap[keyof MathMLElementTagNameMap]

type TGildedSelector = TGildedSelectorValue | Array<TGildedSelectorValue>

export default function g<K extends Element>                        (selector: K | K[] | NodeListOf<K>): GildedNodeList<K>;
export default function g<K extends keyof HTMLElementTagNameMap>    (selector: K):                       GildedNodeList<HTMLElementTagNameMap[K]>;
export default function g<K extends keyof SVGElementTagNameMap>     (selector: K):                       GildedNodeList<SVGElementTagNameMap[K]>;
export default function g<K extends keyof MathMLElementTagNameMap>  (selector: K):                       GildedNodeList<MathMLElementTagNameMap[K]>;
export default function g(selector: TGildedSelector): GildedNodeList<Element> 
{

    let items: any[] = []
    if (typeof selector === 'string')      items = Array.from(document.querySelectorAll(selector))
    else if (selector instanceof NodeList) items = Array.from(selector)
    else if (selector instanceof Element)  items = [selector]
    else if (selector instanceof Array)    items = selector
    else throw new Error(`[Gilded] Invalid selector: ${selector} / typeof ${typeof selector}.`)

    return new GildedNodeList(items)

}

class GildedNodeList<E extends Element> {

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
}
