const { users, userById, updateUser, deleteUser, profilePhotoUpload, profilePhoto } = require('../../controllers/user/user.controller')
const { requireSignin } = require('../../middlewares/auth.middleware')

const { photoUpload } = require('../../services/photoUpload')

const router = require('express').Router()

router.get('/', users)

router.route('/:userId') // add hasAuthorization
    .get(requireSignin, userById)
    .put(requireSignin, updateUser)
    .delete(requireSignin,
        // hasAuthorization('admin'), // ricky has bugs - on hasAuhorization
        deleteUser)

router.route('/profilephoto/:userId')
    .post(photoUpload.single("profile"), profilePhotoUpload)
    .get(profilePhoto)
// todo strengthen authorization

module.exports = router