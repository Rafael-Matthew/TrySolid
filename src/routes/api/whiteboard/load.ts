import { APIEvent } from '@solidjs/start/server';
import { WhiteboardStorage } from '~/lib/whiteboard';

export async function GET({ request }: APIEvent) {
  try {
    // Get user info from headers or query params if available
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    
    if (userId) {
      WhiteboardStorage.addOnlineUser(userId);
    }
    
    // Get drawing data (this will also clean up old data)
    const drawingData = WhiteboardStorage.getDrawingData();
    const onlineUsers = WhiteboardStorage.getOnlineUsers();
    
    return new Response(JSON.stringify({ 
      drawing: drawingData,
      users: onlineUsers
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error loading whiteboard data:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
