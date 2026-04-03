import { db, collection, addDoc, getDocs, doc, deleteDoc } from "./firebase.js";
import { getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
// 🛒 ADD TO CART (FIREBASE)
async function addToCart(name, price){
    await addDoc(collection(db, "cart"), {
        name,
        price
    });

    alert("Added to cart ✅");
}

// 🛒 DISPLAY CART (FROM FIREBASE)
async function displayCart(){
    let div = document.getElementById('cartItems');
    let emptyMsg = document.getElementById('emptyMsg');

    if(!div) return;

    const snapshot = await getDocs(collection(db, "cart"));

    let total = 0;
    div.innerHTML = "";

    if(snapshot.empty){
        emptyMsg.style.display = "block";
        return;
    } else {
        emptyMsg.style.display = "none";
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
}window.removeItem = async function(id){
    await deleteDoc(doc(db, "cart", id));
    displayCart();
}
// ➡️ GO TO CHECKOUT
function checkout(){
    window.location = "checkout.html";
}

// 📦 PLACE ORDER (MOVE CART → ORDERS)
async function placeOrder(){
    let name = document.getElementById('name').value;
    let phone = document.getElementById('phone').value;
    let address = document.getElementById('address').value;
    let error = document.getElementById('error');

    if(name=="" || phone=="" || address==""){
        error.innerText = "Please fill all details";
        return;
    }

    const snapshot = await getDocs(collection(db, "cart"));
    let items = [];

    snapshot.forEach(docSnap=>{
        items.push(docSnap.data());
    });

    const orderRef = await addDoc(collection(db, "orders"), {
        name,
        phone,
        address,
        items,
        status: "Processing"
    });

    // CLEAR CART
    snapshot.forEach(async (docSnap)=>{
        await deleteDoc(doc(db, "cart", docSnap.id));
    });

    // SAVE ORDER ID
    localStorage.setItem("lastOrderId", orderRef.id);

    window.location = "order.html";
}

 

// 📍 TRACK ORDER (REAL)
async function trackOrder(){
    let id = document.getElementById("orderId").value;
    let statusText = document.getElementById("status");
    let progressDiv = document.getElementById("progress");

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

        // PROGRESS UI
        if(status === "Processing"){
            progressDiv.innerHTML = "🟡 Processing your order";
        }
        else if(status === "Out for Delivery"){
            progressDiv.innerHTML = "🚚 Out for delivery";
        }
        else if(status === "Delivered"){
            progressDiv.innerHTML = "✅ Delivered successfully";
        }

    }catch{
        statusText.innerText = "Invalid Order ID";
    }
}
// 🔄 LOAD CART ON PAGE
window.onload = displayCart;

// 🌍 MAKE FUNCTIONS GLOBAL
window.addToCart = addToCart;
window.checkout = checkout;
window.placeOrder = placeOrder;
window.trackOrder = trackOrder;
window.removeItem = removeItem;
