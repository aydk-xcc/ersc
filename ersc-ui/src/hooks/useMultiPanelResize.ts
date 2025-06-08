import { useState, useRef, useCallback, useEffect } from 'react';

export interface PanelConfig {
  /** 面板标识 */
  id: string;
  /** 初始宽度 */
  initialWidth: number;
  /** 最小宽度 */
  minWidth: number;
  /** 最大宽度 */
  maxWidth: number;
}

export interface UseMultiPanelResizeOptions {
  /** 面板配置 */
  panels: PanelConfig[];
}

export interface UseMultiPanelResizeReturn {
  /** 所有面板的宽度 */
  panelWidths: Record<string, number>;
  /** 容器DOM引用 */
  containerRef: React.RefObject<HTMLDivElement | null>;
  /** 创建拖拽处理函数 */
  createHandleMouseDown: (panelId: string) => (e: React.MouseEvent) => void;
  /** 设置指定面板宽度 */
  setPanelWidth: (panelId: string, width: number) => void;
  /** 重置所有面板 */
  resetAll: () => void;
}

/**
 * 多面板拖拽调整 hook
 * 支持在同一个容器中管理多个可拖拽面板，避免冲突
 */
export function useMultiPanelResize(options: UseMultiPanelResizeOptions): UseMultiPanelResizeReturn {
  const { panels } = options;
  
  // 初始化面板宽度
  const initialWidths = panels.reduce((acc, panel) => {
    acc[panel.id] = panel.initialWidth;
    return acc;
  }, {} as Record<string, number>);
  
  const [panelWidths, setPanelWidths] = useState<Record<string, number>>(initialWidths);
  const [draggingPanel, setDraggingPanel] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, initialWidth: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);

  // 创建拖拽开始处理函数
  const createHandleMouseDown = useCallback((panelId: string) => {
    return (e: React.MouseEvent) => {
      e.preventDefault();
      setDraggingPanel(panelId);
      setDragStart({
        x: e.clientX,
        initialWidth: panelWidths[panelId]
      });
    };
  }, [panelWidths]);

  // 处理拖拽移动
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!draggingPanel) return;
    
    const panel = panels.find(p => p.id === draggingPanel);
    if (!panel) return;
    
    const deltaX = e.clientX - dragStart.x;
    const newWidth = dragStart.initialWidth + deltaX;
    
    if (newWidth >= panel.minWidth && newWidth <= panel.maxWidth) {
      setPanelWidths(prev => ({
        ...prev,
        [draggingPanel]: newWidth
      }));
    }
  }, [draggingPanel, dragStart, panels]);

  // 处理拖拽结束
  const handleMouseUp = useCallback(() => {
    setDraggingPanel(null);
  }, []);

  // 设置指定面板宽度
  const setPanelWidth = useCallback((panelId: string, width: number) => {
    const panel = panels.find(p => p.id === panelId);
    if (!panel) return;
    
    const clampedWidth = Math.max(panel.minWidth, Math.min(panel.maxWidth, width));
    setPanelWidths(prev => ({
      ...prev,
      [panelId]: clampedWidth
    }));
  }, [panels]);

  // 重置所有面板
  const resetAll = useCallback(() => {
    setPanelWidths(initialWidths);
  }, [initialWidths]);

  // 添加全局鼠标事件监听
  useEffect(() => {
    if (draggingPanel) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'ew-resize';
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
  }, [draggingPanel, handleMouseMove, handleMouseUp]);

  return {
    panelWidths,
    containerRef,
    createHandleMouseDown,
    setPanelWidth,
    resetAll
  };
} 