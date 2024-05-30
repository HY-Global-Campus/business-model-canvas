
import { Router, Request, Response } from 'express';
import {
    findAllBookOnes,
    findBookOneById,
    createBookOne,
    updateBookOne,
    deleteBookOne,
    findBookOneByUserId
} from '../services/BookOneService.js'; 

const router = Router();

const handleError = (error: unknown, res: Response) => {
    if (error instanceof Error) {
        res.status(500).json({ message: error.message });
    } else {
        res.status(500).json({ message: 'An unknown error occurred' });
    }
};

router.get('/', async (req: Request, res: Response) => {
    try {
        const books = await findAllBookOnes();
        res.json(books);
    } catch (error) {
        handleError(error, res);
    }
});

router.get('/:id', async (req: Request, res: Response) => {
    try {
        const book = await findBookOneById(parseInt(req.params.id));
        if (!book) {
            return res.status(404).json({ message: 'BookOne not found' });
        }
        res.json(book);
    } catch (error) {
        handleError(error, res);
    }
});

router.get('/user/:userid', async (req: Request, res: Response) => {
  try {
    const book = await findBookOneByUserId(req.params.userid);
    if (!book) {
      return res.status(404).json({message: 'BookOne not found'});
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
        const updatedBook = await updateBookOne(parseInt(req.params.id), req.body);
        if (!updatedBook) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json(updatedBook);
    } catch (error) {
        handleError(error, res);
    }
});

router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const result = await deleteBookOne(parseInt(req.params.id));
        if (!result) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json({ message: 'Book deleted successfully' });
    } catch (error) {
        handleError(error, res);
    }
});

export default router;

