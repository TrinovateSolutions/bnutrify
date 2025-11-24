<?php
// feedback_mail.php
// Save to /src/feedback_mail.php

$adminEmail = "mohankrishnagandepalli@gmail.com"; // change if needed
$subject = "New Feedback — BNutrify";

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status'=>'error','message'=>'Method not allowed']);
    exit;
}

// sanitize inputs
$name = isset($_POST['name']) ? trim(strip_tags($_POST['name'])) : '';
$email = isset($_POST['email']) ? trim(strip_tags($_POST['email'])) : '';
$rating = isset($_POST['rating']) ? (int)$_POST['rating'] : 0;
$message = isset($_POST['message']) ? trim($_POST['message']) : '';

if (!$name || !$email || !$rating || !$message) {
    http_response_code(422);
    echo json_encode(['status'=>'error','message'=>'Missing required fields']);
    exit;
}

// prepare entry for JSON store
$entry = [
    'name' => $name,
    'email' => $email,
    'rating' => $rating,
    'message' => $message,
    'ip' => $_SERVER['REMOTE_ADDR'] ?? '',
    'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? '',
    'created_at' => date('c')
];

$uploadDir = __DIR__ . '/uploads/';
if (!is_dir($uploadDir)) {
    @mkdir($uploadDir, 0755, true);
}

$jsonFile = $uploadDir . 'feedback.json';

// read existing file
$all = [];
if (file_exists($jsonFile)) {
    $contents = @file_get_contents($jsonFile);
    $decoded = json_decode($contents, true);
    if (is_array($decoded)) $all = $decoded;
}

// append and write safely using lock
$all[] = $entry;
$tmp = $jsonFile . '.tmp';
if (file_put_contents($tmp, json_encode($all, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)) !== false) {
    rename($tmp, $jsonFile);
} else {
    // not fatal, continue (still attempt to send email)
    error_log("Failed to write feedback.json");
}

// Build admin email HTML
$html = "
<html><body>
  <h3>New Feedback Received</h3>
  <p><strong>Name:</strong> {$name}</p>
  <p><strong>Email:</strong> {$email}</p>
  <p><strong>Rating:</strong> {$rating} / 5</p>
  <p><strong>Message:</strong><br/>" . nl2br(htmlspecialchars($message)) . "</p>
  <p><small>Received: " . date('Y-m-d H:i:s') . "</small></p>
</body></html>
";

// headers
$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-type:text/html;charset=UTF-8\r\n";
$headers .= "From: BNutrify <no-reply@bnutrify.com>\r\n";
$headers .= "Reply-To: " . $email . "\r\n";

// send mail (if mail() configured)
$mailSent = @mail($adminEmail, $subject, $html, $headers);

echo json_encode([
    'status' => 'success',
    'stored' => true,
    'emailed' => $mailSent ? true : false,
    'message' => $mailSent ? 'Feedback sent.' : 'Feedback saved; mail failed or mail() not configured.'
]);
