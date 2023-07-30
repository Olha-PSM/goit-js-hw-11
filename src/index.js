import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import NewsApiService from './js/api-serves';

let totalHits = 0;
let page = 1;

const elements = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};
console.log(elements);

const { searchForm, loadMoreBtn, gallery } = elements;

const newsApiService = new NewsApiService();
console.log(newsApiService);

let lightbox = new SimpleLightbox('.gallery a', {
  captionsData: `alt`,
  captionDelay: 250,
});
loadMoreBtn.style.display = 'none';
searchForm.addEventListener('submit', onSubmit);
loadMoreBtn.addEventListener('click', onLoadMore);

async function onSubmit(e) {
  e.preventDefault();
  page = 1;
  newsApiService.resetPage();
  clearGalleryContainer();
  newsApiService.query = e.currentTarget.searchQuery.value.trim();

  if (newsApiService.query === '') {
    Notiflix.Notify.warning('Please, fill the main field');
    return;
  }

  fetchGallery();
}

function fetchGallery() {
  loadMoreBtn.style.display = 'block';
  newsApiService.fetchArticls().then(showImages);
  if (data.hits.length === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else {
    showImages(data.hits);
    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
    loadMoreBtn.style.display = 'block';
  }
}

function onLoadMore() {
  newsApiService.fetchArticls().then(showImages);
}

function showImages(images) {
  const markup = images
    .map(
      ({
        tags,
        largeImageURL,
        webformatURL,
        likes,
        views,
        comments,
        downloads,
      }) => `
      <div class="photo-card">
      <a  class="photo-link" href="${largeImageURL}">
    <img src="${webformatURL}" alt="${tags}" loading="lazy" class="photo-img"
      />
    <div class="info">
      <p class="info-item">
        <b>Likes ${likes}</b>
      </p>
      <p class="info-item">
        <b>Views ${views}</b>
      </p>
      <p class="info-item">
        <b>Comments ${comments}</b>
      </p>
      <p class="info-item">
        <b>Downloads ${downloads}</b>
      </p>
    </div>
  </div>
      </div>

    `
    )
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}
function clearGalleryContainer() {
  gallery.innerHTML = '';
}
function showError() {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function showEndMessage() {
  Notiflix.Notify.info(
    "We're sorry, but you've reached the end of search results."
  );
  loadMoreBtn.style.display = 'none'; // Hide the button when reaching the end of results
}
