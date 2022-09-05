const express = require('express')//express是node中的后端框架
const fs = require('fs')

const app = express()

app.engine('html', require('express-art-template'))//解析html要引入使用express-art-template

app.use('/node_modules', express.static('./node_modules'))
//别名                开放静态资源
app.use('/public', express.static('./public'))
//配置body-parser，前端post给后端的信息，后端要用req.body来接收，要使用req.body必须借助body-parser
//express里原本不具备接收post信息的能力，要借助外部差价body-parser，以前老版本的express中必须安装express后，在安装body-parser
//现在body-parse被内置在了express中
app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.get('/', function (req, res) {
    //  res.send('我是服务器信息')
    res.render('boot-login.html')
})

app.post('/login', function (req, res) {
    //req(request请求)是前端给后端的信息，res(response)是后端给前端的信息,只跟位置有关
    console.log(req.body)

    fs.readFile('./data/users.json', function (error, data) {
        if (error) {
            console.log(error)
        } else {
            console.log(JSON.parse(data))
            /*for (item of JSON.parse(data)){
                if (item.account==req.body.account&&item.account==req.body.password){
                    res.render('index.html')
                }else{
                   res.send('账号或密码错误')
                }
            }*/
            const user = JSON.parse(data).find(function (item) {
                return item.account == req.body.account
            })//find方法，是把数组里的每一个元素都拿出来根据return的条件进行比较，函数的传参就代表数组中的每一个元素（循环）
            //如果能找到，则ueser就是满足条件的第一个对象（找到一个后，不在继续往后查找了）
            //如果找不到，则user是undefined

            if (user && user.password == req.body.password) {
                delete user.password
                res.render('index.html', {user})
            } else {
                res.send('账号或密码错误')
            }
        }
    })
})

app.get('/test_account', function (req, res) {
    console.log(req.query)
    fs.readFile('./data/users.json', function (error, data) {
        if (error) {
            console.log(error)
        } else {
            /*const aaa = JSON.parse(data).find(function (item) {
                return item.account == req.query.account
            })
            if (aaa) {
                res.send(ture)
            } else {
                res.send(false)
            }
            res.send(aaa ? true : false)
            res.send(Boolean(JSON.parse(data).find(function (item) {
                return item.account == req.query.account
            })))*/
            //null,0,'',undefined,NaN会被Boolean
            res.send(Boolean(JSON.parse(data).find(item => item.account == req.query.account)))
        }

    })
})

app.get('/addScore', (req, res) => {
    fs.readFile('./data/users.json', (error, data) => {
        if (error) {
            console.log(error)
        } else {
            /*const user = Json.parse(data).find(item => item.account == req.query.account)
            if (user) {
                user.bestScore = Math.max(req.query.scoreNum, user.bestScore)

            } else {
                res.send('用户不存在')
            }*/
            const users=JSON.parse(data)
            const index=users.findIndex(item=>item.account==req.query.account)
            users[index].bestScore=Math.max(req.query.scoreNum,users[index].bestScore)
            console.log(users)
            fs.writeFile('./data/users.json',JSON.stringify(users),error=>{
                if (error){
                    console.log(error)
                }
            })
        }
    })
})

app.listen(3000, function () {  //3000是端口号
    console.log('app is running...')
})