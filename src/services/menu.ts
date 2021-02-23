import { MenuDataItem } from '@umijs/route-utils';
import { request } from 'umi';


export async function queryMenus() {
  const parentMenus = await request<API.SidebarData>('/api/method/frappe.desk.moduleview.get_desktop_settings')
  const menus :MenuDataItem[] = []

  const keys = Object.keys(parentMenus.message);

  for (const key of keys) {
    const modules = parentMenus.message[key];
    for (const [index, module] of modules.entries()) {
      const moduleName = module.module_name.replaceAll(' ', '_');
      const menu: MenuDataItem = {
        path: `/modules/${moduleName}`,
        name: moduleName,
        icon: 'menu',
        key: `${moduleName}-${index}`
      }

      menu.children = [];

      if (key === 'Places') {
        menus.push(menu);
        continue;
      }

      try {
        const res = await getModuleView(module.module_name);
        if (res.message && res.message.data) {
          for (const [innerIndex, item] of res.message.data.entries()) {
            const innerChildren: MenuDataItem = {
              path: `/modules/${moduleName}/desk/${moduleName}-${innerIndex}`,
              name: `${item.label}`,
              key: `${moduleName}-${index}-${innerIndex}`
            };
            innerChildren.children = [];
            item.items.forEach((value: Frappe.IModuleViewItem, childIndex: number) => {
              const docType = value.name.replaceAll(' ', '_');
              if (innerChildren.children) {
                innerChildren.children.push({
                  path: value.type === 'doctype' ? `/modules/${moduleName}/desk/${moduleName}-${innerIndex}/docTypes/${docType}` : `/modules/${moduleName}/desk/${moduleName}-${index}/pages/${docType}`,
                  name: value.label,
                  icon: 'menu',
                  key: `${moduleName}-${index}-${innerIndex}-${childIndex}`
                });
              }
            })
            if (moduleName === 'Settings' && item.label === '核心') {
              innerChildren.children.push({
                path: `/modules/${moduleName}/desk/${moduleName}-${innerIndex}/docTypes/Session_Default_Settings`,
                name: '会话默认值',
                hideInMenu: true,
                icon: 'menu'
              });
            }
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
