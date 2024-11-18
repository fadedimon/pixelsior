const selectors = {
    root: '.js-welcome',
    item: '.js-welcome__item',
};

export async function createWelcome() {
    const root = document.querySelector(selectors.root);
    const items: HTMLLIElement[] = Array.from(root!.querySelectorAll(selectors.item));

    await wait(500);

    for (const item of items) {
        const transitionEnd = waitForTransitionEnd(item);
        const height = item.children[0].clientHeight;

        item.style.height = `${height}px`;
        item.style.opacity = '1';

        await transitionEnd;
    }
}

function wait(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

function waitForTransitionEnd(elem: HTMLElement) {
    return new Promise((resolve) => {
        elem.addEventListener('transitionend', resolve, { once: true });
    });
}
