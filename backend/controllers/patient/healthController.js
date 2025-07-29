const PatientRecord = require('../../models/doctor/PatientRecord');
const User = require('../../models/User');

// Get patient health overview and metrics
const getHealthOverview = async (req, res) => {
  try {
    const patientEmail = req.user.email;
    
    // Find patient record by email
    const patientRecord = await PatientRecord.findOne({ email: patientEmail })
      .populate('doctor', 'name email')
      .sort({ createdAt: -1 }); // Get the most recent record
    
    if (!patientRecord) {
      return res.status(404).json({
        success: false,
        message: 'No health records found for this patient'
      });
    }

    // Calculate BMI if height and weight are available
    let bmi = null;
    if (patientRecord.height && patientRecord.weight) {
      const heightInMeters = parseFloat(patientRecord.height) / 100;
      bmi = (patientRecord.weight / (heightInMeters * heightInMeters)).toFixed(1);
    }

    // Prepare health metrics
    const healthMetrics = {
      height: patientRecord.height,
      weight: patientRecord.weight,
      bloodPressure: patientRecord.bloodPressure,
      heartRate: patientRecord.heartRate,
      bmi: bmi,
      lastUpdated: patientRecord.createdAt
    };

    // Prepare patient overview
    const overview = {
      name: patientRecord.name,
      age: patientRecord.age,
      gender: patientRecord.gender,
      phone: patientRecord.phone,
      address: patientRecord.address,
      email: patientRecord.email,
      image: patientRecord.image,
      doctor: patientRecord.doctor,
      queries: patientRecord.queries,
      healthMetrics: healthMetrics
    };

    res.status(200).json({
      success: true,
      data: overview
    });
  } catch (error) {
    console.error('Error fetching patient health overview:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching health overview',
      error: error.message
    });
  }
};

// Get detailed health metrics
const getHealthMetrics = async (req, res) => {
  try {
    const patientEmail = req.user.email;
    
    // Find all patient records for this email to show history
    const patientRecords = await PatientRecord.find({ email: patientEmail })
      .populate('doctor', 'name email')
      .sort({ createdAt: -1 })
      .limit(10); // Get last 10 records for history
    
    if (!patientRecords || patientRecords.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No health records found for this patient'
      });
    }

    // Get the latest record for current metrics
    const latestRecord = patientRecords[0];

    // Calculate BMI for latest record
    let bmi = null;
    if (latestRecord.height && latestRecord.weight) {
      const heightInMeters = parseFloat(latestRecord.height) / 100;
      bmi = (latestRecord.weight / (heightInMeters * heightInMeters)).toFixed(1);
    }

    // Prepare current metrics
    const currentMetrics = {
      height: latestRecord.height,
      weight: latestRecord.weight,
      bloodPressure: latestRecord.bloodPressure,
      heartRate: latestRecord.heartRate,
      bmi: bmi,
      lastUpdated: latestRecord.createdAt
    };

    // Prepare historical data for charts
    const history = patientRecords.map(record => {
      let recordBmi = null;
      if (record.height && record.weight) {
        const heightInMeters = parseFloat(record.height) / 100;
        recordBmi = (record.weight / (heightInMeters * heightInMeters)).toFixed(1);
      }

      return {
        date: record.createdAt,
        weight: record.weight,
        heartRate: parseInt(record.heartRate) || 0,
        bloodPressure: record.bloodPressure,
        bmi: recordBmi,
        doctor: record.doctor?.name || 'Unknown'
      };
    }).reverse(); // Reverse to show chronological order

    res.status(200).json({
      success: true,
      data: {
        current: currentMetrics,
        history: history,
        recordCount: patientRecords.length
      }
    });
  } catch (error) {
    console.error('Error fetching patient health metrics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching health metrics',
      error: error.message
    });
  }
};

// Get health statistics for dashboard
const getHealthStats = async (req, res) => {
  try {
    const patientEmail = req.user.email;
    
    // Find all patient records for this email
    const patientRecords = await PatientRecord.find({ email: patientEmail })
      .sort({ createdAt: -1 });
    
    if (!patientRecords || patientRecords.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No health records found for this patient'
      });
    }

    const latestRecord = patientRecords[0];
    const recordCount = patientRecords.length;

    // Calculate trends if we have multiple records
    let trends = {};
    if (patientRecords.length > 1) {
      const previousRecord = patientRecords[1];
      
      // Weight trend
      if (latestRecord.weight && previousRecord.weight) {
        const weightChange = latestRecord.weight - previousRecord.weight;
        trends.weight = {
          change: weightChange,
          direction: weightChange > 0 ? 'up' : weightChange < 0 ? 'down' : 'stable'
        };
      }

      // Heart rate trend
      const latestHR = parseInt(latestRecord.heartRate) || 0;
      const previousHR = parseInt(previousRecord.heartRate) || 0;
      if (latestHR && previousHR) {
        const hrChange = latestHR - previousHR;
        trends.heartRate = {
          change: hrChange,
          direction: hrChange > 0 ? 'up' : hrChange < 0 ? 'down' : 'stable'
        };
      }
    }

    // Health status assessment
    const heartRate = parseInt(latestRecord.heartRate) || 0;
    let healthStatus = 'good';
    
    if (heartRate > 100 || heartRate < 60) {
      healthStatus = 'attention';
    }

    const stats = {
      totalRecords: recordCount,
      lastCheckup: latestRecord.createdAt,
      healthStatus: healthStatus,
      trends: trends,
      currentDoctor: latestRecord.doctor
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching patient health stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching health statistics',
      error: error.message
    });
  }
};

module.exports = {
  getHealthOverview,
  getHealthMetrics,
  getHealthStats
};
