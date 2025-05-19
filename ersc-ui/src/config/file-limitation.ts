const ALLOW_FILE_MITY = [
    '.js',
    '.jsx',
    '.ts'
];

const UN_ALLOW_FILE_DIRECTORY = [
    'node_modules/',
    'output/',
    '.ersc/',
    'dist/',
    'static/',
    'example/',
    'examples/',
    'test/',
    'types/',
    'typing/',
    'docs/',
    'assets/',
    'scripts/',
    'jest.config.js',
    'rollup.config.js'
]

function isAllowDirectory(name: string) {
    return !UN_ALLOW_FILE_DIRECTORY.find(item => name.includes(item));
}

function isAllowFileType(name: string) {
    return ALLOW_FILE_MITY.find(item => name.endsWith(item));
}
export default function (name: string) {
    return isAllowDirectory(name) && isAllowFileType(name);
}