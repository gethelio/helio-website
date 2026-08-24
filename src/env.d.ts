/// <reference path="../.astro/types.d.ts" />

declare global {
    interface Window {
        dataLayer: any[];
    }

    function gtag(command: 'consent', action: 'default' | 'update', params: Record<string, string>): void;
    function gtag(command: 'js', date: Date): void;
    function gtag(command: 'config', targetId: string, config?: Record<string, unknown>): void;
    function gtag(command: 'event', eventName: string, eventParams?: Record<string, unknown>): void;
    function gtag(command: string, ...args: any[]): void;
}

export {};
