import { MenuDataItem } from '@umijs/route-utils';
import { request } from 'umi';

export async function querySecondLevelMenu(page: string) {
  const formData = new FormData()
  formData.append('page', page)
  return request<API.SidebarDeskItem>('/api/method/frappe.desk.desktop.get_desktop_page', {
    method: 'POST',
    data: formData
  })
}


export async function queryMenus() {
  const parentMenus = await request<API.SidebarData>('/api/method/frappe.desk.desktop.get_desk_sidebar_items')
  const modules = parentMenus.message.Modules
  const menus :MenuDataItem[] = []
  for (const module of modules) {
    const menu: MenuDataItem = {
      path: `/modules/${module.name}`,
      name: module.label,
      icon: 'menu'
    }
    menu.children = [];
    const children = await querySecondLevelMenu(module.name)
    if (children.message.cards.items.length > 0) {
      menu.children.push({
        path: `/modules/${module.name}/cards`,
        name: 'Reports & Masters',
        exact: true
      })
    }

    if (children.message.shortcuts) {
      for (const shortcut of children.message.shortcuts.items) {
        menu.children.push({
          path: `/modules/${module.name}/list/${shortcut.link_to}`,
          name: shortcut.label
        })
      }
    }
    
    menus.push(menu)
  }
  return menus
}
