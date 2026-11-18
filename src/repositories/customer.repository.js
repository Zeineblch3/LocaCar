import prisma from '../database/prisma.js';

export const CustomerRepository = {
  async findAll() {
    return await prisma.customer.findMany({ include: { user: true, reservations: true } });
  },
  async findById(id) {
    return await prisma.customer.findUnique({
      where: { id: Number(id) },
      include: { user: true, reservations: true }
    });
  },
  async update(id, data) {
    return await prisma.customer.update({ where: { id: Number(id) }, data });
  },
  async delete(id) {
    return await prisma.customer.delete({ where: { id: Number(id) } });
  }
};