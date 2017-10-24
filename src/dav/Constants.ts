export class Constants {
    // Default Content-Type header
    public static readonly contentType: string  = 'application/xml; charset=utf-8';

    // DAV namespaces
    public static readonly davNamespace: string = 'DAV:';
    public static readonly appNamespace: string = 'https://illogeek.eu/yawds';

    // DAV elements
    public static readonly propfindElem: string = `{${Constants.davNamespace}}propfind`;
    public static readonly propElem: string     = `{${Constants.davNamespace}}prop`;
    public static readonly propnameElem: string = `{${Constants.davNamespace}}propname`;
    public static readonly allpropElem: string  = `{${Constants.davNamespace}}allprop`;
    public static readonly includeElem: string  = `{${Constants.davNamespace}}include`;
}
