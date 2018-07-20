var express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var jwt = require('jwt-simple')

var User = require('./models/User')
var Post = require('./models/Post')

var auth = require('./auth')

var app = new express()

mongoose.Promise = Promise;

app.use(cors())
app.use(bodyParser.json())

app.get('/posts/:id', async (req, res) => {
    var author = req.params.id
    var posts = await Post.find({author})
    res.send(posts)
})

app.post('/posts', auth.checkAuthenticated, (req, res) => {
    
    const postData = req.body

    postData.author = req.userId

    var post = new Post(postData)

    post.save((err, result) => {
        if(err){
            console.error('error in saving post')
            res.status(500).send('error in saving post')
        }

        res.sendStatus(200)
    })    
})

app.get('/users', async (req, res) => {

    try {    
        var users = await User.find({}, '-password -__v')
        res.send(users);   
    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
})

app.get('/profile/:id', async (req, res) => {    
    try {
     
        var user = await User.findById(req.params.id, '-password -__v')
        res.send(user);
   
    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
})

mongoose.connect('mongodb://letschatdb:letschatdb1234@ds139841.mlab.com:39841/letschat', { useNewUrlParser: true }, (err) => {
    if(!err)
        console.log('connect to mongo')
})

app.use('/auth', auth.router)

app.listen(3000)