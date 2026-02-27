import React, { useEffect, useRef, useState } from 'react';

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
  const [isHovered, setIsHovered] = React.useState(false);
  const containerRef = useRef(null);
  const [verticalStyle, setVerticalStyle] = useState({ top: '50%', transform: 'translateY(-50%)' });

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

  // 检查角色图片是否会被对话框遮挡，计算出正确位置
  useEffect(() => {
    if (containerRef.current && isLoaded) {
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // 对话框底部阈值（屏幕高度的65%）
      const dialogBottomThreshold = windowHeight * 0.65;
      
      // 角色图片底部位置
      const characterBottom = rect.bottom;
      
      console.log('🔍 角色垂直位置检查:', {
        name: character.name,
        characterBottom: characterBottom,
        dialogBottomThreshold: dialogBottomThreshold,
        windowHeight: windowHeight,
        willOverlap: characterBottom > dialogBottomThreshold
      });
      
      // 计算角色的正确位置（不被对话框遮挡的位置）
      // 如果角色底部超过对话框底部阈值，需要上移
      if (characterBottom > dialogBottomThreshold) {
        const overlapAmount = characterBottom - dialogBottomThreshold;
        // 计算正确位置：从50%减去重叠量，再加上20px的缓冲
        const correctTop = `calc(50% - ${overlapAmount + 20}px)`;
        setVerticalStyle({ top: correctTop, transform: 'translateY(-50%)' });
        console.log(`⬆️ 角色调整到正确位置，上移 ${overlapAmount + 20}px 避免被对话框遮挡`);
      } else {
        // 角色不会被遮挡，保持在垂直居中位置
        setVerticalStyle({ top: '50%', transform: 'translateY(-50%)' });
        console.log('✅ 角色垂直居中，不会被对话框遮挡');
      }
    }
  }, [isLoaded, character.name]);

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

  // 根据角色位置和同一侧的角色数量确定样式
  const getPositionStyle = () => {
    console.log('🔍 角色位置计算:', {
      name: character.name,
      position: character.position,
      allCharacters: characters.map(c => ({ name: c.name, position: c.position }))
    });
    
    // 找出同一侧的所有角色
    const sameSideCharacters = characters.filter(c => c.position === character.position);
    // 找出当前角色在同一侧中的索引
    const sameSideIndex = sameSideCharacters.findIndex(c => c.name === character.name);
    
    switch (character.position) {
      case 'left':
        // 同侧角色间距缩小，每个角色间隔3rem
        const leftOffset = sameSideIndex * 3;
        console.log(`✅ 使用左侧位置: left: ${2 + leftOffset}rem, 同侧索引: ${sameSideIndex}`);
        return { left: `${2 + leftOffset}rem`, right: 'auto' };
      case 'right':
        // 同侧角色间距缩小，每个角色间隔3rem
        const rightOffset = sameSideIndex * 3;
        console.log(`✅ 使用右侧位置: right: ${2 + rightOffset}rem, 同侧索引: ${sameSideIndex}`);
        return { right: `${2 + rightOffset}rem`, left: 'auto' };
      case 'center':
        console.log('✅ 使用中间位置: center');
        return { left: '50%', transform: 'translateX(-50%)' };
      default:
        console.warn('⚠️ 未知位置:', character.position, '使用默认位置left: 2rem');
        return { left: '2rem', right: 'auto' };
    }
  };

  const positionStyle = getPositionStyle();
  
  // 合并垂直样式和位置样式
  const mergedStyle = {
    ...verticalStyle,
    ...positionStyle,
    // 如果是center位置，需要合并transform
    transform: character.position === 'center' 
      ? 'translateX(-50%) translateY(-50%)' 
      : verticalStyle.transform
  };
  
  console.log('📍 最终位置样式:', {
    name: character.name,
    position: character.position,
    positionStyle: positionStyle,
    verticalStyle: verticalStyle,
    mergedStyle: mergedStyle
  });

  // 为每个角色生成唯一的动画名称
  const animationName = `float-${character.name}-${index}`;

  return (
    <>
      <style>
        {`
          @keyframes ${animationName} {
            0%, 100% {
              transform: ${character.position === 'center' 
                ? 'translateX(-50%) translateY(-50%) translateY(0px)' 
                : 'translateY(-50%) translateY(0px)'};
            }
            50% {
              transform: ${character.position === 'center' 
                ? 'translateX(-50%) translateY(-50%) translateY(-15px)' 
                : 'translateY(-50%) translateY(-15px)'};
            }
          }
        `}
      </style>
      <div
        ref={containerRef}
        className="absolute cursor-pointer"
        style={{
          top: mergedStyle.top,
          left: mergedStyle.left,
          right: mergedStyle.right,
          transform: mergedStyle.transform,
          animation: `${animationName} ${3 + index * 0.5}s ease-in-out infinite alternate`,
          opacity: isLoaded ? 1 : 0,
          animationDelay: `${index * 0.3}s`,
          zIndex: isHovered ? 100 : 10 + index
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div 
          className="relative transition-transform duration-300 ease-out"
          style={{
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            filter: isHovered 
              ? 'drop-shadow(0 0 12px rgba(255, 255, 255, 0.3)) brightness(1.05)' 
              : 'drop-shadow(0 0 10px rgba(0, 0, 0, 0.3))',
            transition: 'transform 0.3s ease-out, filter 0.3s ease-out'
          }}
        >
          {/* 角色图片 */}
          <img
            src={characterUrl}
            alt={character.name}
            className={`${defaultHeight} object-contain`}
            style={{ maxHeight: `${maxHeight}rem` }}
            onLoad={() => {
              setIsLoaded(true);
              console.log('✅ 角色图片加载成功:', character.name, characterUrl);
            }}
            onError={(error) => {
              setIsLoaded(true);
              console.error('❌ 角色图片加载失败:', error, character.name, characterUrl);
            }}
          />
          {/* 角色名字 */}
          {character.name && (
            <div
              className="absolute left-0 right-0 flex justify-center transition-all duration-300 ease-out"
              style={{
                bottom: isHovered ? '-12px' : '-8px',
                opacity: isHovered ? 1 : 0.8,
                transform: isHovered ? 'translateY(0) scale(1.15)' : 'translateY(0) scale(1)'
              }}
            >
              <div
                className="px-4 py-1 rounded-full text-sm font-medium backdrop-blur-sm transition-all duration-300"
                style={{
                  backgroundColor: isHovered ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.8)',
                  color: isHovered ? '#60a5fa' : '#ffffff',
                  boxShadow: isHovered ? '0 0 20px rgba(96, 165, 250, 0.6)' : 'none'
                }}
              >
                {character.name}
              </div>
            </div>
          )}
          {/* 悬停时的光晕效果 */}
          {isHovered && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.25) 0%, transparent 70%)',
                borderRadius: '50%',
                transform: 'scale(1.4)'
              }}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Character;