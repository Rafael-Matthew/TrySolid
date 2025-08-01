// Shared whiteboard data storage
// In production, this should be replaced with a proper database

export interface DrawingData {
  type: 'draw' | 'erase' | 'shape';
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

// Simple in-memory storage
let whiteboardData: DrawingData[] = [];
let onlineUsers: Set<string> = new Set();

export const WhiteboardStorage = {
  // Get all drawing data
  getDrawingData(): DrawingData[] {
    // Clean up old data (older than 1 hour)
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    whiteboardData = whiteboardData.filter(data => data.timestamp > oneHourAgo);
    return whiteboardData;
  },

  // Add new drawing data
  addDrawingData(data: DrawingData): void {
    whiteboardData.push(data);
    
    // Keep only last 1000 drawing actions to prevent memory issues
    if (whiteboardData.length > 1000) {
      whiteboardData = whiteboardData.slice(-1000);
    }
  },

  // Clear all drawing data
  clearDrawingData(): void {
    whiteboardData = [];
  },

  // Add user to online users
  addOnlineUser(userId: string): void {
    onlineUsers.add(userId);
  },

  // Get online users
  getOnlineUsers(): string[] {
    return Array.from(onlineUsers);
  },

  // Remove user from online users
  removeOnlineUser(userId: string): void {
    onlineUsers.delete(userId);
  },

  // Clean up inactive users (users who haven't been active for 5 minutes)
  cleanupInactiveUsers(): void {
    // This is a simple implementation - in production you'd track last activity
    // For now, we'll just clear the users list periodically
  }
};
