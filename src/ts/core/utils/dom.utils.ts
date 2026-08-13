export function isButtonTarget(target: EventTarget | null): boolean {
    if (!target || !(target instanceof Element)) {
        return false;
    }
    return Boolean(target.closest("button"));
}

export function getRequiredElement<T extends HTMLElement>(id: string): T {
    const el = document.getElementById(id);
    if (!el) {
        throw new Error(`Required DOM element with id "${id}" was not found.`);
    }
    return el as T;
}
