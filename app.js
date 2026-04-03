import { 
    db, collection, addDoc, getDocs, doc, deleteDoc 
} from "./firebase.js";

import { getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


// 🛒 ADD TO CART
async function addToCart(name, price){
    try{
        await addDoc(collection(db, "cart"), {
            name,
            price
        });

        alert("Added to cart ✅");
    }catch(err){
        console.error(err);
        alert("Error adding to cart ❌");
    }
}


// 🛒 DISPLAY CART
async function displayCart(){
    let div = document.getElementById('cartItems');
    let emptyMsg = document.getElementById('emptyMsg');

    if(!div) return;

    try{
        const snapshot = await getDocs(collection(db, "cart"));

        let total = 0;
        div.innerHTML = "";

        if(snapshot.empty){
            if(emptyMsg) emptyMsg.style.display = "block";
            return;
        } else {
            if(emptyMsg) emptyMsg.style.display = "none";
        }

        snapshot.forEach(docSnap=>{
            let item = docSnap.data();
            total += item.price;

            div.innerHTML += `
            <p>
                ${item.name} - ₹${item.price}
                <button onclick="removeItem('${docSnap.id}')">❌</button>
            </p>
            `;
        });

        div.innerHTML += `<h3>Total: ₹${total}</h3>`;
    }catch(err){
        console.error(err);
    }
}


// ❌ REMOVE ITEM
async function removeItem(id){
    try{
        await deleteDoc(doc(db, "cart", id));
        displayCart();
    }catch(err){
        console.error(err);
    }
}


// ➡️ GO TO CHECKOUT
function checkout(){
    window.location = "checkout.html";
}


// 📦 PLACE ORDER
async function placeOrder(){
    try{
        let name = document.getElementById('name').value;
        let phone = document.getElementById('phone').value;
        let address = document.getElementById('address').value;
        let error = document.getElementById('error');

        if(name=="" || phone=="" || address==""){
            if(error) error.innerText = "Please fill all details";
            return;
        }

        const snapshot = await getDocs(collection(db, "cart"));
        let items = [];

        snapshot.forEach(docSnap=>{
            items.push(docSnap.data());
        });

        if(items.length === 0){
            alert("Cart is empty ❌");
            return;
        }

        const orderRef = await addDoc(collection(db, "orders"), {
            name,
            phone,
            address,
            items,
            status: "Processing"
        });

        // CLEAR CART
        for (const docSnap of snapshot.docs){
            await deleteDoc(doc(db, "cart", docSnap.id));
        }

        // SAVE ORDER ID
        localStorage.setItem("lastOrderId", orderRef.id);

        window.location = "order.html";

    }catch(err){
        console.error(err);
        alert("Order failed ❌");
    }
}


// 📍 TRACK ORDER
async function trackOrder(){
    let idInput = document.getElementById("orderId");
    let statusText = document.getElementById("status");
    let progressDiv = document.getElementById("progress");

    if(!idInput) return;

    let id = idInput.value;

    if(!id){
        statusText.innerText = "Please enter Order ID";
        return;
    }

    try{
        const snap = await getDoc(doc(db, "orders", id));

        if(!snap.exists()){
            statusText.innerText = "Order not found ❌";
            return;
        }

        let status = snap.data().status;
        statusText.innerText = "Status: " + status;

        if(progressDiv){
            if(status === "Processing"){
                progressDiv.innerHTML = "🟡 Processing your order";
            }
            else if(status === "Out for Delivery"){
                progressDiv.innerHTML = "🚚 Out for delivery";
            }
            else if(status === "Delivered"){
                progressDiv.innerHTML = "✅ Delivered successfully";
            }
        }

    }catch(err){
        console.error(err);
        statusText.innerText = "Invalid Order ID";
    }
}


// 🔄 LOAD CART
window.onload = displayCart;


// 🌍 MAKE FUNCTIONS GLOBAL (VERY IMPORTANT)
window.addToCart = addToCart;
window.checkout = checkout;
window.placeOrder = placeOrder;
window.trackOrder = trackOrder;
window.removeItem = removeItem;
