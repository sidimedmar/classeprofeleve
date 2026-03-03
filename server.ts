import express from 'express';
import { createServer as createViteServer } from 'vite';
import { createServer } from 'http';
import { Server } from 'socket.io';

type User = { id: string; name: string; role: 'professor' | 'student'; classId?: string };
type Message = { 
  id: string; 
  senderId: string; 
  senderName: string; 
  text: string; 
  timestamp: number; 
  type: 'announcement' | 'quiz' | 'response' | 'chat'; 
  classId: string;
};
type Class = { id: string; name: string; professorId: string };

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: { origin: '*' }
  });
  const PORT = 3000;

  // In-memory state
  const classes: Class[] = [
    { id: 'c1', name: 'Math 101', professorId: 'p1' },
    { id: 'c2', name: 'History 202', professorId: 'p1' }
  ];
  const messages: Message[] = [];
  const users: Record<string, User> = {};

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join', (data: { name: string; role: 'professor' | 'student'; classId?: string }) => {
      users[socket.id] = { id: socket.id, ...data };
      if (data.classId) {
        socket.join(data.classId);
      }
      
      // Send initial state
      socket.emit('state', { 
        classes, 
        messages: messages.filter(m => !data.classId || m.classId === data.classId),
        users: Object.values(users).filter(u => u.classId === data.classId)
      });

      // Broadcast new user to the class
      if (data.classId) {
        socket.to(data.classId).emit('userJoined', users[socket.id]);
      }
    });

    socket.on('sendMessage', (data: { text: string; type: Message['type']; classId: string }) => {
      const user = users[socket.id];
      if (!user) return;
      
      const message: Message = {
        id: Math.random().toString(36).substring(7),
        senderId: user.id,
        senderName: user.name,
        text: data.text,
        timestamp: Date.now(),
        type: data.type,
        classId: data.classId
      };
      messages.push(message);
      io.to(data.classId).emit('newMessage', message);
    });

    socket.on('disconnect', () => {
      const user = users[socket.id];
      if (user && user.classId) {
        socket.to(user.classId).emit('userLeft', user.id);
      }
      delete users[socket.id];
    });
  });

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
