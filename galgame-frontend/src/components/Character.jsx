import React, { useEffect } from 'react';

const Character = ({ character, index }) => {
  // 处理角色图片URL
  const getCharacterUrl = (imageUrl) => {
    if (!imageUrl) return '';
    // 如果是完整URL，直接使用
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    // 否则添加API基础URL
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
    return `${apiBaseUrl}${imageUrl}`;
  };

  // 添加绘制角色的日志
  useEffect(() => {
    console.log('🎭 开始绘制角色:', {
      name: character.name,
      position: character.position,
      imageUrl: character.image,
      processedUrl: character.image ? getCharacterUrl(character.image) : '无图片'
    });
  }, [character]);

  const characterUrl = getCharacterUrl(character.image);

  return (
    <div 
      className={`absolute ${character.position === 'left' ? 'left-8' : 'right-8'} bottom-40 z-10 transition-all duration-1000 ease-out transform`}
      style={{
        animation: `float ${3 + index * 0.5}s ease-in-out infinite alternate`,
        opacity: 0,
        animationDelay: `${index * 0.3}s`
      }}
    >
      <div className="relative">
        {/* 角色图片 */}
        <img 
          src={characterUrl} 
          alt={character.name} 
          className="h-72 object-contain drop-shadow-2xl"
          onLoad={(e) => {
            e.currentTarget.style.opacity = 1;
            console.log('✅ 角色图片加载成功:', character.name, characterUrl);
          }}
          onError={(error) => console.error('❌ 角色图片加载失败:', error, character.name, characterUrl)}
        />
        {/* 角色名字 */}
        {character.name && (
          <div className="absolute -bottom-8 left-0 right-0 flex justify-center">
            <div className="bg-black/80 text-white px-4 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
              {character.name}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Character;