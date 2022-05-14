
 
 import express from 'express'
 
 import cors from 'cors'
 const formidable = require('express-formidable')

  

// @ts-ignore
import  history from 'connect-history-api-fallback'
import  bodyParser from 'body-parser' 
 
import web3utils from 'web3-utils'

import http from 'http'
import https from 'https'

import DegenRouteLoader, { Route } from 'degen-route-loader'
 

import FileHelper from './file-helper'
import APIController from '../controllers/APIController'



const AllRoutes:Array<Route> = FileHelper.readJSONFile('./server/routes.json')
 

 

export default class WebServer  {



    server:https.Server|http.Server

    
    app:any

    apiPort:number

    degenRouteLoader:DegenRouteLoader

    constructor(
      public web3:any, 
      public serverConfig:any,
     

      public apiControllers: Array<{name:string, controller: APIController}>
      ){
      
 
         

        this.app = express()

        this.degenRouteLoader = new DegenRouteLoader()

        this.apiPort = this.serverConfig.port? this.serverConfig.port : 3000

        

      
        this.app.use(cors());
        this.app.use(formidable())
  
        
       
  
    }


    async start(    ){
      

      //Load all of the api controllers similar to rails 
     this.apiControllers.map( controllerData => {

        let filteredRoutes = AllRoutes.filter(x => (x.controller.toLowerCase() == controllerData.name.toLowerCase()))

        this.degenRouteLoader.loadRoutes( this.app, filteredRoutes, controllerData.controller)

      })


      
     
 
      //host static files from dist for webpage 
      const staticFileMiddleware = express.static('dist');
      this.app.use(staticFileMiddleware);
      this.app.use(history({
        disableDotRule: true,
        verbose: true
      }));
      this.app.use(staticFileMiddleware);

      


      this.app.listen(this.apiPort, () => {
        console.log(`API Server listening at http://localhost:${this.apiPort}`)
      })


 

    }
 

}