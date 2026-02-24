import { useState } from 'react';
import { Link } from 'react-router-dom';
import { createGame } from '../../api/game';

const Admin = () => {
  const [game, setGame] = useState({
    title: '',
    coverUrl: '',
    description: '',
    tags: ''
  });

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
    } catch (error) {
      console.error('游戏上传失败:', error);
      alert('游戏上传失败，请重试');
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
        <form>
          <div className="mb-6">
            <label className="block text-gray-300 mb-2">选择游戏</label>
            <select className="w-full bg-gray-700 text-white p-2 rounded">
              <option value="">请选择游戏</option>
              {/* 这里应该从 API 获取游戏列表 */}
            </select>
          </div>
          <div className="mb-6">
            <label className="block text-gray-300 mb-2">上传剧本 JSON 文件</label>
            <input 
              type="file" 
              accept=".json" 
              className="w-full bg-gray-700 text-white p-2 rounded"
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