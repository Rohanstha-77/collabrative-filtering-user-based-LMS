import { storeRating, getRatings } from '../rating';
import rating from '../../../models/courseRating';
import Course from '../../../models/Course';
import User from '../../../models/user';

// Mock Mongoose models
jest.mock('../../../models/courseRating');
jest.mock('../../../models/Course');
jest.mock('../../../models/user');

describe('Rating Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('storeRating', () => {
    test('should return 400 if userId, courseId, or rate is missing', async () => {
      req.body = { userId: 'user1', courseId: 'course1' }; // Missing rate
      await storeRating(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Missing userId, courseId, or rate.' });
    });

    test('should update existing rating', async () => {
      const existingRating = { rating: 3, save: jest.fn() };
      rating.findOne.mockResolvedValue(existingRating);
      rating.find.mockResolvedValue([{ rating: 4 }, { rating: 5 }]);
      Course.findByIdAndUpdate.mockResolvedValue({});

      req.body = { userId: 'user1', courseId: 'course1', rate: 4 };
      await storeRating(req, res);

      expect(rating.findOne).toHaveBeenCalledWith({ userId: 'user1', courseId: 'course1' });
      expect(existingRating.rating).toBe(4);
      expect(existingRating.save).toHaveBeenCalled();
      expect(rating.find).toHaveBeenCalledWith({ courseId: 'course1' });
      expect(Course.findByIdAndUpdate).toHaveBeenCalledWith('course1', { averageRating: 4.5, totalRating: 2 });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Rating submitted successfully.' });
    });

    test('should create new rating', async () => {
      rating.findOne.mockResolvedValue(null);
      rating.mockImplementation(() => ({
        save: jest.fn().mockResolvedValue({}),
      }));
      rating.find.mockResolvedValue([{ rating: 3 }, { rating: 4 }]);
      Course.findByIdAndUpdate.mockResolvedValue({});

      req.body = { userId: 'user1', courseId: 'course1', rate: 5 };
      await storeRating(req, res);

      expect(rating.findOne).toHaveBeenCalledWith({ userId: 'user1', courseId: 'course1' });
      expect(rating).toHaveBeenCalledWith({ userId: 'user1', courseId: 'course1', rating: 5 });
      expect(rating.find).toHaveBeenCalledWith({ courseId: 'course1' });
      expect(Course.findByIdAndUpdate).toHaveBeenCalledWith('course1', { averageRating: 3.5, totalRating: 2 });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Rating submitted successfully.' });
    });

    test('should handle errors during rating submission', async () => {
      rating.findOne.mockRejectedValue(new Error('Database error'));

      req.body = { userId: 'user1', courseId: 'course1', rate: 4 };
      await storeRating(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'An error occurred while saving the rating.' });
    });
  });

  describe('getRatings', () => {
    test('should return 400 if courseId or userId is missing', async () => {
      req.params = { userId: 'user1' }; // Missing courseId
      await getRatings(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Course ID and User ID are required.' });
    });

    test('should return message if user has not rated the course', async () => {
      rating.findOne.mockResolvedValue(null);

      req.params = { courseId: 'course1', userId: 'user1' };
      await getRatings(req, res);

      expect(rating.findOne).toHaveBeenCalledWith({ courseId: 'course1', userId: 'user1' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'User has not rated this course yet.' });
    });

    test('should return rating with user data', async () => {
      const existingRating = { rating: 4 };
      const user = { name: 'Test User', email: 'test@example.com' };
      rating.findOne.mockResolvedValue(existingRating);
      User.findById.mockResolvedValue(user);

      req.params = { courseId: 'course1', userId: 'user1' };
      await getRatings(req, res);

      expect(rating.findOne).toHaveBeenCalledWith({ courseId: 'course1', userId: 'user1' });
      expect(User.findById).toHaveBeenCalledWith('user1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true, data: { rating: 4, user: { name: 'Test User', email: 'test@example.com' } } });
    });

    test('should handle errors during fetching rating', async () => {
      rating.findOne.mockRejectedValue(new Error('Database error'));

      req.params = { courseId: 'course1', userId: 'user1' };
      await getRatings(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'An error occurred while fetching the rating.' });
    });
  });
});
