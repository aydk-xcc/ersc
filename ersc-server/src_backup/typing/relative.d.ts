declare namespace Relative {
    interface Imports {
        name: string;
        is_out: boolean,
        fromFile: string;
        specifiers: Array<string>;
    }

    interface Exports {
        name: string;
        value: string;
        type: string;
    }

    interface RelativeUnit {
        name: string,
        path: string;
        imports: Array<Imports>;
        exports: Array<Exports>;
    }
}