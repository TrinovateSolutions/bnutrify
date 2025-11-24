<?php
// send_mail.php — improved with attachment + debug logging + JSON output

// ==== CONFIGURATION ====
// Change this to the recipient you want to receive appointment emails
$to = "mohankrishnagandepalli@gmail.com";
$subject = "New Appointment Booking — BNutrify";

// Debug log file (webserver must be able to write here)
$debugLog = __DIR__ . '/send_debug.log';

// Helper to append debug
function debug_log($msg) {
    global $debugLog;
    @file_put_contents($debugLog, "[" . date('Y-m-d H:i:s') . "] " . $msg . PHP_EOL, FILE_APPEND);
}

// Basic environment checks
debug_log("Request method: " . $_SERVER['REQUEST_METHOD']);

header('Content-Type: application/json; charset=utf-8');

// Make sure this is a POST
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    $resp = ["status" => "error", "message" => "Invalid request method."];
    echo json_encode($resp);
    debug_log("Invalid request method");
    exit;
}

// sanitize + fetch fields
$name  = isset($_POST['name']) ? trim(strip_tags($_POST['name'])) : '';
$email = isset($_POST['email']) ? trim(strip_tags($_POST['email'])) : '';
$phone = isset($_POST['phone']) ? trim(strip_tags($_POST['phone'])) : '';
$date  = isset($_POST['date']) ? trim(strip_tags($_POST['date'])) : '';
$time  = isset($_POST['time']) ? trim(strip_tags($_POST['time'])) : '';

debug_log("Form data: name={$name}, email={$email}, phone={$phone}, date={$date}, time={$time}");

// Validate minimal
if (empty($name) || empty($email) || empty($phone) || empty($date) || empty($time)) {
    http_response_code(422);
    $resp = ["status" => "error", "message" => "Missing required fields."];
    echo json_encode($resp);
    debug_log("Missing required fields");
    exit;
}

// Handle upload (optional)
$attachmentPath = "";
$attachmentName = "";
if (!empty($_FILES['paymentProof']) && $_FILES['paymentProof']['error'] === UPLOAD_ERR_OK) {
    $uploadDir = __DIR__ . '/uploads/';
    if (!is_dir($uploadDir)) {
        @mkdir($uploadDir, 0777, true);
        debug_log("Created upload dir: $uploadDir");
    }

    $originalName = basename($_FILES['paymentProof']['name']);
    $ext = pathinfo($originalName, PATHINFO_EXTENSION);
    $safeBase = time() . '_' . preg_replace('/[^a-zA-Z0-9_-]/', '_', pathinfo($originalName, PATHINFO_FILENAME));
    $newName = $safeBase . '.' . $ext;
    $targetFile = $uploadDir . $newName;

    if (move_uploaded_file($_FILES['paymentProof']['tmp_name'], $targetFile)) {
        $attachmentPath = $targetFile;
        $attachmentName = $newName;
        debug_log("Uploaded file saved: $targetFile");
    } else {
        debug_log("Failed to move uploaded file");
    }
} else {
    debug_log("No file uploaded or upload error: " . (isset($_FILES['paymentProof']['error']) ? $_FILES['paymentProof']['error'] : 'none'));
}

// Build email body (HTML)
$htmlMessage = "
<html>
  <body>
    <h2>New Appointment Booking</h2>
    <p><strong>Name:</strong> {$name}</p>
    <p><strong>Email:</strong> {$email}</p>
    <p><strong>Phone:</strong> {$phone}</p>
    <p><strong>Date:</strong> {$date}</p>
    <p><strong>Time:</strong> {$time}</p>
    <p>" . ($attachmentPath ? "Attached payment proof: {$attachmentName}" : "No payment proof uploaded.") . "</p>
  </body>
</html>
";

// If there's no attachment, send a simple HTML email
if (empty($attachmentPath)) {
    $headers  = "MIME-Version: 1.0\r\n";
    $headers .= "Content-type: text/html; charset=UTF-8\r\n";
    // Use a sensible From header — if your server requires a domain from the same host, change this
    $from = filter_var($email, FILTER_VALIDATE_EMAIL) ? $email : 'no-reply@' . $_SERVER['SERVER_NAME'];
    $headers .= "From: BNutrify <{$from}>\r\n";
    $headers .= "Reply-To: {$email}\r\n";

    $sent = mail($to, $subject, $htmlMessage, $headers);
    debug_log("mail() returned: " . ($sent ? 'true' : 'false'));

    if ($sent) {
        echo json_encode(["status" => "success", "message" => "Appointment email sent successfully."]);
    } else {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Failed to send email. Please check server mail configuration."]);
    }
    exit;
}

// If there is attachment — build multipart/mixed email with attachment
$separator = md5(time());
$eol = PHP_EOL;

// main headers
$from = filter_var($email, FILTER_VALIDATE_EMAIL) ? $email : 'no-reply@' . $_SERVER['SERVER_NAME'];
$headers  = "From: BNutrify <{$from}>" . $eol;
$headers .= "Reply-To: {$email}" . $eol;
$headers .= "MIME-Version: 1.0" . $eol;
$headers .= "Content-Type: multipart/mixed; boundary=\"" . $separator . "\"" . $eol . $eol;

// message body
$body  = "--" . $separator . $eol;
$body .= "Content-Type: text/html; charset=\"UTF-8\"" . $eol;
$body .= "Content-Transfer-Encoding: 7bit" . $eol . $eol;
$body .= $htmlMessage . $eol . $eol;

// attachment
$fileContent = chunk_split(base64_encode(file_get_contents($attachmentPath)));
$body .= "--" . $separator . $eol;
$body .= "Content-Type: application/octet-stream; name=\"" . $attachmentName . "\"" . $eol;
$body .= "Content-Transfer-Encoding: base64" . $eol;
$body .= "Content-Disposition: attachment; filename=\"" . $attachmentName . "\"" . $eol . $eol;
$body .= $fileContent . $eol;
$body .= "--" . $separator . "--";

// send
$sent = mail($to, $subject, $body, $headers);
debug_log("mail() with attachment returned: " . ($sent ? 'true' : 'false'));

if ($sent) {
    echo json_encode(["status" => "success", "message" => "Appointment email with attachment sent successfully."]);
} else {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Failed to send email with attachment. Check mail config."]);
}
