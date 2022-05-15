
 
//import axios from "axios";
const axios = require('axios')
  
 

export async function resolveRestQuery(uri, inputData){

  return new Promise(   (resolve, reject) => {

    axios.post(uri, inputData )
    .then((res) => {
       
         console.log('res.data',res.data)
         let results = res.data
        
   
          resolve(results)

     }) .catch((error) => {
         console.error('rest error', error)
         reject(error)
     })

 }); 

}
