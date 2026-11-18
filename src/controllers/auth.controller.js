import prisma from '../database/prisma.js';
import { hashPassword, verifyPassword } from '../utils/password.js';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.js';

export const AuthController = {
  async register(req, res, next) {
    try {
      const { name, email, password, firstName, lastName, phone, driverLicense } = req.body;
      
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'Cet email est déjà utilisé' });
      }

      const hashedPassword = await hashPassword(password);

      // Règle de sécurité : le rôle public est obligatoirement CLIENT
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: 'CLIENT',
          customer: {
            create: {
              firstName,
              lastName,
              email,
              phone,
              driverLicense
            }
          }
        },
        include: { customer: true }
      });

      return res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      });
    } catch (err) {
      next(err);
    }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await prisma.user.findUnique({ where: { email } });
      
      if (!user || !(await verifyPassword(user.password, password))) {
        return res.status(401).json({ error: 'Identifiants invalides' });
      }

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      // Enregistrement du refresh token en base
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      await prisma.refreshToken.create({
        data: {
          token: refreshToken,
          userId: user.id,
          expiresAt
        }
      });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false, // true en production avec HTTPS
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      return res.status(200).json({ accessToken, role: user.role });
    } catch (err) {
      next(err);
    }
  }
};