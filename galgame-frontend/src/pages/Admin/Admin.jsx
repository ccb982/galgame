import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createGame } from '../../api/game';
import { createScene } from '../../api/scene';

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

  // 新增函数：获取游戏列表
  const fetchGames = async () => {
    try {
      setLoadingGames(true);
      const response = await fetch('http://localhost:8080/api/games');
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
      
      await createGame({
        ...game,
        status: 1,
        createdAt: new Date()
      });
      
      setGame({ title: '', coverUrl: '', description: '', tags: '' });
      alert('游戏上传成功');
      // 上传成功后重新获取游戏列表
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
              <label className="block text-gray-300 mb-2">封面 URL</label>
              <input 
                type="text" 
                name="coverUrl" 
                value={game.coverUrl} 
                onChange={handleInputChange} 
                className="w-full bg-gray-700 text-white p-2 rounded"
              />
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
    </div>
  );
};

export default Admin;