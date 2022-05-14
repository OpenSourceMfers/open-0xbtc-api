 
import ExtensibleDB from 'extensible-mongoose'
 

import { ControllerMethod } from "degen-route-loader"


import web3utils from 'web3-utils'
import { ERC20MintDefinition } from '../dbextensions/ERC20DBExtensions';




const MAX_ROWS_RETURNED = 500;

export default class APIController   {


 

    constructor(public mongoInterface: ExtensibleDB){}

  

    ping: ControllerMethod =  async (req: any) => {
         return {success:true, data:'pong'}
    }




    getMints: ControllerMethod =  async (req: any) => {
 

        let inputParameters = req.fields

        let {contractAddress } = inputParameters

        let spacing = parseInt( inputParameters.spacing )
        let size = parseInt( inputParameters.size )
        let startEpoch = parseInt( inputParameters.startEpoch )
        
        let results = await APIController.findERC20Mints(this.mongoInterface, contractAddress, startEpoch, size, spacing)

       // await ApplicationManager.logNewRequest(appId,inputData.requestType,inputParameters,results, mongoInterface)

        return {success:true, input: inputParameters, output: results  }


        return {success:true, data:'pong'}
   }



   static async findERC20Mints(mongoInterface:ExtensibleDB, contractAddress:string , startEpoch:number , size: number , spacing: number ){

    if(!contractAddress){
        contractAddress = "0xb6ed7644c69416d67b522e20bc294a9a9b405b31"
    }

    contractAddress = web3utils.toChecksumAddress(contractAddress)


    if(!startEpoch){
        startEpoch = await APIController.findLatestMintEpoch( mongoInterface,contractAddress  )
    }

    let epochArray = [startEpoch]

    if(!spacing || isNaN(spacing) || spacing < 1) spacing = 1 

    if(!size || isNaN(size) || size < 1) size = 1 

    if(size > MAX_ROWS_RETURNED) size = MAX_ROWS_RETURNED
    
    let nextEpoch = startEpoch
    for(let i=1;i<size;i++){
        nextEpoch -=  (spacing) 
        epochArray.push(nextEpoch)
    }
    

    return await mongoInterface.getModel(ERC20MintDefinition).find({contractAddress: contractAddress, epochCount: {$in: epochArray} })
}
    
static async findLatestMintEpoch(mongoInterface:ExtensibleDB, contractAddress : string ){
    let mint  = await mongoInterface.getModel(ERC20MintDefinition).findOne({contractAddress: contractAddress, hashrate_avg8mint: {$exists: true } }).sort( {epochCount: -1})

    if(mint){
        return mint.epochCount
    }

    return 0 
}

 





}