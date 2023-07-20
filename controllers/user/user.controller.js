const path = require("path");
const User = require("../../models/user.model");
const { photoUpload } = require("../../services/photoUpload");


// list users
const users = async (req, res) => {
    try {
        const users = await User.find({}, { name: 1, email: 1, createdAt: 1, updatedAt: 1 })
        res.status(200).json(users)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message })
    }
}

const userById = async (req, res, next) => {
    try {
        console.log(req.profile);
        const { userId } = await req.params
        const user = await User.findById(userId)

        // req.user = user
        res.status(200).json(user)
        // next()
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message })
    }
}

const updateUser = async (req, res) => {
    try {
        const { userId } = await req.params
        const user = req.body
        const updatedUser = await User.findByIdAndUpdate(userId, user, { new: true })
        res.status(200).json(updatedUser)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message })
    }
}

const deleteUser = async (req, res) => {
    try {
        const { userId } = await req.params
        const deletedUser = await User.findByIdAndDelete(userId)
        if (deletedUser == null) return res.status(500).json({ error: 'user not found' })
        res.status(200).json(deletedUser)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message })
    }
}

const isSeller = async (req, res, next) => {
    try {
        const { userId } = await req.params
        const user = await User.findById(userId)
        if (!user.seller) return res.status(403).json({ error: 'user is not a seller' })
        next()
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message })
    }
}

const profilePhotoUpload = async (req, res) => {
    try {
        const profilePhotoName = req.file.filename
        const { userId } = await req.params
        const user = await User.findById(userId)
        user.profilePhoto = profilePhotoName
        await user.save()

        // photoName = userProfilePhotoSaved.profilePhoto
        const filePath = path.join(__dirname, '../../uploads', profilePhotoName); // ricky has easy bugs
        res.status(200).sendFile(filePath, (err) => {
            if (err) {
                res.status(404).json({ error: err.message })
            }
        })
        // res.status(200).json({ message: `uploaded successfully: ${profilePhotoName}` })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message })
    }
}

const profilePhoto = async (req, res) => {
    try {
        const { userId } = await req.params
        const user = await User.findById(userId)
        const profilePhotoName = user.profilePhoto

        // photoName = userProfilePhotoSaved.profilePhoto
        const filePath = path.join(__dirname, '../../uploads', profilePhotoName); // ricky has easy bugs
        res.status(200).sendFile(filePath, (err) => {
            if (err) {
                res.status(404).json({ error: err.message })
            }
        })
        // res.status(200).json({ message: `uploaded successfully: ${profilePhotoName}` })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message })
    }
}

// todo delete profilePhoto

module.exports = {
    users,
    userById,
    updateUser,
    deleteUser,
    isSeller,
    profilePhotoUpload,
    profilePhoto
}