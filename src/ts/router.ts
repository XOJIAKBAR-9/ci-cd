import { PagesList } from './base/enums';
import { isPlantsId } from './base/helpers';
import Cart from './components/cart';
import CartPage from './pages/cart-page';
import CatalogPage from './pages/catalog-page';
import ErrorPage from './pages/error-page';
import PlantPage from './pages/plant-page';

class Router {
  static catalogPage: CatalogPage;
  static cartPage: CartPage;
  static plantPage: PlantPage;
  static errorPage: ErrorPage;

  constructor(cart: Cart) {
    Router.catalogPage = new CatalogPage(cart);
    Router.cartPage = new CartPage(cart);
    Router.plantPage = new PlantPage(cart);
    Router.errorPage = new ErrorPage(cart);
  }

  static render(pathname: string) {
    // console.log('render:', pathname);
    switch (pathname) {
      case PagesList.catalogPage:
        Router.catalogPage.draw();
        break;
      case PagesList.cartPage:
        Router.cartPage.draw();
        break;
      case '/':
        this.goTo(PagesList.catalogPage);
        break;
      default:
        if (isPlantsId(pathname)) {
          Router.plantPage.draw(pathname.slice(1));
        } else {
          Router.errorPage.draw();
        }
        break;
    }
    Router.changeLinks();
  }

  static cleanPath(path: string) {
    let clean = path.replace('/ci-cd', '');
    return clean === '' ? '/' : clean;
  }

  static getBasePath() {
    return window.location.hostname.includes('github.io') ? '/ci-cd' : '';
  }

  static goTo(pageId: string) {
    const basePath = Router.getBasePath();
    const fullPath = basePath + (pageId === '/' ? '' : pageId);
    
    window.history.pushState({ pageId }, pageId, fullPath || '/');
    Router.render(pageId);
    window.scrollTo(0, 0);
  }

  static changeLinks() {
    const links = document.querySelectorAll('[href^="/"]');
    links.forEach((link) => {
      if (!link.classList.contains('link-changed')) {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          if (link instanceof HTMLAnchorElement) {
            let path = Router.cleanPath(new URL(link.href).pathname);
            let currentPath = Router.cleanPath(new URL(window.location.href).pathname);
            
            if (path !== currentPath) {
              Router.goTo(path);
            }
          }
        });
        link.classList.add('link-changed');
      }
    });
  }

  static startRouter() {
    window.addEventListener('popstate', () => {
      const path = Router.cleanPath(new URL(window.location.href).pathname);
      Router.render(path);
    });
    
    const page = Router.cleanPath(new URL(window.location.href).pathname);
    Router.render(page);
  }
}

export default Router;