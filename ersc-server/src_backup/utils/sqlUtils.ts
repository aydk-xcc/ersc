exports.formatSql = (query: any) => {
    let str = '';
    if (+query['pageNum'] && +query['pageSize']) {
        str += ` limit ${query['pageSize']} OFFSET ${(query['pageNum'] - 1) * query['pageSize']} `;
    } else if (query['order']) {
        if (query['order'].startsWith('-')) {
            str += ` orderBy ${query['order'].slice(1)} DESC`;
        } else {
            str += ` orderBy ${query['order']} ASC`;
        }
    }
    return str;
}