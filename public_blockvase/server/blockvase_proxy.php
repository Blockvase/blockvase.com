<?php
// Same-origin PHP proxy to the Python Blockvase API. Adds X-Website-Proxy.
// Does not call pool.blockvase.com:28917; that pull stays server-side in Python.

$proxyCommonCandidates = [
  __DIR__ . '/proxy_common.php',
  '/var/www/html/server/proxy_common.php',
  dirname(__DIR__, 2) . '/public/server/proxy_common.php',
];
$proxyCommonLoaded = false;
foreach ($proxyCommonCandidates as $proxyCommonPath) {
  if (is_readable($proxyCommonPath)) {
    require_once $proxyCommonPath;
    $proxyCommonLoaded = true;
    break;
  }
}
if (!$proxyCommonLoaded) {
  http_response_code(500);
  header('Content-Type: application/json');
  echo json_encode(['success' => false, 'message' => 'Request could not be completed.']);
  exit;
}

if (!getenv('PY_API_BASE')) {
  putenv('PY_API_BASE=http://172.17.0.1:18081');
}

function blockvase_proxy_stats($target_path) {
  if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'GET') {
    header('Content-Type: application/json');
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => sp_public_message_for_status(405)]);
    exit;
  }
  sp_proxy_request($target_path);
}
