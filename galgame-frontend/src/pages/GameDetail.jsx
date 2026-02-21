import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getGameById } from '../api/game';
import { getSaves } from '../api/save';
import { useGameStore } from '../stores/useGameStore';

const GameDetail = () => {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [saves, setSaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const visitorId = useGameStore((state) => state.visitorId);

  useEffect(() => {
    const fetchGameDetail = async () => {
      try {
        const response = await getGameById(id);
        setGame(response.data);
      } catch (error) {
        console.error('Error fetching game detail:', error);
      }
    };

    const fetchSaves = async () => {
      try {
        const response = await getSaves(id, visitorId);
        setSaves(response.data);
      } catch (error) {
        console.error('Error fetching saves:', error);
      }
    };

    fetchGameDetail();
    fetchSaves();
    setLoading(false);
  }, [id, visitorId]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!game) {
    return <div className="flex justify-center items-center h-screen">Game not found</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-start mb-6">
        <Link to="/" className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded">
          返回游戏库
        </Link>
      </div>
      
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/3 h-64 md:h-auto bg-gray-700">
            {game.coverUrl ? (
              <img src={game.coverUrl} alt={game.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                无封面
              </div>
            )}
          </div>
          <div className="w-full md:w-2/3 p-6">
            <h1 className="text-3xl font-bold mb-4">{game.title}</h1>
            <p className="text-gray-300 mb-6">{game.description}</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {game.tags?.split(',').map((tag, index) => (
                <span key={index} className="bg-gray-700 px-3 py-1 rounded-full text-sm">
                  {tag.trim()}
                </span>
              ))}
            </div>
            <div className="flex justify-start">
              <Link 
                to={`/play/${game.id}?scene=start`} 
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded text-lg"
              >
                开始游戏
              </Link>
            </div>
          </div>
        </div>
      </div>

      {saves.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-6">存档列表</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {saves.map((save) => (
              <div key={save.id} className="bg-gray-800 p-4 rounded-lg">
                <h3 className="font-bold mb-2">存档 {save.id}</h3>
                <p className="text-gray-400 text-sm mb-4">
                  更新时间: {new Date(save.updatedAt).toLocaleString()}
                </p>
                <Link 
                  to={`/play/${game.id}?scene=${save.sceneKey}&saveId=${save.id}`} 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  读取存档
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GameDetail;