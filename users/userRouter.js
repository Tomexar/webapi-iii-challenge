const express = require('express');

const Users = require('./userDb')
const Posts = require('../posts/postDb')
const router = express.Router();




router.post('/', validateUserId, validatePosts, validateUser, (req, res) => {
    try{
        const newuser =  Users.insert(req.body)
            res.status(201).json(newuser)
        }catch (error){
            console.log(error);
            res.status(500).json({ message: 'error adding user'})
        }
});

router.post('/:id/posts', async (req, res) => {
    const newpost = {...req.body,user_id: req.params.id };
    try{
        const post = await Posts.insert(newpost);
        res.status(210).json(post); 
    }catch (error){
        console.log(error);
        res.status(500).json({ message: 'error getting messages'})
    }
});

router.get('/', async (req, res) => {
    try{
        const users = await Users.get(req.query);
        res.status(200).json(users);
    }catch(error){
        console.log(error);
        res.status(500).json({ message: 'error'})
    }
});

router.get('/:id',async (req, res) => {
    try{
        const user = await Users.getById(req.params.id);
        if(user){
            res.status(200).json(user);
        }else {
            res.status(404).json({ message: 'User not found'})
        }
    }catch(error){
        console.log(error);
        res.status(500).json({ message: 'error getting user'})
    }

});

router.get('/:id/posts',async (req, res) => {
    try{
        const userposts = await Users.getUserPosts(req.params.id);
        res.status(200).json(userposts);
    }catch (error){
        console.log(error);
        res.status(500).json({ message: 'error getting posts'});
    }
});

router.delete('/:id',async (req, res) => {
    try{
        const count = await Users.remove(req.params.id);
        if(count > 0){
            res.status(200).json({ message: 'user deleted'});
        } else {
            res.status(404).json({ message: 'user not found'})
        }
    }catch (error){
        console.log(error);
        res.status(500).json({ message: 'error deleting user'})
    }

});

router.put('/:id', validateUserId, (req, res) => {
    try{
        const edit = Users.update(req.params.id, req.body);
        if (edit) {
            res.status(200).json(edit);
        }else {
            res.status(404).json({ message: 'user not found'});
        }
    }catch (error){
        console.log(error);
        res.status(500).json({ message: 'error updating'})
    }
});

//custom middleware

function validateUserId(req, res, next) {
    const { id } = req.user;
    if (!id) {
        res.status(400).json({ message: 'invalid user id' })
    } else {
        next();
    }
}

function validateUser(req, res, next) {
    const { user } = req.body;
    const { name } = req.body.name;
    if (!user) {
        res.status(400).json({ message: 'missing user data' })
    }if(!name) {
        res.status(400).json({ message: 'missing required name field'})
    } else {
        next()
    }
}


function validatePosts(req, res, next) {
    const { post } = req.body;
    const { text } = req.text;
    if (!post) {
        res.status(400).json({ message: 'missing post data' })
    } if (!text){
        res.status(400).json({ message: 'messsage: missing text field'})
    }else {
        next()
    }
}


module.exports = router;
