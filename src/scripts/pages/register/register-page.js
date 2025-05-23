import { StoryAPI } from '../../data/api.js';

export default class RegisterPage {
  async render() {
    return `
      <section class="container">
        <div class="auth-container">
        <h1>Register</h1>
        <img class="logo" src="https://assets.cdn.dicoding.com/original/commons/certificate_logo.png" alt="Logo" />
          <form id="register-form">
            <label for="name">Nama</label>
            <input id="name" type="text" placeholder="Masukkan nama lengkap" required />

            <label for="email">Email</label>
            <input id="email" type="email" placeholder="Masukkan email" required />

            <label for="password">Password</label>
            <div class="password-wrapper">
              <input id="password" type="password" placeholder="Masukkan password" minlength="8" required />
              <button type="button" id="toggle-password" class="toggle-password" aria-label="Tampilkan Password">👁️</button>
            </div>

            <button type="submit">Daftar</button>
          </form>

          <div class="auth-switch">
            <button type="button" id="to-login">Sudah punya akun? Masuk di sini</button>
          </div>

          <div id="register-status"></div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    document.body.classList.add('login-page');

    const form = document.getElementById('register-form');
    const status = document.getElementById('register-status');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      status.textContent = 'Memproses pendaftaran…';

      const payload = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        password: form.password.value,
      };

      try {
        const res = await StoryAPI.register(payload);
        if (res.error) {
          status.textContent = `Error: ${res.message}`;
        } else {
          status.textContent = 'Berhasil daftar! Mengalihkan ke login…';
          setTimeout(() => {
            location.hash = '/login';
          }, 1000);
        }
      } catch {
        status.textContent = 'Gagal mendaftar.';
      }
    });

    // Toggle password visibility
    const toggleBtn = document.getElementById('toggle-password');
    toggleBtn.addEventListener('click', () => {
      const passwordInput = document.getElementById('password');
      const isVisible = passwordInput.type === 'text';
      passwordInput.type = isVisible ? 'password' : 'text';
      toggleBtn.textContent = isVisible ? '👁️' : '🙈';
    });

    document.getElementById('to-login').addEventListener('click', () => {
      if (document.startViewTransition) {
        document.startViewTransition(() => {
          location.hash = '/login';
        });
      } else {
        location.hash = '/login';
      }
    });

    window.addEventListener('hashchange', () => {
      document.body.classList.remove('login-page');
    });
  }
}