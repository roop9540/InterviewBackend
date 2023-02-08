const express = require("express")
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}))




//const bodyparser = require("b")

const ejs = require("ejs");
const { UserData } = require("./database");
app.set("view engine", "ejs")

app.get('/', (req, res)=>{
    res.render('home')
})
app.get('/SignUp', (req, res)=>{
    res.render('SignUp');
})
app.get('/login', (req, res)=>{
    res.render('login');
})
app.get('/verify', (req, res)=>{
    res.render('verify');
})
app.post('/SignUp', (req, res)=>{
    let number = Math.random()*999999
  //  number = number.toFixed(6)
    number = Math.trunc(number);
    console.log(number);

    
    const data = new UserData({
        name:req.body.name,
        username:req.body.username,
        password:req.body.password,
        otp:number,
        status:"inactive" 
    })

    // CHECK_IN_URL = '' //SNAKE CASE
    //res.redirect('/verify')

    data.save(err=>{
        if(err){
            console.log("err")
        }else{
            res.redirect('/verify');
        }
    })
})
app.post('/login', async(req, res)=>{
    try{
        const check = await UserData.findOne({username:req.body.username});
       console.log(check);
        
        if(check.password === req.body.password && check.username === req.body.username){
            res.status(201).send({username:check.username,
                 name:check.name,
             _id:check.id})
           //res.send(check);
          // res.redirect('/verify');
        }else{
            res.send("Invalid credentials")
        }
        // send({username:check.username,
        //     name:check.name,
        // _id:check.id}
    }
    catch(err){
        res.send("wrong details");
    }
})

app.get('/edit/:id', (req, res)=>{
    let id = (req.params.id)
    UserData.findByIdAndUpdate({_id: req.params.id}, req.body, {new:true} ,(err, docs)=>{
        if(err){
            console.log("err")
        }else{
            res.render("edit", {user:docs})
        }
    })
})
app.post('/edit/:id', (req, res)=>{
  //  let id = (req.params.id);
    UserData.findByIdAndUpdate({_id: req.params.id}, req.body, (err, docs)=>{
        if(err){
            console.log("err")
        }else{
            res.send("updated Successfully")
        }
    })
})
app.get('/delete/:id', (req, res)=>{
    UserData.findByIdAndDelete({_id:req.params.id}, req.body, (err, docs)=>{
        if(err){
            console.log("err")
        }else{
            res.send("deleted")
        }
    })
})

app.post('/verify', async(req, res)=>{
    try{
        const check = await UserData.findOne({otp:req.body.otp});
        console.log(check.otp+ "this is otp");
        


        if(check.otp === req.body.otp){
            console.log(check.id)
           

           UserData.findByIdAndUpdate({_id:check.id},{status:"active"}, {new:true}, (err, docs)=>{
            if(err){
                console.log("err")
            }else{
               console.log(check)
                res.send(check.status);
            }
           })
           // res.status(201).send('Suceesfully verified');
           //res.send(check);
        }
        // send({username:check.username,
        //     name:check.name,
        // _id:check.id}
    }
    catch(err){
        res.send("wrong otp Please try again");
    }
   
})


app.listen(3000, ()=>{
    console.log("Connect to port")
})