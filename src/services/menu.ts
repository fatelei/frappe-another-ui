import { MenuDataItem } from '@umijs/route-utils';
import { request } from 'umi';


export async function queryMenus() {
  const parentMenus = await request<API.SidebarData>('/api/method/frappe.desk.moduleview.get_desktop_settings')
  const menus :MenuDataItem[] = []

  Object.keys(parentMenus.message).map((key: string) => {
    const modules = parentMenus.message[key];
    for (const module of modules) {
      const moduleName = module.module_name.replaceAll(' ', '_');
      const menu: MenuDataItem = {
        path: `/modules/${moduleName}`,
        name: moduleName,
        icon: 'menu'
      }
      
      menu.children = [];
      for (const link of module.links) {
        const docType = link.name.replaceAll(' ', '_');
        menu.children.push({
          path: `/modules/${moduleName}/list/${docType}`,
          name: link.label
        })
      }
      menus.push(menu)
    }
  });
  return menus
}
