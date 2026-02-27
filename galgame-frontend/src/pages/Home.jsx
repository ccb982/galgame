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
      const response = await getGames(page, 12);
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
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-300">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Galgame 游戏库
          </h1>
          <p className="text-gray-400 text-lg">
            共 <span className="font-semibold text-blue-400">{totalElements}</span> 个游戏，
            第 <span className="font-semibold text-blue-400">{currentPage + 1}</span> 页，
            共 <span className="font-semibold text-blue-400">{totalPages}</span> 页
          </p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '32px', maxWidth: '1280px', margin: '0 auto', padding: '0 16px' }}>
          {games.map((game, index) => (
            <div 
              key={game.id || `game-${index}`} 
              className="group bg-gray-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-gray-750 border border-gray-700"
            >
              {/* 封面容器 */}
              <div className="relative h-56 bg-gradient-to-br from-gray-700 to-gray-800 overflow-hidden flex items-center justify-center">
                {game.coverUrl ? (
                  <img
                    src={`${API_BASE_URL}${game.coverUrl}`}
                    alt={game.title}
                    className="object-contain transition-transform duration-300 group-hover:scale-110"
                    style={{ maxWidth: '320px', maxHeight: '224px' }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-gray-500 text-center">
                      <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p>无封面</p>
                    </div>
                  </div>
                )}
                
                {/* 渐变遮罩 */}
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-gray-900 opacity-20"></div>
              </div>
              
              {/* 游戏信息 */}
              <div className="p-6">
                <h2 className="text-xl font-bold text-white mb-3 truncate group-hover:text-blue-400 transition-colors">
                  {game.title}
                </h2>
                <p className="text-gray-400 mb-4 line-clamp-2 h-12">
                  {game.description}
                </p>
                
                {/* 标签 */}
                {game.tags && game.tags.split(',').length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {game.tags.split(',').slice(0, 3).map((tag, tagIndex) => (
                      <span 
                        key={tagIndex} 
                        className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs rounded-full font-medium"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
                
                {/* 按钮组 */}
                <div className="flex gap-3">
                  <Link 
                    to={`/game/${game.id}`} 
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 text-center justify-center items-center"
                  >
                    <svg style={{ width: '12px', height: '12px', marginRight: '4px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    查看详情
                  </Link>
                  <Link
                    to={`/play/${game.id}?scene=start`}
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2.5 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 text-center justify-center items-center"
                  >
                    <svg style={{ width: '12px', height: '12px', marginRight: '4px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010.905 6.5L10 6.5a1 1 0 00-1-1H5a1 1 0 00-1 1v4a1 1 0 001 1h3.197l2.132 3.197a.5.5 0 00.658-.658l1.197-1.197a.5.5 0 00-.658.658L8.5 12.5a1 1 0 001 1v4a1 1 0 001 1h3.197l2.132 3.197a.5.5 0 00.658.658l1.197 1.197a.5.5 0 00.658-.658L16.5 15.5a1 1 0 001-1v-4a1 1 0 00-1-1h-3.197l-2.132-3.197a.5.5 0 00-.658-.658L8.5 10.5a1 1 0 00-1-1v-4a1 1 0 00-1-1h-3.197L2.132 2.168a.5.5 0 00-.658-.658L1.197.471a.5.5 0 00.658.658L8.5 4.5a1 1 0 001 1v4a1 1 0 001 1h3.197l2.132 3.197a.5.5 0 00.658.658l1.197 1.197a.5.5 0 00.658-.658L16.5 9.5a1 1 0 001-1v-4a1 1 0 00-1-1h-3.197L10.905 1.168A1 1 0 0010 6.5L10 6.5a1 1 0 00-1-1H5a1 1 0 00-1 1v4a1 1 0 001 1h3.197l2.132 3.197a.5.5 0 00.658.658l1.197 1.197a.5.5 0 00.658-.658L8.5 12.5a1 1 0 001 1v4a1 1 0 001 1h3.197l12.132 3.197a.5.5 0 00.658.658l1.197 1.197a.5.5 0 00.658-.658L16.5 15.5a1 1 0 001-1v-4a1 1 0 00-1-1h-3.197L10.905 11.168z" />
                    </svg>
                    开始游戏
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* 分页 */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 text-white rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7 7" />
              </svg>
              <span>上一页</span>
            </button>
            
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i)}
                  className={`min-w-[44px] h-11 px-3 rounded-lg font-bold text-lg transition-all duration-200 flex items-center justify-center ${
                    currentPage === i
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg ring-2 ring-white ring-opacity-50 scale-110'
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
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 text-white rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
            >
              <span>下一页</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;