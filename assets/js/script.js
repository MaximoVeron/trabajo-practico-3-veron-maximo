const API_URL = 'https://dragonball-api.com/api/characters';
const charactersContainer = document.getElementById('charactersContainer');
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const messageDiv = document.getElementById('message');

// devuelve los personajes
async function fetchCharacters(name = '') {
    try {
    messageDiv.textContent = '';
    charactersContainer.innerHTML = '<p class="text-center">Cargando personajes...</p>';

    const response = await fetch(
    name ? `${API_URL}/search?name=${encodeURIComponent(name)}` : API_URL
    );

    if (!response.ok) throw new Error('Error en la solicitud');

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
        showMessage('No se encontraron personajes con ese nombre.');
        charactersContainer.innerHTML = '';
        return;
    }

    renderCharacters(data.items);
    } catch (error) {
    showMessage('Ocurrió un error al consultar la API.');
    charactersContainer.innerHTML = '';
    console.error(error);
    }
}

// muestra el mensaje 
function showMessage(msg) {
    messageDiv.textContent = msg;
}

// muestra las tarjetas de los personajes 
function renderCharacters(characters) {
    charactersContainer.innerHTML = ''; 

    characters.forEach(character => {
        const col = document.createElement('div');
        col.className = 'col-sm-6 col-md-4 col-lg-3';

        col.innerHTML = `
        <div class="card h-100 shadow">
            <img src="${character.image}" class="card-img-top" alt="${character.name}">
            <div class="card-body">
                <h5 class="card-title">${character.name}</h5>
                <p class="card-text"><strong>Raza:</strong> ${character.race || 'Desconocida'}</p>
                <p class="card-text"><strong>Género:</strong> ${character.gender || 'Desconocido'}</p>
            </div>
        </div>
        `;

        col.addEventListener('click', () => {
            document.getElementById('modalTitle').textContent = character.name;
            document.getElementById('modalContent').innerHTML = `
                <div class="row">
                    <div class="col-md-4">
                        <img src="${character.image}" alt="${character.name}" class="img-fluid rounded">
                    </div>
                    <div class="col-md-8">
                        <p><strong>Raza:</strong> ${character.race || 'Desconocida'}</p>
                        <p><strong>Género:</strong> ${character.gender || 'Desconocido'}</p>
                        <p><strong>Ki:</strong> ${character.ki || 'Desconocido'}</p>
                        <p><strong>Descripción:</strong> ${character.description || 'Sin descripción disponible.'}</p>
                    </div>
                </div>
            `;
            const modal = new bootstrap.Modal(document.getElementById('characterModal'));
            modal.show();
        });

        charactersContainer.appendChild(col);
    });
}

// barra de navegacion
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = searchInput.value.trim();
    if (!name) {
        showMessage('Por favor, ingresá un nombre para buscar.');
        return;
    }
    fetchCharacters(name);
});

// muestra todos los personajes al cargar
fetchCharacters();