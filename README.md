# Open 0xBitcoin API
 
  An API Service that can be self-hosted to download and cache the data and statistics for the ERC20 token '0xBitcoin'.  This data is served locally so you are able to easily integrate that data, trustlessly, for your Dapp frontend.   

  Since you are downloading the values from the blockchain yourself, you can be assured that the data about 0xbitcoin is accurate and trustlessly correct while you are using this API in your application.   
 

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

 