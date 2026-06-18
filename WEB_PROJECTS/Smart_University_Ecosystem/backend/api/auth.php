<?php
require_once '../config/db.php';

$action = $_GET['action'] ?? '';
$data = getInput();

if ($action === 'login') {
    $email = trim($data['email'] ?? '');
    $password = $data['password'] ?? '';

    if (!$email || !$password) {
        jsonResponse(['error' => 'Email and password required'], 400);
    }

    $pdo = getDB();
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user || !password_verify($password, $user['password'])) {
        jsonResponse(['error' => 'Invalid credentials'], 401);
    }

    $_SESSION['user_id'] = $user['id'];
    $_SESSION['role'] = $user['role'];

    unset($user['password']);
    jsonResponse(['success' => true, 'user' => $user]);
}

elseif ($action === 'register') {
    $name = trim($data['name'] ?? '');
    $email = trim($data['email'] ?? '');
    $password = $data['password'] ?? '';
    $role = $data['role'] ?? 'student';

    // Server-side validation
    if (!$name || !$email || !$password) {
        jsonResponse(['error' => 'All fields required'], 400);
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        jsonResponse(['error' => 'Invalid email format'], 400);
    }
    if (strlen($password) < 6) {
        jsonResponse(['error' => 'Password must be at least 6 characters'], 400);
    }
    if (!in_array($role, ['student', 'club_rep', 'admin'])) {
        jsonResponse(['error' => 'Invalid role'], 400);
    }

    $pdo = getDB();
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        jsonResponse(['error' => 'Email already registered'], 409);
    }

    $hashed = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $pdo->prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)");
    $stmt->execute([$name, $email, $hashed, $role]);

    jsonResponse(['success' => true, 'message' => 'Registration successful']);
}

elseif ($action === 'logout') {
    session_destroy();
    jsonResponse(['success' => true]);
}

elseif ($action === 'me') {
    $uid = requireAuth();
    $pdo = getDB();
    $stmt = $pdo->prepare("SELECT id, name, email, role, points, created_at FROM users WHERE id = ?");
    $stmt->execute([$uid]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    jsonResponse($user);
}

else {
    jsonResponse(['error' => 'Invalid action'], 400);
}
?>
