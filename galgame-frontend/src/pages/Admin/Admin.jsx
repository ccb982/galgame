import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createGame, createGameWithUpload } from '../../api/game';
import { createScene } from '../../api/scene';
import { uploadBackgroundImage, uploadCharacterImage } from '../../api/sceneImage';

const Admin = () => {
  const [game, setGame] = useState({
    title: '',
    coverUrl: '',
    description: '',
    tags: ''
  });
  
  // 新增状态变量
  const [games, setGames] = useState([]);
  const [loadingGames, setLoadingGames] = useState(false);
  const [selectedGameId, setSelectedGameId] = useState('');
  const [scriptFile, setScriptFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  
  // 新增：场景图片上传状态
  const [backgroundFile, setBackgroundFile] = useState(null);
  const [characterFile, setCharacterFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);

  const checkGameHasScenes = async (gameId) => {
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
      const response = await fetch(`${apiBaseUrl}/games/${gameId}/scenes`);
      if (!response.ok) {
        throw new Error('Failed to check scenes');
      }
      const data = await response.json();
      return data.length > 0;
    } catch (error) {
      console.error('Error checking scenes:', error);
      return false;
    }
  };

  const fetchGames = async () => {
    try {
      setLoadingGames(true);
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
      // 使用较大的size参数获取足够多的游戏
      const response = await fetch(`${apiBaseUrl}/games?page=0&size=100`);
      if (!response.ok) {
        throw new Error('Failed to fetch games');
      }
      const data = await response.json();
      setGames(data.content || data);
    } catch (error) {
      console.error('Error fetching games:', error);
      alert('获取游戏列表失败');
    } finally {
      setLoadingGames(false);
    }
  };

  // 组件挂载时获取游戏列表
  useEffect(() => {
    fetchGames();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGame(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (!game.title) {
        alert('请输入游戏标题');
        return;
      }
      
      const formData = new FormData();
      formData.append('title', game.title);
      formData.append('description', game.description);
      formData.append('tags', game.tags);
      
      if (coverFile) {
        formData.append('coverFile', coverFile);
      } else if (game.coverUrl) {
        formData.append('coverUrl', game.coverUrl);
      }
      
      await createGameWithUpload(formData);
      
      setGame({ title: '', coverUrl: '', description: '', tags: '' });
      setCoverFile(null);
      alert('游戏上传成功');
      fetchGames();
    } catch (error) {
      console.error('游戏上传失败:', error);
      alert('游戏上传失败，请重试');
    }
  };

  // 新增函数：处理剧本上传
  const handleScriptUpload = async (e) => {
    e.preventDefault();
    
    try {
      if (!selectedGameId) {
        alert('请选择游戏');
        return;
      }
      
      const hasScenes = await checkGameHasScenes(selectedGameId);
      if (hasScenes) {
        alert('该游戏已经存在剧本，不能重复上传');
        return;
      }
      
      if (!scriptFile) {
        alert('请上传剧本文件');
        return;
      }
      
      // 读取文件内容
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const scriptContent = JSON.parse(event.target.result);
          
          if (!scriptContent.scenes || !Array.isArray(scriptContent.scenes)) {
            alert('剧本格式错误：缺少scenes数组');
            return;
          }
          
          // 批量创建场景
          for (const scene of scriptContent.scenes) {
            await createScene(selectedGameId, {
              sceneKey: scene.sceneKey,
              content: JSON.stringify(scene.content),
              nextScene: scene.nextScene
            });
          }
          
          alert('剧本上传成功');
          setSelectedGameId('');
          setScriptFile(null);
          // 重置文件输入
          e.target.reset();
        } catch (error) {
          console.error('Error parsing script:', error);
          alert('解析剧本文件失败');
        }
      };
      
      reader.onerror = () => {
        alert('读取文件失败');
      };
      
      reader.readAsText(scriptFile);
    } catch (error) {
      console.error('Error uploading script:', error);
      alert('剧本上传失败');
    }
  };
  
  // 新增：上传背景图片
  const handleBackgroundUpload = async (e) => {
    e.preventDefault();
    
    try {
      if (!selectedGameId) {
        alert('请选择游戏');
        return;
      }
      
      if (!backgroundFile) {
        alert('请选择背景图片');
        return;
      }
      
      setUploadingImage(true);
      const response = await uploadBackgroundImage(selectedGameId, backgroundFile);
      setUploadResult({
        type: 'background',
        url: response.data.imageUrl,
        fullUrl: `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}${response.data.imageUrl}`
      });
      alert('背景图片上传成功');
      setBackgroundFile(null);
    } catch (error) {
      console.error('上传背景图片失败:', error);
      alert('上传背景图片失败，请重试');
    } finally {
      setUploadingImage(false);
    }
  };
  
  // 新增：上传角色图片
  const handleCharacterUpload = async (e) => {
    e.preventDefault();
    
    try {
      if (!selectedGameId) {
        alert('请选择游戏');
        return;
      }
      
      if (!characterFile) {
        alert('请选择角色图片');
        return;
      }
      
      setUploadingImage(true);
      const response = await uploadCharacterImage(selectedGameId, characterFile);
      setUploadResult({
        type: 'character',
        url: response.data.imageUrl,
        fullUrl: `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}${response.data.imageUrl}`
      });
      alert('角色图片上传成功');
      setCharacterFile(null);
    } catch (error) {
      console.error('上传角色图片失败:', error);
      alert('上传角色图片失败，请重试');
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-start mb-6">
        <Link to="/" className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded">
          返回游戏库
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-10 text-center">游戏管理后台</h1>

      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-6">添加新游戏</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-300 mb-2">游戏标题</label>
              <input 
                type="text" 
                name="title" 
                value={game.title} 
                onChange={handleInputChange} 
                className="w-full bg-gray-700 text-white p-2 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">封面图片</label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-gray-400 text-sm mb-1">上传图片</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    className="w-full bg-gray-700 text-white p-2 rounded"
                    onChange={(e) => setCoverFile(e.target.files[0])}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-gray-400 text-sm mb-1">或输入图片URL</label>
                  <input 
                    type="text" 
                    name="coverUrl" 
                    value={game.coverUrl} 
                    onChange={handleInputChange} 
                    className="w-full bg-gray-700 text-white p-2 rounded"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-300 mb-2">游戏简介</label>
              <textarea 
                name="description" 
                value={game.description} 
                onChange={handleInputChange} 
                className="w-full bg-gray-700 text-white p-2 rounded h-32"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-300 mb-2">标签（用逗号分隔）</label>
              <input 
                type="text" 
                name="tags" 
                value={game.tags} 
                onChange={handleInputChange} 
                className="w-full bg-gray-700 text-white p-2 rounded"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-center">
            <button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded text-lg"
            >
              上传游戏
            </button>
          </div>
        </form>
      </div>

      <div className="mt-10 bg-gray-800 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-6">导入剧本</h2>
        <form onSubmit={handleScriptUpload}>
          <div className="mb-6">
            <label className="block text-gray-300 mb-2">选择游戏</label>
            <select 
              className="w-full bg-gray-700 text-white p-2 rounded"
              value={selectedGameId}
              onChange={(e) => setSelectedGameId(e.target.value)}
            >
              <option value="">请选择游戏</option>
              {loadingGames ? (
                <option value="">加载中...</option>
              ) : (
                games.map(gameItem => (
                  <option key={gameItem.id} value={gameItem.id}>
                    {gameItem.title}
                  </option>
                ))
              )}
            </select>
          </div>
          <div className="mb-6">
            <label className="block text-gray-300 mb-2">上传剧本 JSON 文件</label>
            <input 
              type="file" 
              accept=".json" 
              className="w-full bg-gray-700 text-white p-2 rounded"
              onChange={(e) => setScriptFile(e.target.files[0])}
            />
          </div>
          <div className="flex justify-center">
            <button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded text-lg"
            >
              导入剧本
            </button>
          </div>
        </form>
      </div>

      <div className="mt-10 bg-gray-800 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-6">上传场景图片</h2>
        
        <div className="mb-6">
          <label className="block text-gray-300 mb-2">选择游戏</label>
          <select 
            className="w-full bg-gray-700 text-white p-2 rounded"
            value={selectedGameId}
            onChange={(e) => setSelectedGameId(e.target.value)}
          >
            <option value="">请选择游戏</option>
            {loadingGames ? (
              <option value="">加载中...</option>
            ) : (
              games.map(gameItem => (
                <option key={gameItem.id} value={gameItem.id}>
                  {gameItem.title}
                </option>
              ))
            )}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 上传背景图片 */}
          <div>
            <h3 className="text-xl font-semibold mb-4">上传背景图片</h3>
            <form onSubmit={handleBackgroundUpload}>
              <div className="mb-4">
                <input 
                  type="file" 
                  accept="image/*"
                  className="w-full bg-gray-700 text-white p-2 rounded"
                  onChange={(e) => setBackgroundFile(e.target.files[0])}
                  disabled={uploadingImage}
                />
              </div>
              <button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded"
                disabled={uploadingImage || !selectedGameId}
              >
                {uploadingImage ? '上传中...' : '上传背景图片'}
              </button>
            </form>
          </div>

          {/* 上传角色图片 */}
          <div>
            <h3 className="text-xl font-semibold mb-4">上传角色图片</h3>
            <form onSubmit={handleCharacterUpload}>
              <div className="mb-4">
                <input 
                  type="file" 
                  accept="image/*"
                  className="w-full bg-gray-700 text-white p-2 rounded"
                  onChange={(e) => setCharacterFile(e.target.files[0])}
                  disabled={uploadingImage}
                />
              </div>
              <button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded"
                disabled={uploadingImage || !selectedGameId}
              >
                {uploadingImage ? '上传中...' : '上传角色图片'}
              </button>
            </form>
          </div>
        </div>

        {/* 上传结果 */}
        {uploadResult && (
          <div className="mt-6 p-4 bg-gray-700 rounded">
            <h3 className="text-lg font-semibold mb-2">上传结果</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-300">图片类型: {uploadResult.type === 'background' ? '背景' : '角色'}</p>
                <p className="text-gray-300">图片URL: <code className="text-green-400 break-all">{uploadResult.url}</code></p>
              </div>
              <div>
                <img 
                  src={uploadResult.fullUrl} 
                  alt={`${uploadResult.type} image`} 
                  className="max-w-full max-h-40 object-cover rounded"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;