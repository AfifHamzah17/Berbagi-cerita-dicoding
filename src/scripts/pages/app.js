// import routes from '../routes/routes.js';
// import { getActiveRoute, getRouteParams } from '../routes/url-parser.js';

// export default class App {
//   constructor({ content, drawerButton, navigationDrawer }) {
//     this.content = content;
//     this.drawerButton = drawerButton;
//     this.navigationDrawer = navigationDrawer;
//     this._setupDrawer();
//   }

  // _setupDrawer() {
  //   this.drawerButton.addEventListener('click', () => {
  //     this.navigationDrawer.classList.toggle('open');
  //   });
  //   document.body.addEventListener('click', (e) => {
  //     if (
  //       !this.navigationDrawer.contains(e.target) &&
  //       !this.drawerButton.contains(e.target)
  //     ) {
  //       this.navigationDrawer.classList.remove('open');
  //     }
  //   });
  // }

//   async renderPage() {
//     const routeKey = getActiveRoute();
//     const params = getRouteParams();
//     const Page = routes[routeKey];

//     const token = localStorage.getItem('token');
//     if (!token && !['/login', '/register'].includes(routeKey)) {
//       location.hash = '/login';
//       return;
//     }

//     if (!Page) {
//       this.content.innerHTML = '<p>Halaman tidak ditemukan</p>';
//       return;
//     }

//     const page = new Page(params);

//     // Gunakan View Transition API jika tersedia
//     if (document.startViewTransition) {
//       document.startViewTransition(async () => {
//         this.content.innerHTML = await page.render();
//         await page.afterRender();
//       });
//     } else {
//       // fallback biasa
//       this.content.innerHTML = await page.render();
//       await page.afterRender();
//     }
//   }
// }

import routes from '../routes/routes.js';
import { getActiveRoute, getRouteParams } from '../routes/url-parser.js';

export default class App {
  constructor({ content, drawerButton, navigationDrawer }) {
    this.content = content;
    this.drawerButton = drawerButton;
    this.navigationDrawer = navigationDrawer;
    this._setupDrawer();
  }

  _setupDrawer() {
    this.drawerButton.addEventListener('click', () => {
      this.navigationDrawer.classList.toggle('open');
    });
    document.body.addEventListener('click', (e) => {
      if (
        !this.navigationDrawer.contains(e.target) &&
        !this.drawerButton.contains(e.target)
      ) {
        this.navigationDrawer.classList.remove('open');
      }
    });
  }

  async renderPage() {
    const routeKey = getActiveRoute();
    const params   = getRouteParams();
    const Page     = routes[routeKey];
    if (!Page) { this.content.innerHTML = '<p>Halaman tidak ditemukan</p>'; return; }
    const page = new Page(params);
    if (document.startViewTransition) {
      document.startViewTransition(async () => {
        this.content.innerHTML = await page.render();
        await page.afterRender();
      });
    } else {
      this.content.innerHTML = await page.render();
      await page.afterRender();
    }
  }
}
