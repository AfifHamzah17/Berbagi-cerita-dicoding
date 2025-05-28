import { StoryAPI } from '../../data/api.js';

export default class AddPresenter {
  constructor({ view }) {
    this.view = view;
  }

  /**
   * Fetch and show elevation
   */
  async fetchElevation(lat, lon) {
    this.view.showElevationLoading();
    try {
      const alt = await StoryAPI.elevation(lat, lon);
      this.view.showElevation(alt);
    } catch {
      this.view.showElevation(0);
    } finally {
      this.view.hideElevationLoading();
    }
  }

  /**
   * Submit the story payload
   */
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
        // redirect home setelah 1 detik
        setTimeout(() => { location.hash = '/'; }, 1000);
      }
    } catch (err) {
      this.view.showResult('Gagal mengirim cerita. ' + err.message);
    }
  }
}
