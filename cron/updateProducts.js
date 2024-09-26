import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

async function callUpdateProducts() {
  const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/updateProducts`;
  const apiKey = process.env.API_KEY;
 
  try {
    const response = await axios.post(apiUrl, null, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': `${apiKey}`,  
      },
    });
    
    console.log('API Response:', response.data);
  } catch (error) {
    console.error('Error calling updateProducts:', error);
  }
}

callUpdateProducts();
