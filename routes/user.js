const Router=require("express").Router()
const {signinUser,getUser,signupUser,editUser,deleteUser,getUsers,getUserById}=require("../controller/user/user")
const passport=require("../services/jwtPassport")

/*
url : /api/user/signup
@return ok if success

*/

Router.post("/signup",signupUser)

/*
url : /api/user/signin
@return token

*/
Router.post("/signin",signinUser)

/*
url : /api/user/edit/:id
@return ok

*/
Router.put("/edit",passport.authenticate('jwt', { session: false }),editUser)
Router.delete("/delete",passport.authenticate('jwt', { session: false }),deleteUser)

Router.get("/",passport.authenticate('jwt', { session: false }),getUser)
Router.get("/users",passport.authenticate('jwt', { session: false }),getUsers)

module.exports=Router;