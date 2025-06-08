import React, { useState, useRef, useCallback, useEffect } from 'react';
import './ResizeDivider.scss';

type ResizeDirection = 'top' | 'right' | 'bottom' | 'left' | 'horizontal' | 'vertical' | 'all';

interface ResizeDividerProps {
  /** 拖拽方向 */
  direction: ResizeDirection | ResizeDirection[];
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 分隔符大小（px） */
  size?: number;
  /** 子元素 */
  children?: React.ReactNode;
  /** 初始宽度 */
  initialWidth?: number;
  /** 初始高度 */
  initialHeight?: number;
  /** 最小宽度 */
  minWidth?: number;
  /** 最小高度 */
  minHeight?: number;
  /** 最大宽度 */
  maxWidth?: number;
  /** 最大高度 */
  maxHeight?: number;
  /** 尺寸变化回调（可选） */
  onResize?: (width: number, height: number) => void;
}

/**
 * 通用拖拽分隔符组件
 * 支持四个方向的拖拽控制，内部处理所有拖拽逻辑
 * 
 * ## 主要特性
 * - 🎯 内部处理所有拖拽逻辑，无需外部 Hook
 * - 📏 直接调整内容区域尺寸，子元素自动适应
 * - 🔒 支持最小/最大尺寸限制
 * - 🎨 平滑的拖拽体验和视觉反馈
 * - 🧩 灵活的方向控制（单个、组合、全部）
 * 
 * ## 方向参数
 * - 单个方向: 'top', 'right', 'bottom', 'left'
 * - 组合方向: 'horizontal' (左右), 'vertical' (上下), 'all' (四个方向)
 * - 数组形式: ['top', 'right'] 等自定义组合
 * 
 * @example
 * // 基础用法：右侧拖拽调整宽度
 * <ResizeDivider 
 *   direction="right"
 *   initialWidth={300}
 *   minWidth={200}
 *   maxWidth={500}
 * >
 *   <div style={{background: '#f0f0f0', padding: '20px'}}>
 *     内容会自动适应调整后的宽度
 *   </div>
 * </ResizeDivider>
 * 
 * // 水平方向调整
 * <ResizeDivider 
 *   direction="horizontal"
 *   initialWidth={400}
 * >
 *   <div>左右都可以拖拽调整宽度</div>
 * </ResizeDivider>
 * 
 * // 全方向调整，带回调
 * <ResizeDivider 
 *   direction="all"
 *   initialWidth={300}
 *   initialHeight={200}
 *   minWidth={100}
 *   minHeight={100}
 *   maxWidth={600}
 *   maxHeight={400}
 *   onResize={(w, h) => console.log('新尺寸:', w, h)}
 * >
 *   <div style={{background: '#e6f4ff', padding: '20px', height: '100%'}}>
 *     四个方向都可以拖拽调整尺寸
 *   </div>
 * </ResizeDivider>
 */
export default function ResizeDivider({
  direction,
  className = '',
  style = {},
  size = 4,
  children,
  initialWidth,
  initialHeight,
  minWidth = 50,
  minHeight = 50,
  maxWidth,
  maxHeight,
  onResize
}: ResizeDividerProps) {
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [contentSize, setContentSize] = useState({
    width: initialWidth,
    height: initialHeight
  });
  const [isDragging, setIsDragging] = useState<string | null>(null);
  const dragStartRef = useRef<{ x: number; y: number; width: number; height: number } | null>(null);

  // 标准化方向数组
  const getDirections = (): ('top' | 'right' | 'bottom' | 'left')[] => {
    if (Array.isArray(direction)) {
      return direction.filter(d => ['top', 'right', 'bottom', 'left'].includes(d)) as ('top' | 'right' | 'bottom' | 'left')[];
    }
    
    switch (direction) {
      case 'top':
      case 'right':
      case 'bottom':
      case 'left':
        return [direction];
      case 'horizontal':
        return ['left', 'right'];
      case 'vertical':
        return ['top', 'bottom'];
      case 'all':
        return ['top', 'right', 'bottom', 'left'];
      default:
        return [];
    }
  };

  const directions = getDirections();

  // 限制尺寸在合法范围内
  const clampSize = (width: number, height: number) => {
    const clampedWidth = Math.max(
      minWidth,
      maxWidth ? Math.min(maxWidth, width) : width
    );
    const clampedHeight = Math.max(
      minHeight,
      maxHeight ? Math.min(maxHeight, height) : height
    );
    return { width: clampedWidth, height: clampedHeight };
  };

  // 开始拖拽
  const handleMouseDown = useCallback((e: React.MouseEvent, dir: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const currentWidth = contentSize.width || rect.width;
    const currentHeight = contentSize.height || rect.height;

    setIsDragging(dir);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      width: currentWidth,
      height: currentHeight
    };
  }, [contentSize]);

  // 处理鼠标移动
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !dragStartRef.current) return;

    const { x: startX, y: startY, width: startWidth, height: startHeight } = dragStartRef.current;
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    let newWidth = startWidth;
    let newHeight = startHeight;

    switch (isDragging) {
      case 'right':
        newWidth = startWidth + deltaX;
        break;
      case 'left':
        newWidth = startWidth - deltaX;
        break;
      case 'bottom':
        newHeight = startHeight + deltaY;
        break;
      case 'top':
        newHeight = startHeight - deltaY;
        break;
    }

    const { width: clampedWidth, height: clampedHeight } = clampSize(newWidth, newHeight);
    const newSize = { width: clampedWidth, height: clampedHeight };
    
    setContentSize(newSize);
    onResize?.(clampedWidth, clampedHeight);
  }, [isDragging, minWidth, minHeight, maxWidth, maxHeight, onResize]);

  // 结束拖拽
  const handleMouseUp = useCallback(() => {
    setIsDragging(null);
    dragStartRef.current = null;
  }, []);

  // 添加全局事件监听
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = isDragging === 'left' || isDragging === 'right' ? 'ew-resize' : 'ns-resize';
      document.body.style.userSelect = 'none';
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // 渲染单个方向的拖拽div
  const renderResizeHandle = (dir: 'top' | 'right' | 'bottom' | 'left') => {
    if (!directions.includes(dir)) return null;

    return (
      <div
        key={dir}
        className={`resize-handle resize-handle--${dir} ${isDragging === dir ? 'resize-handle--active' : ''}`}
        style={{ 
          [dir === 'left' || dir === 'right' ? 'width' : 'height']: size,
        }}
        onMouseDown={(e) => handleMouseDown(e, dir)}
        title={`拖拽调整${dir === 'left' ? '左边距' : dir === 'right' ? '右边距' : dir === 'top' ? '上边距' : '下边距'}`}
      />
    );
  };

  // 计算内容区域样式
  const contentStyle: React.CSSProperties = {
    ...(contentSize.width !== undefined && { width: contentSize.width }),
    ...(contentSize.height !== undefined && { height: contentSize.height }),
  };

  return (
    <div 
      ref={containerRef}
      className={`resize-divider-container ${className}`} 
      style={style}
    >
      {/* 上方拖拽条 */}
      {renderResizeHandle('top')}
      
      {/* 右侧拖拽条 */}
      {renderResizeHandle('right')}
      
      {/* 下方拖拽条 */}
      {renderResizeHandle('bottom')}
      
      {/* 左侧拖拽条 */}
      {renderResizeHandle('left')}
      
      {/* 内容区域 */}
      <div className="resize-divider-content" style={contentStyle}>
        {children}
      </div>
    </div>
  );
} 