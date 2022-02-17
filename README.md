# Starflask API Web
 
Web frontend for API Service
 

 


### TODO
 
-allow logged-in users to generate API key 
-when a new request comes in, increment use counter on API key - limit max  

-Certain api keys will have allowlists - can only come from certain domain 






### Development commands
```
npm install
npm run server-dev  (in terminal 1)
npm run dev  (in terminal 2)
```

### Packaging commands
```
npm run build
npm run server
```


## using pm2

 pm2 start pm2.config.json --env production 
pm2 monit 



## making a request 

POST 
/api/v1/:app_id

rinkeby.starflask.com/api/v1/test

{"requestType": "ERC721_balance_by_owner", "input":{"publicAddress":"0x99a848F6d8bb6D6Cd1A524B3C99a97e41e1E4b5A"}  }
 