import { queryMenus } from '@/services/menu';

export default {
  namespace: 'menu',
  state: {
    routes: [],
    loading: false
  },

  effects: {
    *getMenus(data: any, func: any) {
      yield func.put({
        type: 'startRequest'
      });
      const menus = yield func.call(queryMenus);
      yield func.put({
        type: 'generateMenus',
        menus
      });
    },
  },
  reducers: {
    generateMenus(state: any, payload: any) {
      return {
        ...state,
        routes: payload.menus || [],
        loading: false
      };
    },
    startRequest(state: any) {
      return {
        ...state,
        loading: true
      };
    }
  }
};
