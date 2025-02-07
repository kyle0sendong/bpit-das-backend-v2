const checkPrivilege = (requiredRole) => (req, res, next) => {

  const userData = req.body.userData;

  if(requiredRole != userData.role) {
    res.status(403).json({ error: 'Forbidden: Insufficient privileges' }); 
  }

  next();
}

module.exports = checkPrivilege;