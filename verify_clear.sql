USE galgame_db;
SELECT 'Games count:' as info, COUNT(*) as count FROM game;
SELECT 'Scenes count:' as info, COUNT(*) as count FROM scene;
SELECT 'Saves count:' as info, COUNT(*) as count FROM save;
