const { response } = require("express");
var express = require("express");
var router = express.Router();
var productHelper = require("../helpers/product-helpers");
const userHelpers=require('../helpers/user-helpers')

const verifyLogin=(req,res,next)=>{
  if(req.session.loggedIn){
    next()
  }else{
    res.redirect('/login')
  }
}

/* GET home page. */
router.get("/", async function (req, res, next) {
  let userDetails=req.session.user
  console.log(userDetails);
  let cartCount=null
  if(req.session.user){
   cartCount=await userHelpers.getCartCount(req.session.user._id)
  }
   productHelper.getAllProducts().then((products) => {
    res.render("index", { products, userDetails,cartCount, user:true });
  });
});


router.get("/login",(req,res,next)=>{
  if(req.session.loggedIn){
    res.redirect('/')
  }else{
  res.render("user/login",{"loginErr":req.session.loginErr})
  req.session.loginErr=false
  }
  })


router.get("/signup",(req,res,next)=>{
  res.render("user/signup")
  })
router.post('/signup',(req,res)=>{
   userHelpers.doSignup(req.body).then((response)=>{
    console.log(response);
    res.redirect('/')
  })
})

router.post('/login',(req,res)=>{
  userHelpers.doLogin(req.body).then((response)=>{
    if(response.status){
      req.session.loggedIn=true
      req.session.user=response.user
      res.redirect('/')
    }else{
      req.session.loginErr="Invalid username or Password"
      res.redirect('/login')
    }
  })
})

router.get('/logout',(req,res)=>{
  req.session.destroy()
  res.redirect('/')
})

router.get("/cart",verifyLogin,async(req,res,next)=>{
   var userDetails=req.session.user
   
   let products=await userHelpers.getCartProducts(req.session.user._id,)
   console.log(products);
  
res.render("user/cart",{userDetails,products,user:true})
})



router.get('/add-to-cart/:id',(req,res)=>{
  console.log('api call');
  userHelpers.addToCart(req.params.id,req.session.user._id).then(()=>{
    res.json({status:true})
  })
})

router.post('/change-product-quantity',(req,res,next)=>{
  console.log(req.body);
  userHelpers.changeProductQuantity(req.body).then((response)=>{
      res.json(response)
  })
})


router.get("/checkout",(req,res)=>{
console.log("check");
var userDetails=req.session.user
  console.log(userDetails);
res.render("user/checkout",{userDetails})
})



module.exports = router;


