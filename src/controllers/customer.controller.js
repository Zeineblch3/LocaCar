import { CustomerService } from '../services/customer.service.js';

export const CustomerController = {
  async getAll(req, res, next) {
    try {
      const customers = await CustomerService.getAllCustomers();
      res.status(200).json(customers);
    } catch (err) { next(err); }
  },
  async getById(req, res, next) {
    try {
      const customer = await CustomerService.getCustomerById(req.params.id, req.user);
      res.status(200).json(customer);
    } catch (err) { next(err); }
  },
  async update(req, res, next) {
    try {
      const updated = await CustomerService.updateCustomer(req.params.id, req.body, req.user);
      res.status(200).json(updated);
    } catch (err) { next(err); }
  }
};