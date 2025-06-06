import HomePresenter from './home-presenter.js';

export default class HomePage {
  constructor() {
    this.presenter = new HomePresenter({ view: this });
  }

  async render() {
    return `
      <section class="container">
        <h1>Daftar Cerita</h1>
        <br>
        <div id="loading-container"></div>
        <div id="story-list" class="story-list"></div>
      </section>
    `;
  }

  async afterRender() {
    if (!navigator.onLine) {
      location.hash = '/offline'; // Redirect to offline page when offline
      return;
    }

    await this.presenter.showStories();
  }

  showLoading() {
    document.getElementById('loading-container').innerHTML = `<div class="loader"></div>`;
  }

  hideLoading() {
    document.getElementById('loading-container').innerHTML = '';
  }

  renderStories(stories) {
    const container = document.getElementById('story-list');
    container.innerHTML = stories
      .map(
        (s) => `
          <article class="story-card">
            <a href="#/detail/${s.id}">
              <div class="story-image-container">
                <img src="${s.photoUrl || ''}" alt="Foto oleh ${s.name}" class="story-image"/>
              </div>
              <h2>${s.name}</h2>
              <p>${s.description.slice(0, 100)}…</p>
              <p><small>Dibuat: ${s.formattedDate || '-'}</small></p>
              <p><small>Lokasi: ${s.lat || 0}, ${s.lon || 0}</small></p>
            </a>
          </article>
        `
      )
      .join('');
  }

  renderError(msg) {
    document.getElementById('story-list').innerHTML = `<p>${msg}<br>Silakan login atau coba lagi.</p>`;
  }
}