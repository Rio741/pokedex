let COUNT_VALUE = 0;
let base_name = [];
let base_value = [];
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

async function loadPokemons() {
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
  pokedek.innerHTML += /*html*/ `
    <div onclick='loadPokemonCard(${
      pokemon.id
    })' class='pokemon' style='background-color: ${getPokemonColor(
    pokemon.types
  )};'>
      <div class='pkm-card-text'>
        <h2>${nameToUpperCase(pokemon)}</h2>
        <span class='pkm-types'>${pokemon.types[0]["type"].name}</span>
        <span class='pkm-types' style='display: ${displayValue};'>${secondType}</span>
      </div>
      <span class='id'>#${formattedId}</span>
      <img class='pokemon-img' src='${pokemonImage}'>
    </div>`;
  console.log(pokemon);
}

function nameToUpperCase(pokemon) {
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
  loadPokemons();
}

async function filterNames() {
  const MAIN_URL = `https://pokeapi.co/api/v2/pokemon/`;
  let response = await fetch(MAIN_URL);
  let textToJson = await response.json();
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
  console.log(textToJson);
}

async function loadPokemonCard(pokemonId) {
  const url = `https://pokeapi.co/api/v2/pokemon/${pokemonId}/`;
  let response = await fetch(url);
  let pokemonData = await response.json();
  openPokemonCard(pokemonData);
}

function openPokemonCard(pokemonData) {
  let moves = renderPokemonMoves(pokemonData);
  let bases = renderPokemonStats(pokemonData);
  document.getElementById("blackscreen").style.display = "flex";
  let pokeCard = document.getElementById("pokecard");
  pokeCard.style.display = "flex";
  const primaryType = pokemonData.types[0].type.name;
  const backgroundColor = typeColors[primaryType] || "gray";
  const formattedId = String(pokemonData.id).padStart(3, "0");
  let secondType = checkSecondPokeType(pokemonData);
  let displayValue = secondType ? "inline" : "none";
  let pokemonImage = pokemonData.sprites.other.dream_world.front_default;
  pokeCard.innerHTML = /*html*/ `
    <div class='pokemon-card' style='background-color: ${backgroundColor};'>
      <div class='pkm-card-text'>
        <h2>${nameToUpperCase(pokemonData)}</h2>
        <span class='pkm-types'>${pokemonData.types[0].type.name}</span>
        <span class='pkm-types' style='display: ${displayValue};'>${secondType}</span>
      </div>
      <img onclick='closeCard()' class='kreuz-img' src='img/kreuz.png'>
      <span class='id'>#${formattedId}</span>
      <img class='pokemoncard-img' src='${pokemonImage}'>
    </div>
    <div class="card-details" id="menuCategories">
<div class="menu-category">
<span onclick='renderCategory()'><b>About</b></span>
  <span onclick='loadChart("${bases}")'><b>Base</b></span>
  <span onclick='renderCategory()'><b>Evolution</b></span>
  <span onclick='renderCategory("${moves}")'><b>Moves</b></span>
</div>
<div id='category-content'>
<canvas id="myChart"></canvas>
</div>
</div>`;
  document.body.style.overflow = "hidden";
}

function renderCategory(index) {
  let categoryContent = document.getElementById("category-content");
  categoryContent.innerHTML = `<div>${index}</div>`;
}

function renderPokemonMoves(pokemonData) {
  let moves = pokemonData.moves;
  let movesHTML = "<div>";
  for (let i = 0; i < moves.length; i++) {
    movesHTML += `<span class= move>-${moves[i].move.name}</span>`;
  }
  return movesHTML;
}
function loadChart() {
  const ctx = document.getElementById("myChart");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: [base_name],
      datasets: [
        {
          label: "# of Votes",
          data: [base_value],
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

function closeCard() {
  document.getElementById("blackscreen").style.display = "none";
  document.getElementById("pokecard").style.display = "none";
  document.body.style.overflow = "auto";
}

async function renderPokemonStats(pokemonData) {
  let base = pokemonData.stats;
  let baseHTML = "";
  let base_stat = "";
  for (let i = 0; i < base.length; i++) {
    baseHTML = `${base[i].stat.name}`;
    base_name.push(baseHTML);
  }
  for (let j = 0; j < base.length; j++) {
    base_stat = `${base[j].base_stat}`;
    base_value.push(base_stat);
  }
}
