const results = document.getElementById('results');
let todosLosPokemones = [];
async function cargarPokemonesIniciales(limit = 300) {
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`);
    const data = await res.json();

    const detallesPromises = data.results.map(poke => fetch(poke.url).then(r => r.json()));
    todosLosPokemones = await Promise.all(detallesPromises);

    mostrarPokemones(todosLosPokemones);
  } catch (error) {
    results.innerHTML = '<p class="error">Error al cargar los Pokémon. Intenta nuevamente.</p>';
  }
}

function mostrarPokemones(pokemones) {
  results.innerHTML = pokemones.map(data => `
    <a href="detalle.html?pokemon=${data.name}" class="card">
      <h3>${data.name.toUpperCase()}</h3>
      <img src="${data.sprites.front_default}" alt="${data.name}" />
      <p><strong>Tipo:</strong> ${data.types.map(t => t.type.name).join(', ')}</p>
    </a>
  `).join('');
}

function buscarPokemon() {
  const input = document.getElementById('pokemonInput');
  const nombre = input.value.trim().toLowerCase();

  if (!nombre) {
    mostrarPokemones(todosLosPokemones);
    return;
  }

  const filtrado = todosLosPokemones.filter(poke => poke.name.includes(nombre));

  if (filtrado.length > 0) {
    mostrarPokemones(filtrado);
  } else {
    results.innerHTML = '<p class="error">Pokémon no encontrado. Intenta con otro nombre.</p>';
  }
}

window.onload = cargarPokemonesIniciales;