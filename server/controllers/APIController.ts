 
import ExtensibleDB from 'extensible-mongoose'
 

import { ControllerMethod } from "degen-route-loader"



export default class APIController   {
 

    constructor(public mongoInterface: ExtensibleDB){}

  

    ping: ControllerMethod =  async (req: any) => {
         return {success:true, data:'pong'}
    }

    

}