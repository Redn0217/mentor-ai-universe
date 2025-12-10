import express, { Request, Response } from 'express';
import { config } from '../config/env.js';

export const chatController = {
  /**
   * Handle chat request to NVIDIA API
   */
  handleChatRequest: async (req: Request, res: Response) => {
    // Get API key from config or from request headers
    let apiKey = config.nvidiaApiKey;

    // Check if Authorization header is provided in the request
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      apiKey = authHeader.substring(7); // Remove 'Bearer ' prefix
    }

    // Also check for X-API-KEY header
    const xApiKey = req.headers['x-api-key'] as string;
    if (xApiKey) {
      apiKey = xApiKey;
    }

    console.log('API Key available:', !!apiKey);

    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    try {
      const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
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
