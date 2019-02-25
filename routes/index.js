var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var Cart = require('../models/cart');
var Order = require('../models/order');

/* GET home page. */
router.get('/', function(req, res, next) {
  var products = Product.find(function(err,doc){
      var productChunk = [];
      var chunkSize = 3;
      for(var i=0;i<doc.length;i=i+chunkSize){
          productChunk.push(doc.slice(i,i+chunkSize));
      }
      var success = req.flash('success')[0];
      res.render('shop/index', { title: 'Shopping Cart', products: productChunk ,success:success,noMessage:!success});
  });
});

router.get('/reduce/:id',function(req,res,next){
    var productId = req.params.id;
    var cart = new Cart(req.session.cart?req.session.cart:{});

    cart.reduce(productId);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
});


router.get('/remove/:id',function(req,res,next){
    var productId = req.params.id;
    var cart = new Cart(req.session.cart?req.session.cart:{});

    cart.remove(productId);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
});


router.get('/add-to-cart/:id',function(req,res,next){
    var productId = req.params.id;
    var cart = new Cart(req.session.cart?req.session.cart:{});

    Product.findById(productId,function(err,product){
        if(err){
            return res.redirect('/');
        }
        cart.add(product,product.id);
        req.session.cart = cart;
        console.log(req.session.cart);
        return res.redirect('/');
    })
});

router.get('/shopping-cart',function(req,res,next){
    if(!req.session.cart){
        return res.render('shop/shopping-cart',{products:null});
    }
    var cart = new Cart(req.session.cart);
    return res.render('shop/shopping-cart',{products:cart.generateArray(),totalprice:cart.totalCost});
});

router.get('/checkout',isLoggedIn,function(req,res,next){
   if(!req.session.cart){
        return res.redirect('/shopping-cart');
    }

    var cart = new Cart(req.session.cart);
    var errMsg = req.flash('error')[0];
    return res.render('shop/checkout',{total: cart.totalCost,errMsg:errMsg,noerrors:!errMsg});
});

router.post('/checkout',isLoggedIn,function(req,res,next){
   if(!req.session.cart){
       return res.redirect('/shopping-cart');
   }
   var cart = new Cart(req.session.cart);
   var stripe = require("stripe")("sk_test_AXHMBIJA4CYu1A4Q6kamEJED");

   var token = req.body.stripeToken; // Using Express

    // Charge user
    stripe.charges.create({
      amount: cart.totalCost*100,
      currency: "usd",
      description: "Example charge",
      source: token,
    }, function(err, charge) {
        if(err){
            req.flash('error',err.message);
            return res.redirect('/checkout');
        }

        var order = new Order({
            user: req.user,
            cart : cart,
            address : req.body.address,
            name: req.body.name,
            paymentId : charge.id
        });

        order.save(function(err,result){
        req.flash('success','Successfuly bought product!!');
        req.session.cart = null;
        res.redirect('/');
        });
    });
});

module.exports = router;

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.session.oldUrl = req.url;
    res.redirect('/user/signin');
}
