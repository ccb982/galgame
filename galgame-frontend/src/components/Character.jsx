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
  const imgRef = useRef(null);
  const [verticalStyle, setVerticalStyle] = useState({ top: '50%', transform: 'translateY(-50%)' });
  const [imageStyle, setImageStyle] = useState({ maxWidth: '50vw' });

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

  // 检查并限制图片宽度不超过屏幕1/3
  useEffect(() => {
    if (imgRef.current && isLoaded) {
      const imgElement = imgRef.current;
      const naturalWidth = imgElement.naturalWidth;
      const naturalHeight = imgElement.naturalHeight;
      const screenWidth = window.innerWidth;
      const maxAllowedWidth = screenWidth / 3;
      
      console.log('🖼️ 角色图片尺寸检查:', {
        name: character.name,
        naturalWidth: naturalWidth,
        naturalHeight: naturalHeight,
        screenWidth: screenWidth,
        maxAllowedWidth: maxAllowedWidth,
        needsResize: naturalWidth > maxAllowedWidth
      });
      
      if (naturalWidth > maxAllowedWidth) {
        const scale = maxAllowedWidth / naturalWidth;
        const newWidth = maxAllowedWidth;
        const newHeight = naturalHeight * scale;
        
        setImageStyle({
          maxWidth: '33.33vw',
          width: `${newWidth}px`,
          height: 'auto'
        });
        
        console.log(`📐 图片已缩放: ${naturalWidth}x${naturalHeight} -> ${newWidth.toFixed(0)}x${newHeight.toFixed(0)}, 缩放比例: ${(scale * 100).toFixed(1)}%`);
      } else {
        setImageStyle({
          maxWidth: '33.33vw',
          width: 'auto',
          height: 'auto'
        });
        console.log('✅ 图片宽度正常，无需缩放');
      }
    }
  }, [isLoaded, character.name]);

  // 检查角色图片是否会被对话框遮挡，计算出正确位置
  useEffect(() => {
    if (containerRef.current && isLoaded) {
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const characterHeight = rect.height;
      
      // 对话框底部阈值（屏幕高度的65%）
      const dialogBottomThreshold = windowHeight * 0.65;
      
      // 角色图片底部位置
      const characterBottom = rect.bottom;
      const characterTop = rect.top;
      
      console.log('🔍 角色垂直位置检查:', {
        name: character.name,
        characterTop: characterTop,
        characterBottom: characterBottom,
        characterHeight: characterHeight,
        dialogBottomThreshold: dialogBottomThreshold,
        windowHeight: windowHeight,
        willOverlapBottom: characterBottom > dialogBottomThreshold,
        willOverflowTop: characterTop < 0
      });
      
      // 可用于显示角色的区域高度（屏幕顶部到对话框底部）
      const availableHeight = dialogBottomThreshold;
      
      // 判断角色图片是否比可用区域高
      const isTallerThanAvailable = characterHeight > availableHeight;
      
      let finalTop;
      
      if (isTallerThanAvailable) {
        // 高角色：优先显示头部，确保顶部在屏幕内
        finalTop = '10px';
        console.log(`📐 高角色图片 (${characterHeight}px > ${availableHeight}px)，优先显示头部，top: 10px`);
      } else {
        // 矮角色：尝试居中，但要避免被对话框遮挡
        // 计算在可用区域内居中的位置
        const centerInAvailable = availableHeight / 2;
        
        // 检查居中后是否会被对话框遮挡
        if (characterBottom > dialogBottomThreshold) {
          // 需要上移以避免被遮挡
          const overlapAmount = characterBottom - dialogBottomThreshold;
          finalTop = `calc(50% - ${overlapAmount + 20}px)`;
          console.log(`⬆️ 角色调整位置，上移 ${overlapAmount + 20}px 避免被对话框遮挡`);
        } else {
          // 可以居中显示
          finalTop = '50%';
          console.log('✅ 角色垂直居中，不会被对话框遮挡');
        }
      }
      
      // 最终检查：确保角色顶部不会超出屏幕
      // 使用 requestAnimationFrame 确保样式已应用后再检查
      requestAnimationFrame(() => {
        if (containerRef.current) {
          const finalRect = containerRef.current.getBoundingClientRect();
          if (finalRect.top < 0) {
            // 顶部超出屏幕，强制下移
            finalTop = '10px';
            console.log(`⚠️ 角色顶部超出屏幕，强制下移至 top: 10px`);
          }
          
          setVerticalStyle({ 
            top: finalTop, 
            transform: finalTop === '50%' ? 'translateY(-50%)' : 'none' 
          });
        }
      });
      
      // 先设置初始位置
      setVerticalStyle({ 
        top: finalTop, 
        transform: finalTop === '50%' ? 'translateY(-50%)' : 'none' 
      });
    }
  }, [isLoaded, character.name, imageStyle]);

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
  const getMergedTransform = () => {
    const verticalTransform = verticalStyle.transform || 'none';
    
    if (character.position === 'center') {
      if (verticalTransform === 'translateY(-50%)') {
        return 'translateX(-50%) translateY(-50%)';
      } else {
        return 'translateX(-50%)';
      }
    }
    return verticalTransform;
  };
  
  const mergedStyle = {
    ...verticalStyle,
    ...positionStyle,
    transform: getMergedTransform()
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
  
  // 根据当前transform生成动画
  const getAnimationTransform = (yOffset) => {
    const verticalTransform = verticalStyle.transform || 'none';
    
    if (character.position === 'center') {
      if (verticalTransform === 'translateY(-50%)') {
        return `translateX(-50%) translateY(-50%) translateY(${yOffset}px)`;
      } else {
        return `translateX(-50%) translateY(${yOffset}px)`;
      }
    }
    
    if (verticalTransform === 'translateY(-50%)') {
      return `translateY(-50%) translateY(${yOffset}px)`;
    }
    
    return `translateY(${yOffset}px)`;
  };

  return (
    <>
      <style>
        {`
          @keyframes ${animationName} {
            0%, 100% {
              transform: ${getAnimationTransform(0)};
            }
            50% {
              transform: ${getAnimationTransform(-15)};
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
            ref={imgRef}
            src={characterUrl}
            alt={character.name}
            className={`object-contain`}
            style={{ ...imageStyle, maxHeight: `${maxHeight}rem` }}
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