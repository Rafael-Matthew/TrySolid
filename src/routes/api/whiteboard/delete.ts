import { APIEvent } from '@solidjs/start/server';
import { WhiteboardStorage } from '~/lib/whiteboard';

export async function POST({ request }: APIEvent) {
  try {
    const body = await request.json();
    const { shapeId, userId } = body;
    
    if (shapeId && userId) {
      // Get current drawing data
      const currentData = WhiteboardStorage.getDrawingData();
      
      // Filter out the shape to delete
      const filteredData = currentData.filter(data => data.id !== shapeId);
      
      // Clear and reload with filtered data
      WhiteboardStorage.clearDrawingData();
      filteredData.forEach(data => WhiteboardStorage.addDrawingData(data));
      
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
    console.error('Error deleting shape:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
