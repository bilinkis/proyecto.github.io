const db = require("../database/models");
const Op = db.Sequelize.Op;
const bcrypt = require("bcryptjs");
var multer = require('multer');
var fs = require('fs');
var path = require('path');
var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    
            callback(null, 'public/images/users');
        },
  filename: function (req, file, callback) {
    callback(null,  'user-' + Date.now() + path.extname(file.originalname));
  }
});
var upload = multer({ storage : storage}).single('user_file');
let controller = {
    viewLogin: function (req,res){
        if(res.locals.loggedIn == null){
        return res.render('login', {title: 'Página de login', path: req.originalUrl});
    } else{
        return res.redirect('/profile/'+res.locals.user.id)
    }
    }, 
    viewRegister: function (req,res){
        if(res.locals.loggedIn == null){
            return res.render('register', {title: 'Página de register', path : req.originalUrl});
        } else{
            return res.redirect('/profile/'+res.locals.user.id)
        }
        
    },
    login:function(req,res){
        
        let data= req.body;
        
        let hashPassword = bcrypt.hashSync(req.body.user_password, 10)
        
        db.Users.findOne({
            raw:true,
            where:{
                email: data.user_email,
                
            }
        })
        .then(function(data){
            console.log(data)
            if(data != null){
            let checkPass = bcrypt.compareSync(req.body.user_password,data.password);
            if(checkPass = true){
                req.session.user = data;
                req.session.loggedIn = true;
                req.session.save();
                res.redirect('/profile/'+data.id)
            }
            else{
                console.log(hashPassword)
                console.log(data.password)
            }
            
        }
        else{
            console.log("no hay user");
        }
        
            
        })
        .catch(function(err){
            console.log(err);
        })
        
    },
    store: function(req,res){
        
        
        
        upload(req,res,function(err) {
            
            if(err) {
                console.log(err);
            }
    let data = req.body;
    let passEncriptada = bcrypt.hashSync(req.body.password, 10)
        db.Users.create({
            name: data.name,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            gender: data.gender,
            password: passEncriptada,
            birthday: data.birthday,
            image:req.file.filename
        });
        return res.redirect('/')
    })
    }
}
module.exports = controller;