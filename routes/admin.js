const { Router } = require("express");
var express = require("express");
const productHelpers = require("../helpers/product-helpers");
var router = express.Router();
var productHelper = require("../helpers/product-helpers");
/* GET users listing. */
router.get("/", function (req, res, next) {
  res.render("admin/dashboard", { admin: true });
});

router.get("/product-manager", (req, res, next) => {
  productHelpers.getAllProducts().then((products) => {
    console.log(products);
    res.render("admin/product-manager", { admin: true, products });
  });
});

router.get("/add-product", (req, res) => {
  res.render("admin/add-product", { admin: true });
});

router.post("/add-product", (req, res) => {
  //console.log(req.body);

  let image1 = req.files.image1;
  let image2 = req.files.image2;
  let image3 = req.files.image3;
  let image4 = req.files.image4;

  productHelper.addProduct(req.body, (id) => {
    console.log(id);

    image1.mv("./public/product-images/" + id + "first" + ".jpg");
    image2.mv("./public/product-images/" + id + "second" + ".jpg");
    image3.mv("./public/product-images/" + id + "third" + ".jpg");
    image4.mv(
      "./public/product-images/" + id + "fourth" + ".jpg",
      (err, done) => {
        if (!err) {
          res.redirect("/admin/product-manager");
        } else {
          console.log(err);
        }
      }
    );
  });
});

router.get("/delete-product/:id", (req, res) => {
  let proId = req.params.id;
  console.log(proId);
  productHelpers.deleteProduct(proId).then((response) => {
    res.redirect("/admin/product-manager/");
  });
});

router.get('/edit-product/:id',async(req,res)=>{
  let product=await productHelper.getProductDetails(req.params.id)
  console.log(product);
  res.render('admin/edit-product',{admin:true, product})
})

router.post("/edit-product/:id", (req, res) => {
  let id = req.params.id;
  
  productHelpers.updateProduct(req.params.id, req.body).then(() => {
    res.redirect("/admin/product-manager");
    if (req.files.image1) {
      let image1 = req.files.image1;
      image1.mv("./public/product-images/" + id + "first" + ".jpg");
    } else if (req.files.image2) {
      let image2 = req.files.image2;
      image2.mv("./public/product-images/" + id + "second" + ".jpg");
    } else if (req.files.image3) {
      let image3 = req.files.image3;
      image3.mv("./public/product-images/" + id + "third" + ".jpg");
    } else if (req.files.image4) {
      let image4 = req.files.image4;
      image4.mv("./public/product-images/" + id + "fourth" + ".jpg");
    }
  });
});



module.exports = router;
