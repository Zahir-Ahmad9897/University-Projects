<?php
require_once '../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';
$pdo = getDB();

// List rewards
if ($method === 'GET' && $action === 'list') {
    $stmt = $pdo->query("SELECT * FROM rewards WHERE stock > 0 ORDER BY points_required ASC");
    jsonResponse($stmt->fetchAll(PDO::FETCH_ASSOC));
}

// Redeem reward
elseif ($method === 'POST' && $action === 'redeem') {
    $uid = requireAuth();
    $data = getInput();
    $reward_id = intval($data['reward_id'] ?? 0);

    // Check eligibility: must have attended at least 2 events
    $stmt = $pdo->prepare("SELECT COUNT(*) as cnt FROM attendance WHERE student_id = ?");
    $stmt->execute([$uid]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($row['cnt'] < 2) jsonResponse(['error' => 'Must attend at least 2 events to redeem rewards'], 403);

    // Get reward
    $stmt = $pdo->prepare("SELECT * FROM rewards WHERE id = ? AND stock > 0");
    $stmt->execute([$reward_id]);
    $reward = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$reward) jsonResponse(['error' => 'Reward not available'], 404);

    // Check points
    $stmt = $pdo->prepare("SELECT points FROM users WHERE id = ?");
    $stmt->execute([$uid]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($user['points'] < $reward['points_required'])
        jsonResponse(['error' => 'Insufficient points'], 400);

    // Redeem
    $pdo->beginTransaction();
    $pdo->prepare("INSERT INTO redemptions (student_id, reward_id) VALUES (?, ?)")->execute([$uid, $reward_id]);
    $pdo->prepare("UPDATE users SET points = points - ? WHERE id = ?")->execute([$reward['points_required'], $uid]);
    $pdo->prepare("UPDATE rewards SET stock = stock - 1 WHERE id = ?")->execute([$reward_id]);
    $pdo->commit();

    jsonResponse(['success' => true, 'message' => 'Reward redeemed successfully!']);
}

// Get clubs
elseif ($method === 'GET' && $action === 'clubs') {
    $stmt = $pdo->query("SELECT c.*, u.name as rep_name FROM clubs c LEFT JOIN users u ON c.rep_id = u.id");
    jsonResponse($stmt->fetchAll(PDO::FETCH_ASSOC));
}

// Admin: get all students
elseif ($method === 'GET' && $action === 'students') {
    requireAuth();
    $stmt = $pdo->query("SELECT id, name, email, role, points, created_at FROM users WHERE role='student' ORDER BY points DESC");
    jsonResponse($stmt->fetchAll(PDO::FETCH_ASSOC));
}

else {
    jsonResponse(['error' => 'Invalid request'], 400);
}
?>
