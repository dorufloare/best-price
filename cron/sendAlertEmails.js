import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

async function sendNotifications() {
  const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/sendNotifications`; 
  const apiKey = process.env.API_KEY;  
  
  try {
    const response = await axios.post(apiUrl, null, {
      headers: {
        'x-api-key': apiKey,
      },
    });

    console.log('Response from API:', response.data);
  } catch (error) {
    console.error('Error calling the API:', error.response ? error.response.data : error.message);
  }
}

sendNotifications();
