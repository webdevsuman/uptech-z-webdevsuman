class Validation {
  static validate(schema) {
    return (req, res, next) => {
      try {
        const result = schema.safeParse(req.body);

        if (!result.success) {
          return res.status(400).json({
            success: false,
            errors: result.error.issues.map((issue) => ({
              field: issue.path.join("."),
              message: issue.message,
            })),
          });
        }

        req.body = result.data;
        return next();
      } catch (error) {
        return res.status(500).json({
          success: false,
          message:
            error.message || "An unexpected error occurred during validation.",
        });
      }
    };
  }
}

export default Validation;
