import { error } from "console";
const util = require('util');

const sqlite3 = require('sqlite3');

const db = new sqlite3.Database('./ersc_db.db');
const getAll = util.promisify(db.all.bind(db));

exports.initDB = () => {
    db.run('CREATE TABLE IF NOT EXISTS projects (id INTEGER PRIMARY KEY AUTOINCREMENT, name text, process FLOAT, entry text, base_dir text, user_id INTEGER, createdAt INTEGER, updatedAt INTEGER)');
    db.run('CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY AUTOINCREMENT, name text, pwd text)');
}

exports.getProjects = async (useId: number) => {
    return await getAll("select * from projects where user_id = ?", useId);
}

exports.addProject = async (obj: Project.Project) => {
    db.prepare(`insert into projects (name, entry, process, base_dir, user_id, createdAt, updatedAt) values(
        ${obj.name},
        ${obj.entry},
        ${obj.process},
        ${obj.base_dir},
        ${obj.user_id},
        ${obj.createdAt},
        ${obj.updatedAt},
    )`);
    await db.run();
}

exports.delProject = async (obj: Project.Project) => {
    db.prepare(`insert into projects (name, entry, process, base_dir, user_id, createdAt, updatedAt) values(
        ${obj.name},
        ${obj.entry},
        ${obj.process},
        ${obj.base_dir},
        ${obj.user_id},
        ${obj.createdAt},
        ${obj.updatedAt},
    )`);
    await db.run();
}