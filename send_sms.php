
<?php
// Replace with your actual Africa's Talking credentials
$username = "your_username";
$apiKey = "your_api_key";

$phone = $_POST['phone'];
$name = $_POST['name'];
$product = $_POST['product'];
$quantity = $_POST['quantity'];
$totalamount = $_POST['total'];

$message = "Hi $name, your order for $quantity x delicious $product has been received. You were charged only $totalamount Thank you for choosing Pork Hub! We hope you come back soon!";

$url = "https://api.africastalking.com/version1/messaging";

$data = http_build_query([
    'username' => $username,
    'to' => $phone,
    'message' => $message
]);

$options = [
    "http" => [
        "header" => [
            "Content-type: application/x-www-form-urlencoded",
            "apiKey: $apiKey"
        ],
        "method" => "POST",
        "content" => $data
    ]
];

$context = stream_context_create($options);
$result = file_get_contents($url, false, $context);

echo json_encode(["status" => "sent", "result" => $result]);
?>
