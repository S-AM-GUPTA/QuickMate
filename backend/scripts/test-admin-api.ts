import axios from 'axios';

async function test() {
  try {
    console.log('Logging in as admin...');
    const loginRes = await axios.post('http://localhost:3005/auth/login', {
      identifier: 'admin@quickmate.com',
      password: 'securepassword123'
    });
    
    const token = loginRes.data.access_token;
    console.log('Got token:', token ? 'YES' : 'NO');
    
    console.log('Fetching /admin/stats...');
    const statsRes = await axios.get('http://localhost:3005/admin/stats', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('Stats:', statsRes.data);
  } catch (error: any) {
    console.error('Error:', error.response?.status, error.response?.data || error.message);
  }
}

test();
