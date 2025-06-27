
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('orderForm');
  const addressFieldContainer = document.getElementById('deliveryAddressField');
  const addressInput = document.getElementById('delivery_address');

  document.querySelectorAll('input[name="order_type"]').forEach(radio => {
    radio.addEventListener('change', function () {
      if (this.value === 'Delivery') {
        addressFieldContainer.style.display = 'block';
      } else {
        addressFieldContainer.style.display = 'none';
        addressInput.value = '';
      }
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const selectedType = document.querySelector('input[name="order_type"]:checked');
    if (selectedType && selectedType.value === 'Delivery' && addressInput.value.trim() === '') {
      alert('Please enter your delivery address.');
      addressInput.focus();
      return;
    }

    const productSelect = document.getElementById('product');
    const productName = productSelect.options[productSelect.selectedIndex].value;
    const amount = productSelect.options[productSelect.selectedIndex].getAttribute('data-price');
    const quantity = document.getElementById('quantity').value;
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    const baseAmount = parseInt(amount) * parseInt(quantity) * 100;
    const totalAmount = Math.round(baseAmount * 1.01);

    const handler = PaystackPop.setup({
      key: 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxx',
      email: email || `${phone}@porkhub.com`, 
      amount: totalAmount,
      currency: 'GHS',
      label: name,
      metadata: {
        custom_fields: [
          { display_name: "Customer Name", variable_name: "customer_name", value: name },
          { display_name: "Phone", variable_name: "phone", value: phone },
          { display_name: "Email", variable_name: "email", value: email },
          { display_name: "Product", variable_name: "product", value: `${productName} x${quantity}` },
          { display_name: "Message", variable_name: "message", value: message }
        ]
      },
      callback: function (response) {
        document.getElementById('reference').value = response.reference;
        form.submit();

        fetch('send_sms.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            name: name,
            phone: phone,
            product: productName,
            quantity: quantity
          })
        });
      },
      onClose: function () {
        alert('Transaction was cancelled.');
      }
    });

    handler.openIframe();
  });
});
