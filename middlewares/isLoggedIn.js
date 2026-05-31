module.exports.isLoggedIn=((req, res, next)=> {
  if (!req.session.userId) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error","You must logged in");
    return res.redirect("/login");
  } 
  next();
});


module.exports.isConductorLogged = ((req, res, next) => {
    if (!req.session.employeeId) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must logged in");
        return res.redirect("/conductor/login");
    } 
    next();
});