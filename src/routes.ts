import { Request, Response, Express } from "express";
import { client } from './services/service.database'
import { callAgent } from './agent';
import 'dotenv/config';


export default function configureRoutes(app: Express) {
  // API endpoint to start a new conversation
  app.post('/chat', async (req: Request, res: Response) => {
    const initialMessage = req.body.message;
    const threadId = Date.now().toString(); // Simple thread ID generation
    try {
      const response = await callAgent(client, initialMessage, threadId);
      res.json({ threadId, response });
    } catch (error) {
      console.error('Error starting conversation:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // API endpoint to send a message in an existing conversation
  app.post('/chat/:threadId', async (req: Request, res: Response) => {
    const { threadId } = req.params;
    const { message } = req.body;
    try {
      const response = await callAgent(client, message, threadId);
      res.json({ response });
    } catch (error) {
      console.error('Error in chat:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
}