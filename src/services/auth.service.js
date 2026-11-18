import prisma from '../database/prisma.js';
import { hashPassword, verifyPassword } from '../utils/password.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.js';

export const AuthService = {
  async register(data) {
    const { name, email, password, firstName, lastName, phone, driverLicense } = data;

    // Vérifier l'unicité de l'email
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      const err = new Error('Cet e-mail est déjà utilisé');
      err.status = 400;
      throw err;
    }

    // Hachage du mot de passe avec Argon2[cite: 5]
    const hashedPassword = await hashPassword(password);

    // Règle de sécurité : le rôle lors d'une inscription publique est obligatoirement CLIENT[cite: 5, 11]
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

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      customer: user.customer
    };
  },

  async login(email, password) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await verifyPassword(user.password, password))) {
      const err = new Error('Identifiants invalides');
      err.status = 401;
      throw err;
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Stockage du Refresh Token en base de données
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 jours
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt
      }
    });

    return { accessToken, refreshToken, user };
  },

  async refresh(oldRefreshToken) {
    if (!oldRefreshToken) {
      const err = new Error('Refresh token manquant');
      err.status = 401;
      throw err;
    }

    try {
      const payload = verifyRefreshToken(oldRefreshToken);
      
      // Vérifier si le token existe et n'est pas révoqué en base
      const tokenRecord = await prisma.refreshToken.findFirst({
        where: { token: oldRefreshToken, revokedAt: null }
      });

      if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
        const err = new Error('Refresh token invalide ou expiré');
        err.status = 401;
        throw err;
      }

      const user = await prisma.user.findUnique({ where: { id: payload.id } });
      if (!user) {
        const err = new Error('Utilisateur introuvable');
        err.status = 401;
        throw err;
      }

      const newAccessToken = generateAccessToken(user);
      return { accessToken: newAccessToken };
    } catch (e) {
      const err = new Error('Refresh token invalide');
      err.status = 401;
      throw err;
    }
  },

  async logout(refreshToken) {
    if (refreshToken) {
      await prisma.refreshToken.updateMany({
        where: { token: refreshToken },
        data: { revokedAt: new Date() }
      });
    }
  },

  async logoutAll(userId) {
    await prisma.refreshToken.updateMany({
      where: { userId: Number(userId), revokedAt: null },
      data: { revokedAt: new Date() }
    });
  },

  async getMe(userId) {
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
      include: { customer: true }
    });
    if (!user) {
      const err = new Error('Utilisateur introuvable');
      err.status = 404;
      throw err;
    }
    // Ne jamais retourner le mot de passe
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
};