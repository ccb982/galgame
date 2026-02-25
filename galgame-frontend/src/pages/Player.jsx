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
      hasCharacters: !!sceneContent.characters
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
        zIndex: 1
      }}
    >
      {/* 背景图 */}
      {sceneContent?.bg && (
        <div className="absolute inset-0">
          <img 
            src={sceneContent.bg} 
            alt="背景" 
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* 立绘 */}
      {sceneContent?.characters && sceneContent.characters.map((character, index) => (
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
          {sceneContent?.options && sceneContent.options.length > 0 ? (
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