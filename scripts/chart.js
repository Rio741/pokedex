const customColors = [
  'rgb(255, 99, 132)', // Rot
  'rgb(54, 162, 235)', // Blau
  'rgb(255, 205, 86)', // Gelb
  'rgb(75, 192, 192)', // Grün
  'rgb(153, 102, 255)', // Lila
  'rgb(255, 159, 64)', // Orange
];

function loadChart(pokemonData) {
  let content = document.getElementById('category-content')
  content.innerHTML = `<div class="chartbox"><canvas id="myChart" class="chart"></canvas></div>`;
  const ctx = document.getElementById('myChart');
  myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: statusNames,
      datasets: [{
        label: 'Status-Values',
        data: statusValues,
        backgroundColor: customColors,
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

