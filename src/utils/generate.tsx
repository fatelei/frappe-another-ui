/**
 * Generate fields to list.
 * @param docType 
 * @param fields 
 */
export const generateListFields = (docType: string, fields: string[]): string[] => {
  const rsts: string[] = [];

  for (const item of fields) {
    rsts.push(`\`tab${docType}\`.\`${item}\``)
  }
  return rsts;
}


/**
 * Generate fields to list.
 * @param docType 
 * @param fields 
 */
export const generateCountFields = (docType: string): string[] => {
  return [`count( \`tab${docType}\`.\`name\`) AS total_count`];
}


/**
 * Generate fields to list.
 * @param docType 
 * @param fields 
 */
export const generateFilterFields = (field: string, operator: string, value: any): string[] => {
  return [field, operator, value];
}
