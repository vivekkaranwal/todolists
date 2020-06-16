//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const app = express();
mongoose.connect("mongodb+srv://vivekkaranwal:Test1234@cluster0-4sb5h.mongodb.net/todolistDB", {useNewUrlParser:true, useUnifiedTopology:true, useFindAndModify:false})
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const dataSchema = new mongoose.Schema({
      name:String
});
const Data =  mongoose.model("todolist",dataSchema)
const data = new Data({
    name:"Make your todolist "
});


const netData = [data];
const listSchema = {
     name:String,
     items:[dataSchema]
}
const List = mongoose.model("list", listSchema);
  
  // Data.insertMany( netData , function(err){
  //      if(err){
  //        console.log(err);   
  //      }else{
  //        console.log("Succesfully data id added to the database");
         
  //      }
  // })
  
app.get("/home", function(req, res) {

   Data.find({}, function(err, results){
    if(results.length===0){
      Data.insertMany( netData , function(err){
        if(err){
          console.log(err);   
        }
        });
        res.redirect("/home")
    }else{
      if(err){
        console.log(err);
      }else{
        res.render("list", {listTitle: "Today", newListItems: results});
        
              
      }
    }
  })
});

app.post("/", function(req, res){
 
 //  const item = req.body.newItem;
    const redirectName = req.body.list;  
    const itemdata = new Data({
      name:req.body.newItem
   });    

                
  if (redirectName === "Today") {
        itemdata.save();
        res.redirect("/home");
  } else {
     List.findOne({name:redirectName}, function(err, foundList){
           foundList.items.push(itemdata);
           foundList.save();
           res.redirect("/"+redirectName)
     })

  }
});
app.post("/delete" , function(req ,res){
     const listname = req.body.listName; 
     const data_id =(req.body.checkbox);
     if(listname === "Today"){
     Data.deleteOne(
     {_id:  data_id},
     function(err){
       if(!err){
        res.redirect("/home")  
       }
     });
    }else{
      List.findOneAndUpdate({name:listname},{$pull:{items:{_id:data_id}}}, function(err){
            if(!err){
              res.redirect("/"+listname);
            }
      })
    }
     

     
})
app.get("/:topic", function(req, res){
  
      const topicName = _.capitalize(req.params.topic)
      List.findOne({name:topicName}, function(err ,foundList){
          if(err){
            console.log(err);
            
          }else{
              if(!foundList){   
                const list = new List({
                  name:topicName,
                  
              })
              list.save();
              res.redirect("/"+topicName);
              }else{
                    res.render("list",{listTitle: foundList.name, newListItems: foundList.items})  
                  
              }
          }
  
          
      })
 

})

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(process.env.PORT ||3000, function() {
  console.log("Server started on port 3000");
});


// List.deleteOne(
//      {_id:"5ed66ddfb99fc20fd838832d"},
//      function(err){
//        if(err){
//           console.log(err);
          
//        }else{
//           console.log("ye i delete it");
          
//        }
//      }
// )
