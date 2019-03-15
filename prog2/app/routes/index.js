var express = require('express');
var router = express.Router();
var users = require('../models/users');
var Item = require('../models/item');
var Subject = require('../models/booksubject');
var hash = require('crypto-js');
/* GET home page. */
//default returns search page
router.get('/', function (req, res, next) {
    res.render('search', {
        layout: "index",
        'error' : 
        {
            't': true,
            "mesg":""
        }
    });
});

//validate search input
//takes a string and determine if any unwanted characters are present
valid = function(str)
{
    for(var i = 0; i < str.length; i++)
    {
        var c = str[i];
        if((c >= "A" && c <= "Z") || (c >= "a" && c <= "z") || c === "'" ||c === ' '|| (c>= "0" && c <= "9"))
        {
            continue;
        }
        else
        {
            return false;
        }
    }
    return true;
};

router.get('/search', function(req,res,next){
    //if any valid data
    if(req.query.txtTitle){
    
    
        if(!valid(req.query.txtTitle))
        {
           
            res.render('search', {
                layout: "index",
                'error' : 
                { 
                    't': true,
                    "mesg":"Bad search string"
                }
            });
            return;
        }
    //current page 
    let p = parseInt(req.query.start)|0;
    Item.search(req.query.txtTitle,p,10, function(error, result){
        if(error){
        
        res.render('search', {
            layout: "index",
            'error' :
            {
                't': true,
                "mesg":
                "bad search"
            }
        });
        }
        else{
       
        Item.count(req.query.txtTitle, function(err, re){

            
            let count = re[0]['count(*)'];
            let mp = parseInt(count/10)|0;
            if(count%10 > 0)mp+=1;
            let p = parseInt(req.query.start)|0;
            let n = p + 10;
            if(n > (mp-1)*10) n-= 10;
    
            let pr = p - 10;
            if(pr < 0) pr=0;

            res.render('search',{
                layout: "index",
                "maxpage": mp,
                 "page":(p/10+1),
                  "next":n,
                  "prev":pr,
                  "query":req.query.txtTitle,
                  "items": result,
                  "count": count,
                  'error' : { 
                      't': false
                    }
                });
        });
        
        }
    });

}
else
{
    //no search param
    console.log("no args");
    res.render('search', {
        layout: "index",
        'error' : 
        { 
            't': true,
            "mesg":""
        }
    });
}
    
});

//display details
router.get('/details', function(req, res, next)
{
    Item.getid(req.query.book_id,function(error, result){
        if(error){
        res.render('search', {
            layout: "index",
            'error': {
                "t": true,
                "mesg":"bad search"
            }
        });
        }

        else{
        
        Subject.search(req.query.book_id, function(err, re){

            if(err){
                console.log(err);
                return err;
            }
         
            res.render('details', {
                layout: "index",
                "book":result,
                "subject": re,
                "login":req.session.login
                
            });
        });
        
        }
    });

});

//search results
router.get('/mobile_searchresult', function(req,res,next)
{
    if(req.query.search)
    {
        if(!valid(req.query.search))
        {
            console.log("bad search");
            res.render('mobile_search', {
                layout: "mobile_index",
                "mesg":"Bad search string"
            });

            return;
        }
        else
        {
            let p = parseInt(req.query.start)|0
            Item.search(req.query.search, p, 10, function(err, result)
            {
                if(err)
                {
                    console.log(err);
                    return;
                }
                Item.count(req.query.search,function(e, r){
                    let count = r[0]['count(*)'];
                    let mp = parseInt(count)|0;
                    let n = p+10;
                    let pr = p -10;
                    if(count%10 > 0)mp+=1;
                    if(pr < 0)p=0;
                    if(n > mp*10)n -= 10;

                    res.render("mobile_searchresult", {
                        layout: "mobile_index",
                        "items": result,
                        "next":n,
                        "prev":pr,
                        "search":req.query.search
                    });
                });
                
            });
        }
    }
    else
    {
        console.log("no params");
            res.render('mobile_search', {
                layout: "mobile_index",
                "mesg":""
            });
    }
});

//search screen
router.get('/mobile_search',function(req,res,next){
    res.render("mobile_search",{layout: "mobile_index"});
});

//load login page
router.get("/login", function(req,res,next){

    

    res.render("login",{
        layout: "index",
        login: req.session.login
    });
});

//try and login
router.post('/login',function(req,res,next){
    
    if(req.body.logout)
    {
        req.session.login = false;
        res.render('login', {
            layout:'index',
            login:req.session.login
        });
        
    }
    else{
        let temp = hash.SHA256(req.body.txtPassword).toString();
    users.search(req.body.txtUsername, temp, function(err,result)
    {
        if(err)
        {
            console.log(err);
            return;
        }
        if(result)req.session.login = true;

        res.render('login', {
            layout:'index',
            login:req.session.login
        });
        
    });
}
});

//display edit file page
router.get('/maintain', function(req,res,next)
{
    Item.getid(req.query.id, function(error, result)
    {
        if(error)
        {
            console.log(error);
            return;
        }

        res.render('maintain',{
            layout:"index",
            book:result
        });
    });
});
//edit a file
router.post('/maintain', function(req,res,next)
{

    let b = req.body;
    
    
    let values = 
    {
        "title": b.Title,
        "author":b.Author,
        "addAuthor":b.AddAuthor,
        "callNo": b.CallNo,
        "pubInfo":b.Pub_Info,
        "descript":b.Descript,
        "series":b.Series
    }
    let query = {
        "id": b.id,
        "updateCount": b.updateCount
    }
    
    if(b.CallNo == undefined || b.CallNo.length ===0 || b.Author== undefined || b.Author.length===0 || b.Title == undefined || b.Title.length === 0) 
    {
        values.id = b.id;
        values.updateCount = b.updateCount;
        res.render("maintain", {
        layout:"index",
        book:values,
        error:{
            c:false,
            v:true,
            msg:"call#, author, and title cannot be empty"
        }
            });
            return;
    }


    Item.update(values,query, function(error, result){
        
        if(error)
        {
            console.log(error);
            return;
        }
        
        if(result > 0)
        {
        
            res.redirect('/details?book_id=' + encodeURI(b.id));
        }
        else
        {
            values.id = b.id;
            values.updateCount = b.updateCount;
            res.render("maintain", {
                layout:"index",
                book:values,
                error: {
                    c:true,
                    v:false,
                }

            });
        }
    });
});


module.exports = router;
