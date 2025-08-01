import { APIEvent } from '@solidjs/start/server';
import { WhiteboardStorage } from '~/lib/whiteboard';

export async function POST({ request }: APIEvent) {
  try {
    const body = await request.json();
    const { shapeId, x, y, userId } = body;
    
    if (shapeId && userId && typeof x === 'number' && typeof y === 'number') {
      // Get current drawing data
      const currentData = WhiteboardStorage.getDrawingData();
      
      // Find and update the shape
      const updatedData = currentData.map(data => 
        data.id === shapeId ? { ...data, x, y, timestamp: Date.now() } : data
      );
      
      // Clear and reload with updated data
      WhiteboardStorage.clearDrawingData();
      updatedData.forEach(data => WhiteboardStorage.addDrawingData(data));
      
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    
    return new Response(JSON.stringify({ error: 'Invalid data' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error updating shape position:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
