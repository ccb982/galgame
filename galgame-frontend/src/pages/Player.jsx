import { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { getScene } from '../api/scene';
import { createSave } from '../api/save';
import { useGameStore } from '../stores/useGameStore';

const Player = () => {
  const { gameId } = useParams();
  const [searchParams] = useSearchParams();
  const [sceneKey, setSceneKey] = useState(searchParams.get('scene') || 'start');
  const [scene, setScene] = useState(null);
  const [loading, setLoading] = useState(true);
  const visitorId = useGameStore((state) => state.visitorId);

  useEffect(() => {
    const fetchScene = async () => {
      try {
        const response = await getScene(gameId, sceneKey);
        setScene(response.data);
      } catch (error) {
        console.error('Error fetching scene:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchScene();
  }, [gameId, sceneKey]);

  const handleNextScene = () => {
    if (scene?.nextScene) {
      setSceneKey(scene.nextScene);
    }
  };

  const handleOptionClick = (nextScene) => {
    setSceneKey(nextScene);
  };

  const handleSave = async () => {
    try {
      await createSave({
        gameId: parseInt(gameId),
        sceneKey,
        visitorId,
        variables: JSON.stringify({})
      });
      alert('存档成功');
    } catch (error) {
      console.error('Error saving game:', error);
      alert('存档失败');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!scene) {
    return <div className="flex justify-center items-center h-screen">Scene not found</div>;
  }

  const sceneContent = JSON.parse(scene.content);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* 背景图 */}
      {sceneContent.bg && (
        <div className="absolute inset-0">
          <img 
            src={sceneContent.bg} 
            alt="背景" 
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* 立绘 */}
      {sceneContent.characters && sceneContent.characters.map((character, index) => (
        <div key={index} className={`absolute ${character.position === 'left' ? 'left-10' : 'right-10'} bottom-20`}>
          <img 
            src={character.image} 
            alt={character.name} 
            className="h-64 object-contain"
          />
        </div>
      ))}

      {/* 文本框 */}
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 p-6">
        <div className="container mx-auto">
          <p className="text-xl mb-6">{sceneContent.text}</p>
          
          {/* 选项 */}
          {sceneContent.options && sceneContent.options.length > 0 ? (
            <div className="flex flex-col gap-3">
              {sceneContent.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionClick(option.next)}
                  className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded text-left"
                >
                  {option.text}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <button
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                保存
              </button>
              <button
                onClick={handleNextScene}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded text-lg"
              >
                继续
              </button>
              <Link 
                to={`/game/${gameId}`} 
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                退出
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Player;