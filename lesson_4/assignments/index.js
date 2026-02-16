import * as Carousel from "./Carousel.js";
import axios from "axios";

const breedSelect = document.getElementById("breedSelect");
const infoDump = document.getElementById("infoDump");
const progressBar = document.getElementById("progressBar");
const getFavouritesBtn = document.getElementById("getFavouritesBtn");

const API_KEY = "";
const CAT_API_BASE_URL = "https://api.thecatapi.com/v1";

let breeds = [];

const catApi = axios.create({
  baseURL: CAT_API_BASE_URL,
  headers: API_KEY ? { "x-api-key": API_KEY } : {}
});

catApi.interceptors.request.use(
  (config) => {
    config.metadata = { startTime: Date.now() };
    console.log(`Request started: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

catApi.interceptors.response.use(
  (response) => {
    const startTime = response.config.metadata?.startTime;
    if (startTime) {
      console.log(`Request completed in ${Date.now() - startTime}ms: ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    const startTime = error.config?.metadata?.startTime;
    if (startTime) {
      console.log(`Request failed in ${Date.now() - startTime}ms: ${error.config.url}`);
    }
    return Promise.reject(error);
  }
);

function renderBreedInfo(breed) {
  infoDump.innerHTML = "";

  if (!breed) {
    infoDump.textContent = "Select a breed to view information.";
    return;
  }

  const heading = document.createElement("h3");
  heading.textContent = breed.name;

  const description = document.createElement("p");
  description.textContent = breed.description || "No description available.";

  const details = document.createElement("p");
  details.innerHTML = `<strong>Origin:</strong> ${breed.origin || "Unknown"} | <strong>Temperament:</strong> ${breed.temperament || "Unknown"}`;

  infoDump.append(heading, description, details);
}

function buildCarousel(images, breedName) {
  Carousel.clear();
  const validImages = images.filter((image) => image?.url);

  if (!validImages.length) {
    infoDump.insertAdjacentHTML(
      "beforeend",
      "<p><em>No images available for this breed.</em></p>"
    );
    return;
  }

  validImages.forEach((image) => {
    const item = Carousel.createCarouselItem(
      image.url,
      `${breedName} cat`,
      image.id
    );
    Carousel.appendCarousel(item);
  });

  Carousel.start();
}

async function onBreedChange() {
  const breedId = breedSelect.value;
  const selectedBreed = breeds.find((breed) => breed.id === breedId);

  renderBreedInfo(selectedBreed);

  if (!breedId) {
    Carousel.clear();
    return;
  }

  try {
    const { data } = await catApi.get("/images/search", {
      params: { breed_ids: breedId, limit: 10 }
    });

    buildCarousel(data, selectedBreed?.name || "Cat");
  } catch (error) {
    console.error("Failed to load breed images", error);
    Carousel.clear();
    infoDump.textContent = "Unable to load images right now. Try another breed.";
  }
}

async function initialLoad() {
  try {
    const { data } = await catApi.get("/breeds");
    breeds = data;

    breedSelect.innerHTML = "";

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Select a breed...";
    breedSelect.appendChild(defaultOption);

    const optionsFragment = document.createDocumentFragment();
    breeds.forEach((breed) => {
      const option = document.createElement("option");
      option.value = breed.id;
      option.textContent = breed.name;
      optionsFragment.appendChild(option);
    });
    breedSelect.appendChild(optionsFragment);

    if (breeds.length) {
      breedSelect.value = breeds[0].id;
      await onBreedChange();
    }
  } catch (error) {
    console.error("Failed to load breeds", error);
    infoDump.textContent = "Unable to load breeds. Check API key and try again.";
  }
}

breedSelect.addEventListener("change", onBreedChange);
initialLoad();

export async function favourite(imgId) {
  console.log(`Favourite clicked for image ${imgId}`);
}
