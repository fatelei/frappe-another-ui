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
  export interface ISidebarModules {
    category: string
    label: string
    name: string
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
}
