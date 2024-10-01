const socket = io();

socket.on("productos", (data)=>{
    renderProductos(data)
})

const renderProductos = (productos) =>{
    const contenedorProductos = document.getElementById("product-list")
    contenedorProductos.innerHTML ="";

productos.forEach((producto) => {
    const card = document.createElement("div")
    
    card.innerHTML = `
    <div class="cardReal" >
    <h3 class="cardTitulo centrar-text">${producto.title}</h3>
    <p class="cardDescription centrar-text">${producto.description}</p>
    <p class="cardPrice centrar-text">$${producto.price}</p>
    <button class="cardButton centrar-text"> Eliminar </button>
    </div> `

    contenedorProductos.appendChild(card)

    card.querySelector("button").addEventListener("click", ()=>{
        eliminarProducto(producto.id);
    })
})};

const eliminarProducto = (id)=>{
    socket.emit("eliminarProducto", id);
}

//agregar producto

const productForm = document.getElementById('product-form');
const productTitleInput = document.getElementById('product-title');
const productDescriptionInput = document.getElementById('product-description');
const productPriceInput = document.getElementById('product-price');
const productStatusInput = document.getElementById('product-status');
const productCodeInput = document.getElementById('product-code');
const productStockInput = document.getElementById('product-stock');
const productCategoryInput = document.getElementById('product-category');

productForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const product = {
        "title": productTitleInput.value,
        "description": productDescriptionInput.value,
        "price": parseFloat(productPriceInput.value),
        "status": productStatusInput.value.toLowerCase() === 'true',
        "code": parseInt(productCodeInput.value),
        "stock": parseInt(productStockInput.value),
        "category": productCategoryInput.value
    };
    socket.emit("addProduct", product);
    productForm.reset();
});