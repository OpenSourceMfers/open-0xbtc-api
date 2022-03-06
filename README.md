# Open 0xBitcoin API
 
  API Service for 0xBTC Mineable Token
 

 


### TODO
-write a script that loops through all erc20_mint in order to generate estimated difficulty for each record 
-write a script that loops through all erc20-mint in order to generate estimated hashrate for each record 

 

 -try to connect to bootstrap.0xbtc.io -> this is the p2p bootstrapping server.  This will help build a list of other nodes to connect to.  It will also provide a list of datahash checkpoints..  Nodes which are not abiding by these checkpoints will be ignored/blocked.  

 -build my own p2p engine using mongo (class)
 


### Pre-requisite
```
install Nodejs 14

```


### Development commands
```
npm install
npm run server-dev  (in terminal 1)
npm run dev  (in terminal 2)
```


### Run Tests
```
npm install
npm run test  
```



### Packaging commands
```
npm run build
npm run server
```


## using pm2

 pm2 start pm2.config.json --env production 
pm2 monit 



## running tasks 

NODE_ENV=staging yarn tasks



## making a request 

POST 
/api/v1/:app_id

rinkeby.starflask.com/api/v1/test

{"requestType": "ERC721_balance_by_owner", "input":{"publicAddress":"0x99a848F6d8bb6D6Cd1A524B3C99a97e41e1E4b5A"}  }
 
