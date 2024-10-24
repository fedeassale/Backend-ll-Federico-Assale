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

// document.addEventListener('DOMContentLoaded', function () {
//     const buttons = document.querySelectorAll('.add-to-cart');

//     buttons.forEach(button => {
//         button.addEventListener('click', async (event) => {
//             const productId = event.target.getAttribute('data-product-id');
//             const cartId = '{{user.cart}}'; // Supongo que el carrito está vinculado al usuario

//             try {
//                 const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json'
//                     },
//                     body: JSON.stringify({ quantity: 1 }) // Puedes ajustar la cantidad según el caso
//                 });

//                 if (response.ok) {
//                     alert('Producto agregado al carrito');
//                 } else {
//                     alert('Error al agregar el producto');
//                 }
//             } catch (error) {
//                 console.error('Error:', error);
//                 alert('Error al agregar el producto');
//             }
//         });
//     });
// });