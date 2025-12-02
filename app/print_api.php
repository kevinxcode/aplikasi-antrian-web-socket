<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$queue_number = $_GET['number'] ?? 'A001';
$queue_type = $_GET['type'] ?? 'cs';

// Path ke Python script
$script_path = __DIR__ . '/print_receipt.py';

// Jalankan Python
$command = "python \"$script_path\" $queue_number $queue_type 2>&1";
$output = shell_exec($command);

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
