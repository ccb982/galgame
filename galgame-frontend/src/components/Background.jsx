import React, { useEffect } from 'react';

const Background = ({ bg }) => {
  // 处理背景图片URL
  const getBackgroundUrl = (bgUrl) => {
    if (!bgUrl) return '';
    // 如果是完整URL，直接使用
    if (bgUrl.startsWith('http')) {
      return bgUrl;
    }
    // 否则添加API基础URL
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
    return `${apiBaseUrl}${bgUrl}`;
  };

  // 添加绘制背景的日志
  useEffect(() => {
    console.log('🎨 开始绘制背景:', {
      bgUrl: bg,
      processedUrl: bg ? getBackgroundUrl(bg) : '默认背景'
    });
  }, [bg]);

  if (!bg) {
    console.log('🎨 使用默认背景');
    return (
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-800 z-0"></div>
    );
  }

  const backgroundUrl = getBackgroundUrl(bg);
  console.log('🎨 绘制背景图片:', backgroundUrl);

  return (
    <div className="absolute inset-0 overflow-hidden z-0" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
      {/* 背景图片 */}
      <div 
        className="absolute inset-0" 
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0,
          backgroundImage: `url(${backgroundUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      ></div>
      {/* 渐变叠加层 */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}></div>
    </div>
  );
};

export default Background;