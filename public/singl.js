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
      console.log(cart)  
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
  
  /*Vue.component("swiper-slide",{
   
    template:  `<div class = "featured_items_box">
                  <a href = "#"><img v-bind:src = "item.img"></a>
                  <h2 class = "items_list_text">{{item.name}}</h2>
                  <p class = "items_list_price">{{item.price}}</p>
                  <div class = "add_tocard"><a href= "#" @click.prevent="handleBuyClick(item)">Add to card</a></div>
               </div>`, 
    methods: {
        handleBuyClick(item) {
        this.$emit("onBuy", item);
      }
    },         

    data() {
      return {
        relatItems: [],
      };
    },
  
    mounted () {
      fetch (`${API_URL}/related`)
      .then(response => response.json())
      .then((items) => {
        this.relatItems = items;
      });
    },

  });
 
  Vue.component ("swiper", {
    props: ["items"],
    
    template: `
                 <swiper-slide v-for="entry in items" :item="entry" @onBuy="handleBuyClick"></swiper-slide>
                  
                `,
    methods: {
      handleBuyClick(item){
        this.$emit("onbuy", item);
      }
    },
    data() {
      return {
        relatItems: [],
      };
    },
  
    mounted () {
      fetch (`${API_URL}/related`)
      .then(response => response.json())
      .then((items) => {
        this.relatItems = items;
      });
    },
  }); */

  Vue.use(VueAwesomeSwiper)

 //корневой компонент 
 const app = new Vue({
  el: "#vue",
  data: {
    cart:[],
    relatItems: [],
    swiperOption: {
      slidesPerView: 4,
      spaceBetween: 20,
      slidesPerGroup: 4,
      loop: true,
      loopFillGroupWithBlank: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      }
    }

  },
  components: {
    LocalSwiper: VueAwesomeSwiper.swiper,
    LocalSlide: VueAwesomeSwiper.swiperSlide,
  },
  
  mounted() {
   fetch(`${API_URL}/cart`)
      .then(response => response.json())
      .then((items) => {
        this.cart = items;
      });

      fetch (`${API_URL}/related`)
      .then(response => response.json())
      .then((items) => {
        this.relatItems = items;
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
    
    handleBuyClick(item) {
        const cartItem = this.cart.find((entry) => entry.id === item.id);
        if (cartItem) {                           // товар в корзине уже есть, нужно увеличить количество
          fetch(`${API_URL}/cart/${item.id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ quantity: cartItem.quantity + 1 }),
          })
            .then((response) => response.json())
            .then((item) => {
              const itemIdx = this.cart.findIndex((entry) => entry.id === item.id);
              Vue.set(this.cart, itemIdx, item);
            });
        } else {                                 // товара в корзине еще нет, нужно добавить
          fetch(`${API_URL}/cart`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...item, quantity: 1 })
          })
            .then((response) => response.json())
            .then((item) => {
              this.cart.push(item);
            });
        }
      },
  
  }
  })

