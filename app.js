import { 
    db, collection, addDoc, getDocs, doc, deleteDoc, getDoc 
} from "./firebase.js";

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
    if(!div) return;

    const snapshot = await getDocs(collection(db, "cart"));

    let total = 0;
    div.innerHTML = "";

    snapshot.forEach(docSnap=>{
        let item = docSnap.data();
        total += item.price;

        div.innerHTML += `<p>${item.name} - ₹${item.price}</p>`;
    });

    div.innerHTML += `<h3>Total: ₹${total}</h3>`;
}

// ➡️ GO TO CHECKOUT
function checkout(){
    window.location = "checkout.html";
}

// 📦 PLACE ORDER (MOVE CART → ORDERS)
async function placeOrder(){
    let name = document.getElementById('name').value;
    let address = document.getElementById('address').value;

    if(name=="" || address==""){
        alert("Fill all details");
        return;
    }

    const snapshot = await getDocs(collection(db, "cart"));
    let items = [];

    snapshot.forEach(docSnap=>{
        items.push(docSnap.data());
    });

    const orderRef = await addDoc(collection(db, "orders"), {
        name,
        address,
        items,
        status: "Processing"
    });

    // CLEAR CART
    snapshot.forEach(async (docSnap)=>{
        await deleteDoc(doc(db, "cart", docSnap.id));
    });

    // SAVE ORDER ID FOR TRACKING PAGE
    localStorage.setItem("lastOrderId", orderRef.id);

    window.location = "order.html";
}

// 📍 TRACK ORDER (REAL)
async function trackOrder(){
    let input = document.getElementById("orderId");
    let id = input.value || localStorage.getItem("lastOrderId");

    if(!id){
        document.getElementById("status").innerText = "Enter Order ID";
        return;
    }

    try{
        const snap = await getDoc(doc(db, "orders", id));

        if(snap.exists()){
            document.getElementById("status").innerText = snap.data().status;
        } else {
            document.getElementById("status").innerText = "Order not found";
        }
    }catch{
        document.getElementById("status").innerText = "Invalid ID";
    }
}

// 🔄 LOAD CART ON PAGE
window.onload = displayCart;

// 🌍 MAKE FUNCTIONS GLOBAL
window.addToCart = addToCart;
window.checkout = checkout;
window.placeOrder = placeOrder;
window.trackOrder = trackOrder;
