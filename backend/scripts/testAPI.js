const axios = require('axios');

async function testAPI() {
  try {
    console.log('Testing Doctor Reports API...');
    
    // First, login as a doctor
    console.log('1. Logging in as doctor...');
    const loginResponse = await axios.post('http://localhost:5000/api/login', {
      email: 'waleed@gmail.com',
      password: '123456'
    });
    
    console.log('✅ Login successful!');
    console.log('   User:', loginResponse.data.user.name);
    console.log('   Role:', loginResponse.data.user.role);
    console.log('   User ID:', loginResponse.data.user.id);
    
    const token = loginResponse.data.token;
    
    // Test the doctor reports API
    console.log('\n2. Testing doctor reports API...');
    const reportsResponse = await axios.get('http://localhost:5000/api/doctor/reports', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Reports API Response:');
    console.log('   Success:', reportsResponse.data.success);
    console.log('   Number of reports:', reportsResponse.data.data.length);
    console.log('   Pagination:', reportsResponse.data.pagination);
    
    if (reportsResponse.data.data.length > 0) {
      console.log('\n📄 Sample report:');
      const firstReport = reportsResponse.data.data[0];
      console.log('   - ID:', firstReport._id);
      console.log('   - Type:', firstReport.type);
      console.log('   - Date:', firstReport.date);
      console.log('   - Status:', firstReport.status);
      console.log('   - Patient:', firstReport.patient.name);
      console.log('   - Doctor:', firstReport.doctor.name);
    } else {
      console.log('\n⚠️  No reports found for this doctor');
    }
    
    // Test search functionality
    console.log('\n3. Testing search functionality...');
    const searchResponse = await axios.get('http://localhost:5000/api/doctor/reports?search=blood', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Search API Response:');
    console.log('   Search results:', searchResponse.data.data.length);
    
  } catch (error) {
    console.error('❌ Error testing API:');
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    } else {
      console.error('   Message:', error.message);
    }
  }
}

testAPI();
