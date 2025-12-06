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
$temp_file = sys_get_temp_dir() . '/temp_settings.json';
file_put_contents($temp_file, json_encode($settings));

// Path ke Python script
$script_path = __DIR__ . '/print_receipt.py';

// Jalankan Python
$command = "python \"$script_path\" $queue_number $queue_type 2>&1";
$output = shell_exec($command);

// Hapus temp file
@unlink($temp_file);

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
