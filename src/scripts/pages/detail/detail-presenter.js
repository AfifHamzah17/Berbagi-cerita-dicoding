import { StoryAPI } from '../../data/api.js';

export default class DetailPresenter {
  constructor({ view, id }) {
    this.view = view;
    this.id   = id;
  }

  async showDetail() {
    this.view.showLoading();
    try {
      const { story } = await StoryAPI.getStoryDetail(this.id);
      // tambahkan reverse-geocode
      story.province = await StoryAPI.reverseGeocode(story.lat, story.lon);
      this.view.renderDetail(story);
    } catch {
      this.view.renderError('Gagal memuat detail cerita.');
    } finally {
      this.view.hideLoading();
    }
  }
}
