import { StoryAPI } from '../../data/api.js';
import { IdbHelper } from '../../utils/idb.js';
import { showFormattedDate } from '../../utils/index.js';

export default class HomePresenter {
  constructor({ view }) {
    this.view = view;
  }

  async showStories() {
    this.view.showLoading();

    try {
      if (!navigator.onLine) throw new Error('Offline');

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
    } catch (err) {
      const offlineStories = await IdbHelper.getAllStories();

      if (offlineStories.length) {
        const stories = offlineStories.map((s) => ({
          id: s.id,
          name: s.name,
          description: s.description,
          formattedDate: '-', // No date from API
          lat: 0,
          lon: 0,
        }));

        this.view.renderStories(stories);
      } else {
        this.view.renderError('Gagal memuat cerita.');
      }
    } finally {
      this.view.hideLoading();
    }
  }
}