type Page = 'handbook' | 'contact' | 'studio-pro';

export function isPage(value: string): value is Page {
    return value === 'handbook' || value === 'contact' || value === 'studio-pro';
}

function isObject(value: unknown): value is Record<string, unknown> {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function hasKeys(value: Record<string, unknown>, keys: string[]): boolean {
    return Object.keys(value).length === keys.length && keys.every((key) => Object.prototype.hasOwnProperty.call(value, key));
}

function isStringWithin(value: unknown, max: number): value is string {
    return typeof value === 'string' && value.length <= max;
}

function isMapUrl(value: unknown): boolean {
    if (!isStringWithin(value, 2048)) return false;
    if (value === '') return true;
    if (!/^https?:\/\/\S+$/i.test(value)) return false;
    try {
        const url = new URL(value);
        return (url.protocol === 'http:' || url.protocol === 'https:') && !!url.hostname;
    } catch {
        return false;
    }
}

export function validatePageContent(page: Page, value: unknown): boolean {
    if (!isObject(value)) return false;

    if (page === 'handbook') {
        return hasKeys(value, ['sections']) && Array.isArray(value.sections) && value.sections.length <= 30 &&
            value.sections.every((section: unknown) => isObject(section) && hasKeys(section, ['title', 'body']) &&
                isStringWithin(section.title, 200) && isStringWithin(section.body, 5000));
    }

    if (page === 'studio-pro') {
        return hasKeys(value, ['url', 'imageUrl']) && value.url !== '' && isMapUrl(value.url) &&
            isStringWithin(value.imageUrl, 255) && (value.imageUrl === '' || /^\/images\/[\w.-]+\.(?:png|jpe?g|gif|webp)$/i.test(value.imageUrl));
    }

    const keys = ['addressLine1', 'addressLine2', 'phone', 'email', 'officeHours', 'mapUrl'];
    return hasKeys(value, keys) &&
        isStringWithin(value.addressLine1, 200) && isStringWithin(value.addressLine2, 200) &&
        isStringWithin(value.phone, 50) && isStringWithin(value.email, 254) &&
        isStringWithin(value.officeHours, 500) && isMapUrl(value.mapUrl);
}