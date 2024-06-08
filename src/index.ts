




export default function g<K extends keyof HTMLElementTagNameMap>(selector: K): GildedNodeList<HTMLElementTagNameMap[K]>;
export default function g<K extends keyof SVGElementTagNameMap>(selector: K): GildedNodeList<SVGElementTagNameMap[K]>;
export default function g<K extends keyof MathMLElementTagNameMap>(selector: K): GildedNodeList<MathMLElementTagNameMap[K]>;
export default function g<K extends Element | HTMLElement = Element>(selector: string): GildedNodeList<K> {
    let items: any[] = []
    if (typeof selector === 'string') items = Array.from(document.querySelectorAll(selector))

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


const element = document.querySelectorAll('asdasdasdas')