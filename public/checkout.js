const API_URL = "http://localhost:3000";

const app = new Vue({
   el: "#vue",
   data: {
     users:[],
     reviews:[],
     cart:[],
     isActive : false
   },  
   mounted() {
      fetch(`${API_URL}/users`)
        .then(response => response.json())
        .then((users) => {
          this.users = users;
        });

        fetch(`${API_URL}/reviews`)
        .then(response => response.json())
        .then((reviews) => {
            this.reviews = reviews.filter((item) => item.appruved !== "non approved");
        });

      fetch(`${API_URL}/cart`)
      .then(response => response.json())
      .then((items) => {
        this.cart = items;
      });

    },
    components: {
      vuejsDatepicker
   },

    methods: {
      handleSendClick(){  
         const arrNameCheck = [document.getElementById("name"), document.getElementById("sername") ];
         let checkCount = true;
         let regexp = /^[a-zA-Zа-яА-ЯёЁ]+$/;
         for (var i = 0; i < arrNameCheck.length; i++){
              if (regexp.test(arrNameCheck[i].value) == true){
                 arrNameCheck[i].style.border = "";  
              }else{
                 arrNameCheck[i].style.border ="1px solid #f16d7f";
                 checkCount = false;
              };
         }
         const $phoneChek = document.getElementById("phone").value;
         regexp = /^\+\d{1}\(\d{3}\)\d{3}-\d{4}$/;
          if (regexp.test($phoneChek) == true){
             document.getElementById("phone").style.border = "";
          }else{
             document.getElementById("phone").style.border = "1px solid #f16d7f";
             checkCount = false;
          };
      
         const $mail = document.getElementById("email_adress").value;
      
         const $password = document.getElementById("shipping_checkout").value;
         const $passwordRep = document.getElementById("shipping_checkout_repeat").value;
         if ($password === $passwordRep){
           document.getElementById("shipping_checkout").style.border = "";
           document.getElementById("shipping_checkout_repeat").style.border = "";
        }else{
           document.getElementById("shipping_checkout").style.border = "1px solid #f16d7f";
           document.getElementById("shipping_checkout_repeat").style.border = "1px solid #f16d7f";
           checkCount = false;
       };
         if (checkCount === true){
            const user = 
              {userName: $mail,
               password: $password 
              }
            
           document.getElementById("login").classList.add("checkout_buttonHide")
           fetch(`${API_URL}/users`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({userName: $mail,
               password: $password 
              }) 
            })
              .then((response) => response.json())
              .then(() => {
                this.users.push(user);
              });
         }else{
           const $dialog = document.getElementById("dialog");
           $dialog.classList.add("marcked");
         }
      
      
      },
      
      handleSendReviewsClick(){
         const $review = document.getElementById("review").value;
        
         fetch(`${API_URL}/reviews`, {
             method: "POST",
             headers: {
               "Content-Type": "application/json",
             },
             body: JSON.stringify({ text: $review,
                 appruved: "non approved"
             }) 
           })
             .then((response) => response.json())
             .then(() => {
               this.reviews.push(reviews);
             });
        document.getElementById("review").value = "";
         
   
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

      handleLoginClick(){
        const $username = document.getElementById("userName").value;
        const $passwordUser = document.getElementById("password").value;
        const userID = {
          userName: $username,
          password: $passwordUser
          };
          fetch(`${API_URL}/users`)
            .then(response => response.json())
            .then(() => {
               const userLog =  this.users.findIndex(user => user.userName === userID.userName & user.password === userID.password)
                if(userLog > -1){
                    fetch(`${API_URL}/reviews`)
                       .then(response => response.json())
                       .then((reviews) => {
                        this.reviews = reviews;
                      });
                      document.getElementById("passwordIncorr").style.display = "";
                      document.getElementById("userName").value = "";
                      document.getElementById("password").value = "";
                      document.getElementById("register").style.display = "none"
                }else {
                  document.getElementById("passwordIncorr").style.display = "flex";
                }
             });
          
           }
      
     }

   });

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
  