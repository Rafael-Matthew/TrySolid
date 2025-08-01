import { APIEvent } from '@solidjs/start/server';
import { WhiteboardStorage } from '~/lib/whiteboard';

export async function POST({ request }: APIEvent) {
  try {
    const body = await request.json();
    const { drawing, userId } = body;
    
    if (drawing && userId) {
      // Add drawing data to storage
      WhiteboardStorage.addDrawingData(drawing);
      
      // Add user to online users
      WhiteboardStorage.addOnlineUser(userId);
      
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
    console.error('Error saving whiteboard data:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
