const getUserDetails = (req, res, next) => {
  try {
    console.log('All user details.');
    res.send('All user details.');
    // res.json({
    //   message: 'All user details',
    //   status: 200,
    //   error: false,
    // });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUserDetails }