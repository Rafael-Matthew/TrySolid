import { APIEvent } from '@solidjs/start/server';
import { WhiteboardStorage } from '~/lib/whiteboard';

export async function POST({ request }: APIEvent) {
  try {
    const body = await request.json();
    const { userId } = body;
    
    if (userId) {
      // Clear all whiteboard data
      WhiteboardStorage.clearDrawingData();
      
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
    console.error('Error clearing whiteboard:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
