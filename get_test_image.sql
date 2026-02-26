USE galgame_db;

SELECT id, title, cover_url FROM game WHERE cover_url LIKE '/uploads/images/covers/%' LIMIT 1;