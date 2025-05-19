import { MockMethod } from 'vite-plugin-mock';
import Mock from 'mockjs';
import { projectUrl } from '../../src/const/url';

const Random = Mock.Random;

let nameArr = ['react', 'vue', 'angular', 'node', 'express', 'koa', 'egg'];
let versionArr = ['1.0.0', '2.0.0', '3.0.0', '4.0.0', '5.0.0', '6.0.0', '7.0.0'];
interface ProjectData {
  id: string;
  name: string;
  version: string;
  description: string;
}

// 生成用户列表数据
const generateUserList = (count: number): ProjectData[] => {
  const list: ProjectData[] = [];
  for (let i = 0; i < count; i++) {
    list.push({
      id: Random.id(),
      name: nameArr[i % nameArr.length],
      version: versionArr[i % versionArr.length],
      description: Random.string('number', 11),
    });
  }
  return list;
};
console.log(projectUrl.projectsUrl);
export default [
  {
    url: projectUrl.projectsUrl,
    method: 'get',
    response: ({ query }: { query: Record<string, any> }) => {
      const { page = 1, pageSize = 10 } = query;
      const list = generateUserList(100);
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      console.log('mock');
      return {
        code: 200,
        data: {
          list: list.slice(start, end),
          total: list.length,
          page: Number(page),
          pageSize: Number(pageSize),
        },
        message: 'success'
      };
    }
  },
  {
    url: projectUrl.singleProjectsUrl,
    method: 'get',
    response: ({ params }: { params: Record<string, any> }) => {
      return {
        code: 200,
        data: {
          id: params.id,
          name: nameArr[params.id % nameArr.length],
          version: versionArr[params.id % versionArr.length],
          description: Random.string('number', 11),
        },
        message: 'success'
      };
    }
  }
] as MockMethod[]; 