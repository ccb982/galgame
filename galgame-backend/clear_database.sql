USE galgame_db;

DELETE FROM scene;
DELETE FROM game;

SELECT '数据库已清理完成' AS message;
