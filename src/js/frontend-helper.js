

  
 
import axios from "axios";

const env = process.env.NODE_ENV



const clientConfig = require('../config/clientConfig.json')[env]
 

export default class FrontendHelper {

    constructor( ){
      

    }

    static async requestAccessChallenge(publicAddress){
      let api_root = FrontendHelper.getRouteTo('api')


      let uri = api_root.concat( '/generate_access_challenge/' )
      let inputData = {publicAddress: publicAddress} 


      return new Promise(   (resolve, reject) => {

        axios.post(uri, inputData )
        .then((res) => {
           
             console.log(res.data)
             let results = res.data
            
       
              resolve(results)
  
         }) .catch((error) => {
             console.error(error)
             reject(error)
         })
  
     }); 

     
    }

    static async requestAccessToken(publicAddress , signature){
      /*let api_root = FrontendHelper.getRouteTo('api')


      let uri = api_root.concat('/generate_access_token')
      let inputData = {publicAddress:publicAddress,signature:signature} 


      return new Promise(   (resolve, reject) => {

        axios.post(uri, inputData )
        .then((res) => {
           
             console.log(res.data)
             let results = res.data
            
       
              resolve(results)
  
         }) .catch((error) => {
             console.error(error)
             reject(error)
         })
  
     }); */

     let inputData = {publicAddress:publicAddress,signature:signature} 


     return await FrontendHelper.handleAPIRequest('/generate_access_token',inputData)

     
    }

    static async handleAPIRequest(endpoint, inputData ){
        let api_root = FrontendHelper.getRouteTo('api')
  
  
        let uri = api_root.concat(endpoint/*'/generate_access_token'*/)
        //let inputData = {publicAddress:publicAddress,signature:signature} 
  
  
        return new Promise(   (resolve, reject) => {
  
          axios.post(uri, inputData )
          .then((res) => {
             
               console.log('res', res.data)
               let results = res.data
              
         
                resolve(results)
    
           }) .catch((error) => {
               console.error(error)
               reject(error)
           })
    
       }); 
  
       
      }


    static getRouteTo(dest){

        console.log('ENV IS ', env )

        return clientConfig.external_routes[dest]
      

    }


}