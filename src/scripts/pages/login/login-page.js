import { StoryAPI } from '../../data/api.js';

export default class LoginPage {
  async render() {
    return `
      <section class="container">
        <div class="auth-container">
          <h1>Login</h1>
          <img class="logo" src="https://assets.cdn.dicoding.com/original/commons/certificate_logo.png" alt="Logo" />
          <form id="login-form">
            <label for="email">Email</label>
            <input id="email" type="email" placeholder="Masukkan email" required />

            <label for="password">Password</label>
            <div class="password-wrapper">
              <input id="password" type="password" placeholder="Masukkan password" required />
              <button type="button" class="toggle-password" aria-label="Tampilkan Password">👁️</button>
            </div>

            <button type="submit">Masuk</button>
          </form>

          <div class="auth-switch">
            <button type="button" id="to-register">Belum punya akun? Daftar di sini</button>
          </div>

          <div id="login-status"></div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    document.body.classList.add('login-page');

    const form = document.getElementById('login-form');
    const status = document.getElementById('login-status');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      status.textContent = 'Memproses…';
      const email = e.target.email.value.trim();
      const password = e.target.password.value;

      try {
        const res = await StoryAPI.login({ email, password });
        if (res.error) {
          status.textContent = `Error: ${res.message}`;
        } else {
          location.hash = '/';
        }
      } catch {
        status.textContent = 'Login gagal.';
      }
    });

    const toggleBtn = document.querySelector('.toggle-password');
    toggleBtn.addEventListener('click', () => {
      const passInput = document.getElementById('password');
      const isVisible = passInput.type === 'text';
      passInput.type = isVisible ? 'password' : 'text';
      toggleBtn.textContent = isVisible ? '👁️' : '🙈';
    });

    document.getElementById('to-register').addEventListener('click', () => {
      if (document.startViewTransition) {
        document.startViewTransition(() => {
          location.hash = '/register';
        });
      } else {
        location.hash = '/register';
      }
    });

    window.addEventListener('hashchange', () => {
      document.body.classList.remove('login-page');
    });
  }
}