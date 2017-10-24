export abstract class Node {
    public get isFile(): boolean {
        return false;
    }

    public get isCollection(): boolean {
        return false;
    }
}
