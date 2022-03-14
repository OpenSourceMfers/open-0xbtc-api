# Open 0xBitcoin API
 
  API Service for 0xBTC Mineable Token
 

 


### TODO 

  
 -store checkpoint datahashes of this data (sets of mints -> merkle tree ?   -> store in era row ?  no ->  separate table ) 

 -try to connect to bootstrap.0xbtc.io -> this is the p2p bootstrapping server.  This will help build a list of other nodes to connect to.  It will also provide a list of datahash checkpoints..  Nodes which are not abiding by these checkpoints will be ignored/blocked.  

 -build   p2p engine using mongo (class) so nodes can share data (speed up so they dont need to fetch from vibegraph)
 


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

https://apidocs.0xbtc.io