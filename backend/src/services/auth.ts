import jsonwebtoken from "jsonwebtoken"
import express from "express"
import config from "../config.js";
import { UserTokenForm, isUserTokenForm } from "../types/user.js";

const getTokenFromRequest = (request: express.Request) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '');
  }
  return null;
}

export const checkPermission = (request: express.Request): UserTokenForm | undefined  => {
  const token = getTokenFromRequest(request);
  if (!token) return undefined;
  try {
    const decodedToken = jsonwebtoken.verify(token, config.JWT_SECRET);
    if (isUserTokenForm(decodedToken)) {
      return decodedToken;                                         
    }
    return undefined;
  } catch (error) {
    return undefined;
  }
}
