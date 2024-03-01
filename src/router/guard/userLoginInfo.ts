import type { Router, LocationQueryRaw, RouteRecordRaw, RouteMeta } from 'vue-router';
import NProgress from 'nprogress'; // progress bar
import { useUserStore } from '@/store';
import { isLogin } from '@/utils/auth';
import formatModules from '../routes';
import { REDIRECT_MAIN } from '../routes/base';
import { AppRouteRecordRaw } from '../routes/types';

function hasPermission(meta: RouteMeta, auth: string[]) {
  /* eslint-disable */
  const { requiresAuth, roles } = meta;
  if (requiresAuth && roles) {
    return (roles as string[]).some((permission) => auth.indexOf(permission) >= 0);
  } else {
    return true;
  }
}

export default function setupUserLoginInfoGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    NProgress.start();
    const userStore = useUserStore();
    if (isLogin()) {
      if (userStore.auth.length) {
        next();
      } else {
        try {
          if (!userStore.auth.length) {
            await userStore.info();
            // 生成权限路由表
            const modules = import.meta.glob('../routes/modules/*.ts', { eager: true });
            let appRoutes: AppRouteRecordRaw[] = formatModules(modules, []);
            appRoutes = appRoutes.filter((route) => {
              if (hasPermission(route.meta as RouteMeta, userStore.auth)) {
                if (route.children && route.children.length > 0) {
                  route.children = route.children.filter((childRoute) => {
                    if (hasPermission(childRoute.meta as RouteMeta, userStore.auth)) {
                      return childRoute;
                    }
                    return false;
                  });
                  return route;
                } else {
                  return route;
                }
              }
              return false;
            });
            let removeAsyncFns = [];
            appRoutes.forEach((route) => {
              let removeFn = router.addRoute(route as RouteRecordRaw);
              removeAsyncFns.push(removeFn);
            });
            userStore.setRemoveAsyncRouteFns(removeAsyncFns);
            router.addRoute(REDIRECT_MAIN);
          }
          next();
        } catch (error) {
          console.log('err: ', error);
          await userStore.logout();
          next({
            name: 'login',
            // query: {
            //   redirect: to.name,
            //   ...to.query,
            // } as LocationQueryRaw,
          });
        }
      }
    } else {
      if (to.name === 'login') {
        next();
        return;
      }
      next({
        name: 'login',
        query: {
          redirect: to.name,
          ...to.query,
        } as LocationQueryRaw,
      });
    }
  });
}
