const API_URL = "http://localhost:3000";


Vue.component("cart_item", {
  props: ["item"],

  template: `<div class= "item_in_cart">
               <a href="#"><img v-bind:src = "item.thumb" alt="item_in_cart"></a>
               <div class= "about_item">
                 <h3 class="name_item">{{item.name}}</h3>
                 <div class= "stars"><a href="#"><img src="https://student-geekbrains.000webhostapp.com/img/stars.jpg" alt="stars"></a></div>
                 <div  class="item_price_cart">{{item.price}}</div>
                 <div class="item_price_cart">{{item.quantity}}</div>
               </div>
               <div class="delit_items">
                 <a href="#" @click.prevent="handleDeleteClick(item)"><img src="https://student-geekbrains.000webhostapp.com/img/del.png" alt="del"></a>
               </div>
             </div>`,

  methods:{
    handleDeleteClick(item){
      this.$emit("onDel", item);
    }
   },

  });

  Vue.component("cart_drop_list", {
   props: ["drop"],
   
   template: `<div>
               <div id = "empty_Cart">
                <cart_item v-for="entry in drop" :item="entry" @onDel="handleDeleteClick"> </cart_item>
              </div>
               <div class= "total">
                          <h3 class= "total_text" >total</h3>
                          <div class="tatal_price" id = "total_price">{{ total }}</div>
               </div>
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


 //корневой компонент 

 const app = new Vue({
  el: "#vue",
  data: {
    cart:[],
    filterValue: "",
  },
  components: {
  	vuejsDatepicker
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
  }
  })
    