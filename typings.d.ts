declare module 'on-finished' {
    function onFinished(res: any, listener: Function): void;
    namespace onFinished {}
    export = onFinished;
}

declare module 'on-headers' {
    function onHeaders(res: any, listener: Function): void;
    namespace onHeaders {}
    export = onHeaders;
}

declare module 'range_check' {
    export function inRange(ip: string, range: string): boolean;
    export function isIP(ip: string): boolean;
    export function displayIP(ip: string): string;
}
