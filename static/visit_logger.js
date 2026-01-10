// visit_logger.js
(function() {
    const now = new Date();
    fetch('/log_visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ timestamp: now.toISOString() })
    });
})();
