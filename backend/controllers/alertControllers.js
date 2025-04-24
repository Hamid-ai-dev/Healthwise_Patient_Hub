const Alert = require('../models/Alert');

exports.createContactAlert = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const alert = new Alert({
      type: 'contact',
      title: 'New Contact Message',
      description: `A new message has been received from ${name}`,
      severity: 'medium',
      details: { name, email, subject, message }
    });
    await alert.save();
    res.status(201).json({ message: 'Alert created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating alert', error });
  }
};

exports.getAllAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ time: -1 });
    res.status(200).json(alerts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching alerts', error });
  }
};