let COUNT_VALUE = 0; // Definiere die Anzahl der zu ladenden Pokémon
const MAIN_URL = `https://pokeapi.co/api/v2/pokemon/?offset=${COUNT_VALUE}&limit=20`;

async function loadPokemon() {
  let response = await fetch(MAIN_URL);
  let data = await response.json();
  let pokemonList = data.results;

  for (let i = 0; i < pokemonList.length; i++) {
    let pokemon = await getPokemonDetails(pokemonList[i].url);
    renderPokemonInfo(pokemon);
    console.log(pokemon);
  }
}

async function getPokemonDetails(url) {
  let response = await fetch(url);
  let pokemonData = await response.json();
  return pokemonData;
}

function renderPokemonInfo(pokemon) {
  let pokedexElement = document.getElementById("pokedex");

  pokedexElement.innerHTML += /*html*/ `<div class='pokemon'><div class='position'><h2>${pokemon.name}</h2><span class='elements'>${pokemon["types"]["0"]["type"]["name"]} </span>
  <span class='elements'> ${pokemon["types"]["1"]["type"]["name"]} </span></div>
  <img class='img'src='${pokemon["sprites"]["other"]["dream_world"]["front_default"]}'></div>`;
}

// Aufruf der loadPokemon Funktion beim Laden der Seite

function count() {
  return (COUNT_VALUE = 20);
}
