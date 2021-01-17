/**
 * Generate fields to list.
 * @param docType 
 * @param fields 
 */
export const generateListFields = (fields: string[]): string[] => {
  const rsts: string[] = ['name'];

  for (const item of fields) {
    rsts.push(`${item}`)
  }
  return rsts;
}


/**
 * Generate fields to list.
 * @param docType 
 * @param fields 
 */
export const generateCountFields = (docType: string): string[] => {
  return [`count( \`name\`) AS total_count`];
}


/**
 * Generate fields to list.
 * @param docType 
 * @param fields 
 */
export const generateFilterFields = (field: string, operator: string, value: any): string[] => {
  return [field, operator, value];
}
