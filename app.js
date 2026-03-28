import { db, collection, addDoc } from "./firebase.js";

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(name, price){
    cart.push({name, price});
    localStorage.setItem('cart', JSON.stringify(cart));
    alert("Added to cart ✅");
}

function displayCart(){
    let div = document.getElementById('cartItems');
    if(!div) return;

    let total = 0;
    div.innerHTML="";

    cart.forEach(item=>{
        total += item.price;
        div.innerHTML += `<p>${item.name} - ₹${item.price}</p>`;
    });

    div.innerHTML += `<h3>Total: ₹${total}</h3>`;
}

function checkout(){
    window.location = "checkout.html";
}

async function placeOrder(){
    let name = document.getElementById('name').value;
    let address = document.getElementById('address').value;

    if(name=="" || address==""){
        alert("Fill all details");
        return;
    }

    await addDoc(collection(db, "orders"), {
        name,
        address,
        cart,
        status:"Processing"
    });

    localStorage.removeItem('cart');
    window.location = "order.html";
}

function trackOrder(){
    document.getElementById('status').innerText = "Out for Delivery 🚚";
}

window.onload = displayCart;

// MAKE FUNCTIONS GLOBAL
window.addToCart = addToCart;
window.checkout = checkout;
window.placeOrder = placeOrder;
window.trackOrder = trackOrder;