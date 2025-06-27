
<?php
$ref = $_POST['reference'] ?? '';
$status = '❌ Order not found';

// Example hardcoded order statuses (in real use, this would be a DB lookup)
$orders = [
  'PKH-123456' => '✅ Order received, ⏳ preparing now',
  'PKH-234567' => '🛵 Out for delivery',
  'PKH-345678' => '📦 Delivered',
];

if (array_key_exists($ref, $orders)) {
  $status = $orders[$ref];
}
?>

<!DOCTYPE html>
<html>
<head>
  <title>Order Status</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 30px;
      background-color: #fff8f1;
    }
    .status-box {
      max-width: 400px;
      margin: auto;
      padding: 20px;
      background: #fff;
      border-radius: 8px;
      text-align: center;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }
    .status-box h2 {
      color: #d35400;
    }
    .status-box p {
      font-size: 1.2rem;
    }
  </style>
</head>
<body>
  <div class="status-box">
    <h2>Status for Order: <?php echo htmlspecialchars($ref); ?></h2>
    <p><?php echo $status; ?></p>
  </div>
</body>
</html>
