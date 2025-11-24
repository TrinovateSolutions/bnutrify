<?php
// ==== CONFIGURATION ====
$adminEmail = "mohankrishnagandepalli@gmail.com"; // Your email
$subjectAdmin = "New Appointment Booking";
$subjectClient = "BNutrify – Appointment Received";

// ==== VALIDATE INPUT ====
if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $name  = htmlspecialchars($_POST["name"]);
    $email = htmlspecialchars($_POST["email"]);
    $phone = htmlspecialchars($_POST["phone"]);
    $date  = htmlspecialchars($_POST["date"]);
    $time  = htmlspecialchars($_POST["time"]);

    // ==== File Upload Handling ====
    $uploadOk = false;
    $attachment = "";
    $filename = "";

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

    // ==== Email Body for Admin ====
    $messageAdmin = "
    <html><body>
        <h2>New Appointment Booking</h2>
        <p><strong>Name:</strong> $name</p>
        <p><strong>Email:</strong> $email</p>
        <p><strong>Phone:</strong> $phone</p>
        <p><strong>Date:</strong> $date</p>
        <p><strong>Time:</strong> $time</p>
        " . ($uploadOk ? "<p>Payment proof uploaded: $filename</p>" : "<p>No payment proof uploaded.</p>") . "
    </body></html>
    ";

    $headersAdmin  = "MIME-Version: 1.0\r\n";
    $headersAdmin .= "Content-type:text/html;charset=UTF-8\r\n";
    $headersAdmin .= "From: BNutrify <no-reply@bnutrify.com>\r\n";

    // ==== Auto-reply Email Body for Client ====
    $messageClient = "
    <html><body>
        <h2>Thank You for Booking!</h2>
        <p>Hi <strong>$name</strong>,</p>
        <p>We have received your appointment request. Our team will review it and confirm your slot shortly.</p>

        <p><strong>Your Details:</strong></p>
        <p>Date: $date<br>
        Time: $time<br>
        Phone: $phone</p>

        <p>Thank you for choosing BNutrify.<br>
        We will get back to you soon.</p>

        <p>Warm regards,<br><strong>BNutrify</strong></p>
    </body></html>
    ";

    $headersClient  = "MIME-Version: 1.0\r\n";
    $headersClient .= "Content-type:text/html;charset=UTF-8\r\n";
    $headersClient .= "From: BNutrify <no-reply@bnutrify.com>\r\n";

    // ==== SEND EMAILS ====
    $sentToAdmin  = mail($adminEmail, $subjectAdmin, $messageAdmin, $headersAdmin);
    $sentToClient = mail($email, $subjectClient, $messageClient, $headersClient);

    if ($sentToAdmin && $sentToClient) {
        echo json_encode(["status" => "success", "message" => "Emails sent successfully."]);
    } else {
        echo json_encode(["status" => "error", "message" => "Email sending failed."]);
    }

} else {
    echo json_encode(["status" => "error", "message" => "Invalid request method."]);
}
?>
