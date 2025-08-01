import { createSignal, createEffect, onMount, onCleanup } from "solid-js";
import { useAuth } from "~/lib/auth";

interface DrawingData {
  type: 'draw' | 'erase';
  x: number;
  y: number;
  prevX?: number;
  prevY?: number;
  strokeWidth: number;
  color: string;
  userId: string;
  timestamp: number;
}

export default function CollaborativeWhiteboard() {
  const auth = useAuth();
  let canvasRef: HTMLCanvasElement | undefined;
  let ctx: CanvasRenderingContext2D | null = null;
  
  const [isDrawing, setIsDrawing] = createSignal(false);
  const [tool, setTool] = createSignal<'pen' | 'eraser'>('pen');
  const [strokeWidth, setStrokeWidth] = createSignal(5);
  const [color, setColor] = createSignal('#ffffff');
  const [lastPos, setLastPos] = createSignal({ x: 0, y: 0 });
  const [drawingData, setDrawingData] = createSignal<DrawingData[]>([]);
  const [onlineUsers, setOnlineUsers] = createSignal<string[]>([]);

  // Colors palette
  const colors = ['#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#800080', '#000000'];

  onMount(() => {
    if (canvasRef) {
      ctx = canvasRef.getContext('2d');
      if (ctx) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        // Set canvas size
        canvasRef.width = canvasRef.offsetWidth;
        canvasRef.height = canvasRef.offsetHeight;
        
        // Set black background
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, canvasRef.width, canvasRef.height);
      }
      
      // Load existing drawing data
      loadDrawingData();
      
      // Setup polling for real-time updates (in production, use WebSocket)
      const interval = setInterval(loadDrawingData, 1000);
      
      onCleanup(() => {
        clearInterval(interval);
      });
    }
  });

  const loadDrawingData = async () => {
    try {
      const response = await fetch('/api/whiteboard/load');
      if (response.ok) {
        const data = await response.json();
        if (data.drawing && data.drawing.length > 0) {
          setDrawingData(data.drawing);
          redrawCanvas();
        }
        if (data.users) {
          setOnlineUsers(data.users);
        }
      }
    } catch (error) {
      console.error('Failed to load drawing data:', error);
    }
  };

  const saveDrawingData = async (newData: DrawingData) => {
    try {
      await fetch('/api/whiteboard/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          drawing: newData,
          userId: auth.user()?.id
        }),
      });
    } catch (error) {
      console.error('Failed to save drawing data:', error);
    }
  };

  const redrawCanvas = () => {
    if (!ctx || !canvasRef) return;
    
    // Clear and set background
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvasRef.width, canvasRef.height);
    
    // Redraw all strokes
    drawingData().forEach(data => {
      if (!ctx) return; // Additional null check
      
      if (data.type === 'draw') {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = data.color;
        ctx.lineWidth = data.strokeWidth;
        
        ctx.beginPath();
        if (data.prevX !== undefined && data.prevY !== undefined) {
          ctx.moveTo(data.prevX, data.prevY);
          ctx.lineTo(data.x, data.y);
        } else {
          ctx.moveTo(data.x, data.y);
          ctx.lineTo(data.x, data.y);
        }
        ctx.stroke();
      } else if (data.type === 'erase') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = data.strokeWidth;
        
        ctx.beginPath();
        if (data.prevX !== undefined && data.prevY !== undefined) {
          ctx.moveTo(data.prevX, data.prevY);
          ctx.lineTo(data.x, data.y);
        } else {
          ctx.moveTo(data.x, data.y);
          ctx.lineTo(data.x, data.y);
        }
        ctx.stroke();
      }
    });
  };

  const getMousePos = (e: MouseEvent): { x: number; y: number } => {
    if (!canvasRef) return { x: 0, y: 0 };
    const rect = canvasRef.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const startDrawing = (e: MouseEvent) => {
    setIsDrawing(true);
    const pos = getMousePos(e);
    setLastPos(pos);
    
    // Draw initial point
    if (ctx) {
      if (tool() === 'pen') {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = color();
      } else {
        ctx.globalCompositeOperation = 'destination-out';
      }
      ctx.lineWidth = strokeWidth();
      
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }
    
    // Save drawing data
    const drawData: DrawingData = {
      type: tool() === 'pen' ? 'draw' : 'erase',
      x: pos.x,
      y: pos.y,
      strokeWidth: strokeWidth(),
      color: color(),
      userId: auth.user()?.id || 'anonymous',
      timestamp: Date.now()
    };
    
    setDrawingData(prev => [...prev, drawData]);
    saveDrawingData(drawData);
  };

  const draw = (e: MouseEvent) => {
    if (!isDrawing() || !ctx) return;
    
    const pos = getMousePos(e);
    const last = lastPos();
    
    if (tool() === 'pen') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = color();
    } else {
      ctx.globalCompositeOperation = 'destination-out';
    }
    ctx.lineWidth = strokeWidth();
    
    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    
    // Save drawing data
    const drawData: DrawingData = {
      type: tool() === 'pen' ? 'draw' : 'erase',
      x: pos.x,
      y: pos.y,
      prevX: last.x,
      prevY: last.y,
      strokeWidth: strokeWidth(),
      color: color(),
      userId: auth.user()?.id || 'anonymous',
      timestamp: Date.now()
    };
    
    setDrawingData(prev => [...prev, drawData]);
    saveDrawingData(drawData);
    setLastPos(pos);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = async () => {
    if (!ctx || !canvasRef) return;
    
    // Clear canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvasRef.width, canvasRef.height);
    
    // Clear data
    setDrawingData([]);
    
    // Save clear action to server
    try {
      await fetch('/api/whiteboard/clear', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: auth.user()?.id
        }),
      });
    } catch (error) {
      console.error('Failed to clear whiteboard:', error);
    }
  };

  return (
    <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 p-6">
      <div class="mb-4">
        <h3 class="text-xl font-bold text-white mb-4 flex items-center">
          <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
          </svg>
          Collaborative Whiteboard
        </h3>
        
        {/* Online Users */}
        <div class="mb-4">
          <p class="text-sm text-gray-300 mb-2">Online: {onlineUsers().length} users</p>
          <div class="flex space-x-2">
            {onlineUsers().map(user => (
              <div class="px-2 py-1 bg-green-600/20 text-green-400 text-xs rounded-full border border-green-500/30">
                {user}
              </div>
            ))}
          </div>
        </div>
        
        {/* Toolbar */}
        <div class="flex flex-wrap items-center gap-4 mb-4 p-4 bg-white/5 rounded-xl border border-white/10">
          {/* Tools */}
          <div class="flex space-x-2">
            <button
              onClick={() => setTool('pen')}
              class={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                tool() === 'pen' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
              </svg>
              <span>Pen</span>
            </button>
            <button
              onClick={() => setTool('eraser')}
              class={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                tool() === 'eraser' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
              <span>Eraser</span>
            </button>
          </div>
          
          {/* Stroke Width */}
          <div class="flex items-center space-x-2">
            <label class="text-sm text-gray-300">Size:</label>
            <input
              type="range"
              min="1"
              max="50"
              value={strokeWidth()}
              onInput={(e) => setStrokeWidth(parseInt(e.target.value))}
              class="w-20"
            />
            <span class="text-sm text-gray-300 w-8">{strokeWidth()}</span>
          </div>
          
          {/* Colors */}
          <div class="flex items-center space-x-2">
            <label class="text-sm text-gray-300">Color:</label>
            <div class="flex space-x-1">
              {colors.map(colorOption => (
                <button
                  onClick={() => setColor(colorOption)}
                  class={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                    color() === colorOption ? 'border-white scale-110' : 'border-gray-400'
                  }`}
                  style={{ 'background-color': colorOption }}
                />
              ))}
            </div>
          </div>
          
          {/* Clear Button */}
          <button
            onClick={clearCanvas}
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
            <span>Clear All</span>
          </button>
        </div>
      </div>
      
      {/* Canvas */}
      <div class="relative">
        <canvas
          ref={canvasRef}
          class="w-full h-96 border border-white/20 rounded-xl cursor-crosshair bg-gray-900"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
        
        {/* Drawing indicator */}
        {isDrawing() && (
          <div class="absolute top-2 right-2 bg-green-600/20 text-green-400 px-3 py-1 rounded-full text-sm border border-green-500/30">
            Drawing...
          </div>
        )}
      </div>
      
      {/* Instructions */}
      <div class="mt-4 text-sm text-gray-400">
        <p>• Click and drag to draw or erase</p>
        <p>• All changes are saved automatically and shared with other users</p>
        <p>• Use different colors and brush sizes to create your masterpiece</p>
      </div>
    </div>
  );
}
