const acorn = require("acorn");

export function parseAst(str) {
    return acorn.parse(str, {
        ecmaVersion: 2020,
        sourceType: 'module'
    })
}
