import { CustomerRepository } from '../repositories/customer.repository.js';

export const CustomerService = {
  async getAllCustomers() {
    return await CustomerRepository.findAll();
  },
  async getCustomerById(id, user) {
    const customer = await CustomerRepository.findById(id);
    if (!customer) {
      const err = new Error('Client introuvable');
      err.status = 404;
      throw err;
    }
    // Règle d'accès : un client ne peut consulter que son propre profil[cite: 7]
    if (user.role === 'CLIENT' && customer.userId !== user.id) {
      const err = new Error('Accès refusé à ce profil');
      err.status = 403;
      throw err;
    }
    return customer;
  },
  async updateCustomer(id, data, user) {
    const customer = await CustomerService.getCustomerById(id, user);
    return await CustomerRepository.update(customer.id, data);
  }
};