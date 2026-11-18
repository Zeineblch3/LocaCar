export const validate = (schema) => async (req, res, next) => {
  try {
    req.body = await schema.body.parseAsync(req.body);
    req.query = await schema.query.parseAsync(req.query);
    req.params = await schema.params.parseAsync(req.params);
    next();
  } catch (error) {
    return res.status(400).json({ error: 'Validation échouée', details: error.errors });
  }
};