export default {
  secret: process.env.JWT_SECRET || 'SUPER_SECRET_SECRET',
  expiresIn: '24h',
};
