


import Web3 from 'web3'


const web3utils = Web3.utils



export default class IndexerBurnBook {

    static async modifyLedgerByEvent(event,mongoInterface){ 
  
        let eventName = event.event   

        let outputs = event.returnValues
 
        let contractAddress = web3utils.toChecksumAddress(event.address )
        if(!eventName){
 
            console.log('WARN: unknown event in ', event.transactionHash )
            return
        }
 
        eventName = eventName.toLowerCase() 

        
        if(eventName == 'tokensburned'){
 
            let from = web3utils.toChecksumAddress( outputs['0'] )
            let token =  web3utils.toChecksumAddress( outputs['1'] )
            let tokens =   parseInt(outputs['2'])
 
 
            await IndexerBurnBook.incrementBurnedAmount( contractAddress,  from, token, tokens , mongoInterface )
             
        }
          

    }
 

   static async incrementBurnedAmount(contractAddress, from, token, tokens, mongoInterface){

       let collectionName = 'erc20_burned' 

       let existing = await mongoInterface.findOne(collectionName, {from: from, token: token, contractAddress: contractAddress  }  )

        let amountDelta = parseInt(tokens)

       if(existing){
        await mongoInterface.updateCustomAndFindOne(collectionName, {from: from, token: token, contractAddress: contractAddress } , {  $inc: { amount: amountDelta } } )
    }else{
        await mongoInterface.insertOne(collectionName, {from: from, token: token, contractAddress: contractAddress, amount: amountDelta }   )
    }
   }

 


}