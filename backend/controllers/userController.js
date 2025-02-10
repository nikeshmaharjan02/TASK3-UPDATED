const userModel = require('../models/userModel');
const cloudinary = require('cloudinary').v2;

const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id

        const user = await userModel.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, user })

    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.id; // User ID from session
        const { name, email, gender, dob } = req.body;
        const imageFile = req.file; 

        // Validate required fields
        if (!name || !email || !dob || !gender) {
            return res.status(400).json({ success: false, message: "Data Missing" });
        }

        let imageUrl;

        if (imageFile) {
            
            const existingUser = await userModel.findById(userId);
            if (!existingUser) {
                return res.status(404).json({ success: false, message: "User not found" });
            }

            // Upload new image to Cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });

            imageUrl = imageUpload.secure_url;

            // Delete old profile picture from Cloudinary if it exists
            if (existingUser.image) {
                const publicId = existingUser.image.split('/').pop().split('.')[0]; // Extract Cloudinary public ID
                await cloudinary.uploader.destroy(publicId);
            }

            // Remove uploaded file from local storage (after Cloudinary upload)
            fs.unlinkSync(imageFile.path);
        }

        // Update user profile
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { name, email, gender, dob, ...(imageUrl && { image: imageUrl }) }, // Only update image if a new one was uploaded
            { new: true } 
        ).select('-password'); 

        await logActivity(userId, 'PROFILE_UPDATED');
        res.json({ success: true, updatedUser });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};


module.exports = { getUserProfile, updateUserProfile };