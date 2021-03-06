const db = require("../database/models");
const Op = db.Sequelize.Op;
let controller = {
    save: function(req,res){
        let timestamp = new Date().getTime();
        db.Comments.create({
            userId: res.locals.user.id,
            comment:req.body.comment,
            createdAt: timestamp,
            productId: req.body.id,
            
        })
        .then(function(data){
            db.Posts.findByPk(req.body.id)
           
            .then(function(post){
                db.Posts.update({
                    comments: post.dataValues.comments + 1,
                    updatedAt: new Date().getTime(),
                },{
                    where:{id:req.body.id}
                })
                .then(function(){
                    db.Users.findOne({
                        raw:true,
                        where:{id:post.userId}
                    })
                    .then(function(postUser){
                        db.Users.update({
                            commentsReceived: postUser.commentsReceived +1,
                            updatedAt: new Date().getTime(),
                            },
                            {
                                where: {id: postUser.id}
                            })
                            .then(function(){
                                db.Users.findOne({
                                    raw:true,
                                    where:{id:res.locals.user.id}
                                }).then(function(userPosting){
                                    db.Users.update({
                                        commentsPosted: userPosting.commentsPosted +1,
                                        updatedAt: new Date().getTime(),
                                    },
                                    {
                                        where: {id: res.locals.user.id}
                                    })
                                })
                                
                                .then(function(){
                                    return res.redirect(req.headers.referer)
                            })
                    })
                })
                
                
                    
                        
                    })
                })
            })
            
    },
    delete: function(req,res){ 
        console.log(req.body)
        db.Comments.destroy({
            where: {id:req.body.commentId}
        })
        .then(function(data){
            db.Posts.findByPk(req.body.postId)
            .then(function(post){
                db.Posts.update({
                    comments: post.dataValues.comments -1,
                    updatedAt: new Date().getTime(),
                },{
                    where:{id:req.body.postId}
                })
            })
            .then(function(){
                return res.redirect(req.headers.referer)
            })
            
            
        })
        .catch(function(err){
            console.log(err)
        })
    }
}
module.exports = controller;