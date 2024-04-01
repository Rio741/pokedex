let COUNT_VALUE = 0; // Definiere die Anzahl der zu ladenden Pokémon

async function loadPokemon() {
  const MAIN_URL = `https://pokeapi.co/api/v2/pokemon/?offset=${COUNT_VALUE}&limit=20`;
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

// Funktion, die die Namen der Pokémon-Typen in einen lesbaren String konvertiert
function getPokemonTypes(pokemon) {
  let types = "";
  for (let i = 0; i < pokemon.types.length; i++) {
    types += pokemon.types[i].type.name;
    if (i < pokemon.types.length - 1) {
      types += ", ";
    }
  }
  return types;
}

// Funktion, die die Sprite-URL des Pokémon zurückgibt
function getPokemonSpriteUrl(pokemon) {
  return pokemon.sprites.other.dream_world.front_default || "";
}

function renderPokemonInfo(pokemon) {
  let pokedexElement = document.getElementById("pokedek");
  let types = getPokemonTypes(pokemon);
  let spriteUrl = getPokemonSpriteUrl(pokemon);
  pokedexElement.innerHTML += /*html*/ `
    <div class='pokemon'>
      <div class='pkm-card-text'>
        <h2>${pokemon.name}</h2>
        <span class='pkm-types'>${types}</span>
      </div>
      <img class='pokemon-img' src='${spriteUrl}'>
    </div>`;
}

function loadMorePokemons() {
  COUNT_VALUE += 20;
  loadPokemon();
}
