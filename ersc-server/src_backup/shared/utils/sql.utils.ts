/**
 * 格式化SQL查询条件
 */
export function formatSqlQuery(query: any): string {
  let sqlFragment = '';
  
  // 处理排序
  if (query.order) {
    sqlFragment += ` ORDER BY ${query.order}`;
  } else {
    sqlFragment += ' ORDER BY updatedAt DESC';
  }
  
  // 处理分页
  if (query.pageSize && query.pageNum) {
    const offset = (parseInt(query.pageNum) - 1) * parseInt(query.pageSize);
    sqlFragment += ` LIMIT ${parseInt(query.pageSize)} OFFSET ${offset}`;
  }
  
  return sqlFragment;
} 