import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getGames } from '../api/game';

const Home = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await getGames();
        setGames(response.data.content);
      } catch (error) {
        console.error('Error fetching games:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-10 text-center">Galgame 游戏库</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <div key={game.id} className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="h-48 bg-gray-700 flex items-center justify-center">
              {game.coverUrl ? (
                <img src={game.coverUrl} alt={game.title} className="w-full h-full object-cover" />
              ) : (
                <div className="text-gray-400">无封面</div>
              )}
            </div>
            <div className="p-4">
              <h2 className="text-xl font-bold mb-2">{game.title}</h2>
              <p className="text-gray-400 mb-4">{game.description}</p>
              <div className="flex justify-between items-center">
                <Link 
                  to={`/game/${game.id}`} 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  查看详情
                </Link>
                <Link 
                  to={`/play/${game.id}?scene=start`} 
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                  开始游戏
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;