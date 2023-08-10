
let categories = document.getElementById("categories"); 
let productList = document.getElementById("product-list"); 

let products = [
    {
        id: 1, 
        name: "Heladera", 
        image: "heladera.jpg", 
        price: '290.000', 
        category: "Electrodomésticos", 
        stock: 3, 
    },
    {
        id: 6, 
        name: "Monitor 19'", 
        image: "monitor.jpg", 
        price: '78.000', 
        category: "Informática", 
        stock: 2, 
    },
    {
        id: 2,
        name: "Televisor 55'",
        image: "televisor.jpg",
        price: '170.000',
        category: "Hogar",
        stock: 4,
    },
    {
        id: 3,
        name: "Computadora Gamer",
        image: "computadora.jpg",
        price: '850.000',
        category: "Informática",
        stock: 1,
    },
    {
        id: 4,
        name: "Impresora",
        image: "impresora.jpg",
        price: '127.000',
        category: "Informática",
        stock: 5,
    },
    {
        id: 5,
        name: "GPU RTX 3090",
        image: "rtx.jpg",
        price: '499.999',
        category: "Informática",
        stock: 2,
    },
];

// Función para generar las categorías desde el array de productos
function generateCategories() {
    let categoriesObj = {};
    for (let product of products) {
        let category = product.category;
        if (!categoriesObj[category]) {
            categoriesObj[category] = 1;
        } else {
            categoriesObj[category]++;
        }
    }
    for (let category in categoriesObj) {
        let li = document.createElement("li");
        let a = document.createElement("a");

        a.textContent = `${category} (${categoriesObj[category]})`;
        a.setAttribute("href", "#");
        li.appendChild(a);
        categories.appendChild(li);
    }
}

function generateProducts() {
    for (let product of products) {
        let div = document.createElement("div");
        div.className = "product-item";
        let img = document.createElement("img"); 
        img.setAttribute("src", 'img/'+ product.image);
        div.appendChild(img);
        let h4 = document.createElement("h4");
        h4.textContent = product.name;
        div.appendChild(h4);

        let p = document.createElement("p");
        p.textContent = `$${product.price}`;
        div.appendChild(p);

        let button = document.createElement("button");
        button.textContent = "Comprar";
        button.addEventListener("click", function () {
            addToCart(product.id);
        });
        div.appendChild(button);
        productList.appendChild(div);
    }
}

// Función para agregar un producto al carrito
function addToCart(id) {
    let product = products.find((product) => product.id === id);
    if (product && product.stock > 0) {
        product.stock--;
        
        let cart = JSON.parse(localStorage.getItem("Producto")) || [];
        let item = cart.find((item) => item.id === id);

        if (item) {
            item.quantity++;
        } else {
            item = {
                id: product.id,
                name: product.name,
                quantity: 1,
            };
            cart.push(item);
        }
        localStorage.setItem("Producto", JSON.stringify(cart, null, 1));
        Swal.fire({
            icon: "success",
            title: "Producto agregado al carrito",
            text: `${product.name} x ${item.quantity}`,
            timer: 2000,
            showConfirmButton: false,
        });
    } else {
        Swal.fire({
            icon: "error",
            title: "No hay stock disponible",
            text: `Lo sentimos, no hay más unidades de ${product.name}`,
            timer: 2000,
            showConfirmButton: false,
        });
    }
}

// Función para filtrar los productos por categoría usando una promesa
function filterByCategory(category) {
    return new Promise(function (resolve, reject) {
        let filteredProducts = [];
        for (let product of products) {
            if (product.category === category) {
                filteredProducts.push(product);
            }
        }
        if (filteredProducts.length > 0) {
            resolve(filteredProducts);
        } else {
            reject("No se encontraron productos con esa categoría");
        }
    });
}

generateCategories();

generateProducts();

// Función para filtrar el array de una cierta categoria de productos
filterByCategory("Informática")
    .then(function (products) {
        console.log(products);
    })
    .catch(function (error) {
        console.error(error);
    });



const url = 'https://jsonplaceholder.typicode.com/users';
let boton = document.getElementById('btn2');

// Función para obtener los datos de 10 usuarios random de la API usando fetch
function obtenerUsuarios() {
    fetch(url)
    .then(function (respuesta) {
        if (respuesta.ok) {
        return respuesta.json();
        } else {
        throw new Error(respuesta.status);
        }
    })
    .then(function (json) {
        for (let i = 0; i < json.length; i++) {
        let usuario = json[i];

        let usuarioHTML = document.createElement('div');
        usuarioHTML.classList.add('users');
        usuarioHTML.innerHTML = '<h2>' + usuario.name + '</h2><p><b>Email: </b>' + usuario.email + '</p><p><b>Teléfono: </b>' + usuario.phone + '</p>';
        document.getElementById('usuarios').appendChild(usuarioHTML);
        }
    })
    .catch(function (error) {
        console.error('Error al obtener los usuarios: ' + error.message);
    });
}
boton.addEventListener('click', obtenerUsuarios);


// Función para mostrar el carrito
function showCart() {
    let cart = JSON.parse(localStorage.getItem("Producto")) || [];
    if (cart.length === 0) {
        Swal.fire({
            title: "Tu carrito está vacío",
            text: "Aún no has comprado nada",
            icon: "info",
        });
    } else {
        let cartItems = "";
        let total = 0;
        for (let item of cart) {
            let product = products.find((product) => product.id === item.id);
            let subtotal = item.quantity * product.price;
            cartItems += `${item.name} x ${item.quantity} - $${subtotal}\n`;
            total += subtotal;
        }
        Swal.fire({
            title: "Tu carrito tiene los siguientes productos:",
            text: cartItems + `Total: $${total.toFixed(2)}`,
            icon: "success",
            showCancelButton: true,
            confirmButtonText: "Finalizar compra",
            cancelButtonText: "Seguir comprando",
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem("Producto");
                Swal.fire({
                    title: "Gracias por tu compra",
                    text: "Esperamos que disfrutes de tus productos",
                    icon: "success",
                });
                generateProducts();
            }
        });
    }
}

let cartButton = document.getElementById("cart-button");
cartButton.addEventListener("click", showCart);