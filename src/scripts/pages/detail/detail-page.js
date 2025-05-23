// import { StoryAPI } from '../../data/api.js';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';

// export default class DetailPage {
//   constructor({ id }) {
//     this.id = id;  // harus berupa 'story-XYZ'
//   }

//   async render() {
//     return `
//       <section class="container">
//         <button id="btn-back">← Kembali</button>
//         <div id="detail-content">Loading…</div>
//       </section>
//     `;
//   }

//   async afterRender() {
//     document.getElementById('btn-back').addEventListener('click', () => history.back());
//     const container = document.getElementById('detail-content');
//     const token = localStorage.getItem('token');

//     if (!this.id) {
//       container.innerHTML = `<p>ID cerita tidak ditemukan.</p>`;
//       return;
//     }

//     try {
//       const { story, error, message } = await StoryAPI.getStoryDetail(this.id, token);
//       if (error) {
//         container.innerHTML = `<p>${message}</p>`;
//         return;
//       }

//       container.innerHTML = `
//         <h1>${story.name}</h1>
//         <img src="${story.photoUrl}" alt="Foto oleh ${story.name}" />
//         <p>${story.description}</p>
//         <div id="map-detail" style="height:300px; margin:1rem 0;"></div>
//       `;

//       const map = L.map('map-detail').setView([story.lat, story.lon], 5);
//       const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
//       const topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png');
//       osm.addTo(map);
//       L.control.layers({ OSM: osm, Topo: topo }).addTo(map);
//       L.marker([story.lat, story.lon]).addTo(map).bindPopup(story.name);
//     } catch (err) {
//       container.innerHTML = `<p>Gagal memuat detail cerita. ${err.message}</p>`;
//     }
//   }
// }
// src/scripts/pages/detail/detail-page.js
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import DetailPresenter from './detail-presenter.js';

export default class DetailPage {
  constructor({ id }) {
    this.presenter = new DetailPresenter({ view: this, id });
  }

  async render() {
    return `
      <section class="container">
        <button id="btn-back">← Kembali</button>
        <div id="loading-container"></div>
        <div id="detail-content"></div>
      </section>
    `;
  }

  async afterRender() {
    document.getElementById('btn-back').addEventListener('click', () => history.back());
    await this.presenter.showDetail();
  }

  showLoading() {
    document.getElementById('loading-container').innerHTML = `<div class="loader"></div>`;
  }
  hideLoading() {
    document.getElementById('loading-container').innerHTML = '';
  }

renderDetail(story) {
  document.getElementById('detail-content').innerHTML = `
    <h1>${story.name}</h1>
    <!-- ganti langsung <img> menjadi dalam container: -->
    <div class="detail-image-container">
      <img src="${story.photoUrl}" alt="Foto oleh ${story.name}" class="detail-image"/>
    </div>
    <p>${story.description}</p>
    <div id="map-detail" style="height:300px; margin:1rem 0;"></div>
  `;

    // Inisialisasi map
    const map = L.map('map-detail').setView([story.lat, story.lon], 5);
    const osm  = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    const topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png');
    L.control.layers({ OSM: osm, Topo: topo }).addTo(map);

    // Tambahkan marker
    const marker = L.marker([story.lat, story.lon]).addTo(map);

    // Reverse geocoding untuk dapatkan provinsi
    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${story.lat}&lon=${story.lon}&format=json`, {
      headers: {
        'User-Agent': 'YourAppName (your@email.com)'
      }
    })
      .then(response => response.json())
      .then(data => {
        const province = data.address.state || "Provinsi tidak ditemukan";
        marker.bindPopup(`
          <strong>${story.name}</strong><br>
          Lat: ${story.lat}<br>
          Lon: ${story.lon}<br>
          Provinsi: ${province}
        `).openPopup();
      })
      .catch(error => {
        console.error('Gagal mendapatkan data provinsi:', error);
        marker.bindPopup(`
          <strong>${story.name}</strong><br>
          Lat: ${story.lat}<br>
          Lon: ${story.lon}<br>
          Provinsi: Gagal dimuat
        `).openPopup();
      });
  }

  renderError(msg) {
    document.getElementById('detail-content').innerHTML = `<p>${msg}</p>`;
  }
}