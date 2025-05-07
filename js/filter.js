// Cargar el archivo JSON con los productos
fetch('js/products.json')
  .then(response => response.json()) // Convierte la respuesta a formato JSON
  .then(data => {
    const { categories, products } = data; // Desestructuramos las categorías y productos del JSON
    
    // Crear las pills de categorías
    crearPills(categories, products);

    // Mostrar todos los productos inicialmente
    mostrarProductos(products);

    // Filtrar productos por búsqueda
    document.getElementById("search-input").addEventListener("input", function(event) {
      const searchTerm = event.target.value.toLowerCase();
      const filteredProducts = products.filter(product => normalizeString(product.title).includes(normalizeString(searchTerm)));
      mostrarProductos(filteredProducts);
    });
  })
  .catch(error => {
    console.error('Error al cargar los productos:', error);
  });

// Función para crear las pills de categorías
function crearPills(categories, products) {
  const categoryPillsContainer = document.getElementById("category-pills");

  // Asegúrate de que el contenedor tenga las clases necesarias para el diseño responsivo
  categoryPillsContainer.classList.add("d-flex", "flex-wrap", "justify-content-center");

  // Generar el HTML de las pills de categorías
  categories.forEach(category => {
    const pill = document.createElement("button");
    pill.classList.add("btn", "p-2", "m-2", "text-uppercase", "btn-outline-info");
    pill.innerText = category;

    pill.addEventListener("click", () => {
      const yaActiva = pill.classList.contains("btn-info");
    
      // Desactivar todas las pills
      document.querySelectorAll("#category-pills button").forEach(p => {
        p.classList.remove("btn-info");
        p.classList.add("btn-outline-info");
      });
    
      if (yaActiva) {
        // Si ya estaba activa, simplemente mostrar todos los productos
        mostrarProductos(products);
      } else {
        // Activar la pill clickeada
        pill.classList.remove("btn-outline-info");
        pill.classList.add("btn-info");
    
        // Filtrar por esa categoría
        filtrarPorCategoria(category, products);
      }
    });
      
    categoryPillsContainer.appendChild(pill);
  });
}

  

// Función para filtrar productos por categoría
function filtrarPorCategoria(categoria, products) {
    const pills = document.querySelectorAll("#category-pills button");
    let activeCategory = null;
  
    pills.forEach(pill => {
      if (pill.classList.contains("btn-info")) {
        activeCategory = pill.innerText;
      }
    });
  
    // Si hay una categoría activa y coincide con la que clickeaste
    if (activeCategory === categoria) {
      mostrarProductos(products); // Mostrar todos
    } else {
      const filteredProducts = products.filter(product => product.category === categoria);
      mostrarProductos(filteredProducts);
    }
  }
  

  function mostrarProductos(products) {
    const productContainer = document.getElementById("product-container");
    const noResultsMessage = document.getElementById("no-results-message");
  
    productContainer.innerHTML = ''; // Limpiar contenedor de productos
  
    if (products.length === 0) {
      noResultsMessage.classList.remove("d-none"); // Mostrar mensaje
    } else {
      noResultsMessage.classList.add("d-none"); // Ocultar mensaje
    }
  
    products.forEach(product => {
      const productCard = document.createElement("div");
      // Cambiar el comportamiento de las columnas en pantallas pequeñas (col-6)
      productCard.classList.add("col-6", "col-sm-6", "col-md-4", "col-lg-3", "card-container");
  
      productCard.innerHTML = `
        <div class="card text-center product m-2 m-md-3 rounded square-card">
          <img class="img-fluid d-block mx-auto img-fixed" src="${product.image}" alt="${product.title}" />
          <div class="card-body p-2">
            <h5 class="lead text-dark">${product.title}</h5>
          </div>
        </div>
      `;
  
      productContainer.appendChild(productCard);
    });
  }
  

// Función para normalizar cadenas de texto (eliminar tildes y hacer minúsculas)
function normalizeString(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}
