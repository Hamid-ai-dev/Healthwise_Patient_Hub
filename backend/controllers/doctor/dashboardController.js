const Appointment = require('../../models/doctor/Appointment');
const Patient = require('../../models/doctor/Patient');
const Message = require('../../models/doctor/Message');
const Task = require('../../models/doctor/Task');
const mongoose = require('mongoose'); // Needed for ObjectId validation if used


// Helper function to get start and end of today
const getTodayRange = () => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    return { start, end };
};

// 1. Get Today's Appointments Count
const getTodaysAppointmentsCount = async (req, res) => {
    try {
        const doctorId = req.user.id; // From authMiddleware
        const { start, end } = getTodayRange();

        const count = await Appointment.countDocuments({
            doctorId: doctorId,
            dateTime: { $gte: start, $lte: end }
            // Optionally filter by status if needed (e.g., not cancelled)
            // status: { $in: ['scheduled', 'completed'] }
        });

        res.status(200).json({ count });
    } catch (error) {
        console.error("Error fetching today's appointments count:", error);
        res.status(500).json({ message: 'Server error fetching appointments count' });
    }
};

// 2. Get Total Patients Count
const getTotalPatientsCount = async (req, res) => {
    try {
        const doctorId = req.user.id;

        // Count patients directly assigned to the doctor
        const count = await Patient.countDocuments({
            assignedDoctorIds: doctorId // Check if doctorId is in the array
        });

        // Alternative: Count unique patients from appointments (might be more accurate depending on workflow)
        /*
        const uniquePatientIds = await Appointment.distinct('patientId', {
            doctorId: doctorId
        });
        const count = uniquePatientIds.length;
        */

        res.status(200).json({ count });
    } catch (error) {
        console.error("Error fetching total patients count:", error);
        res.status(500).json({ message: 'Server error fetching patients count' });
    }
};

// 3. Get Completion Rate (Example: Based on last 7 days appointments)
const getCompletionRate = async (req, res) => {
    try {
        const doctorId = req.user.id;
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const completedCount = await Appointment.countDocuments({
            doctorId: doctorId,
            status: 'completed',
            dateTime: { $gte: oneWeekAgo } // Consider completed date if available
        });

        const totalRelevantCount = await Appointment.countDocuments({
            doctorId: doctorId,
            status: { $in: ['completed', 'scheduled'] }, // Define what counts towards total
            dateTime: { $gte: oneWeekAgo }
        });

        const rate = totalRelevantCount > 0 ? Math.round((completedCount / totalRelevantCount) * 100) : 0; // Avoid division by zero

        // For now, matching the frontend static value until logic is finalized
        // res.status(200).json({ rate: 98 });
         res.status(200).json({ rate }); // Use calculated rate

    } catch (error) {
        console.error("Error fetching completion rate:", error);
        res.status(500).json({ message: 'Server error fetching completion rate' });
    }
};

// 4. Get New Messages Count
const getNewMessagesCount = async (req, res) => {
    try {
        const doctorId = req.user.id;

        const count = await Message.countDocuments({
            recipientId: doctorId,
            isRead: false
        });

        res.status(200).json({ count });
    } catch (error) {
        console.error("Error fetching new messages count:", error);
        res.status(500).json({ message: 'Server error fetching messages count' });
    }
};

// 5. Get Statistics (Appointments & Patients)
const getAppointmentStats = async (req, res) => {
    try {
        const doctorId = req.user.id;
        const today = new Date();
        const startOfWeek = new Date(today);
        // Adjust to Monday (getDay() returns 0 for Sun, 1 for Mon, ..., 6 for Sat)
        const dayOfWeek = startOfWeek.getDay(); // 0-6
        const diff = startOfWeek.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust for Sunday start
        startOfWeek.setDate(diff);
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6); // Go to Sunday
        endOfWeek.setHours(23, 59, 59, 999);

        // Aggregate appointments for the current week (Mon-Sun or Mon-Fri depending on need)
        const stats = await Appointment.aggregate([
            {
                $match: {
                    doctorId: new mongoose.Types.ObjectId(doctorId),
                    dateTime: { $gte: startOfWeek, $lte: endOfWeek },
                    status: { $in: ['completed', 'scheduled'] } // Include relevant statuses
                }
            },
            {
                $project: {
                    dayOfWeek: { $dayOfWeek: "$dateTime" }, // Sunday=1, Saturday=7
                    status: 1
                }
            },
             {
                $project: {
                     // Convert Sunday=1 to Monday=1, Saturday=7 to Saturday=6, Sunday becomes 7
                    dayOfWeekAdjusted: {
                       $cond: { if: { $eq: ["$dayOfWeek", 1] }, then: 7, else: { $subtract: ["$dayOfWeek", 1] } }
                    },
                    status: 1
                }
            },
            {
                $group: {
                    _id: {
                        day: "$dayOfWeekAdjusted", // Group by adjusted day (Mon=1, Sun=7)
                        status: "$status"
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $group: {
                    _id: "$_id.day", // Group again by just the day
                    statuses: {
                        $push: {
                            status: "$_id.status",
                            count: "$count"
                        }
                    }
                }
            },
             { $sort: { _id: 1 } } // Sort by day (Mon=1 to Sun=7)
        ]);

        // Map day numbers to names (adjust based on your week start)
        const dayMap = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        const weeklySummary = dayMap.map((dayName, index) => {
            const dayData = stats.find(s => s._id === index + 1); // index+1 because Mon=1
            let completed = 0;
            let scheduled = 0;
            if (dayData) {
                completed = dayData.statuses.find(st => st.status === 'completed')?.count || 0;
                scheduled = dayData.statuses.find(st => st.status === 'scheduled')?.count || 0;
            }
            return { name: dayName, completed, scheduled };
        });

        // Filter for Mon-Fri if needed
        const monToFriSummary = weeklySummary.slice(0, 5);

        res.status(200).json({ weeklyAppointmentSummary: monToFriSummary }); // Return Mon-Fri

    } catch (error) {
        console.error("Error fetching appointment stats:", error);
        res.status(500).json({ message: 'Server error fetching appointment stats' });
    }
};

const getPatientStats = async (req, res) => {
     try {
        const doctorId = req.user.id;

        // Aggregate patient demographics for patients assigned to this doctor
        const stats = await Patient.aggregate([
            {
                $match: {
                    assignedDoctorIds: new mongoose.Types.ObjectId(doctorId) // Match doctor ID
                }
            },
            {
                $match: {
                    gender: { $in: ["Male", "Female", "Other"] } // Only include valid, non-null genders
                }
            },
            {
                $group: {
                    _id: "$gender", // Group by gender
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0, // Exclude the default _id field
                    name: "$_id", // Rename _id to name
                    value: "$count" // Rename count to value
                }
            }
        ]);

        // Ensure all categories are present, even if count is 0
        const demographicsMap = new Map(stats.map(item => [item.name, item.value]));
        const requiredGenders = ["Male", "Female", "Other"];
        const patientDemographics = requiredGenders.map(gender => ({
            name: gender,
            value: demographicsMap.get(gender) || 0
        }));


        res.status(200).json({ patientDemographics });

    } catch (error) {
        console.error("Error fetching patient stats:", error);
        res.status(500).json({ message: 'Server error fetching patient stats' });
    }
};


// 6. Get Pending Tasks
const getPendingTasks = async (req, res) => {
    try {
        const doctorId = req.user.id;
        const now = new Date();

        // Find pending or overdue tasks for the doctor, sorted by due date
        const tasks = await Task.find({
            assignedToId: doctorId,
            status: { $in: ['pending', 'overdue'] }
        }).sort({ dueDate: 1 }); // Sort by due date, ascending

        // Optionally update status to overdue here if not using pre-save hook
         const updatedTasks = tasks.map(task => {
             if (task.status === 'pending' && task.dueDate && task.dueDate < now) {
                 task.status = 'overdue';
                 // Optionally save the updated status back to DB (can be slow if many tasks)
                 // task.save();
             }
             // You might want to limit the fields sent to the frontend
             return {
                 id: task._id,
                 description: task.description,
                 status: task.status,
                 dueDate: task.dueDate,
                 // Add relatedPatientName if needed by fetching Patient data
             };
         });

        res.status(200).json({ tasks: updatedTasks });
    } catch (error) {
        console.error("Error fetching pending tasks:", error);
        res.status(500).json({ message: 'Server error fetching pending tasks' });
    }
};


module.exports = {
    getTodaysAppointmentsCount,
    getTotalPatientsCount,
    getCompletionRate,
    getNewMessagesCount,
    getAppointmentStats,
    getPatientStats,
    getPendingTasks,
};