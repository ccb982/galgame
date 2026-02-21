// 生成 UUID 作为游客 ID
export const generateVisitorId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// 获取游客 ID
export const getVisitorId = () => {
  return localStorage.getItem('visitorId') || generateVisitorId();
};

// 设置游客 ID
export const setVisitorId = (visitorId) => {
  localStorage.setItem('visitorId', visitorId);
};