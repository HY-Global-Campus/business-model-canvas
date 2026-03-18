
import { Router, Request, Response } from 'express';
import {
    findAllBookOnes,
    findBookOneById,
    createBookOne,
    updateBookOne,
    deleteBookOne,
    findBookOneByUserId
} from '../services/BookOneService.js';
import { sendErrorResponse, handleUnexpectedError } from '../utilities/errorHandler.js'; 

const router = Router();

const handleError = (error: unknown, res: Response, context: string = 'BookOneController') => {
    handleUnexpectedError(error, res, context);
};

router.get('/', async (req: Request, res: Response) => {
    if (!req.user?.isAdmin) {
        sendErrorResponse(res, 'UNAUTHORIZED');
        return;
    }
    try {
        const books = await findAllBookOnes();
        res.json(books);
    } catch (error) {
        handleError(error, res);
    }
});

router.get('/:id', async (req: Request, res: Response) => {
    if (!req.user?.isAdmin) {
        return res.status(401).send();
    }
    try {
        const book = await findBookOneById(parseInt(req.params.id));
        if (!book) {
            sendErrorResponse(res, 'RESOURCE_NOT_FOUND', { resource: 'BookOne' });
            return;
        }
        res.json(book);
    } catch (error) {
        handleError(error, res);
    }
});

router.get('/user/:userid', async (req: Request, res: Response) => {
    // if (req.user?.id !== req.params.userid && !req.user?.isAdmin) {
    //     return res.status(401).send();
    // }
  try {
    const book = await findBookOneByUserId(req.params.userid);
    if (!book) {
      sendErrorResponse(res, 'RESOURCE_NOT_FOUND', { resource: 'BookOne' });
      return;
    }
    res.json(book);
  } catch (error) {
    handleError(error, res);
  }
});

router.post('/', async (req: Request, res: Response) => {
    try {
        const newBook = await createBookOne(req.body);
        res.status(201).json(newBook);
    } catch (error) {
        handleError(error, res);
    }
});

router.put('/:id', async (req: Request, res: Response) => {
    try {
        const owner_id = (await findBookOneById(parseInt(req.params.id)))?.userId;
        if (req.user?.id !== owner_id) {
            sendErrorResponse(res, 'FORBIDDEN');
            return;
        }
        const updatedBook = await updateBookOne(parseInt(req.params.id), req.body);
        if (!updatedBook) {
            sendErrorResponse(res, 'RESOURCE_NOT_FOUND', { resource: 'BookOne' });
            return;
        }
        res.json(updatedBook);
    } catch (error) {
        handleError(error, res);
    }
});

router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const owner_id = (await findBookOneById(parseInt(req.params.id)))?.userId;
        if (req.user?.id !== owner_id && !req.user?.isAdmin) {
            sendErrorResponse(res, 'FORBIDDEN');
            return;
        }
        const result = await deleteBookOne(parseInt(req.params.id));
        if (!result) {
            sendErrorResponse(res, 'RESOURCE_NOT_FOUND', { resource: 'BookOne' });
            return;
        }
        res.json({ message: 'Book deleted successfully' });
    } catch (error) {
        handleError(error, res);
    }
});

export default router;

