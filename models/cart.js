module.exports = function Cart(oldCart){
    this.items = oldCart.items || {};
    this.totalqty = oldCart.totalqty || 0;
    this.totalCost = oldCart.totalCost || 0;
    
    this.add = function(item,id){
        var storedItem = this.items[id];
        if(!storedItem){
            storedItem = this.items[id] = {item:item,price:0,qty:0};
        }
        storedItem.qty++;
        storedItem.price = storedItem.qty*storedItem.item.price;
        this.totalqty++;
        this.totalCost += storedItem.item.price;
    };
    
    this.reduce = function(id){
        this.items[id].qty--;
        this.items[id].price -= this.items[id].item.price;
        this.totalqty--;
        this.totalCost -= this.items[id].item.price;;
        
        if(this.items[id].qty<=0){
            delete this.items[id];
        }
        
    }
    
    this.remove = function(id){
        this.totalqty -= this.items[id].qty;
        this.totalCost -= this.items[id].price;;
        delete this.items[id];
    }
    
    this.generateArray = function(){
        var arr = [];
        for(var id in this.items){
            arr.push(this.items[id]);
        }
        return arr;
    }
}