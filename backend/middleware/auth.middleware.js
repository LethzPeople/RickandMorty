import { verifyToken } from '../config/jwt.js';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  try {
    let token;

    // Verificar si hay token en el header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Verificar si existe el token
    if (!token) {
      return res.status(401).json({ message: 'No autorizado, no se proporcionó token' });
    }

    // Verificar el token
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: 'No autorizado, token inválido' });
    }

    // Obtener el usuario
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'No autorizado, usuario no encontrado' });
    }

    // Verificar si el usuario está activo
    if (!user.isActive) {
      return res.status(401).json({ message: 'No autorizado, cuenta desactivada' });
    }

    // Agregar el usuario a la solicitud
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'No autorizado, error en autenticación' });
  }
};