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
    document.getElementById('btn-back')
      .addEventListener('click', () => history.back());
    await this.presenter.showDetail();
  }

  showLoading() {
    document.getElementById('loading-container')
      .innerHTML = `<div class="loader"></div>`;
  }
  hideLoading() {
    document.getElementById('loading-container').innerHTML = '';
  }

  renderDetail(story) {
    document.getElementById('detail-content').innerHTML = `
      <h1>${story.name}</h1>
      <div class="detail-image-container">
        <img src="${story.photoUrl}"
             alt="Foto oleh ${story.name}"
             class="detail-image"/>
      </div>
      <p>${story.description}</p>
      <p><small>Provinsi: ${story.province || 'Tidak diketahui'}</small></p>
      <p><small>latitude: ${story.lat || 'Tidak diketahui'}</small></p>
      <p><small>longitude : ${story.lon || 'Tidak diketahui'}</small></p>
      <div id="map-detail" style="height:300px; margin:1rem 0;"></div>
    `;

    // inisialisasi map & marker
    const map = L.map('map-detail').setView([story.lat, story.lon], 5);
    const osm  = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
                   .addTo(map);
    const topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png');
    L.control.layers({ OSM: osm, Topo: topo }).addTo(map);
    L.marker([story.lat, story.lon]).addTo(map);
  }

  renderError(msg) {
    document.getElementById('detail-content').innerHTML = `<p>${msg}</p>`;
  }
}
