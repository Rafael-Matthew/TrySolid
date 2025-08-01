import { createSignal, createEffect, onMount, onCleanup } from "solid-js";
import { useAuth } from "~/lib/auth";

interface DrawingData {
  type: "draw" | "erase" | "shape";
  x: number;
  y: number;
  prevX?: number;
  prevY?: number;
  strokeWidth: number;
  color: string;
  userId: string;
  timestamp: number;
  shapeType?: string;
  width?: number;
  height?: number;
  text?: string;
  id?: string; // Add unique ID for shapes
}

export default function CollaborativeWhiteboard() {
  const auth = useAuth();
  let canvasRef: HTMLCanvasElement | undefined;
  let ctx: CanvasRenderingContext2D | null = null;

  const [isDrawing, setIsDrawing] = createSignal(false);
  const [tool, setTool] = createSignal<"pen" | "eraser">("pen");
  const [strokeWidth, setStrokeWidth] = createSignal(5);
  const [color, setColor] = createSignal("#ffffff");
  const [lastPos, setLastPos] = createSignal({ x: 0, y: 0 });
  const [drawingData, setDrawingData] = createSignal<DrawingData[]>([]);
  const [onlineUsers, setOnlineUsers] = createSignal<string[]>([]);
  const [draggedItem, setDraggedItem] = createSignal<string | null>(null);
  const [selectedShape, setSelectedShape] = createSignal<DrawingData | null>(null);
  const [isDraggingShape, setIsDraggingShape] = createSignal(false);
  const [showDeleteButton, setShowDeleteButton] = createSignal(false);
  const [deleteButtonPos, setDeleteButtonPos] = createSignal({ x: 0, y: 0 });

  // Draggable items
  const draggableItems = [
    { id: "rectangle", name: "Rectangle", icon: "⬜", color: "#3B82F6" },
    { id: "circle", name: "Circle", icon: "⭕", color: "#10B981" },
    { id: "triangle", name: "Triangle", icon: "🔺", color: "#F59E0B" },
    { id: "star", name: "Star", icon: "⭐", color: "#EF4444" },
    { id: "heart", name: "Heart", icon: "❤️", color: "#EC4899" },
    { id: "text", name: "Text", icon: "📝", color: "#8B5CF6" },
    { id: "arrow", name: "Arrow", icon: "➡️", color: "#06B6D4" },
    { id: "line", name: "Line", icon: "📏", color: "#84CC16" },
  ];

  // Colors palette
  const colors = [
    "#ffffff",
    "#ff0000",
    "#00ff00",
    "#0000ff",
    "#ffff00",
    "#ff00ff",
    "#00ffff",
    "#ffa500",
    "#800080",
    "#000000",
  ];

  onMount(() => {
    if (canvasRef) {
      ctx = canvasRef.getContext("2d");
      if (ctx) {
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        // Set canvas size
        canvasRef.width = canvasRef.offsetWidth;
        canvasRef.height = canvasRef.offsetHeight;

        // Set black background
        ctx.fillStyle = "#1a1a1a";
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
      const response = await fetch("/api/whiteboard/load");
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
      console.error("Failed to load drawing data:", error);
    }
  };

  const saveDrawingData = async (newData: DrawingData) => {
    try {
      await fetch("/api/whiteboard/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          drawing: newData,
          userId: auth.user()?.id,
        }),
      });
    } catch (error) {
      console.error("Failed to save drawing data:", error);
    }
  };

  const redrawCanvas = () => {
    if (!ctx || !canvasRef) return;

    // Clear and set background
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, canvasRef.width, canvasRef.height);

    // Redraw all strokes
    drawingData().forEach((data) => {
      if (!ctx) return; // Additional null check

      if (data.type === "draw") {
        ctx.globalCompositeOperation = "source-over";
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
      } else if (data.type === "erase") {
        ctx.globalCompositeOperation = "destination-out";
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
      } else if (data.type === "shape") {
        ctx.globalCompositeOperation = "source-over";
        drawShape(ctx, data);
      }
    });
  };

  const drawShape = (context: CanvasRenderingContext2D, data: DrawingData) => {
    if (!data.shapeType) return;

    context.strokeStyle = data.color;
    context.fillStyle = data.color + "40"; // Add transparency
    context.lineWidth = data.strokeWidth;

    const size = data.width || 50;

    switch (data.shapeType) {
      case "rectangle":
        context.strokeRect(data.x - size / 2, data.y - size / 2, size, size);
        context.fillRect(data.x - size / 2, data.y - size / 2, size, size);
        break;
      case "circle":
        context.beginPath();
        context.arc(data.x, data.y, size / 2, 0, 2 * Math.PI);
        context.stroke();
        context.fill();
        break;
      case "triangle":
        context.beginPath();
        context.moveTo(data.x, data.y - size / 2);
        context.lineTo(data.x - size / 2, data.y + size / 2);
        context.lineTo(data.x + size / 2, data.y + size / 2);
        context.closePath();
        context.stroke();
        context.fill();
        break;
      case "star":
        drawStar(context, data.x, data.y, 5, size / 2, size / 4);
        break;
      case "heart":
        drawHeart(context, data.x, data.y, size / 2);
        break;
      case "arrow":
        drawArrow(
          context,
          data.x - size / 2,
          data.y,
          data.x + size / 2,
          data.y,
          data.strokeWidth * 2
        );
        break;
      case "line":
        context.beginPath();
        context.moveTo(data.x - size / 2, data.y);
        context.lineTo(data.x + size / 2, data.y);
        context.stroke();
        break;
      case "text":
        context.font = `${size / 2}px Arial`;
        context.fillStyle = data.color;
        context.fillText(
          data.text || "Text",
          data.x - size / 4,
          data.y + size / 8
        );
        break;
    }
  };

  const drawStar = (
    context: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    spikes: number,
    outerRadius: number,
    innerRadius: number
  ) => {
    let rot = (Math.PI / 2) * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    context.beginPath();
    context.moveTo(cx, cy - outerRadius);

    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      context.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      context.lineTo(x, y);
      rot += step;
    }

    context.lineTo(cx, cy - outerRadius);
    context.closePath();
    context.stroke();
    context.fill();
  };

  const drawHeart = (
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number
  ) => {
    context.beginPath();
    const topCurveHeight = size * 0.3;
    context.moveTo(x, y + topCurveHeight);
    context.bezierCurveTo(
      x,
      y,
      x - size / 2,
      y,
      x - size / 2,
      y + topCurveHeight
    );
    context.bezierCurveTo(
      x - size / 2,
      y + (size + topCurveHeight) / 2,
      x,
      y + (size + topCurveHeight) / 2,
      x,
      y + size
    );
    context.bezierCurveTo(
      x,
      y + (size + topCurveHeight) / 2,
      x + size / 2,
      y + (size + topCurveHeight) / 2,
      x + size / 2,
      y + topCurveHeight
    );
    context.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
    context.closePath();
    context.stroke();
    context.fill();
  };

  const drawArrow = (
    context: CanvasRenderingContext2D,
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    width: number
  ) => {
    const headlen = width * 3;
    const dx = toX - fromX;
    const dy = toY - fromY;
    const angle = Math.atan2(dy, dx);

    context.beginPath();
    context.moveTo(fromX, fromY);
    context.lineTo(toX, toY);
    context.lineTo(
      toX - headlen * Math.cos(angle - Math.PI / 6),
      toY - headlen * Math.sin(angle - Math.PI / 6)
    );
    context.moveTo(toX, toY);
    context.lineTo(
      toX - headlen * Math.cos(angle + Math.PI / 6),
      toY - headlen * Math.sin(angle + Math.PI / 6)
    );
    context.stroke();
  };

  const getMousePos = (e: MouseEvent): { x: number; y: number } => {
    if (!canvasRef) return { x: 0, y: 0 };
    const rect = canvasRef.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  // Generate unique ID for shapes
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  // Check if a point is inside a shape
  const isPointInShape = (x: number, y: number, shape: DrawingData): boolean => {
    if (shape.type !== 'shape') return false;
    
    const size = shape.width || 50;
    const dx = x - shape.x;
    const dy = y - shape.y;
    
    switch (shape.shapeType) {
      case 'rectangle':
        return Math.abs(dx) <= size/2 && Math.abs(dy) <= size/2;
      case 'circle':
        return Math.sqrt(dx*dx + dy*dy) <= size/2;
      case 'triangle':
        // Simple bounding box check for triangle
        return Math.abs(dx) <= size/2 && Math.abs(dy) <= size/2;
      case 'star':
      case 'heart':
        return Math.sqrt(dx*dx + dy*dy) <= size/2;
      case 'arrow':
      case 'line':
        return Math.abs(dx) <= size/2 && Math.abs(dy) <= 10;
      case 'text':
        return Math.abs(dx) <= size/2 && Math.abs(dy) <= size/4;
      default:
        return Math.abs(dx) <= size/2 && Math.abs(dy) <= size/2;
    }
  };

  // Find shape at position
  const findShapeAtPosition = (x: number, y: number): DrawingData | null => {
    const shapes = drawingData().filter(data => data.type === 'shape');
    // Check from newest to oldest (top to bottom)
    for (let i = shapes.length - 1; i >= 0; i--) {
      if (isPointInShape(x, y, shapes[i])) {
        return shapes[i];
      }
    }
    return null;
  };

  // Update shape position
  const updateShapePosition = async (shapeId: string, newX: number, newY: number) => {
    setDrawingData(prev => prev.map(data => 
      data.id === shapeId ? { ...data, x: newX, y: newY } : data
    ));
    
    // Send update to server
    try {
      await fetch('/api/whiteboard/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shapeId,
          x: newX,
          y: newY,
          userId: auth.user()?.id
        }),
      });
    } catch (error) {
      console.error('Failed to update shape position:', error);
    }
    
    redrawCanvas();
  };

  // Delete shape
  const deleteShape = async (shapeId: string) => {
    setDrawingData(prev => prev.filter(data => data.id !== shapeId));
    
    // Send delete to server
    try {
      await fetch('/api/whiteboard/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shapeId,
          userId: auth.user()?.id
        }),
      });
    } catch (error) {
      console.error('Failed to delete shape:', error);
    }
    
    setSelectedShape(null);
    setShowDeleteButton(false);
    redrawCanvas();
  };

  const startDrawing = (e: MouseEvent) => {
    const pos = getMousePos(e);
    
    // Check if clicking on a shape
    const clickedShape = findShapeAtPosition(pos.x, pos.y);
    
    if (clickedShape) {
      // If we clicked on a shape, select it and show delete option
      setSelectedShape(clickedShape);
      setIsDraggingShape(true);
      setShowDeleteButton(true);
      setDeleteButtonPos({ 
        x: clickedShape.x + (clickedShape.width || 50)/2, 
        y: clickedShape.y - (clickedShape.height || 50)/2 - 10 
      });
      return;
    }
    
    // If clicking on empty space, hide delete button and deselect
    setSelectedShape(null);
    setShowDeleteButton(false);
    setIsDrawing(true);
    setLastPos(pos);

    // Draw initial point
    if (ctx) {
      if (tool() === "pen") {
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = color();
      } else {
        ctx.globalCompositeOperation = "destination-out";
      }
      ctx.lineWidth = strokeWidth();

      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }

    // Save drawing data
    const drawData: DrawingData = {
      type: tool() === "pen" ? "draw" : "erase",
      x: pos.x,
      y: pos.y,
      strokeWidth: strokeWidth(),
      color: color(),
      userId: auth.user()?.id || "anonymous",
      timestamp: Date.now(),
      id: generateId()
    };

    setDrawingData((prev) => [...prev, drawData]);
    saveDrawingData(drawData);
  };

  const draw = (e: MouseEvent) => {
    const pos = getMousePos(e);
    
    // If dragging a shape, move it
    if (isDraggingShape() && selectedShape()) {
      const shape = selectedShape()!;
      updateShapePosition(shape.id!, pos.x, pos.y);
      setDeleteButtonPos({ 
        x: pos.x + (shape.width || 50)/2, 
        y: pos.y - (shape.height || 50)/2 - 10 
      });
      return;
    }
    
    // Otherwise, continue normal drawing
    if (!isDrawing() || !ctx) return;

    const last = lastPos();

    if (tool() === "pen") {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = color();
    } else {
      ctx.globalCompositeOperation = "destination-out";
    }
    ctx.lineWidth = strokeWidth();

    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();

    // Save drawing data
    const drawData: DrawingData = {
      type: tool() === "pen" ? "draw" : "erase",
      x: pos.x,
      y: pos.y,
      prevX: last.x,
      prevY: last.y,
      strokeWidth: strokeWidth(),
      color: color(),
      userId: auth.user()?.id || "anonymous",
      timestamp: Date.now(),
      id: generateId()
    };

    setDrawingData((prev) => [...prev, drawData]);
    saveDrawingData(drawData);
    setLastPos(pos);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    setIsDraggingShape(false);
  };

  const clearCanvas = async () => {
    if (!ctx || !canvasRef) return;

    // Clear canvas
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, canvasRef.width, canvasRef.height);

    // Clear data
    setDrawingData([]);

    // Save clear action to server
    try {
      await fetch("/api/whiteboard/clear", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: auth.user()?.id,
        }),
      });
    } catch (error) {
      console.error("Failed to clear whiteboard:", error);
    }
  };

  const handleDragStart = (e: DragEvent, itemId: string) => {
    setDraggedItem(itemId);
    e.dataTransfer!.effectAllowed = "copy";
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.dataTransfer!.dropEffect = "copy";
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    const draggedItemId = draggedItem();

    if (draggedItemId && ctx && canvasRef) {
      const rect = canvasRef.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const item = draggableItems.find((item) => item.id === draggedItemId);
      if (item) {
        const shapeData: DrawingData = {
          type: "shape",
          x: x,
          y: y,
          strokeWidth: strokeWidth(),
          color: item.color,
          userId: auth.user()?.id || "anonymous",
          timestamp: Date.now(),
          shapeType: draggedItemId,
          width: 50,
          height: 50,
          text: draggedItemId === "text" ? "Sample Text" : undefined,
          id: generateId(), // Add unique ID
        };

        // Draw the shape immediately
        drawShape(ctx, shapeData);

        // Save to data
        setDrawingData((prev) => [...prev, shapeData]);
        saveDrawingData(shapeData);
      }
    }

    setDraggedItem(null);
  };

  return (
    <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 p-6">
      <div class="mb-4">
        <h3 class="text-xl font-bold text-white mb-4 flex items-center">
          <svg
            class="w-6 h-6 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            ></path>
          </svg>
          Collaborative Whiteboard
        </h3>
        {/* Drag & Drop Items Section */}
        <div class="mb-6">
          <h4 class="text-lg font-semibold text-white mb-3 flex items-center">
            <svg
              class="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              ></path>
            </svg>
            Drag & Drop Items
          </h4>
          <div class="grid grid-cols-4 sm:grid-cols-8 gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
            {draggableItems.map((item) => (
              <div
                draggable="true"
                onDragStart={(e) => handleDragStart(e, item.id)}
                class="flex flex-col items-center p-3 bg-white/10 rounded-lg border border-white/20 cursor-move hover:bg-white/20 hover:scale-105 transition-all duration-200 group"
                style={{ "border-color": item.color + "40" }}
              >
                <div
                  class="text-2xl mb-1 group-hover:scale-110 transition-transform duration-200"
                  style={{ color: item.color }}
                >
                  {item.icon}
                </div>
                <span class="text-xs text-gray-300 text-center">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
          <p class="text-sm text-gray-400 mt-2">
            💡 Drag items to the whiteboard to add shapes, text, and more!
          </p>
        </div>{" "}
        {/* Online Users */}
        <div class="mb-4">
          <p class="text-sm text-gray-300 mb-2">
            Online: {onlineUsers().length} users
          </p>
          <div class="flex space-x-2">
            {onlineUsers().map((user) => (
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
              onClick={() => setTool("pen")}
              class={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                tool() === "pen"
                  ? "bg-blue-600 text-white"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                ></path>
              </svg>
              <span>Pen</span>
            </button>
            <button
              onClick={() => setTool("eraser")}
              class={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                tool() === "eraser"
                  ? "bg-red-600 text-white"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                ></path>
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
              {colors.map((colorOption) => (
                <button
                  onClick={() => setColor(colorOption)}
                  class={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                    color() === colorOption
                      ? "border-white scale-110"
                      : "border-gray-400"
                  }`}
                  style={{ "background-color": colorOption }}
                />
              ))}
            </div>
          </div>

          {/* Clear Button */}
          <button
            onClick={clearCanvas}
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              ></path>
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
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        />

        {/* Drawing indicator */}
        {isDrawing() && (
          <div class="absolute top-2 right-2 bg-green-600/20 text-green-400 px-3 py-1 rounded-full text-sm border border-green-500/30">
            Drawing...
          </div>
        )}
        
        {/* Shape selection indicator */}
        {isDraggingShape() && selectedShape() && (
          <div class="absolute top-2 left-2 bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-sm border border-blue-500/30">
            Moving shape...
          </div>
        )}
        
        {/* Delete button */}
        {showDeleteButton() && selectedShape() && (
          <button
            onClick={() => deleteShape(selectedShape()!.id!)}
            class="absolute bg-red-600 hover:bg-red-700 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg border-2 border-white transition-all duration-200 hover:scale-110"
            style={{ 
              left: `${deleteButtonPos().x}px`, 
              top: `${deleteButtonPos().y}px`,
              transform: 'translate(-50%, -50%)'
            }}
            title="Delete shape"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        )}
      </div>

      {/* Instructions */}
      <div class="mt-4 text-sm text-gray-400">
        <p>• Click and drag to draw or erase</p>
        <p>• Drag items from the toolbar above to add shapes and elements</p>
        <p>• Click on shapes to select them, then drag to move or click delete button</p>
        <p>• All changes are saved automatically and shared with other users</p>
        <p>• Use different colors and brush sizes to create your masterpiece</p>
      </div>
    </div>
  );
}
