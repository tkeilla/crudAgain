const express = require("express")
const app = express()

const uri = "mongodb+srv://dbuser:dbuser@cluster0.ovstvw0.mongodb.net/?retryWrites=true&w=majority"
const {MongoClient} = require("mongodb-legacy")
const ObjectId = require('mongodb-legacy').ObjectId

//conexão com o banco mongodb

const client = new MongoClient(uri)
const db = client.db("teste-db")
const collection = db.collection("crud")



app.set("view engine", "ejs")
app.use(express.urlencoded({extended:true}))

app.listen(3000, function(){
    console.log("Tentando Certar")
})

app.get("/ler", (req, res)=>{
    res.send("Deu certo, meu patrao")
})

app.get("/index", (req, res) =>{
    res.render("index.ejs")
})

app.post("/ver", (req, res)=>{
    console.log ("se garante")
    res.send("Turma B")
})

app.post("/show", (req, res) => {
    collection.insertOne(req.body, (err, result)=> {
     if(err) return console.log(err)
     console.log("SALVOU COM SUCESSO NO NOSSO BANCO DE DADOS")
     res.redirect("/show")
     collection.find().toArray((err, results) =>{
         console.log(results)
     })
    })
 })
 app.get('/', (req, res) => {
    let cursor = db.collection('crud').find()
})

//renderizar e retornar o conteúdo do nosso banco
app.get('/show', (req, res) => {
    collection.find().toArray((err, results) => {
        if (err) return console.log(err)
        res.render('show.ejs', {crud: results})
    })
})

//criando a nossa rota e comandos para editar
app.route('/edit/:id')
.get((req, res) => {
    var id = req.params.id

    collection.find(ObjectId(id)).toArray((err, result) => {
        if(err) return res.send(err)
        res.render('edit.ejs', {crud: result})
    })
})
.post((req, res) => {
    var id = req.params.id
    var roll = req.body.roll
    var name = req.body.name
    var dob = req.body.dob
    var sex = req.body.sex

    collection.updateOne({_id: ObjectId(id)}, {
        $set: {
            roll: roll,
            name: name,
            dob: dob,
            sex: sex,
        }
    }, (err, result) => {
        if(err) return res.send(err)
        res.redirect('/show')
        console.log('Banco de dados atualizado')


    })
})
//criando a nossa rota e comandos para deletar
app.route ('/delete/:id')
.get((req, res) => {
    var id = req.params.id

    db.collection('crud').deleteOne({_id: ObjectId(id)}, (err, result) => {
        if(err) return res.send(500, err)
        console.log('Deletando do nosso banco de dados!')
        res.redirect('/show')
    })
})
app.put('/updateuser/:id', function(req, res) {
    var db = req.db;
    var userToUpdate = req.params.id;
    db.collection('userlist').update({ _id: ObjectId(userToUpdate)}, req.body, function (err, result) {
        res.send(
            (err === null) ? {msg: ''} : {msg: err}
        );
    });
});





