const axios = require('axios').default;

export default class NewsApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.PER_PAGE = 40;
  }
  async fetchArticls() {
    console.log(this);
    const apiOptions = {
      method: 'get',
      url: 'https://pixabay.com/api/',

      params: {
        key: '38516408-b596b12dec0c344cdc294ce99',
        q: `${this.searchQuery}`,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        page: `${this.page}`,
        per_page: `${this.PER_PAGE}`,
      },
    };

    try {
      const response = await axios(apiOptions);
      const data = response.data;
      console.log(data.hits);
      this.incrementPage();
      return data.hits;
    } catch (error) {
      console.error(error);
    }
  }
  incrementPage() {
    this.page += 1;
  }
  resetPage() {
    this.page = 1;
  }
  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
