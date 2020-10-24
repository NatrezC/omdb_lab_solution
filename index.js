require('dotenv').config()
const express = require('express')
const app = express()
const ejsLayouts = require('express-ejs-layouts')
const axios = require('axios')
const db = require('./models')

app.set('view engine', 'ejs')
app.use(ejsLayouts)
app.use(express.urlencoded({extended:false}))

// home -> form to input movie title
app.get('/', (req, res)=>{
    res.render('home')
})

// movies (results from the search)
app.get('/movies', (req, res)=>{
    let movieTitle = req.query.movieTitle
    axios.get(`http://www.omdbapi.com/?apikey=${process.env.API_KEY}&s=${movieTitle}`)
    .then(response=>{
        // res.send(response.data)
        res.render('movies', {results: response.data.Search})
    })
})

// show (info about one particular movie)
app.get('/movies/:movieId', (req, res)=>{
    let movieId = req.params.movieId
    axios.get(`http://www.omdbapi.com/?apikey=${process.env.API_KEY}&i=${movieId}`)
    .then(response=>{
        console.log(response.data)
        res.render('show', {movie: response.data})
    })
})

// post this to my faves table
app.post('/faves', (req, res)=>{
    console.log("Form data: ", req.body)
    db.fave.create(req.body)
    .then(createdFave => {
        // res.redirect('/faves')
        res.send(createdFave)
    })
})

app.listen(process.env.PORT, ()=>{
    console.log('OMDB API LAB RUNNING ON 8000')
})