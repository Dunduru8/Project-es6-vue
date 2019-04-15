const express = require ("express");
const fs = require ("fs");
const bodyParser = require("body-parser");
const moment = require("moment"); //подключаем библиотеку для записывания даты  и времени (npm i moment) 

const app = express(); // создаем приложение с использованием фреймв. express


app.use(express.static("./public"));
app.use(bodyParser.json());

app.get("/goods", (req, res) => {
    fs.readFile("./db/goods.json", "utf-8", (err, data) => {
       if(err) {
           return console.log(err)
       }
       res.send(data);
    });
});

app.get("/cart", (req, res) => {
    fs.readFile("./db/cart.json", "utf-8", (err, data) => {
        if(err) {
            return console.log(err)
        }
        res.send(data);
     });
});

app.use ( "/cart", (req, res, next) => {                        //перехватываем все запросы, идущие к козрине, 
    if(["POST", "PATCH", "DELETE"].includes(req.method)){      //проверяем что это один из необходимых методов
    const mapping = {
        "POST": "Добавление",
        "PATCH": "Редактирование",
        "DELETE": "Удаление",
    };
    fs.readFile("./db/stats.json", "utf-8", (err, data) => {    
        const stats = JSON.parse(data);
        console.log(stats);
        
        switch (req.method) {
            case "POST":                                                    
            stats.push({                                    
                action: mapping[req.method],                //записываем из mapping название метода 
                name: req.body.name,                        //и из req.body название товара
                tamestamp: moment().format(),
            });   
            console.log(stats);                   
            fs.writeFile("./db/stats.json", JSON.stringify(stats), (err) => {   //записываем в файл новую статистику     
                console.log(err);
            });                                                 
            break;
            
            case "PATCH":
            case "DELETE":
               const [,, id] = req.url.split("/"); //в url приходит запись: "название метода" / id, мы выделяем из нее id
               
               fs.readFile("./db/goods.json", "utf-8", (err, data) => {   
                   const goods = JSON.parse(data);
                   const good = goods.find((item) => item.id === +id); //в списке товаров ищем товар, id которого совпадает
                   
                   stats.push({                                    
                    action: mapping[req.method],                //записываем из mapping название метода 
                    name: good.name,                           // название товара из const good
                    tames: moment().format(),
                }); 
                fs.writeFile("./db/stats.json", JSON.stringify(stats), (err) => {      //записываем в файл новую статистику 
                 console.log(err);            
                });                   
                });  
                    
            }
     });
    }
    next();                                                    //можно пропустить запрос дальше или что то сделать с ним, в данном случае   
});                                                            //все запросы пропускаем дальше

app.post("/cart", (req, res) => {
    fs.readFile("./db/cart.json", "utf-8", (err, data) => {
        if(err) {
            return console.log(err)
        }
    const cart = JSON.parse(data);
    cart.push(req.body);
    
    fs.writeFile("./db/cart.json", JSON.stringify(cart), (err) => {
        if(err) {
            return console.log(err);
        }
        res.send(req.body); 
    })
    });
}); 

app.patch("/cart/:id", (req, res) => {
    fs.readFile("./db/cart.json", "utf-8", (err, data) => {    
        if(err) {
            return console.log(err)
        }
    let cart = JSON.parse(data);            
    
    cart = cart.map((item) => {
        if(item.id === +req.params.id) {
           return {...item, ...req.body};
        }
        return item;
       });

    fs.writeFile("./db/cart.json", JSON.stringify(cart), (err) => {
        if(err) {
            return console.log(err);
        }
        res.send(cart.find((item) => item.id === +req.params.id)); 
    })
    });
});

app.delete("/cart/:id", (req, res) => {
    fs.readFile("./db/cart.json", "utf-8", (err, data) => {        //читаем данные из файла cart.json
        if(err) {
            return console.log(err)
        }
    let cart = JSON.parse(data);                                //парсим файл cart.json
    const deleted = cart.find((item) => item.id === +req.params.id);   //находим товар, который нужно удалить
    cart = cart.filter((item) => item.id !== +req.params.id);       //отфильтровывем корзину, убирая из нее удаляемый товар
    
    fs.writeFile("./db/cart.json", JSON.stringify(cart), (err) => {
        if(err) {
            return console.log(err);
        }
        res.send(deleted);     //отправляем серверу ответ с товаром для удаления
    })
    });
});


app.listen(3000, () => {         //для прослушивания порта
    console.log("server has been started");
})                         