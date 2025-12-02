<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$queue_number = $_GET['number'] ?? 'A001';
$queue_type = $_GET['type'] ?? 'cs';
$title = $_GET['title'] ?? 'BTN Syariah';
$address = $_GET['address'] ?? 'Jl. Sopo Del No 56 Jakarta Selatan';
$footer = $_GET['footer'] ?? '';

// Save settings to temp file
$settings = [
    'title' => $title,
    'address' => $address,
    'footer' => $footer
];
file_put_contents(__DIR__ . '/temp_settings.json', json_encode($settings));

// Path ke Python script
$script_path = __DIR__ . '/print_receipt.py';

// Jalankan Python
$command = "python \"$script_path\" $queue_number $queue_type 2>&1";
$output = shell_exec($command);

// Hapus temp file
@unlink(__DIR__ . '/temp_settings.json');

if (strpos($output, 'Print OK') !== false) {
    echo json_encode([
        'success' => true,
        'output' => $output
    ]);
} else {
    echo json_encode([
        'success' => false,
        'error' => $output
    ]);
}
?>
