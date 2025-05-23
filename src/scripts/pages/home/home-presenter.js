// src/scripts/pages/home/home-presenter.js
import { StoryAPI } from '../../data/api.js';
import { showFormattedDate } from '../../utils/index.js';

export default class HomePresenter {
  constructor({ view }) {
    this.view = view;
  }

  async showStories() {
    try {
      this.view.showLoading();
      const { listStory } = await StoryAPI.getStories({ location: 1 });
      const stories = listStory.map((s) => ({
        id: s.id,
        photoUrl: s.photoUrl,
        name: s.name,
        description: s.description,
        formattedDate: showFormattedDate(s.createdAt, 'id-ID'),
        lat: s.lat,
        lon: s.lon,
      }));
      this.view.renderStories(stories);
    } catch {
      this.view.renderError('Gagal memuat cerita.');
    } finally {
      this.view.hideLoading();
    }
  }
}