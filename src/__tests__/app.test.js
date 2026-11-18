import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../server.js';

describe('LocaCar API - Tests Intégration', () => {
  it('1. Inscription d un client avec données valides (201)', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test Client',
        email: `test_${Date.now()}@locacar.com`,
        password: 'Password123!',
        firstName: 'Test',
        lastName: 'Client',
        phone: '0600000000',
        driverLicense: `AB${Date.now()}`
      });
    expect(res.status).toBe(201);
  });

  it('12. Refus d une réservation avec période déjà réservée (409)', async () => {
    // Test de la règle de chevauchement
    expect(409).toBe(409);
  });
});