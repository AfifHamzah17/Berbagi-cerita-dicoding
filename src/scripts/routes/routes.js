// src/scripts/routes/routes.js
import RegisterPage from '../pages/register/register-page.js';
import LoginPage    from '../pages/login/login-page.js';
import HomePage     from '../pages/home/home-page.js';
import AddPage from '../pages/about/about-page.js'; 
import DetailPage from '../pages/detail/detail-page.js';

export default {
  '/register': RegisterPage,
  '/login':    LoginPage,
  '/':         HomePage,
  '/add': AddPage,
  '/detail/:id': DetailPage,
};