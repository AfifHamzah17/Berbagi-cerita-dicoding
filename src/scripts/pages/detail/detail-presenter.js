// src/scripts/pages/detail/detail-presenter.js
import { StoryAPI } from '../../data/api.js';

export default class DetailPresenter {
  constructor({ view, id }) {
    this.view = view;
    this.id = id;
  }

  async showDetail() {
    this.view.showLoading();
    try {
      const { story } = await StoryAPI.getStoryDetail(this.id);
      this.view.renderDetail(story);
    } catch (err) {
      this.view.renderError('Gagal memuat detail cerita.');
    } finally {
      this.view.hideLoading();
    }
  }
}
