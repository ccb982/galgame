import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getGameById } from '../api/game';
import { getSaves } from '../api/save';
import { useGameStore } from '../stores/useGameStore';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const GameDetail = () => {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [saves, setSaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const visitorId = useGameStore((state) => state.visitorId);

  const getCoverUrl = (coverUrl) => {
    if (!coverUrl) return '';
    if (coverUrl.startsWith('http')) {
      return coverUrl;
    }
    return `${API_BASE_URL}${coverUrl}`;
  };

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
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-blue-500"></div>
          <p className="mt-4 text-gray-300">加载中...</p>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-center">
          <p className="text-gray-400 text-xl">游戏不存在</p>
          <Link to="/" className="mt-4 text-blue-400 hover:text-blue-300">返回游戏库</Link>
        </div>
      </div>
    );
  }

  const coverUrl = getCoverUrl(game.coverUrl);

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      <div className="container mx-auto px-4 py-4 max-w-5xl h-full flex flex-col">
        {/* 返回按钮 */}
        <div className="mb-2 flex-shrink-0">
          <Link to="/" className="inline-flex items-center text-gray-400 hover:text-white transition-colors text-sm">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7v14m0 0l7-7m-7 7v-14" />
            </svg>
            返回游戏库
          </Link>
        </div>
        
        {/* 游戏信息卡片 */}
        <div className="bg-gray-800 rounded-2xl overflow-hidden shadow-2xl border border-gray-700 flex-1 flex flex-col">
          <div className="flex flex-col md:flex-row flex-1">
            {/* 封面图片 */}
            <div className="w-full md:w-2/5 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center p-3">
              {coverUrl ? (
                <img 
                  src={coverUrl} 
                  alt={game.title} 
                  className="object-contain rounded-lg shadow-lg"
                  style={{ maxWidth: '100%', maxHeight: '380px' }}
                />
              ) : (
                <div className="flex items-center justify-center text-gray-500" style={{ height: '200px' }}>
                  <svg className="w-16 h-16 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm">无封面</p>
                </div>
              )}
            </div>
            
            {/* 游戏信息 */}
            <div className="w-full md:w-3/5 p-4 flex flex-col">
              {/* 固定内容区域 */}
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-white mb-2">{game.title}</h1>
                <p className="text-gray-300 mb-2 leading-relaxed text-xs line-clamp-2">{game.description}</p>
                
                {/* 标签 */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {game.tags?.split(',').map((tag, index) => (
                    <span 
                      key={index} 
                      className="px-2 py-0.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs rounded-full font-medium shadow-md"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
                
                {/* 开始游戏按钮 */}
                <div className="flex justify-start mb-3">
                  <Link 
                    to={`/play/${game.id}?scene=start`} 
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2 rounded-lg font-bold text-base transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    开始游戏
                  </Link>
                </div>
              </div>
              
              {/* 存档列表 - 可滚动区域 */}
              {saves.length > 0 && (
                <div className="flex-1 overflow-y-auto min-h-0 border-t border-gray-700 pt-3">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-base font-bold text-white flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14a2 2 0 012-2v10a2 2 0 01-2 2H5a2 2 0 00-2-2V8a2 2 0 012-2zm0 0l4 4h4m-4-4h4M9 12h6m-6 0h-6" />
                      </svg>
                      存档列表
                    </h2>
                    <span className="text-gray-400 text-xs">共 {saves.length} 个存档</span>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2">
                    {saves.map((save) => (
                      <div key={save.id} className="bg-gray-700 rounded-lg p-2 hover:bg-gray-600 transition-all duration-300 border border-gray-600">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-sm text-white flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14a2 2 0 012-2v10a2 2 0 01-2 2H5a2 2 0 00-2-2V8a2 2 0 012-2zm0 0l4 4h4m-4-4h4M9 12h6m-6 0h-6" />
                            </svg>
                            存档 {save.id}
                          </h3>
                          <span className="text-gray-400 text-xs">
                            {new Date(save.updatedAt).toLocaleDateString('zh-CN')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetail;
