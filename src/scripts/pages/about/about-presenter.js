// src/scripts/pages/about/about-presenter.js
import { StoryAPI } from '../../data/api.js';

export default class AddPresenter {
  constructor({ view }) {
    this.view = view;
  }

  async submitStory(payload) {
    this.view.showSubmitting();
    try {
      const token = localStorage.getItem('token');
      const res = token
        ? await StoryAPI.addStory(payload)
        : await StoryAPI.addStoryGuest(payload);
      if (res.error) {
        this.view.showResult(`Error: ${res.message}`);
      } else {
        this.view.showResult('Berhasil ditambahkan!');
        // Redirect ke beranda setelah 1 detik agar list baru muncul
        setTimeout(() => {
          location.hash = '/';
        }, 1000);
      }
    } catch (err) {
      this.view.showResult('Gagal mengirim cerita. ' + err.message);
    }
  }
}
