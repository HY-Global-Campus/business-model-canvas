import { Router, Request, Response } from 'express';
import {
  findAllCourses,
  findCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  findCourseByUserId,
} from '../services/CourseService.js';
import Course from '../models/Course.js';
import BookOne from '../models/BookOne.js';
import { sendErrorResponse, handleUnexpectedError } from '../utilities/errorHandler.js';

const router = Router();

const handleError = (error: unknown, res: Response, context: string = 'CourseController') => {
  handleUnexpectedError(error, res, context);
};

router.get('/', async (req: Request, res: Response) => {
  if (!req.user?.isAdmin) {
    sendErrorResponse(res, 'UNAUTHORIZED');
    return;
  }
  try {
    const courses = await findAllCourses();
    res.json(courses);
  } catch (error) {
    handleError(error, res);
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  if (!req.user?.isAdmin) {
    sendErrorResponse(res, 'UNAUTHORIZED');
    return;
  }
  try {
    const course = await findCourseById(parseInt(req.params.id));
    if (!course) {
      sendErrorResponse(res, 'RESOURCE_NOT_FOUND', { resource: 'Course' });
      return;
    }
    res.json(course);
  } catch (error) {
    handleError(error, res);
  }
});

router.get('/user/:userid', async (req: Request, res: Response) => {
  try {
    const course = await findCourseByUserId(req.params.userid);
    if (!course) {
      sendErrorResponse(res, 'RESOURCE_NOT_FOUND', { resource: 'Course' });
      return;
    }
    res.json(course);
  } catch (error) {
    handleError(error, res);
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const newCourse = await createCourse(req.body);
    res.status(201).json(newCourse);
  } catch (error) {
    handleError(error, res);
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const owner_id = (await findCourseById(parseInt(req.params.id)))?.userId;
    if (req.user?.id !== owner_id) {
      sendErrorResponse(res, 'FORBIDDEN');
      return;
    }
    const updatedCourse = await updateCourse(parseInt(req.params.id), req.body);
    if (!updatedCourse) {
      sendErrorResponse(res, 'RESOURCE_NOT_FOUND', { resource: 'Course' });
      return;
    }
    res.json(updatedCourse);
  } catch (error) {
    handleError(error, res);
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const owner_id = (await findCourseById(parseInt(req.params.id)))?.userId;
    if (req.user?.id !== owner_id && !req.user?.isAdmin) {
      sendErrorResponse(res, 'FORBIDDEN');
      return;
    }
    const result = await deleteCourse(parseInt(req.params.id));
    if (!result) {
      sendErrorResponse(res, 'RESOURCE_NOT_FOUND', { resource: 'Course' });
      return;
    }
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    handleError(error, res);
  }
});

export default router;

// Admin utilities
router.delete('/admin/reset', async (req: Request, res: Response) => {
  try {
    if (!req.user?.isAdmin) {
      return res.status(401).send();
    }
    await Course.destroy({ where: {} });
    return res.json({ message: 'All Course entries deleted' });
  } catch (error) {
    handleError(error, res);
  }
});

router.delete('/admin/reset-all', async (req: Request, res: Response) => {
  try {
    if (!req.user?.isAdmin) {
      return res.status(401).send();
    }
    await Course.destroy({ where: {} });
    await BookOne.destroy({ where: {} });
    return res.json({ message: 'All Course and BookOne entries deleted' });
  } catch (error) {
    handleError(error, res);
  }
});


