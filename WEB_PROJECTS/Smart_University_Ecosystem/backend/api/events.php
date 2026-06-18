<?php
require_once '../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';
$pdo = getDB();

// GET all events
if ($method === 'GET' && $action === 'list') {
    $category = $_GET['category'] ?? '';
    $sql = "SELECT e.*, c.name as club_name FROM events e LEFT JOIN clubs c ON e.club_id = c.id";
    $params = [];
    if ($category) {
        $sql .= " WHERE e.category = ?";
        $params[] = $category;
    }
    $sql .= " ORDER BY e.event_date ASC";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    jsonResponse($stmt->fetchAll(PDO::FETCH_ASSOC));
}

// GET single event
elseif ($method === 'GET' && $action === 'detail') {
    $id = intval($_GET['id'] ?? 0);
    $stmt = $pdo->prepare("SELECT e.*, c.name as club_name FROM events e LEFT JOIN clubs c ON e.club_id = c.id WHERE e.id = ?");
    $stmt->execute([$id]);
    $event = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$event) jsonResponse(['error' => 'Event not found'], 404);
    jsonResponse($event);
}

// POST create event (club_rep/admin)
elseif ($method === 'POST' && $action === 'create') {
    $uid = requireAuth();
    $data = getInput();

    $title = trim($data['title'] ?? '');
    $description = trim($data['description'] ?? '');
    $club_id = intval($data['club_id'] ?? 0);
    $event_date = $data['event_date'] ?? '';
    $start_time = $data['start_time'] ?? '';
    $end_time = $data['end_time'] ?? '';
    $capacity = intval($data['capacity'] ?? 50);
    $points_reward = intval($data['points_reward'] ?? 10);
    $category = $data['category'] ?? 'physical';
    $meeting_link = $data['meeting_link'] ?? null;
    $location = $data['location'] ?? null;

    // Validate category-specific fields
    if ($category === 'online' && !$meeting_link)
        jsonResponse(['error' => 'Online events require a meeting link'], 400);
    if ($category === 'physical' && !$location)
        jsonResponse(['error' => 'Physical events require a location'], 400);
    if ($category === 'hybrid' && (!$meeting_link || !$location))
        jsonResponse(['error' => 'Hybrid events require both meeting link and location'], 400);

    if (!$title || !$event_date || !$start_time || !$end_time)
        jsonResponse(['error' => 'Title, date and times are required'], 400);

    $stmt = $pdo->prepare("INSERT INTO events (title, description, club_id, event_date, start_time, end_time, capacity, points_reward, category, meeting_link, location) VALUES (?,?,?,?,?,?,?,?,?,?,?)");
    $stmt->execute([$title, $description, $club_id, $event_date, $start_time, $end_time, $capacity, $points_reward, $category, $meeting_link, $location]);
    jsonResponse(['success' => true, 'id' => $pdo->lastInsertId()]);
}

else {
    jsonResponse(['error' => 'Invalid request'], 400);
}
?>
