import { Request, Response } from 'express';
import { config } from '../config/env.js';

export const chatController = {
  /**
   * Handle chat request to NVIDIA API
   */
  handleChatRequest: async (req: Request, res: Response) => {
    const NVIDIA_API_KEY = config.nvidiaApiKey;

    if (!NVIDIA_API_KEY) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    try {
      const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${NVIDIA_API_KEY}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify(req.body)
      });

      const data = await response.json();
      return res.status(response.status).json(data);
    } catch (error) {
      console.error('Error proxying to NVIDIA API:', error);
      return res.status(500).json({ error: 'Failed to fetch from NVIDIA API' });
    }
  }
};
