<?php
// Enable error reporting and logging
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);
ini_set('error_log', 'C:/xampp/htdocs/FinancialLiteracyApp/backend/php_errors.log');

// Set headers
header('Content-Type: application/json');

try {
    // Log the raw POST data
    error_log('Raw POST data: ' . file_get_contents('php://input'));
    
    // Get and decode JSON data
    $json = file_get_contents('php://input');
    if (empty($json)) {
        throw new Exception('No input received');
    }
    
    $data = json_decode($json, true);
    if ($data === null) {
        throw new Exception('JSON decode error: ' . json_last_error_msg());
    }
    
    // Log decoded data
    error_log('Decoded data: ' . print_r($data, true));
    
    // Basic validation
    if (empty($data['username']) || empty($data['password'])) {
        throw new Exception('Username and password are required');
    }
    
    // For testing, return success if we got this far
    echo json_encode([
        'success' => true,
        'message' => 'Login successful',
        'user' => [
            'username' => $data['username']
        ]
    ]);
    
} catch (Exception $e) {
    error_log('Login error: ' . $e->getMessage());
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?> 