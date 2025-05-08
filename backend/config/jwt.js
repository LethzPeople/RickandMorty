import jwt from 'jsonwebtoken';

export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'rick_and_morty_secret', {
    expiresIn: '30d',
  });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'rick_and_morty_secret');
  } catch (error) {
    return null;
  }
};