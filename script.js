let COUNT_VALUE = 0; // Definiere die Anzahl der zu ladenden Pokémon

async function loadPokemon() {
  const MAIN_URL = `https://pokeapi.co/api/v2/pokemon/?offset=${COUNT_VALUE}&limit=20`;
  let response = await fetch(MAIN_URL);
  let data = await response.json();
  let pokemonList = data.results;
  for (let i = 0; i < pokemonList.length; i++) {
    let pokemon = await getPokemonDetails(pokemonList[i].url);
    renderPokemonInfo(pokemon);
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
      types += "<br>";
    }
  }
  return types;
}

// Mapping-Tabelle für Pokémon-Typen und transparente Farben
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

// Funktion, um die Hintergrundfarbe basierend auf den Pokémon-Typen zu erhalten
function getPokemonColor(types) {
  // Wenn das Pokémon mehrere Typen hat, verwende den ersten Typ
  const primaryType = types[0].type.name;
  return typeColors[primaryType] || "gray"; // Verwende grau, wenn der Typ nicht in der Mapping-Tabelle ist
}

// Funktion, die die Sprite-URL des Pokémon zurückgibt
function getPokemonSpriteUrl(pokemon) {
  return pokemon.sprites.other.dream_world.front_default || "";
}

function renderPokemonInfo(pokemon) {
  let pokedexElement = document.getElementById("pokedek");
  let types = getPokemonTypes(pokemon);
  let spriteUrl = getPokemonSpriteUrl(pokemon);
  pokemon.name =
    pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1).toLowerCase();
  const backgroundColor = getPokemonColor(pokemon.types); // Farbe basierend auf den Pokémon-Typen erhalten
  pokedexElement.innerHTML += /*html*/ `
    <div id='pokemon'class='pokemon' style='background-color: ${backgroundColor};'>
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

function filterNames() {
  const searchTerm = document
    .getElementById("search-field")
    .value.toLowerCase();
  const pokemonElements = document.getElementsByClassName("pokemon");

  for (let i = 0; i < pokemonElements.length; i++) {
    const pokemonName = pokemonElements[i]
      .getElementsByClassName("pkm-card-text")[0]
      .getElementsByTagName("h2")[0]
      .innerText.toLowerCase();
    if (pokemonName.includes(searchTerm)) {
      pokemonElements[i].style.display = "flex";
    } else {
      pokemonElements[i].style.display = "none";
    }
  }
}
