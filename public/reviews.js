const API_URL = "http://localhost:3000";

/*Vue.component("reviews", {
     
    data() {
      return {
      reviews: [],
     };
   },   

   mounted() {
       fetch(`${API_URL}/reviews`)
       .then(response => response.json())
       .then((reviews) => {
         this.reviews = reviews;
       });
   },
 
   methods:{
      
    },
 
   });*/



const app = new Vue({
   el: "#vue",
   data: {
     reviews:[]
   },  
   mounted() {
      
        fetch(`${API_URL}/reviews`)
        .then(response => response.json())
        .then((reviews) => {
            this.reviews = reviews;
          
        });
    },

    methods: {
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
            

            }
          
    }

   });
  
   
   
