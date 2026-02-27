import { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { getScene } from '../api/scene';
import { createSave } from '../api/save';
import { useGameStore } from '../stores/useGameStore';
import Background from '../components/Background';
import Character from '../components/Character';

const Player = () => {
  const { gameId } = useParams();
  const [searchParams] = useSearchParams();
  const [sceneKey, setSceneKey] = useState(searchParams.get('scene') || 'start');
  const [scene, setScene] = useState(null);
  const [loading, setLoading] = useState(true);
  const visitorId = useGameStore((state) => state.visitorId);

  // 组件初始化日志
  console.log('🎮 游戏播放器初始化:', {
    gameId,
    sceneKey,
    visitorId,
    currentURL: window.location.href
  });

  useEffect(() => {
    const fetchScene = async () => {
      console.log('📡 开始获取场景数据:', {
        gameId,
        sceneKey,
        timestamp: new Date().toISOString()
      });
      
      try {
        setLoading(true);
        console.log('🔄 加载状态设置为 true');
        
        const response = await getScene(gameId, sceneKey);
        console.log('✅ API调用成功:', {
          status: response.status,
          statusText: response.statusText,
          data: response.data
        });
        
        setScene(response.data);
        console.log('💾 场景数据已存储:', response.data);
        
      } catch (error) {
        console.error('❌ API调用失败:', {
          error: error.message,
          errorStack: error.stack,
          gameId,
          sceneKey
        });
        
        if (error.response) {
          console.error('📋 错误响应:', {
            status: error.response.status,
            data: error.response.data,
            headers: error.response.headers
          });
        } else if (error.request) {
          console.error('📡 请求发送但无响应:', error.request);
        } else {
          console.error('💥 请求配置错误:', error.message);
        }
        
      } finally {
        setLoading(false);
        console.log('🔄 加载状态设置为 false');
      }
    };

    fetchScene();
  }, [gameId, sceneKey]);

  // 场景切换状态
  const [isChangingScene, setIsChangingScene] = useState(false);

  const handleNextScene = () => {
    if (scene?.nextScene) {
      // 添加场景切换动画
      setIsChangingScene(true);
      setTimeout(() => {
        setSceneKey(scene.nextScene);
        setIsChangingScene(false);
      }, 500);
    }
  };

  const handleOptionClick = (nextScene) => {
    // 添加场景切换动画
    setIsChangingScene(true);
    setTimeout(() => {
      setSceneKey(nextScene);
      setIsChangingScene(false);
    }, 500);
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

  let sceneContent;
  try {
    console.log('📦 开始解析场景数据:', {
      sceneData: scene,
      hasContent: !!scene?.content
    });
    
    if (!scene || !scene.content) {
      throw new Error('场景数据无效');
    }
    
    console.log('🔍 场景内容:', {
      contentLength: scene.content.length,
      contentPreview: scene.content.substring(0, 100) + (scene.content.length > 100 ? '...' : '')
    });
    
    sceneContent = JSON.parse(scene.content);
    console.log('✅ JSON解析成功:', sceneContent);
    
    if (!sceneContent.text) {
      throw new Error('场景缺少文本内容');
    }
    
    console.log('🎯 场景数据验证通过:', {
      hasText: !!sceneContent.text,
      hasOptions: !!sceneContent.options,
      hasBackground: !!sceneContent.bg,
      hasCharacters: !!sceneContent.characters,
      optionsCount: sceneContent.options?.length || 0
    });
    
  } catch (error) {
    console.error('❌ 解析场景内容失败:', {
      error: error.message,
      errorStack: error.stack,
      sceneData: scene,
      content: scene?.content
    });
    
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">场景数据解析失败</p>
          <p className="text-gray-400">{error.message}</p>
          <Link 
            to={`/game/${gameId}`} 
            className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            返回游戏详情
          </Link>
        </div>
      </div>
    );
  }

  // UI渲染前日志
  console.log('🎨 准备渲染游戏界面:', {
    sceneKey,
    sceneContent: {
      hasText: !!sceneContent.text,
      hasOptions: !!sceneContent.options,
      hasBackground: !!sceneContent.bg,
      hasCharacters: !!sceneContent.characters,
      optionsCount: sceneContent.options?.length || 0
    }
  });

  return (
    <div 
      className="relative w-full h-screen overflow-hidden"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: 0,
        display: 'block',
        overflow: 'hidden',
        zIndex: 0
      }}
    >
      {/* 场景切换过渡动画 */}
      {isChangingScene && (
        <div 
          className="absolute inset-0 bg-black z-50 transition-opacity duration-500"
          style={{ opacity: 1, animation: 'fadeInOut 1s ease-in-out' }}
        ></div>
      )}
      {/* 背景图 */}
      <Background bg={sceneContent?.bg} />

      {/* 立绘 */}
      {sceneContent?.characters && sceneContent.characters.map((character, index) => (
        <Character key={index} character={character} index={index} characters={sceneContent.characters} />
      ))}
      
      {/* 文本框 */}
      <div 
        className="absolute z-20 flex items-end justify-center"
        style={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          margin: 0,
          padding: 0,
          paddingBottom: '2rem'
        }}
      >
        <div 
          style={{
            maxWidth: '4xl',
            width: '90%',
            margin: '0 auto',
            padding: '1.5rem'
          }}
        >
          <div 
            className="backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl p-6 transition-all duration-500"
            style={{
              margin: 0,
              padding: '1.5rem',
              background: 'rgba(0, 0, 0, 0.8)'
            }}
          >
            {/* 文本内容 */}
            <div className="mb-6 text-center">
              <p 
                className="text-xl md:text-2xl leading-relaxed tracking-wide"
                style={{ fontWeight: 'bold', color: '#ffffff' }}
              >
                {sceneContent.text}
              </p>
            </div>
            
            {/* 选项 */}
            {sceneContent?.options && sceneContent.options.length > 0 ? (
              <div className="flex flex-col items-center gap-4">
                {sceneContent.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleOptionClick(option.next)}
                    className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl text-center transition-all duration-300 transform hover:-translate-y-1 border border-white/20 backdrop-blur-sm w-full max-w-md"
                    style={{
                      opacity: 0,
                      animation: `fadeIn ${0.5}s ease-out forwards`,
                      animationDelay: `${index * 0.2}s`
                    }}
                  >
                    <span className="inline-block mr-3 text-yellow-400">▶</span>
                    {option.text}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap justify-between items-center gap-4">
                <button
                  onClick={handleSave}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  保存
                </button>
                <Link 
                  to={`/game/${gameId}`} 
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  退出
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* 动画关键帧 */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          100% {
            transform: translateY(-10px);
          }
        }
        
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInOut {
          0% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Player;