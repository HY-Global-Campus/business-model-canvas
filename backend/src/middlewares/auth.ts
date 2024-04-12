import express from 'express'
import { checkPermission } from '../services/auth.js'

const authMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => { 
  const hasPermission = checkPermission(req);
  if (hasPermission) {
    req.user = hasPermission;
    next();
  } else {
    res.status(401).send('Unauthorized');
  }
}

export default authMiddleware;
