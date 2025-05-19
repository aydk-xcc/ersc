// @ts-ignore
import * as acorn from "acorn";

export function parseAst(str: string) {
    return acorn.parse(str, {
        ecmaVersion: 2020,
        sourceType: 'module'
    })
}
