# Open 0xBitcoin API
 
  API Service for 0xBTC Mineable Token
 

 


### TODO 

 -make a task that wipes all difficulty era and hashrate data (not vibegraph data) -> new table ? 

 
 -store checkpoint datahashes of this data (sets of mints -> merkle tree ?   -> store in era row ?  no ->  separate table ) 

 -try to connect to bootstrap.0xbtc.io -> this is the p2p bootstrapping server.  This will help build a list of other nodes to connect to.  It will also provide a list of datahash checkpoints..  Nodes which are not abiding by these checkpoints will be ignored/blocked.  

 -build my own p2p engine using mongo (class)
 


### Pre-requisite
```
install Nodejs 14

install MongoDB Community Edition

```


### Development commands
```
npm install
npm run server-dev  (in terminal 1 for api service)
npm run dev  (in terminal 2 for live-watched web server)
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

NODE_ENV=production yarn tasks



## making a request 

POST 
/api/v1/:app_id

rinkeby.starflask.com/api/v1/test

{"requestType": "ERC721_balance_by_owner", "input":{"publicAddress":"0x99a848F6d8bb6D6Cd1A524B3C99a97e41e1E4b5A"}  }
 



 ## Real data 
 epoch 189848
 target 2495467076135289833464849845656757122614752268471404094735851

estimated:
        2495467076135289833464849845656757122614752268471404094735851
