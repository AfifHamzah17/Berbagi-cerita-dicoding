// import { StoryAPI } from '../../data/api.js';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';

// export default class AddPage {
//   constructor() {
//     this.stream = null;
//   }

//   async render() {
//     return `
//       <section class="container">
//         <h1>Tambah Cerita</h1>
//         <form id="add-form">
//           <label for="desc">Deskripsi</label>
//           <textarea id="desc" required></textarea>

//           <fieldset>
//             <legend>Pilih Foto</legend>
//             <button type="button" id="use-camera-button">Gunakan Kamera</button>
//             <input id="photo" type="file" accept="image/*" required />
//           </fieldset>

//           <div id="camera-container" style="display:none; margin:1rem 0;">
//             <video id="video" autoplay playsinline style="max-width:100%;"></video>
//             <button type="button" id="capture-button">Ambil Foto</button>
//             <button type="button" id="stop-camera-button">Matikan Kamera</button>
//           </div>

//           <div id="map" style="height:200px; margin:1rem 0;"></div>
//           <input type="hidden" id="lat" />
//           <input type="hidden" id="lon" />

//           <button type="submit">Kirim</button>
//         </form>
//         <div id="add-status"></div>
//       </section>
//     `;
//   }

//   async afterRender() {
//     // Inisialisasi peta
//     const map = L.map('map').setView([0, 0], 2);
//     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
//     let marker;
// map.on('click', async ({ latlng }) => {
//   const lat = latlng.lat;
//   const lon = latlng.lng;
//   document.getElementById('lat').value = lat;
//   document.getElementById('lon').value = lon;

//   if (marker) marker.remove();
//   marker = L.marker(latlng).addTo(map);

//   // Ambil data elevasi dari Open-Elevation API
//   try {
//     const res = await fetch(`https://api.opentopodata.org/v1/test-dataset?locations=${lat},${lon}`);
//     const data = await res.json();
//     const altitude = data.results?.[0]?.elevation ?? 0;
//     document.getElementById('alt').value = altitude;
//   } catch (err) {
//     console.error('Gagal mengambil data elevasi:', err);
//     document.getElementById('alt').value = 0;
//   }
// });


//     // Elemen-elemen kamera & file
//     const useCameraBtn    = document.getElementById('use-camera-button');
//     const stopCameraBtn   = document.getElementById('stop-camera-button');
//     const captureBtn      = document.getElementById('capture-button');
//     const cameraContainer = document.getElementById('camera-container');
//     const video           = document.getElementById('video');
//     const photoInput      = document.getElementById('photo');

//     // Tombol gunakan kamera
//     useCameraBtn.addEventListener('click', async () => {
//       // Mulai stream jika belum aktif
//       if (!this.stream) {
//         try {
//           this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
//           video.srcObject = this.stream;
//         } catch (err) {
//           alert('Gagal mengakses kamera: ' + err.message);
//           return;
//         }
//       }
//       cameraContainer.style.display = 'block';
//       photoInput.required = false; // alihkan wajib input file
//     });

//     // Tombol ambil foto
//     captureBtn.addEventListener('click', () => {
//       const canvas = document.createElement('canvas');
//       canvas.width  = video.videoWidth;
//       canvas.height = video.videoHeight;
//       const ctx = canvas.getContext('2d');
//       ctx.drawImage(video, 0, 0);
//       canvas.toBlob((blob) => {
//         // Bungkus blob jadi File, lalu assign ke input[type=file]
//         const file = new File([blob], 'camera-photo.png', { type: 'image/png' });
//         const dt = new DataTransfer();
//         dt.items.add(file);
//         photoInput.files = dt.files;
//       });
//       // Setelah capture, biasakan matikan kamera
//       stopCamera();
//     });

//     // Tombol matikan kamera
//     stopCameraBtn.addEventListener('click', () => stopCamera());

//     const stopCamera = () => {
//       if (this.stream) {
//         this.stream.getTracks().forEach((track) => track.stop());
//         this.stream = null;
//       }
//       cameraContainer.style.display = 'none';
//       photoInput.required = true; // kembalikan validasi file
//     };

//     // Submit form
//     const form = document.getElementById('add-form');
//     const status = document.getElementById('add-status');
//     form.addEventListener('submit', async (e) => {
//       e.preventDefault();
//       status.textContent = 'Mengirim…';

//       const description = document.getElementById('desc').value;
//       const photo       = photoInput.files[0];
//       const lat         = document.getElementById('lat').value;
//       const lon         = document.getElementById('lon').value;
//       const token       = localStorage.getItem('token');

//       try {
//         const res = token
//           ? await StoryAPI.addStory({ description, photo, lat, lon })
//           : await StoryAPI.addStoryGuest({ description, photo, lat, lon });
//         status.textContent = res.error ? `Error: ${res.message}` : 'Berhasil ditambahkan!';
//       } catch (err) {
//         status.textContent = 'Gagal mengirim cerita. ' + err.message;
//       }
//     });
//   }
// }

// src/scripts/pages/about/about-page.js
import AddPresenter from './about-presenter.js';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default class AddPage {
  constructor() {
    this.stream = null;
    this.presenter = new AddPresenter({ view: this });
  }

  async render() {
    return `
      <section class="container">
        <h1>Tambah Cerita</h1>
        <form id="add-form">
          <label for="desc">Deskripsi</label>
          <textarea id="desc" required></textarea>

          <fieldset>
            <legend>Pilih Foto</legend>
            <button type="button" id="use-camera-button">Gunakan Kamera</button>
            <input id="photo" type="file" accept="image/*" required />
          </fieldset>

          <div id="camera-container" style="display:none; margin:1rem 0;">
            <video id="video" autoplay playsinline style="max-width:100%;"></video>
            <button type="button" id="capture-button">Ambil Foto</button>
            <button type="button" id="stop-camera-button">Matikan Kamera</button>
          </div>

          <div id="map" style="height:200px; margin:1rem 0;"></div>
          <input type="hidden" id="lat" />
          <input type="hidden" id="lon" />

          <button type="submit">Kirim</button>
        </form>
        <div id="add-status"></div>
      </section>
    `;
  }

  async afterRender() {
    // Inisialisasi peta
    const map = L.map('map').setView([0, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    let marker;
    const stopCamera = () => {
      if (this.stream) {
        this.stream.getTracks().forEach(t => t.stop());
        this.stream = null;
      }
      document.getElementById('camera-container').style.display = 'none';
      document.getElementById('photo').required = true;
    };

map.on('click', async ({ latlng }) => {
  const { lat, lng } = latlng;
  document.getElementById('lat').value = lat;
  document.getElementById('lon').value = lng;

  if (marker) marker.remove();
  marker = L.marker(latlng).addTo(map);

  // Ambil data elevasi
  try {
    const res = await fetch(`https://api.opentopodata.org/v1/test-dataset?locations=${lat},${lng}`);
    const data = await res.json();
    const altitude = data.results?.[0]?.elevation ?? 0;

    // **Perbaikan assignment altitude**
    const altInput = document.getElementById('alt');
    if (altInput) {
      altInput.value = altitude;
    }
  } catch (err) {
    console.error('Gagal mengambil data elevasi:', err);
    const altInput = document.getElementById('alt');
    if (altInput) {
      altInput.value = 0;
    }
  }
});

    // Kamera & file elements
    const useCameraBtn  = document.getElementById('use-camera-button');
    const stopCameraBtn = document.getElementById('stop-camera-button');
    const captureBtn    = document.getElementById('capture-button');
    const cameraContainer = document.getElementById('camera-container');
    const video         = document.getElementById('video');
    const photoInput    = document.getElementById('photo');

    useCameraBtn.addEventListener('click', async () => {
      if (!this.stream) {
        try {
          this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
          video.srcObject = this.stream;
        } catch (err) {
          alert('Gagal mengakses kamera: ' + err.message);
          return;
        }
      }
      cameraContainer.style.display = 'block';
      photoInput.required = false;
    });

    captureBtn.addEventListener('click', () => {
      const canvas = document.createElement('canvas');
      canvas.width  = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0);
      canvas.toBlob(blob => {
        const file = new File([blob], 'camera-photo.png', { type: 'image/png' });
        const dt = new DataTransfer();
        dt.items.add(file);
        photoInput.files = dt.files;
      });
      stopCamera();
    });

    stopCameraBtn.addEventListener('click', stopCamera);
    window.addEventListener('hashchange', stopCamera);

    // Binding form submit ke Presenter
    const form = document.getElementById('add-form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      stopCamera();  // pastikan kamera mati sebelum submit

      const payload = {
        description: document.getElementById('desc').value,
        photo: photoInput.files[0],
        lat: document.getElementById('lat').value,
        lon: document.getElementById('lon').value,
      };
      await this.presenter.submitStory(payload);
    });
  }

  // Methods untuk Presenter panggil:
  showSubmitting() {
    document.getElementById('add-status').textContent = 'Mengirim…';
  }
  showResult(msg) {
    document.getElementById('add-status').textContent = msg;
  }
}
