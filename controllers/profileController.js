const db = require("../database/models");
const Op = db.Sequelize.Op;

let controller = {
    main: function (req,res){
    let findUser = new Promise(function(resolve,reject){
        db.Users.findByPk(req.params.id)
        .then(function(data){
            
            resolve(data);
        })
        .catch(function(err){
            reject();
        })
    })
    let findPosts = new Promise(function(resolve,reject){
        db.Posts.findAll({
            raw:true,
            where:{
                userId:req.params.id,
            }
        })
        .then(function(dataPosts){
            resolve(dataPosts);
            
        })

        .catch(function(err){
            reject()
        })
    })
    let findComments = new Promise(function(resolve,reject){
        db.Comments.findAll({
            raw:true,
            where: {
                userId:req.params.id
            }
        })
        .then(function(data){
            resolve(data);
        })
        .catch(function(err){
            console.log(err);
            reject()
        })
    })
    Promise.all([findUser,findPosts,findComments])
    .then(function(values){
        console.log();
        return res.render('profile', {title:"Perfil", user:values[0].dataValues, posts:values[1], comments:values[2]})
    })
    .catch(function(err){
        console.log(err);
    })
    },
    edit: function(req,res){
        db.Users.findByPk(req.params.id)
        .then(function(data){
            return res.render('profile-edit-email', {title: "Cambiá tu email", user: data.dataValues, path: req.originalUrl})
        })
    },
    storeEditEmail: function(req,res){
        db.Users.update({
            email:req.body.email_name,
        },{
            where: {id:req.body.id}
        })
         .then(function(data){
            console.log(data)
        .then(function(file){
            res.redirect('/profile/'+ req.body.id);
        })
        .catch(function(err){
            console.log(err)
        })
        })
    },
    editPassword: function(req,res){
        db.Users.findByPk(req.params.id)
        .then(function(data){
            return res.render('profile-edit-password', {title: "Cambiá tu password", user: data.dataValues, path: req.originalUrl})
        })
    },
    storeEditPassword: function(req,res){
        db.Users.update({
            password:req.body.password_name,
        },{
            where: {id:req.body.id}
        })
         .then(function(data){
            console.log(data)
        .then(function(file){
            res.redirect('/profile/'+ req.body.id);
        })
        .catch(function(err){
            console.log(err)
        })
        })
    }
}
module.exports = controller;