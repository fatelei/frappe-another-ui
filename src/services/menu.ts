import { IRoute, request } from 'umi';

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
  const menus :IRoute[] = []
  for (const module of modules) {
    const menu: IRoute = {
      path: `/modules/${module.name}`,
      name: module.label,
      children: []
    }
    const children = await querySecondLevelMenu(module.name)
    if (children.message.cards.items.length > 0) {
      menu.children.push({
        path: `/modules/${module.name}/cards`,
        name: 'Reports & Masters'
      })
    }

    if (children.message.shortcuts) {
      for (const shortcut of children.message.shortcuts.items) {
        menu.children.push({
          path: `/modules/${module.name}/list/${shortcut.name}`,
          name: shortcut.label
        })
      }
    }
    
    menus.push(menu)
  }
  return menus
}
