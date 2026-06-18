<?php
require_once '../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';
$pdo = getDB();

// Register for event
if ($method === 'POST' && $action === 'register') {
    $uid = requireAuth();
    $data = getInput();
    $event_id = intval($data['event_id'] ?? 0);

    if (!$event_id) jsonResponse(['error' => 'Event ID required'], 400);

    // Get event details
    $stmt = $pdo->prepare("SELECT * FROM events WHERE id = ?");
    $stmt->execute([$event_id]);
    $event = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$event) jsonResponse(['error' => 'Event not found'], 404);

    // Business Rule: Prevent duplicate registration (Issue 1 fix)
    $stmt = $pdo->prepare("SELECT id FROM registrations WHERE student_id = ? AND event_id = ?");
    $stmt->execute([$uid, $event_id]);
    if ($stmt->fetch()) jsonResponse(['error' => 'Already registered for this event'], 409);

    // Business Rule: Check capacity
    if ($event['registered'] >= $event['capacity'])
        jsonResponse(['error' => 'Event is full'], 400);

    // Business Rule: No two events at same time
    $stmt = $pdo->prepare("
        SELECT r.id FROM registrations r
        JOIN events e ON r.event_id = e.id
        WHERE r.student_id = ? AND e.event_date = ?
        AND NOT (e.end_time <= ? OR e.start_time >= ?)
    ");
    $stmt->execute([$uid, $event['event_date'], $event['start_time'], $event['end_time']]);
    if ($stmt->fetch()) jsonResponse(['error' => 'Time conflict with another event'], 400);

    // Business Rule: Max 3 events per week
    $stmt = $pdo->prepare("
        SELECT COUNT(*) as cnt FROM registrations r
        JOIN events e ON r.event_id = e.id
        WHERE r.student_id = ? AND YEARWEEK(e.event_date) = YEARWEEK(?)
    ");
    $stmt->execute([$uid, $event['event_date']]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($row['cnt'] >= 3) jsonResponse(['error' => 'Cannot register for more than 3 events per week'], 400);

    // Register
    $stmt = $pdo->prepare("INSERT INTO registrations (student_id, event_id) VALUES (?, ?)");
    $stmt->execute([$uid, $event_id]);

    $pdo->prepare("UPDATE events SET registered = registered + 1 WHERE id = ?")->execute([$event_id]);

    jsonResponse(['success' => true, 'message' => 'Successfully registered for event']);
}

// Get student's registrations
elseif ($method === 'GET' && $action === 'my') {
    $uid = requireAuth();
    $stmt = $pdo->prepare("
        SELECT e.*, r.registered_at, c.name as club_name
        FROM registrations r JOIN events e ON r.event_id = e.id
        LEFT JOIN clubs c ON e.club_id = c.id
        WHERE r.student_id = ? ORDER BY e.event_date ASC
    ");
    $stmt->execute([$uid]);
    jsonResponse($stmt->fetchAll(PDO::FETCH_ASSOC));
}

// Mark attendance (admin/rep)
elseif ($method === 'POST' && $action === 'attend') {
    $uid = requireAuth();
    $data = getInput();
    $student_id = intval($data['student_id'] ?? 0);
    $event_id = intval($data['event_id'] ?? 0);

    // Check registration
    $stmt = $pdo->prepare("SELECT id FROM registrations WHERE student_id = ? AND event_id = ?");
    $stmt->execute([$student_id, $event_id]);
    if (!$stmt->fetch()) jsonResponse(['error' => 'Student not registered for this event'], 400);

    // Prevent duplicate attendance
    $stmt = $pdo->prepare("SELECT id FROM attendance WHERE student_id = ? AND event_id = ?");
    $stmt->execute([$student_id, $event_id]);
    if ($stmt->fetch()) jsonResponse(['error' => 'Attendance already marked'], 409);

    $pdo->prepare("INSERT INTO attendance (student_id, event_id) VALUES (?, ?)")->execute([$student_id, $event_id]);

    // Award points
    $stmt = $pdo->prepare("SELECT points_reward FROM events WHERE id = ?");
    $stmt->execute([$event_id]);
    $ev = $stmt->fetch(PDO::FETCH_ASSOC);
    $pdo->prepare("UPDATE users SET points = points + ? WHERE id = ?")->execute([$ev['points_reward'], $student_id]);

    jsonResponse(['success' => true, 'message' => 'Attendance marked and points awarded']);
}

// Get attendance history
elseif ($method === 'GET' && $action === 'history') {
    $uid = requireAuth();
    $stmt = $pdo->prepare("
        SELECT e.title, e.event_date, e.points_reward, a.attended_at
        FROM attendance a JOIN events e ON a.event_id = e.id
        WHERE a.student_id = ? ORDER BY a.attended_at DESC
    ");
    $stmt->execute([$uid]);
    jsonResponse($stmt->fetchAll(PDO::FETCH_ASSOC));
}

else {
    jsonResponse(['error' => 'Invalid request'], 400);
}
?>
