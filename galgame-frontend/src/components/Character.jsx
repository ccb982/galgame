import React, { useEffect, useRef } from 'react';

const Character = ({ character, index, defaultHeight = 'h-56', maxHeight = '64', characters = [] }) => {
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

  const characterUrl = getCharacterUrl(character.image);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const containerRef = useRef(null);

  // 添加绘制角色的日志
  useEffect(() => {
    console.log('🎭 开始绘制角色:', {
      name: character.name,
      position: character.position,
      imageUrl: character.image,
      processedUrl: character.image ? getCharacterUrl(character.image) : '无图片',
      index: index
    });
  }, [character, index]);

  // 检查DOM元素的实际位置
  useEffect(() => {
    if (containerRef.current && isLoaded) {
      const rect = containerRef.current.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(containerRef.current);
      
      console.log('🔍 角色DOM元素信息:', {
        name: character.name,
        position: character.position,
        left: computedStyle.left,
        right: computedStyle.right,
        className: containerRef.current.className,
        offsetLeft: containerRef.current.offsetLeft,
        offsetRight: containerRef.current.offsetRight,
        rect: {
          left: rect.left,
          right: rect.right,
          width: rect.width,
          top: rect.top,
          bottom: rect.bottom
        }
      });
    }
  }, [isLoaded, character.name, character.position]);

  // 根据角色位置确定样式
  const getPositionStyle = () => {
    console.log('🔍 角色位置计算:', {
      name: character.name,
      position: character.position,
      allCharacters: characters.map(c => ({ name: c.name, position: c.position }))
    });
    
    switch (character.position) {
      case 'left':
        console.log('✅ 使用左侧位置: left: 2rem');
        return { left: '2rem', right: 'auto' };
      case 'right':
        console.log('✅ 使用右侧位置: right: 2rem');
        return { right: '2rem', left: 'auto' };
      case 'center':
        console.log('✅ 使用中间位置: center');
        return { left: '50%', transform: 'translateX(-50%)' };
      default:
        console.warn('⚠️ 未知位置:', character.position, '使用默认位置left: 2rem');
        return { left: '2rem', right: 'auto' };
    }
  };

  const positionStyle = getPositionStyle();
  console.log('📍 最终位置样式:', {
    name: character.name,
    position: character.position,
    positionStyle: positionStyle
  });

  return (
    <div 
      ref={containerRef}
      className="absolute bottom-40 transition-all duration-1000 ease-out transform"
      style={{
        ...positionStyle,
        animation: `float ${3 + index * 0.5}s ease-in-out infinite alternate`,
        opacity: isLoaded ? 1 : 0,
        animationDelay: `${index * 0.3}s`,
        zIndex: 10 + index
      }}
    >
      <div className="relative">
        {/* 角色图片 */}
        <img 
          src={characterUrl} 
          alt={character.name} 
          className={`${defaultHeight} object-contain drop-shadow-2xl`}
          style={{ maxHeight: `${maxHeight}rem` }}
          onLoad={() => {
            setIsLoaded(true);
            console.log('✅ 角色图片加载成功:', character.name, characterUrl);
          }}
          onError={(error) => {
            setIsLoaded(true); // 即使加载失败也显示容器，避免元素不显示
            console.error('❌ 角色图片加载失败:', error, character.name, characterUrl);
          }}
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