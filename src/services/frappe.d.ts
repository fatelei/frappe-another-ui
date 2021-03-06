declare namespace Frappe {
  export interface ISidebarAdministration {
    category: string
    label: string
    name: string
  }
  export interface ISidebarDomain {
    category: string
    label: string
    name: string
  }

  export interface ILink {
    name: string
    label: string
    type: string
    description: string
  }

  export interface IModule {
    app: string
    category: string
    color: string
    icon: string
    label: string
    links: ILink[]
    module_name: string
    type: string
  }

  export interface ISidebarModules {
    category: string
    label: string
    moduleName: string
    app: string
    links: ILink[]
  }

  interface ISidebarCard {
    creation: string
    docstatus: number
    doctype: number
    hidden: number
    idx: number
    label: string
    modified: string
    modifiedBy: string
    name: string
    owner: string
    parent: string
    parentfield: string
    parenttype: string
    links: ISidebarItemLink[]
    link_to: string
  }

  interface ISidebarItemLink {
    count: number
    dependencies: string[]
    description: string
    incompleteDependencies: string[]
    label: string
    name: string
    onboard: number
    type: string
  }

  interface ISidebarCards {
    items: ISidebarCard[]
    label: string
  }

  export interface ISidebarPage {
    allowCustomization: boolean
    cards: ISidebarCards
    charts: ISidebarCards
    shortcuts: ISidebarCards
  }

  export interface ISidebar {
    Administration: ISidebarAdministration[]
    Domains: ISidebarDomain[]
    Modules: ISidebarModules[]
  }

  export interface IModuleDesktopSettings {
    Administration: IModule[]
    Domains: IModule[]
    Modules: IModule[]
    Places:  IModule[]
  }

  export interface IModuleViewItem {
    count: number
    label: string
    name: string
    onboard: number
    type: string
  }

  export interface IModuleViewCard {
    items: IModuleViewItem[]
    label: string
    icon: string
  }

  export interface IModuleViewResponse {
    data: IModuleViewCard[]
  }

  export interface ISearchLink {
    value: string
    description: string
  }
}
