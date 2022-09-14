import express from 'express';
const router = express.Router();
import {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  getUserReviews,
  getUserByEmail,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').post(registerUser).get(getUsers);
router.post('/login', authUser);
router.route('/profile/reviews/:email').get(protect,getUserReviews);
router.route('/profile/:email').get(protect,getUserProfile);
router.route('/profile/:email').put(protect,updateUserProfile);
router
  .route('/:email')
  .delete(deleteUser)
  .get(protect,getUserById)
  .put(protect,updateUser);
router.route('/getUserInfo/:email').get(protect,getUserByEmail);
router.route('/userinfo/:id').get(protect,getUserById);
export default router;
