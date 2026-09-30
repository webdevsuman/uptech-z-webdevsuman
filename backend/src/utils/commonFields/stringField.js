const stringField = ({ required = false, unique = false, trim = true, lowercase = false, uppercase = false, defaultValue } = {}) => ({
  type: String,
  required,
  unique,
  trim,
  lowercase,
  uppercase,
  ...(defaultValue !== undefined && { default: defaultValue }),
});

export default stringField;
