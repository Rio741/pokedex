let COUNT_VALUE = 0;
let statusNames = [];
let statusValues = [];
let allPokemon = [];
let isLoading = false;
const typeColors = {
  normal: "rgba(168, 168, 120, 0.8)",
  fire: "rgba(240, 128, 48, 0.8)",
  water: "rgba(104, 144, 240, 0.8)",
  electric: "rgba(248, 208, 48, 0.8)",
  grass: "rgba(120, 200, 80, 0.8)",
  ice: "rgba(152, 216, 216, 0.8)",
  fighting: "rgba(192, 48, 40, 0.8)",
  poison: "rgba(160, 64, 160, 0.8)",
  ground: "rgba(224, 192, 104, 0.8)",
  flying: "rgba(168, 144, 240, 0.8)",
  psychic: "rgba(248, 88, 136, 0.8)",
  bug: "rgba(168, 184, 32, 0.8)",
  rock: "rgba(184, 160, 56, 0.8)",
  ghost: "rgba(112, 88, 152, 0.8)",
  dragon: "rgba(112, 56, 248, 0.8)",
  dark: "rgba(112, 88, 72, 0.8)",
  steel: "rgba(184, 184, 208, 0.8)",
  fairy: "rgba(238, 153, 172, 0.8)",
};

/**
 * Initializes the application by fetching the list of all Pokémon,
 * pushing them into an array, and fetching the Pokémon data for display.
 */
async function init() {
  await fetchHolePokemonList();
  pushAllPokemonsToArray();
  fetchPokemons();
}

/**
 * Fetches the list of all Pokémon.
 * @returns {Promise<void>}
 */
async function fetchHolePokemonList() {
  let url = "https://pokeapi.co/api/v2/pokemon?limit=1500&offset=0.";
  let response = await fetch(url);
  let amountOfPokemon = await response.json();
  let amountOfAllPokemon = await amountOfPokemon["count"];
}

/**
 * Pushes all Pokémon to the global array 'allPokemon'.
 * @returns {Promise<void>}
 */
async function pushAllPokemonsToArray() {
  for (let i = 1; i < 1026; i++) {
    let url = `https://pokeapi.co/api/v2/pokemon/${i}`;
    let response = await fetch(url);
    let currentPokemon = await response.json();
    allPokemon.push(currentPokemon);
  }
}

/**
 * Fetches Pokémon data based on the current count value.
 * @returns {Promise<void>}
 */
async function fetchPokemons() {
  if (isLoading) return;
  isLoading = true;
  const MAIN_URL = `https://pokeapi.co/api/v2/pokemon/?offset=${COUNT_VALUE}`;
  let response = await fetch(MAIN_URL);
  let textToJson = await response.json();
  let pokemonList = textToJson.results;
  for (let i = 0; i < pokemonList.length; i++) {
    await getPokemonInfos(pokemonList[i].url);
  }
  isLoading = false;
}

/**
 * Fetches Pokémon information from a given URL and renders it.
 * @param {string} url - The URL of the Pokémon data.
 * @returns {Promise<void>}
 */
async function getPokemonInfos(url) {
  let response = await fetch(url);
  let pokemon = await response.json();
  let pokemonImage = pokemon.sprites.other.dream_world.front_default;
  const formattedId = String(pokemon.id).padStart(3, "0");
  let secondType = checkSecondPokeType(pokemon);
  let displayValue = secondType ? "inline" : "none";
  let pokedek = document.getElementById("pokedek");
  pokedek.innerHTML += renderPokemon(
    pokemon,
    formattedId,
    secondType,
    displayValue,
    pokemonImage
  );
}

/**
 * Fetches and renders Pokémon data for a specific Pokémon ID.
 * @param {number} pokemonId - The ID of the Pokémon to fetch.
 * @returns {Promise<void>}
 */
async function fetchCardPokemon(pokemonId) {
  const url = `https://pokeapi.co/api/v2/pokemon/${pokemonId}/`;
  let response = await fetch(url);
  let pokemonData = await response.json();
  getPokemonCardInfos(pokemonData);
}

/**
 * Retrieves Pokémon card information and updates the card display.
 * @param {Object} pokemonData - The data of the Pokémon to display.
 * @returns {void}
 */
function getPokemonCardInfos(pokemonData) {
  const pokeCard = document.getElementById("pokecard");
  setPokemonCard(pokeCard);
  const primaryType = pokemonData.types[0].type.name;
  const backgroundColor = typeColors[primaryType];
  const formattedId = String(pokemonData.id).padStart(3, "0");
  let secondType = checkSecondPokeType(pokemonData);
  let displayValue = secondType ? "inline" : "none";
  let pokemonImage = pokemonData.sprites.other.dream_world.front_default;
  pokeCard.innerHTML = renderPokemonCard(
    pokemonData,
    backgroundColor,
    formattedId,
    secondType,
    displayValue,
    pokemonImage
  );
  pokemonStatusValues(pokemonData);
}

/**
 * Loads more Pokémon by increasing the count value and fetching Pokémon data.
 * @returns {void}
 */
function loadMorePokemons() {
  COUNT_VALUE += 20;
  fetchPokemons();
}

/**
 * Displays the Pokémon card and darkens the background.
 * @param {HTMLElement} pokeCard - The HTML element representing the Pokémon card.
 * @returns {void}
 */
function setPokemonCard(pokeCard) {
  pokeCard.style.display = "flex";
  document.getElementById("blackscreen").style.display = "flex";
  document.body.style.overflow = "hidden";
}

/**
 * Closes the Pokémon card and restores the background.
 * @returns {void}
 */
function closePokemonCard() {
  document.getElementById("blackscreen").style.display = "none";
  document.getElementById("pokecard").style.display = "none";
  document.body.style.overflow = "auto";
}

/**
 * Handles the click event for moving left in the Pokémon evolution chain.
 * @param {number} pokemonData - The ID of the Pokémon.
 * @returns {void}
 */
function clickLeft(pokemonData) {
  if (pokemonData > 0) {
    fetchCardPokemon(pokemonData);
  }
}

/**
 * Handles the click event for moving right in the Pokémon evolution chain.
 * @param {number} pokemonData - The ID of the Pokémon.
 * @returns {void}
 */
function clickRight(pokemonData) {
  fetchCardPokemon(pokemonData);
}

/**
 * Fetches the evolution chain of a Pokémon and creates its evolution chart.
 * @param {number} pokemonId - The ID of the Pokémon.
 * @returns {void}
 */
async function fetchEvolution(pokemonId) {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/`
  );
  const data = await response.json();
  const evolutionChainUrl = data.evolution_chain.url;
  const evolutionChainResponse = await fetch(evolutionChainUrl);
  const evolutionChainData = await evolutionChainResponse.json();
  createEvolution(evolutionChainData.chain);
}

/**
 * Creates the Pokémon evolution chain based on the chain data.
 * @param {Object} chain - The evolution chain data.
 * @returns {void}
 */
async function createEvolution(chain) {
  const categoryContent = document.getElementById("category-content");
  categoryContent.innerHTML =
    '<div><h2 class="headline-evolution">Evolution-Chain</h2><div id="evolutionDiv"></div></div>';
  const evolutionDiv = document.getElementById("evolutionDiv");
  while (chain) {
    const pokemonName = chain.species.name;
    const formattedName = formatPokemonName(chain.species);
    const pokemonData = await fetchEvolutionData(pokemonName);
    const pokemonDiv = createEvolutionDiv(formattedName, pokemonData);
    evolutionDiv.appendChild(pokemonDiv);
    chain = chain.evolves_to[0];
  }
}

/**
 * Fetches evolution data for a Pokémon.
 * @param {string} pokemonName - The name of the Pokémon.
 * @returns {Object} - The Pokémon data.
 */
async function fetchEvolutionData(pokemonName) {
  const pokemonResponse = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${pokemonName}/`
  );
  return await pokemonResponse.json();
}

/**
 * Creates an evolution div for a Pokémon.
 * @param {string} formattedName - The formatted name of the Pokémon.
 * @param {Object} pokemonData - The data of the Pokémon.
 * @returns {HTMLElement} - The HTML element representing the Pokémon div.
 */
function createEvolutionDiv(formattedName, pokemonData) {
  const pokemonImage = pokemonData.sprites.other.dream_world.front_default;
  const pokemonDiv = document.createElement("div");
  pokemonDiv.innerHTML = `
    <h3>${formattedName}</h3>
    <img class='evolution-img' src="${pokemonImage}" alt="${formattedName}" />
  `;
  return pokemonDiv;
}

/**
 * Loads the evolution chain for a Pokémon.
 * @param {number} pokemonId - The ID of the Pokémon.
 * @returns {void}
 */
async function loadEvolution(pokemonId) {
  await fetchEvolution(pokemonId);
}

/**
 * Generates HTML for displaying the moves of a Pokémon.
 * @param {Object} pokemonData - The data of the Pokémon.
 * @returns {string} - The HTML string representing the moves.
 */
function generatePokemonMoves(pokemonData) {
  let moves = pokemonData.moves;
  let movesHTML = "<div>";
  for (let i = 0; i < moves.length; i++) {
    movesHTML += `<span class= move>${moves[i].move.name}</span>`;
  }
  return movesHTML;
}

/**
 * Displays the Pokémon moves on the page.
 * @param {string} content - The HTML content representing the moves.
 * @returns {void}
 */
function displayPokemonMoves(content) {
  let categoryContent = document.getElementById("category-content");
  categoryContent.innerHTML = `<div class='moves-container'>${content}</div>`;
}

/**
 * Retrieves the base stats of a Pokémon for charting.
 * @param {Object} pokemonData - The data of the Pokémon.
 * @returns {void}
 */
function pokemonStatusValues(pokemonData) {
  let baseStats = pokemonData.stats;
  statusNames = [];
  statusValues = [];
  for (let i = 0; i < baseStats.length; i++) {
    statusNames.push(baseStats[i].stat.name);
    statusValues.push(baseStats[i].base_stat);
  }
  loadChart();
}

/**
 * Fetches the first category of a Pokémon and generates its HTML content.
 * @param {number} pokemonId - The ID of the Pokémon.
 * @returns {void}
 */
async function fetchFirstCategory(pokemonId) {
  const url = `https://pokeapi.co/api/v2/pokemon/${pokemonId}/`;
  const response = await fetch(url);
  const pokemonData = await response.json();
  const abilityUrl = pokemonData.abilities[0].ability.url;
  const abilityResponse = await fetch(abilityUrl);
  const abilityData = await abilityResponse.json();
  generateFirstCategory(pokemonData, abilityData);
}

/**
 * Generates HTML content for the first category of a Pokémon.
 * @param {Object} pokemonData - The data of the Pokémon.
 * @param {Object} abilityData - The data of the Pokémon's ability.
 * @returns {void}
 */
function generateFirstCategory(pokemonData, abilityData) {
  let pokeAbility =
    abilityData.name.charAt(0).toUpperCase() +
    abilityData.name.slice(1).toLowerCase();
  let pokeAbilityEffect = abilityData.effect_entries[0].short_effect;
  let height = pokemonData.height;
  let weight = pokemonData.weight;
  let formattedWeight = weight / 10;
  document.getElementById("category-content").innerHTML = htmlContent =
    renderFirstCategory(
      pokeAbility,
      pokeAbilityEffect,
      height,
      formattedWeight
    );
}

/**
 * Formats the name of a Pokémon.
 * @param {Object} pokemon - The data of the Pokémon.
 * @returns {string} - The formatted name of the Pokémon.
 */
function formatPokemonName(pokemon) {
  pokemonName =
    pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1).toLowerCase();
  return pokemonName;
}

/**
 * Checks if a Pokémon has a second type.
 * @param {Object} pokemon - The data of the Pokémon.
 * @returns {string|null} - The second type of the Pokémon or null if it has only one type.
 */
function checkSecondPokeType(pokemon) {
  if (pokemon.types.length > 1) {
    return pokemon.types[1]["type"].name;
  } else {
    return null;
  }
}

/**
 * Retrieves the color of a Pokémon based on its type.
 * @param {Array} types - The types of the Pokémon.
 * @returns {string} - The color associated with the Pokémon's primary type.
 */
function getPokemonColor(types) {
  const primaryType = types[0].type.name;
  return typeColors[primaryType] || "gray";
}

/**
 * Filters Pokémon names based on the search term and displays them.
 * @returns {void}
 */
async function filterNames() {
  const searchTerm = document
    .getElementById("search-field")
    .value.toLowerCase();
  const pokedek = document.getElementById("pokedek");
  await filterAndDisplayPokemon(searchTerm, pokedek);
  toggleLoadMoreButton(searchTerm);
}

/**
 * Toggles the visibility of the load more button based on the search term.
 * @param {string} searchTerm - The search term entered by the user.
 * @returns {void}
 */
async function toggleLoadMoreButton(searchTerm) {
  const loadMoreButton = document.getElementById("load-more-btn");
  if (searchTerm.trim() !== "") {
    loadMoreButton.style.display = "none";
  } else {
    loadMoreButton.style.display = "block";
    const pokedek = document.getElementById("pokedek");
    await filterAndDisplayPokemon("", pokedek);
  }
}

/**
 * Filters Pokémon based on the search term and displays them.
 * @param {string} searchTerm - The search term entered by the user.
 * @param {HTMLElement} pokedek - The container element for displaying Pokémon.
 * @returns {void}
 */
async function filterAndDisplayPokemon(searchTerm, pokedek) {
  const filteredPokemon = allPokemon.filter((pokemon) => {
    return pokemon.name.toLowerCase().includes(searchTerm);
  });
  pokedek.innerHTML = "";
  let counter = 0;
  for (const pokemon of filteredPokemon) {
    if (counter >= 20) break;
    await getPokemonInfos(`https://pokeapi.co/api/v2/pokemon/${pokemon.id}`);
    counter++;
  }
}