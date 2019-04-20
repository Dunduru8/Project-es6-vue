const API_URL = "http://localhost:3000";


Vue.component("cart_item", {
    props: ["item"],
  
    template: `<div>
                     <div class= "item_cart">
                       <div class= "item_cart_right">
                         <a href="Singl.html"><img v-bind:src = "item.thumb" alt="item"></a>
                             <ul class="item_cart_text">
                               <li><a href="Singl.html">{{item.brand}} {{item.name}}</a></li>
                               <li><img src="https://student-geekbrains.000webhostapp.com/img/stars.jpg" alt="stars"></li>
                               <li>Color: {{item.color}}</li>
                               <li>Size: XL</li>
                             </ul>
    
                        </div>
                      <div class= "item_cart_left">
                             <ul class="cart_nav_text_left">
                                 <li>{{item.price}}</li>
                                 <li>{{item.quantity}}</li>
                                 <li>free</li>
                                 <li>{{item.price * item.quantity}}</li>
                                 <li><a href="#" @click.prevent="handleDeleteClick(item)"> <img src="https://student-geekbrains.000webhostapp.com/img/del.png" alt="del"></a></li>		
       
                             </ul>
                      </div>
                    </div> 
                    <div class= "border_line"></div>
                </div>`,
  
    methods:{
      handleDeleteClick(item){
        this.$emit("onDel", item);
      }
     },
  
    });
  
    Vue.component("cart_list", {
     props: ["drop"],
     
     template: `<div>
                 <cart_item v-for="entry in drop" :item="entry" @onDel="handleDeleteClick"> </cart_item>
                </div>`, 
    
     data() {
       return {
         cart: [],
        };
      },
      
    mounted() {
      fetch(`${API_URL}/cart`)
      .then(response => response.json())
      .then((items) => {
        this.cart = items;   
       });
    },
  
    methods: { 
      handleDeleteClick(item) {
      this.$emit("ondel", item);
        },
  
    },
    computed: {
      total() {
      return this.cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
    }
    }
  
    });
  
 Vue.component("total", {
    template:  `<div class="cart_checkout">
                     <div class= "subTotal">
                          <h3>Sub total</h3>
                          <p id = "total_price">{{total}}</p>
                     </div>
                     <div class="garndTotal">
                          <h3>GRAND TOTAL</h3>
                          <p>{{total}}</p>
                     </div>
                     <div class="grandTotal_border"></div>
                     <div class="checkOut_buttonInCart"><a href="Checkout.html">proceed to checkout</a></div>  
                </div>`, 
    data() {
       return {
         cart: [],
        };
      },
      
    mounted() {
      fetch(`${API_URL}/cart`)
      .then(response => response.json())
      .then((items) => {
        this.cart = items;   
       });
    }, 
    computed: {
        total() {
        return this.cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
      }
      },
 })   

//корневой компонент 

const app = new Vue({
    el: "#vue",
    data: {
      cart:[],
      filterValue: "",
    },
  
    mounted() {
      fetch(`${API_URL}/cart`)
        .then(response => response.json())
        .then((items) => {
          this.cart = items;
        });
    },
  
    methods: {
      
      handleSearchClick(query) {
        this.filterValue = query;
      },
    
     
      handleDeleteClick(item) {
        if (item.quantity > 1) {
          fetch(`${API_URL}/cart/${item.id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ quantity: item.quantity - 1 }),
          })
            .then((response) => response.json())
            .then((item) => {
              const itemIdx = this.cart.findIndex((entry) => entry.id === item.id);
              Vue.set(this.cart, itemIdx, item);
            });
        } else {
          fetch(`${API_URL}/cart/${item.id}`, {
            method: "DELETE",
          })
            .then(() => {
              this.cart = this.cart.filter((cartItem) => cartItem.id !== item.id);
            });
        }
    },
    handleDeleteAllClick() {
      cartDel = this.cart
      cartDel.forEach(function(item){
        fetch(`${API_URL}/cart/${item.id}`, {
          method: "DELETE",
          })
          .then(() => {
            this.cart = this.cart.filter((cartItem) => cartItem.id !== item.id);
          });
      });
      
      }
  }
  })
    