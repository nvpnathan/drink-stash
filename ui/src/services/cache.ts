import { Injectable } from '@angular/core';

// Local Storage cache lives for 3 days
const EXPIRY = 3 * 24 * 60 * 60 * 1000;

@Injectable()
export class CacheService {
    constructor(
    ) { }

    set(name: string, value: any): void {
        sessionStorage.setItem(name, JSON.stringify(value));
    }

    get(name: string): any {
        const item = sessionStorage.getItem(name);
        if (!item) return;
        return JSON.parse(item);
    }

    remove(name): void {
        sessionStorage.clearItem(name);
    }

    clear(): void {
        sessionStorage.clear();
    }
}
