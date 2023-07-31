const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '38516408-b596b12dec0c344cdc294ce99';
const axios = require('axios').default;

import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.getElementById('search-form');
const input = document.querySelector('.js-input');
const gallery = document.querySelector('.js-gallery');
const loadBtn = document.querySelector('.load-js');
let lightbox = new SimpleLightbox('.gallery a', {
  captionsData: `alt`,
  captionDelay: 250,
});
let page = 1;
let perPage = 40;
let totalHits = 0;
let searchQuery = '';

loadBtn.style.display = 'none';

form.addEventListener('submit', handleSubmit);
loadBtn.addEventListener('click', handleLoadMore);

async function handleSubmit(e) {
  e.preventDefault();
  page = 1;
  gallery.innerHTML = '';
  loadBtn.style.display = 'none';
  const value = input.value;
  try {
    const data = await fetchImages(value);

    if (data.hits.length === 0) {
      showError();
    } else {
      showImages(data.hits);
      totalHits = data.totalHits;

      if (page * perPage < totalHits) {
        loadBtn.style.display = 'block';
      } else {
        showEndMessage();
      }
    }

    page += 1;
  } catch (error) {
    console.log(error);
    showError();
  }
}

async function handleLoadMore() {
  try {
    const value = input.value;
    const data = await fetchImages(value);

    if (data.hits.length === 0) {
      showError();
    } else {
      showImages(data.hits);
      totalHits = data.totalHits;

      if (page * perPage < totalHits) {
        loadBtn.style.display = 'block';
      } else {
        showEndMessage();
      }
    }

    page += 1;
  } catch (error) {
    console.log(error);
    showError();
  }
}

async function fetchImages(value) {
  const url = `${BASE_URL}?key=${API_KEY}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;
  const { data } = await axios.get(url);
  return data;
}

function showImages(images) {
  const markup = images
    .map(
      ({
        largeImageURL,
        tags,
        webformatURL,
        likes,
        views,
        comments,
        downloads,
      }) => `
    <div class="photo-card">
    <a  class="photo-link" href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" class="img" />
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

function showError() {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function showEndMessage() {
  Notiflix.Notify.info(
    "We're sorry, but you've reached the end of search results."
  );
  loadBtn.style.display = 'none';
}
