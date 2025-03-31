const checkPrivilege = (allowedRoles) => (req, res, next) => {

  const userRole = req.user?.role; // Assuming req.user is populated by validateToken middleware
  
  if (allowedRoles.includes(userRole)) {
    return next();
  }
  return res.status(403).json({ message: 'Access forbidden: insufficient privileges' });
}

module.exports = checkPrivilege;