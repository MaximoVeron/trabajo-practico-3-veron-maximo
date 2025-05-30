// URL base de la API (reemplazá con la tuya si es otra)
const API_URL = 'https://dragonball-api.com/api/characters'; // ejemplo

// Referencias a elementos del DOM
const charactersContainer = document.getElementById('charactersContainer');
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');

// Función que obtiene los personajes desde la API
function fetchCharacters(name = '') {
    let url = API_URL;

    // Si se proporciona un nombre, agrega el parámetro de búsqueda
    if (name) {
        url += `?name=${encodeURIComponent(name)}`;
    }

    // Realiza la solicitud a la API
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los personajes');
            }
            return response.json();
        })
        .then(data => {
            // La API puede devolver los personajes directamente o dentro de una propiedad (como 'items')
            const characters = data.items || data; 
            renderCharacters(characters);
        })
        .catch(error => {
            console.error('Error:', error);
            showMessage('No se pudieron cargar los personajes.');
        });
}

// Función que muestra las tarjetas de los personajes
function renderCharacters(characters) {
    // Limpia el contenedor
    charactersContainer.innerHTML = ''; 

    // Recorre y crea una tarjeta por cada personaje
    characters.forEach(character => {
        const col = document.createElement('div');
        col.className = 'col-sm-6 col-md-4 col-lg-3';

        col.innerHTML = `
    <div class="card shadow h-100 d-flex flex-column">
        <img src="${character.image}" class="card-img-top" alt="${character.name}">
        <div class="card-body d-flex flex-column justify-content-between">
            <h5 class="card-title">${character.name}</h5>
            <p class="card-text"><strong>Raza:</strong> ${character.race || 'Desconocida'}</p>
            <p class="card-text"><strong>Género:</strong> ${character.gender || 'Desconocido'}</p>
        </div>
    </div>
`;


        // Evento que abre un modal con información detallada
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

            // Abre el modal con Bootstrap
            const modal = new bootstrap.Modal(document.getElementById('characterModal'));
            modal.show();
        });

        charactersContainer.appendChild(col);
    });
}

// Muestra un mensaje en pantalla (podés mejorar esta función con un alert o toast)
function showMessage(message) {
    alert(message);
}

// Maneja la búsqueda desde el formulario
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = searchInput.value.trim();
    if (!name) {
        showMessage('Por favor, ingresá un nombre para buscar.');
        return;
    }

    fetchCharacters(name); // Busca por nombre
});

// Carga los personajes automáticamente al iniciar
fetchCharacters();
