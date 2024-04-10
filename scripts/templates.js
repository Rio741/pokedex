function renderPokemon(pokemon, formattedId, secondType, displayValue, pokemonImage) {
  return `<div onclick='fetchCardPokemon(${pokemon.id})' class='pokemon' style='background-color: ${getPokemonColor(pokemon.types)};'>
      <div class='pkm-card-text'>
        <h2>${formatPokemonName(pokemon)}</h2>
        <span class='pkm-types'>${pokemon.types[0]["type"].name}</span>
        <span class='pkm-types' style='display: ${displayValue};'>${secondType}</span>
      </div>
      <span class='id'>#${formattedId}</span>
      <img class='pokemon-img' src='${pokemonImage}'>
    </div>`;
}

function renderPokemonCard(pokemonData, backgroundColor, formattedId, secondType, displayValue, pokemonImage) {
  return `
    <div class='pokemon-card' style='background-color: ${backgroundColor};'>
      <div class='pkm-card-text-open'>
        <h2>${formatPokemonName(pokemonData)}</h2>
        <span class='pkm-types'>${pokemonData.types[0].type.name}</span>
        <span class='pkm-types' style='display: ${displayValue};'>${secondType}</span>
      </div>
      <img onclick='closeCard()' class='kreuz-img' src='img/kreuz.png'>
      <span class='id'>#${formattedId}</span>
      <img class='pokemoncard-img' src='${pokemonImage}'>
    </div>
    <div class="card-details" id="menuCategories">
      <div class="menu-category">
        <button onclick='fetchFirstCategory("${pokemonData.id}")'><b>About</b></button>
        <button onclick='loadChart("${pokemonStatusValues(pokemonData)}")'><b>Base</b></button>
        <button onclick='loadEvolution("${pokemonData.id}")'><b>Evolution</b></button>
        <button onclick='displayPokemonMoves("${generatePokemonMoves(pokemonData)}")'><b>Moves</b></button>
      </div>
      <div id='category-content'> 
      </div>
      <canvas id="myChart"></canvas>
    </div>
    <img onclick='clickLeft("${pokemonData.id-1}")' src="img/pfeil-links.png" alt="" class="arrow-left">
    <img onclick='clickRight("${pokemonData.id+1}")' src="img/pfeil-rechts.png" alt="" class="arrow-right">
  `;
}
