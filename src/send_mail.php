<?php
// ==== CONFIGURATION ====
$to = "mohankrishnagandepalli@gmail.com"; // 👈 change this to your email
$subject = "New Appointment Booking";

// ==== VALIDATE INPUT ====
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $name  = htmlspecialchars($_POST["name"]);
    $email = htmlspecialchars($_POST["email"]);
    $phone = htmlspecialchars($_POST["phone"]);
    $date  = htmlspecialchars($_POST["date"]);
    $time  = htmlspecialchars($_POST["time"]);

    // Handle uploaded file
    $uploadOk = false;
    $attachment = "";

    if (isset($_FILES["paymentProof"]) && $_FILES["paymentProof"]["error"] == UPLOAD_ERR_OK) {
        $uploadDir = __DIR__ . "/uploads/";
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);
        
        $filename = time() . "_" . basename($_FILES["paymentProof"]["name"]);
        $targetFile = $uploadDir . $filename;

        if (move_uploaded_file($_FILES["paymentProof"]["tmp_name"], $targetFile)) {
            $uploadOk = true;
            $attachment = $targetFile;
        }
    }

    // ==== CREATE EMAIL BODY ====
    $message = "
    <html>
    <body>
        <h2>New Appointment Booking</h2>
        <p><strong>Name:</strong> $name</p>
        <p><strong>Email:</strong> $email</p>
        <p><strong>Phone:</strong> $phone</p>
        <p><strong>Date:</strong> $date</p>
        <p><strong>Time:</strong> $time</p>
        " . ($uploadOk ? "<p>Payment proof uploaded: $filename</p>" : "<p>No payment proof uploaded.</p>") . "
    </body>
    </html>
    ";

    // ==== EMAIL HEADERS ====
    $headers  = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: <$email>" . "\r\n";

    // ==== SEND EMAIL ====
    if (mail($to, $subject, $message, $headers)) {
        echo json_encode(["status" => "success", "message" => "Appointment email sent successfully."]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to send email."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request method."]);
}
?>
