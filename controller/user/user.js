var jwt = require('jsonwebtoken');
const mongoose=require("mongoose")
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
const User=mongoose.model("User")
const config = require("../../config");
const bcrypt = require("bcryptjs");
const signupUser=(req,res,err)=>{
const { errors, isValid } = validateRegisterInput(req.body);
if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });

      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
  
}
  
const signinUser=(req,res,err)=>{
  const { errors, isValid } = validateLoginInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email }).then(user => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    }

    // Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id,
          name: user.name
        };

        // Sign token
        jwt.sign(
          payload,
          config.access_token,
          {
            expiresIn: 31556926 // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
 
    
}

const getUser=async(req,res,err)=>{
 
   const user=await User.findOne({_id:req.user._id})
  
   if(!user)
   return res.sendStatus(404)
   res.json({user})

}
const getUsers=async(req,res,err)=>{
 
   
    User.find({})
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(500).json({ success: false, msg: `Something went wrong. ${err}` });
    });

  
 
 }
const editUser=(req,res,err)=>{
 console.log("BODY ",req.body.data)
    User.findOneAndUpdate({_id:req.user._id},{...req.body.data},{new:true},(err,user)=>{
        res.json({user})
    })
   
}
const deleteUser=(req,res,err)=>{
  User.findOneAndDelete({_id:req.user._id},(err,user)=>{
    res.json("delted")
    res.json({user})
  })
}
 
module.exports={
    signinUser,
    signupUser,
    editUser,
    deleteUser,
    getUser,
    getUsers,


}
