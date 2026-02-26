USE galgame_db;

UPDATE game 
SET cover_url = REPLACE(cover_url, 'http://localhost:8080/api/uploads/covers/', '/uploads/images/covers/')
WHERE cover_url LIKE 'http://localhost:8080/api/uploads/covers/%';

SELECT id, title, cover_url FROM game LIMIT 3;