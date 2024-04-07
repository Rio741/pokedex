let COUNT_VALUE = 0;
let statusNames = [];
let statusValues = [];
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

async function fetchPokemons() {
  const MAIN_URL = `https://pokeapi.co/api/v2/pokemon/?offset=${COUNT_VALUE}`;
  let response = await fetch(MAIN_URL);
  let textToJson = await response.json();
  let pokemonList = textToJson.results;
  for (let i = 0; i < pokemonList.length; i++) {
    await getPokemonInfos(pokemonList[i].url);
  }
}

async function getPokemonInfos(url) {
  let response = await fetch(url);
  let pokemon = await response.json();
  let pokemonImage = pokemon.sprites.other.dream_world.front_default;
  const formattedId = String(pokemon.id).padStart(3, "0");
  let secondType = checkSecondPokeType(pokemon);
  let displayValue = secondType ? "inline" : "none";
  let pokedek = document.getElementById("pokedek");
  pokedek.innerHTML += renderPokemon(pokemon, formattedId, secondType, displayValue, pokemonImage);//im templates-ordner
  console.log(pokemon);
}

async function fetchCardPokemon(pokemonId) {
  const url = `https://pokeapi.co/api/v2/pokemon/${pokemonId}/`;
  let response = await fetch(url);
  let pokemonData = await response.json();
  getPokemonCardInfos(pokemonData);
}

function getPokemonCardInfos(pokemonData) {
  const pokeCard = document.getElementById("pokecard"); // pokeCard initialisieren
  setCard(pokeCard); // Die Pokecard anzeigen
  const primaryType = pokemonData.types[0].type.name;
  const backgroundColor = typeColors[primaryType]
  const formattedId = String(pokemonData.id).padStart(3, "0");
  let secondType = checkSecondPokeType(pokemonData);
  let displayValue = secondType ? "inline" : "none";
  let pokemonImage = pokemonData.sprites.other.dream_world.front_default;
  pokeCard.innerHTML = renderPokemonCard(pokemonData, backgroundColor, formattedId, secondType, displayValue, pokemonImage);//im templates-ordner
}

function setCard(pokeCard){
  pokeCard.style.display = "flex";
  document.getElementById("blackscreen").style.display = "flex";
  document.body.style.overflow = "hidden";
}

function displayCategoryContent(content) {
  let categoryContent = document.getElementById("category-content");
  categoryContent.innerHTML = `<div>${content}</div>`;
}

let myChart;
function loadChart() {
  if (myChart) {
    myChart.destroy();
  }

  const ctx = document.getElementById("myChart");
  myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: statusNames,
      datasets: [
        {
          label: "# of Votes",
          data: statusValues,
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

function pokemonStatusValues(pokemonData) {
  let baseStats = pokemonData.stats;
  statusNames = [];
  statusValues = [];
  for (let i = 0; i < baseStats.length; i++) {
    statusNames.push(baseStats[i].stat.name);
    statusValues.push(baseStats[i].base_stat);
  }
}

function generatePokemonMoves(pokemonData) {
  let moves = pokemonData.moves;
  let movesHTML = "<div>";
  for (let i = 0; i < moves.length; i++) {
    movesHTML += `<span class= move>-${moves[i].move.name}</span>`;
  }
  return movesHTML;
}


function formatPokemonName(pokemon) {
  pokemonName =
    pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1).toLowerCase();
  return pokemonName;
}

function checkSecondPokeType(pokemon) {
  if (pokemon.types.length > 1) {
    return pokemon.types[1]["type"].name;
  } else {
    return null;
  }
}

function getPokemonColor(types) {
  const primaryType = types[0].type.name;
  return typeColors[primaryType] || "gray";
}

function loadMorePokemons() {
  COUNT_VALUE += 20;
  fetchPokemons();
}

function closeCard() {
  document.getElementById("blackscreen").style.display = "none";
  document.getElementById("pokecard").style.display = "none";
  document.body.style.overflow = "auto";
}