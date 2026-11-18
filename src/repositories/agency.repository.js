import prisma from '../database/prisma.js';

export const AgencyRepository = {
  async findAll() {
    return await prisma.agency.findMany({ include: { vehicles: true } });
  },
  async findById(id) {
    return await prisma.agency.findUnique({
      where: { id: Number(id) },
      include: { vehicles: true },
    });
  },
  async create(data) {
    return await prisma.agency.create({ data });
  },
  async update(id, data) {
    return await prisma.agency.update({ where: { id: Number(id) }, data });
  },
  async delete(id) {
    return await prisma.agency.delete({ where: { id: Number(id) } });
  }
};