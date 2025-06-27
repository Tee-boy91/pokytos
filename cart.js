
const menuItems = [
    { name: "Grilled Pork", price: 50, image: "images/grilled-pork.jpg" },
    { name: "Pork Kebab", price: 25, image: "images/spicy-kebab.jpg" },
    { name: "Soda", price: 10, image: "images/pork-chops.jpg" },
    { name: "Palm Wine", price: 15, image: "images/pork-chops.jpg" }
];

let cart = menuItems.map(item => ({ ...item, quantity: 0 }));

document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', (event) => {
        const itemElement = event.target.closest('.item');
        const itemName = itemElement.dataset.name;
        const itemIndex = cart.findIndex(item => item.name === itemName);

        if (itemIndex !== -1) {
            cart[itemIndex].quantity++;
            updateCart();
            showAddedToCartMessage(event.target);
        }
    });
});

document.querySelectorAll('.remove-from-cart').forEach(button => {
    button.addEventListener('click', (event) => {
        const itemElement = event.target.closest('.item');
        const itemName = itemElement.dataset.name;
        const itemIndex = cart.findIndex(item => item.name === itemName);

        if (itemIndex !== -1 && cart[itemIndex].quantity > 0) {
            cart[itemIndex].quantity--;
            updateCart();
        }
    });
});

function showAddedToCartMessage(button) {
    const message = document.createElement('div');
    message.textContent = 'Added to cart';
    message.style.position = 'absolute';
    message.style.backgroundColor = '#4CAF50';
    message.style.color = 'white';
    message.style.padding = '5px 10px';
    message.style.borderRadius = '5px';
    message.style.zIndex = '1000';
    
    const rect = button.getBoundingClientRect();
    message.style.left = `${rect.left + window.scrollX}px`;
    message.style.top = `${rect.top + window.scrollY - 30}px`;

    document.body.appendChild(message);

    setTimeout(() => {
        document.body.removeChild(message);
    }, 2000);
}
function updateCart() {
  const cartItems = document.getElementById("cart-items");
  const addFee = document.getElementById("addFee");
  cartItems.innerHTML = "";
  let total = 0;
  cart.forEach(item => {
    if (item.quantity > 0) {
      const li = document.createElement("li");
      li.textContent = `${item.name} x ${item.quantity} = GHS ${item.price * item.quantity}`;
      cartItems.appendChild(li);
      total += item.price * item.quantity;
    }
  });
  if (addFee.checked) total *= 1.01;
  document.getElementById("cart-total").textContent = total.toFixed(2);
}
document.getElementById("addFee").addEventListener("change", updateCart);
document.getElementById("checkout").addEventListener("click", () => {
  const hasItems = cart.some(item => item.quantity > 0);
  if (!hasItems) return alert("Cart is empty");
  document.getElementById("customerModal").style.display = "block";
});
document.querySelector(".close-modal").addEventListener("click", () => {
  document.getElementById("customerModal").style.display = "none";
});
document.getElementById("order_type").addEventListener("change", function () {
  const deliveryFields = document.getElementById("delivery_fields");
  deliveryFields.style.display = this.value === "Delivery" ? "block" : "none";
});

 document.getElementById('useLocation').addEventListener('click', function () {
    const btn = this;
    btn.disabled = true;
    btn.innerText = "Getting location...";

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      btn.innerText = "📍 Use Current Location";
      btn.disabled = false;
      return;
    }

    navigator.geolocation.getCurrentPosition(
      function (position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        // OpenCage API Call
        const apiKey = '753e10258e0a4932851477e322627ced'; // <-- Replace with your real key
        const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${apiKey}`;

        fetch(apiUrl)
          .then(response => response.json())
          .then(data => {
            if (data && data.results && data.results.length > 0) {
              const formatted = data.results[0].formatted;
              document.getElementById('delivery_address').value = formatted;
            } else {
              alert("Unable to retrieve address.");
            }
            btn.innerText = "📍 Use Current Location";
            btn.disabled = false;
          })
          .catch(error => {
            console.error(error);
            alert("Failed to retrieve address.");
            btn.innerText = "📍 Use Current Location";
            btn.disabled = false;
          });
      },
      function (error) {
        alert("Unable to retrieve location.");
        btn.innerText = "📍 Use Current Location";
        btn.disabled = false;
      }
    );
  });
function validateForm() {
  const name = document.getElementById("cust_name");
  const phone = document.getElementById("cust_phone");
  const order_type = document.getElementById("order_type");
  const address = document.getElementById("delivery_address");
  let isValid = true;

  // Reset styles
  [name, phone, order_type, address].forEach(el => el.style.borderColor = '#ddd');

  if (!/^[A-Za-z\s]+$/.test(name.value)) {
    name.style.borderColor = 'red';
    isValid = false;
  }

  if (!/^(\+233|0)[0-9]{9}$/.test(phone.value)) {
    phone.style.borderColor = 'red';
    isValid = false;
  }

  if (order_type.value === "") {
    order_type.style.borderColor = 'red';
    isValid = false;
  }

  if (order_type.value === "Delivery" && address.value.trim() === "") {
    address.style.borderColor = 'red';
    isValid = false;
  }

  return isValid;
}

document.getElementById("confirmOrder").addEventListener("click", () => {
  if (!validateForm()) {
    return alert("Please correct the errors before proceeding.");
  }

  const name = document.getElementById("cust_name").value;
  const phone = document.getElementById("cust_phone").value;
  const message = document.getElementById("cust_message").value;
  const order_type = document.getElementById("order_type").value;
  const address = document.getElementById("delivery_address").value;
  const email = phone + "@porkyto's restaurant.com";
  const filteredCart = cart.filter(i => i.quantity > 0);
  
  let total = filteredCart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  if (document.getElementById("addFee").checked) total *= 1.01;

  const handler = PaystackPop.setup({
    key: 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxx',
    email,
    amount: Math.round(total * 100),
    currency: "GHS",
    callback: function (response) {
      fetch("process_order.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart: filteredCart,
          name, phone, message, order_type,
          address: (order_type === "Delivery") ? address : "",
          reference: response.reference
        })
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert("Order submitted successfully!");
          window.location.reload();
        } else {
          alert("Error: " + data.message);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert("There was an error submitting your order.");
      });
    },
    onClose: function () {
      alert("Payment cancelled.");
    }
  });
  handler.openIframe();
});
