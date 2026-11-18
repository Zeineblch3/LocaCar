import prisma from '../database/prisma.js';

export const VehicleRepository = {
  async findFiltered(filters, skip, take) {
    const where = {};
    if (filters.brand) where.brand = { contains: filters.brand };
    if (filters.category) where.category = filters.category;
    if (filters.maxPrice) where.dailyPrice = { lte: filters.maxPrice };

    const [data, total] = await Promise.all([
      prisma.vehicle.findMany({
        where,
        skip,
        take,
        include: { agency: true }
      }),
      prisma.vehicle.count({ where })
    ]);
    return { data, total };
  },
  async findById(id) {
    return await prisma.vehicle.findUnique({
      where: { id: Number(id) },
      include: { agency: true, reservations: true }
    });
  },
  async create(data) {
    return await prisma.vehicle.create({ data });
  },
  async update(id, data) {
    return await prisma.vehicle.update({ where: { id: Number(id) }, data });
  },
  async delete(id) {
    return await prisma.vehicle.delete({ where: { id: Number(id) } });
  }
};