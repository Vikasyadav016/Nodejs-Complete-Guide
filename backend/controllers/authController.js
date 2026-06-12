const login = (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      });
    }

    // Simulate authentication logic
    if (email === 'user@example.com' && password === 'password') {
      return res.status(200).json({
        success: true,
        message: 'Login successful.',
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid email or password.',
    });
  } catch (error) {
    next(error);
  }
};

const signup = (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      });
    }

    // Simulate user creation logic
    return res.status(201).json({
      success: true,
      message: 'User created successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { login, signup };