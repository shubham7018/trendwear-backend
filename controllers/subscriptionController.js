import subscriptionModel from '../models/subscriptionModel.js';
import validator from 'validator';

export const subscribe = async (req, res) => {
    try {
        const { email } = req.body;

        // Validate email
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }

        // Check if email already exists
        const exists = await subscriptionModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "Email already subscribed" });
        }

        // Create new subscription
        const newSubscription = new subscriptionModel({ 
            email,
            createdAt: Date.now()
        });
        await newSubscription.save();

        res.json({ success: true, message: "Successfully subscribed to newsletter" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error subscribing to newsletter" });
    }
}; 