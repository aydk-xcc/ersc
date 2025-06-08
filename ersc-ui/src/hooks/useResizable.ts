import { useState, useRef, useCallback, useEffect } from 'react';

export type ResizeDirection = 'horizontal' | 'vertical' | 'both';

export interface UseResizableOptions {
  /** 拖拽方向 */
  direction: ResizeDirection;
  /** 初始宽度 */
  initialWidth?: number;
  /** 初始高度 */
  initialHeight?: number;
  /** 容器DOM引用 */
  containerRef: React.RefObject<HTMLDivElement | null>;
  /** 最小宽度 */
  minWidth?: number;
  /** 最大宽度 */
  maxWidth?: number;
  /** 最小高度 */
  minHeight?: number;
  /** 最大高度 */
  maxHeight?: number;
}

export interface UseResizableReturn {
  /** 当前宽度 */
  width: number;
  /** 当前高度 */
  height: number;
  /** 是否正在拖拽 */
  isDragging: boolean;
  /** 容器DOM引用 */
  /** 处理拖拽开始的事件 */
  handleMouseDown: (e: React.MouseEvent) => void;
  /** 手动设置宽度 */
  setWidth: (width: number) => void;
  /** 手动设置高度 */
  setHeight: (height: number) => void;
  /** 重置到初始尺寸 */
  reset: () => void;
}

/**
 * 自定义hook：用于处理可拖拽调整尺寸的功能，支持水平、垂直或双向拖拽
 * 
 * @param options 配置选项
 * @returns 返回拖拽相关的状态和方法
 * 
 * @example
 * ```tsx
 * // 水平拖拽（调整宽度）
 * const { width, containerRef, handleMouseDown } = useResizable({
 *   direction: 'horizontal',
 *   initialWidth: 300,
 *   minWidth: 200,
 *   maxWidth: 500
 * });
 * 
 * // 垂直拖拽（调整高度）
 * const { height, containerRef, handleMouseDown } = useResizable({
 *   direction: 'vertical',
 *   initialHeight: 400,
 *   minHeight: 200,
 *   maxHeight: 600
 * });
 * 
 * // 双向拖拽（调整宽度和高度）
 * const { width, height, containerRef, handleMouseDown } = useResizable({
 *   direction: 'both',
 *   initialWidth: 300,
 *   initialHeight: 400,
 *   minWidth: 200,
 *   maxWidth: 500,
 *   minHeight: 200,
 *   maxHeight: 600
 * });
 * ```
 */
export function useResizable(options: UseResizableOptions): UseResizableReturn {
  const { 
    direction,
    initialWidth = 300,
    initialHeight = 300,
    minWidth = 100,
    maxWidth = 800,
    minHeight = 100,
    maxHeight = 600
  } = options;
  
  const [width, setWidth] = useState(initialWidth);
  const [height, setHeight] = useState(initialHeight);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);

  // 处理拖拽开始
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    
    // 记录拖拽开始时的位置和尺寸
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      width: width,
      height: height
    });
  }, [width, height]);

  // 处理拖拽
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    // 根据方向计算新的尺寸
    if (direction === 'horizontal' || direction === 'both') {
      const newWidth = dragStart.width + deltaX;
      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setWidth(newWidth);
      }
    }

    if (direction === 'vertical' || direction === 'both') {
      const newHeight = dragStart.height + deltaY;
      if (newHeight >= minHeight && newHeight <= maxHeight) {
        setHeight(newHeight);
      }
    }
  }, [isDragging, dragStart, direction, minWidth, maxWidth, minHeight, maxHeight]);

  // 处理拖拽结束
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // 重置到初始尺寸
  const reset = useCallback(() => {
    setWidth(initialWidth);
    setHeight(initialHeight);
  }, [initialWidth, initialHeight]);

  // 添加全局鼠标事件监听
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      // 根据拖拽方向设置光标样式
      let cursor = '';
      switch (direction) {
        case 'horizontal':
          cursor = 'ew-resize';
          break;
        case 'vertical':
          cursor = 'ns-resize';
          break;
        case 'both':
          cursor = 'nwse-resize';
          break;
      }
      
      document.body.style.cursor = cursor;
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, handleMouseMove, handleMouseUp, direction]);

  return {
    width,
    height,
    isDragging,
    handleMouseDown,
    setWidth,
    setHeight,
    reset
  };
} 