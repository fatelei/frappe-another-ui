import { MenuDataItem } from '@umijs/route-utils';
import { request } from 'umi';


export async function queryMenus() {
  const parentMenus = await request<API.SidebarData>('/api/method/frappe.desk.moduleview.get_desktop_settings')
  const menus :MenuDataItem[] = []

  const keys = Object.keys(parentMenus.message);

  for (const key of keys) {
    const modules = parentMenus.message[key];
    for (const module of modules) {
      const moduleName = module.module_name.replaceAll(' ', '_');
      const menu: MenuDataItem = {
        path: `/modules/${moduleName}`,
        name: moduleName,
        icon: 'menu'
      }

      menu.children = [];

      if (key === 'Places') {
        menus.push(menu);
        continue;
      }

      try {
        const res = await getModuleView(module.module_name);
        if (res.message && res.message.data) {
          for (const item of res.message.data) {
            const innerChildren: MenuDataItem = {
              path: `/modules/${moduleName}/moduleview`,
              name: item.label,
              key: item.label
            };
            innerChildren.children = [];
            item.items.forEach((value: Frappe.IModuleViewItem) => {
              const docType = value.name.replaceAll(' ', '_');
              if (innerChildren.children) {
                innerChildren.children.push({
                  path: `/modules/${moduleName}/docTypes/${docType}`,
                  name: value.label,
                  icon: 'menu'
                });
              }
            })
            menu.children.push(innerChildren);
          }
        };
      } catch (err) {
        console.error(err);
      }

      menus.push(menu);
    }
  }
  return menus
}


export async function getModuleView(module: string) {
  const res = await request<API.IModuleView>('/api/method/frappe.desk.moduleview.get', {
    method: 'POST',
    requestType: 'form',
    data: {
      module
    }
  })
  return res
}
