declare namespace API {
  export interface CurrentUser {
    avatar?: string;
    name?: string;
    message?: string;
    title?: string;
    group?: string;
    signature?: string;
    tags?: {
      key: string;
      label: string;
    }[];
    userid?: string;
    access?: 'user' | 'guest' | 'admin';
    unreadCount?: number;
  }

  export interface LoginStateType {
    message?: string;
    exc?: string;
    type?: string;
  }

  export interface NoticeIconData {
    id: string;
    key: string;
    avatar: string;
    title: string;
    datetime: string;
    type: string;
    read?: boolean;
    description: string;
    clickClose?: boolean;
    extra: any;
    status: string;
  }

  export interface SidebarData {
    message: Frappe.IModuleDesktopSettings
  }

  export interface SidebarDeskItem {
    message: Frappe.ISidebarPage
  }

  export interface SearchLink {
    results: Frappe.ISearchLink[]
  }

  export interface ValidateSearchLink {
    message: string
    valid_value: string
  }

  export interface IModuleView {
    message: Frappe.IModuleViewResponse
  }
}
