import { MenuDataItem } from '@umijs/route-utils';
import { request } from 'umi';


export async function queryMenus() {
  const parentMenus = await request<API.SidebarData>('/api/method/frappe.desk.moduleview.get_desktop_settings')
  const menus :MenuDataItem[] = []

  Object.keys(parentMenus.message).map((key: string) => {
    const modules = parentMenus.message[key];
    for (const module of modules) {
      const menu: MenuDataItem = {
        path: `/modules/${module.module_name}`,
        name: module.module_name,
        icon: 'menu'
      }
      
      menu.children = [];
      for (const link of module.links) {
        menu.children.push({
          path: `/modules/${module.module_name}/list/${link.name}`,
          name: link.label
        })
      }
      menus.push(menu)
    }
  });
  return menus
}
