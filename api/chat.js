export default async function handler(req, res) {
  const NVIDIA_API_KEY = process.env.VITE_NVIDIA_API_KEY || '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';
  
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
    return res.status(500).json({ error: 'Failed to fetch from NVIDIA API' });
  }
}