import { error } from "console";
const util = require('util');
const sqlite3 = require('sqlite3');
const sqlUtils = require('../utils/sqlUtils');

const db = new sqlite3.Database('./ersc_db.db');
const getAll = util.promisify(db.all.bind(db));
const run = util.promisify(db.run.bind(db));

exports.initDB = () => {
    db.run('CREATE TABLE IF NOT EXISTS projects (id INTEGER PRIMARY KEY AUTOINCREMENT, name text, all_rows INTEGER, read_rows INTEGER, version text, entry text, base_dir text, user_id INTEGER, createdAt INTEGER, updatedAt INTEGER)');
    db.run('CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY AUTOINCREMENT, name text, pwd text)');
}

exports.getProjects = async (query: any) => {
    let sql = "select * from projects";
    let arr: Array<string> = [];
    Object.keys(query || {}).forEach(item => {
        if(!['pageSize', 'pageNum', 'order'].includes(item)) {
            arr.push(`${item} = '${query[item]}'`);
        }
    })
    if (arr.length) {
        sql += ` where ${arr.join(' and ')}`
    }
    sql += sqlUtils.formatSql(query);
    console.log(sql);
    return await getAll(sql, []);
}

exports.addProject = async (obj: Project.Project) => {
    let sql = `insert into projects (name, version, entry, all_rows, read_rows, base_dir, user_id, createdAt, updatedAt) values(
        '${obj.name}',
        '${obj.version}',
        '${obj.entry}',
        0,
        0,
        '${obj.base_dir}',
        ${obj.user_id || 1},
        ${obj.createdAt || Date.now()},
        ${obj.updatedAt || Date.now()}
    )`;

    console.log(sql);
    return run(sql);

}

exports.delProject = async (id: number) => {
    return run('DELETE FROM projects where id = ?', [id]);
}