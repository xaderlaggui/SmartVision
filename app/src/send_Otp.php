<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    $email = $input['email'];

    if (!$email) {
        echo json_encode(['error' => 'Email is required.']);
        exit;
    }

    // Connect to Supabase
    $supabaseUrl = 'https://axfxzasuzgzfnkwsnpyz.supabase.co';
    $supabaseKey =  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4Znh6YXN1emd6Zm5rd3NucHl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIyMzAwODIsImV4cCI6MjA0NzgwNjA4Mn0.tWBFktshc9KWzGamYkc53xopv6TrP5LI6p7EQC4dyKc';
    $headers = [
        "Authorization: Bearer $supabaseKey",
        "apikey: $supabaseKey",
        "Content-Type: application/json"
    ];

    $curl = curl_init();
    curl_setopt_array($curl, [
        CURLOPT_URL => "$supabaseUrl/rest/v1/otps?select=otp&email=eq.$email",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => $headers,
    ]);

    $response = curl_exec($curl);
    $error = curl_error($curl);
    curl_close($curl);

    if ($error) {
        echo json_encode(['error' => 'Failed to fetch OTP.']);
        exit;
    }

    $data = json_decode($response, true);

    if (empty($data) || !isset($data[0]['otp'])) {
        echo json_encode(['error' => 'OTP not found for this email.']);
        exit;
    }

    $otp = $data[0]['otp'];

    // Send email using PHPMailer
    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com'; // Set the SMTP server to send through
        $mail->SMTPAuth = true;
        $mail->Username = 'xader.jarabelo.laggui@gmail.com'; // SMTP username
        $mail->Password = 'mrzp ogzw upuq gurd'; // SMTP password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        $mail->setFrom('xader.jarabelo.laggui@gmail.com', 'SmartVision');
        $mail->addAddress($email);

        $mail->isHTML(true);
        $mail->Subject = 'Your OTP Code';
        $mail->Body = "<p>Your OTP code is <strong>$otp</strong>.</p>";

        $mail->send();
        echo json_encode(['success' => 'OTP sent successfully.']);
    } catch (Exception $e) {
        echo json_encode(['error' => 'Mail error: ' . $mail->ErrorInfo]);
    }
} else {
    echo json_encode(['error' => 'Invalid request method.']);
}
?>
