var Product = require('../models/product');

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/shopping',{ useNewUrlParser: true });

var products = [
    new Product({
        imagePath:'https://n4.sdlcdn.com/imgs/f/k/e/Nike-Poplar-Willow-Cricket-Bat-SDL552812155-1-6cbe8.jpg',
        title:'Nike Cricket Bat',
        description:'Rahane English Willow bat.',
        price:120
    }),
    new Product({
        imagePath:'https://images-na.ssl-images-amazon.com/images/I/714Jx3gXszL._SY679_.jpg',
        title:'MRF cricket bat',
        description:'Kohli special edition Genius MRF english willow bat. ',
        price:150
    }),
    new Product({
        imagePath:'https://cdn.shopclues.com/images1/thumbnails/94796/320/320/142453641-94796066-1542279289.jpg',
        title:'Spartan cricket bat',
        description:'MSD special Kashmir willow bat. ',
        price:140
    }),
    new Product({
        imagePath:'https://images-na.ssl-images-amazon.com/images/I/71LZ1tXNS6L._SX425_.jpg',
        title:'Ceat cricket bat',
        description:'Hitman version english willow bat. ',
        price:125
    }),
    new Product({
        imagePath:'https://www.meulemans.com.au/wp-content/uploads/2017/06/Gray-Nicolls-XXX-Limited-Edition-Cricket-bat-1.jpg',
        title:'Gray Nicolls cricket bat',
        description:'Williamson special English willow bat. ',
        price:130
    }),
    new Product({
        imagePath:'https://5.imimg.com/data5/DF/FK/MY-6897438/sg-cricket-bat-500x500.jpg',
        title:'Sg cricket bat',
        description:'Pandya special english willow bat for powerful hitting.',
        price:135
    }),
];

var done=0;
for(var i=0;i<products.length;i++){
    products[i].save(function(err,result){
        done++;
        if(done===products.length){
            exit();
        }
    })
}

function exit(){
    mongoose.disconnect();
}
