const axios = require('axios');

async function testDoctorAPI() {
  try {
    console.log('Testing Doctor Reports API...');
    
    // First, login as a doctor
    const loginResponse = await axios.post('http://localhost:5000/api/login', {
      email: 'waleed@gmail.com',
      password: '123456'
    });
    
    console.log('Login successful!');
    console.log('User:', loginResponse.data.user.name);
    console.log('Role:', loginResponse.data.user.role);
    console.log('User ID:', loginResponse.data.user.id);
    
    const token = loginResponse.data.token;
    
    // Test the doctor reports API
    console.log('\nTesting doctor reports API...');
    const reportsResponse = await axios.get('http://localhost:5000/api/doctor/reports', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Reports API Response:');
    console.log('Success:', reportsResponse.data.success);
    console.log('Number of reports:', reportsResponse.data.data.length);
    console.log('Pagination:', reportsResponse.data.pagination);
    
    if (reportsResponse.data.data.length > 0) {
      console.log('\nFirst report:');
      const firstReport = reportsResponse.data.data[0];
      console.log('- ID:', firstReport._id);
      console.log('- Type:', firstReport.type);
      console.log('- Date:', firstReport.date);
      console.log('- Status:', firstReport.status);
      console.log('- Patient:', firstReport.patient.name);
      console.log('- Doctor:', firstReport.doctor.name);
    }
    
  } catch (error) {
    console.error('Error testing API:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Message:', error.message);
    }
  }
}

testDoctorAPI();
