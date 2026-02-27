import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getGames } from '../api/game';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const Home = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetchGames = async (page = 0) => {
    try {
      setLoading(true);
      const response = await getGames(page, 10);
      setGames(response.data.content);
      setCurrentPage(response.data.number);
      setTotalPages(response.data.totalPages);
      setTotalElements(response.data.totalElements);
    } catch (error) {
      console.error('Error fetching games:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      fetchGames(newPage);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-10 text-center">Galgame 游戏库</h1>
      
      <div className="mb-4 text-gray-400 text-center">
        共 {totalElements} 个游戏，第 {currentPage + 1} 页，共 {totalPages} 页
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game, index) => (
          <div key={game.id || `game-${index}`} className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="bg-gray-700 flex items-center justify-center overflow-hidden" style={{ height: '300px' }}>
              {game.coverUrl ? (
                <img 
                  src={`${API_BASE_URL}${game.coverUrl}`} 
                  alt={game.title} 
                  className="object-contain" 
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
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
      
      {totalPages > 1 && (
        <div className="mt-10 flex justify-center items-center gap-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white px-4 py-2 rounded"
          >
            上一页
          </button>
          
          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i)}
                className={`px-4 py-2 rounded ${
                  currentPage === i
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 hover:bg-gray-600 text-white'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
            className="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white px-4 py-2 rounded"
          >
            下一页
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;