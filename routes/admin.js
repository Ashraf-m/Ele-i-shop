const { Router } = require('express');
var express = require('express');
const productHelpers = require('../helpers/product-helpers');
var router = express.Router();
var productHelper=require('../helpers/product-helpers')
/* GET users listing. */
router.get('/', function(req, res, next) {

  res.render('admin/dashboard',{admin:true})
});

router.get("/product-manager", (req, res,next) => {
    productHelpers.getAllProducts().then((products)=>{
      console.log(products);
      res.render("admin/product-manager", { admin: true, products});
    })
   
  });

  router.get("/add-product", (req, res) => {
 
    res.render("admin/add-product", { admin: true, });
  });


 
    
  

  router.post('/add-product',(req,res)=>{
    //console.log(req.body);
   
    let image1=req.files.image1
    let image2=req.files.image2
    let image3=req.files.image3
    let image4=req.files.image4


    productHelper.addProduct(req.body,(id)=>{
      console.log(id);
      
    image1.mv("./public/product-images/" + id + "first" + ".jpg");
    image2.mv("./public/product-images/" + id + "second" + ".jpg");
    image3.mv("./public/product-images/" + id + "third" + ".jpg");
      image4.mv('./public/product-images/'+id+ "fourth" + ".jpg",(err,done)=>{
        if(!err){
          res.redirect("/admin/product-manager")
        }else{
          console.log(err);
        }
      })
     
    })
  })

  router.get('/delete-product/:id',(req,res)=>{
    let proId=req.params.id
    console.log(proId);
    productHelpers.deleteProduct(proId).then((response)=>{
      res.redirect("/admin/product-manager/");
    })
  })

  



 




  

module.exports = router;
