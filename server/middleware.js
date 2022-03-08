const authPage = (permissions) => {
  return (req, res, next) => {
    const userRole = req.body.role;
    if (permissions.includes(userRole)) {
      next();
    } else {
      console.log(req.body);
      return res.status(401).json("Permission restricted");
    }
  };
};

module.exports = { authPage };
