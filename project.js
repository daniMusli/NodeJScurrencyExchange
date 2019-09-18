var express=require('express') // include the express module 
var request=require("request") // request module to get the info from link
var bodyParser=require('body-parser') // to parse the post request to get the value
// of the selected option 
var app=express() // initialize an express environment 
app.use(bodyParser.json())// in case the json is complicated for the json.parse method 
// (we didnt use it)
app.use(bodyParser.urlencoded({extended:true}))
var jsonObj // declared as global to get its value and use it in app.post
// without the need to get the info from the link again  
var url = "https://api.canlidoviz.com/web/items?marketId=1&type=0"
// incoming get request from root will be processed here 
app.get('/',function(req,res){  
    request(url,function(error,response,body){ // request the info from link 
        if(!error&&(response.statusCode==200))// if there was no error with the connection 
        {
           
            jsonObj= JSON.parse(body)
            // here we add the html page part by part as we cant use external 
            // html because we are building the page upon javascript variables in this page 
            // and sending each variable and recieve it over the html page is not an efficient use 
            // html + css 
            var html = '<html><head><style>'
            html+= 'button{height:20px;width:100px;margin: 60px -120px; position:relative;top:50%; left:50%;}'

            html+='.centerDiv{width: 50%;height:370px;margin: 0 auto;background-color:#eff1f4 ;}'
            html+='.div1{width: 40%;height:370px;background-color:#eff1f4 ;float:left;}'
            html+='.div2{width: 60%;height:370px;background-color:#eff1f4 ;float:left;}</style>'
            html+= '</head><body><div class="centerDiv"><div class="div1"><label><b>Kurlar:</b></label><br>'
            // here i used 20 instead of length to give the page better look and prevent the page to go to scroll 
            html+= '<form action="/" method="POST"><select name="kurlar" size=20 onchange="this.form.submit()">'
            // when an option is chosen send its value to the server by post method 
            // we write it inside form to take advantage of the action and method  attribute 
            for (var i = 0 ; i <jsonObj.length; i++){
            // dynamicly create each option  
                    html+=  '<option value='+i+'> '+jsonObj[i].name+'</option>'  
            }
            html+= '</select></form></div>'
            html+='<div class="div2"><br><br><br><label id="kurIsmi">Kur Ismi : </label><br><br>'
            html+= '<label>Alış : </label><br><br><label>Satış : </label><br><br>'
            html+= '<label>Yüzde Değişim : </label><br><br><label>Satış : </label><br>'
            // again we added button inside form to refresh data we send a request from client to server 
            html+= '<form action="/" method="GET"><button type="button" onclick="this.form.submit()">Kurları Yenile</button></form>'
            html+='</div></div>'
            html+= '</body></html>'
            res.send(html)

        }
        else
        {
            res.send("There is no valid response from the API.");
        }
    })
}) 
// post request to get values from server side 
app.post('/', function (req, res) {
    var index = req.body.kurlar// get the value of kurlar 0=66
    var html = '<html><head><style>'
    html+= 'button{height:20px;width:100px;margin: 60px -120px; position:relative;top:50%; left:50%;}'
    html+='.centerDiv{width: 50%;height:370px;margin: 0 auto;background-color:#eff1f4 ;}'
    html+='.div1{width: 40%;height:370px;background-color:#eff1f4 ;float:left;}'
    html+='.div2{width: 60%;height:370px;background-color:#eff1f4 ;float:left;}</style>'
    html+= '</head><body><div class="centerDiv"><div class="div1"><label><b>Kurlar:</b></label><br>'
    html+= '<form action="/" method="POST"><select name="kurlar" size=20 onchange="this.form.submit()">'
    for (var i = 0 ; i <jsonObj.length; i++)
    {
        html+=  '<option value='+i+'> '+jsonObj[i].name+'</option>'  
    }
    html+= '</select></form></div>'
    html+='<div class="div2"><br><br><br><label id="kurIsmi">Kur Ismi :<span style="color:black;font-weight:bold">'+jsonObj[index].name+'</span></label><br><br>'
    html+= '<label>Alış : <span style="color:black;font-weight:bold">'+Number(jsonObj[index].buyPrice).toFixed(4)+'</span></label><br><br><label>Satış : <span style="color:black;font-weight:bold">'+Number(jsonObj[index].sellPrice).toFixed(4)+'</span></label><br><br>'
    html+= '<label>Yüzde Değişim : <span style="color:red;font-weight:bold">'+jsonObj[index].dailyChangePercentage+'</span> </label><br><br><label>Döviz Kodu :<span style="color:black;font-weight:bold"> '+jsonObj[index].code+'</span> </label><br>'
    html+= '<form action="/" method="GET"><button type="button" onclick="this.form.submit()">Kurları Yenile</button></form>'
    html+='</div></div>'
    html+= '</body></html>'
    res.send(html)
})    
  
app.listen(5000,function(){console.log('Web Server is running at http://127.0.0.1:5000/')})
