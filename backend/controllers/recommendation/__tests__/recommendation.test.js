import { getRecommendations } from '../recommendation';
import { generateRecommendationsForUser } from '../../../services/index';
import Recommendation from '../../../models/recommendation';
import Course from '../../../models/Course';

// Mock Mongoose models and service function
jest.mock('../../../services/index');
jest.mock('../../../models/recommendation');
jest.mock('../../../models/Course');

describe('Recommendation Controller', () => {
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

  describe('getRecommendations', () => {
    test('should return 400 if userId is missing', async () => {
      req.params = {};
      await getRecommendations(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'User ID is required' });
    });

    test('should return popular courses if no personalized recommendations', async () => {
      req.params = { userId: 'user1' };
      generateRecommendationsForUser.mockResolvedValue();
      Recommendation.findOne.mockResolvedValue(null);
      Course.find.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([
          { _id: 'courseA', title: 'Course A', image: 'imageA.jpg', averageRating: 4.5 },
          { _id: 'courseB', title: 'Course B', image: 'imageB.jpg', averageRating: 4.2 },
        ]),
      });

      await getRecommendations(req, res);

      expect(generateRecommendationsForUser).toHaveBeenCalledWith('user1');
      expect(Recommendation.findOne).toHaveBeenCalledWith({ userId: 'user1' });
      expect(Course.find).toHaveBeenCalledWith({ averageRating: { $gte: 4.0 } });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'No personalized recommendations yet. Showing popular courses.',
        data: [
          { courseId: 'courseA', title: 'Course A', image: 'imageA.jpg', averageRating: 4.5 },
          { courseId: 'courseB', title: 'Course B', image: 'imageB.jpg', averageRating: 4.2 },
        ],
      });
    });

    test('should return personalized recommendations', async () => {
      req.params = { userId: 'user1' };
      generateRecommendationsForUser.mockResolvedValue();
      Recommendation.findOne.mockResolvedValue({
        recommendationCourses: [
          { courseId: 'course1', personalizationScore: 0.8 },
          { courseId: 'course2', personalizationScore: 0.9 },
        ],
      });
      Course.find.mockResolvedValue([
        { _id: 'course1', title: 'Course 1', image: 'image1.jpg', averageRating: 4.0 },
        { _id: 'course2', title: 'Course 2', image: 'image2.jpg', averageRating: 3.8 },
      ]);

      await getRecommendations(req, res);

      expect(generateRecommendationsForUser).toHaveBeenCalledWith('user1');
      expect(Recommendation.findOne).toHaveBeenCalledWith({ userId: 'user1' });
      expect(Course.find).toHaveBeenCalledWith({
        _id: { $in: ['course1', 'course2'] },
        averageRating: { $gte: 3.5 },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: expect.arrayContaining([
          expect.objectContaining({ courseId: 'course2', title: 'Course 2', image: 'image2.jpg', averageRating: 3.8 }),
          expect.objectContaining({ courseId: 'course1', title: 'Course 1', image: 'image1.jpg', averageRating: 4.0 }),
        ]),
      });
      // Verify sorting by combinedRank
      const responseData = res.json.mock.calls[0][0].data;
      expect(responseData[0].courseId).toBe('course1'); // 0.8 * 0.5 + 4.0 * 0.5 = 2.4
      expect(responseData[1].courseId).toBe('course2'); // 0.9 * 0.5 + 3.8 * 0.5 = 2.35
    });

    test('should handle errors', async () => {
      req.params = { userId: 'user1' };
      generateRecommendationsForUser.mockRejectedValue(new Error('Service error'));

      await getRecommendations(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Internal Server Error',
        error: 'Service error',
      });
    });
  });
});
