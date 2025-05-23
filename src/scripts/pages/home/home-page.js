// // src/scripts/pages/home/home-page.js
// import { StoryAPI } from '../../data/api.js';

// export default class HomePage {
//   async render() {
//     return `
//       <section class="container">
//         <h1>Daftar Cerita</h1>
//         <div id="story-list" class="story-list">Loading…</div>
//       </section>
//     `;
//   }

//   async afterRender() {
//     const container = document.getElementById('story-list');
//     const token = localStorage.getItem('token');

//     try {
//       const { listStory } = await StoryAPI.getStories({ location: 1 }, token);
//       container.innerHTML = listStory.map(s => `
//         <article class="story-card">
//           <a href="#/detail/${s.id}">
//             <img src="${s.photoUrl}" alt="Foto oleh ${s.name}" />
//             <h2>${s.name}</h2>
//             <p>${s.description.slice(0, 100)}…</p>
//           </a>
//         </article>
//       `).join('');
//     } catch {
//       container.innerHTML = `<p>Gagal memuat cerita.</p>`;
//     }
//   }
// }

// src/scripts/pages/home/home-page.js
import HomePresenter from './home-presenter.js';

export default class HomePage {
  constructor() {
    this.presenter = new HomePresenter({ view: this });
  }

  async render() {
    return `
      <section class="container">
        <h1>Daftar Cerita</h1>
        <div id="loading-container"></div>
        <div id="story-list" class="story-list"></div>
      </section>
    `;
  }

  async afterRender() {
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
              <img src="${s.photoUrl}" alt="Foto oleh ${s.name}" class="story-image"/>
            </div>
            <h2>${s.name}</h2>
            <p>${s.description.slice(0, 100)}…</p>
            <p><small>Dibuat: ${s.formattedDate}</small></p>
            <p><small>Lokasi: ${s.lat.toFixed(4)}, ${s.lon.toFixed(4)}</small></p>
          </a>
        </article>
      `
      )
      .join('');
  }
  renderError(msg) {
    document.getElementById('story-list').innerHTML = `<p>${msg} <br>Silahkan login terlebih dahulu</p>`;
  }
}
