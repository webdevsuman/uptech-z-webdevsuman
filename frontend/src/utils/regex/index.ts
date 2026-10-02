export default {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  phone: /^\+?[1-9]\d{9,14}$/,
  otp: /^\d{6}$/,
  objectId: /^[0-9a-fA-F]{24}$/,
  slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
};