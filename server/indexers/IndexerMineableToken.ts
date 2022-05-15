

import Web3 from 'web3'


const web3utils = Web3.utils



export default class IndexerMineableToken {
 
    static async modifyLedgerByEvent(event,mongoInterface){

        await IndexerMineableToken.modifyERC20LedgerByEvent(event,mongoInterface)

    }





   
    static async modifyERC20LedgerByEvent(  event, mongoInterface){
     
       let eventName = event.event 

     //  console.log('event',event)
       
        let blockNumber = parseInt(event.blockNumber)

      

       let outputs = event.returnValues

       let contractAddress = web3utils.toChecksumAddress(event.address )
       if(!eventName){

           console.log('WARN: unknown event in ', event.transactionHash )
           return
       }

       eventName = eventName.toLowerCase()
       
       if(eventName == 'transfer'){

           let from = web3utils.toChecksumAddress( outputs['0'] )
           let to = web3utils.toChecksumAddress( outputs['1'] )
           let amount = parseInt(outputs['2']) 



           await IndexerMineableToken.modifyERC20LedgerBalance(   from ,contractAddress , amount * -1 , mongoInterface )
           await IndexerMineableToken.modifyERC20LedgerBalance(   to ,contractAddress , amount , mongoInterface) 

            
           await IndexerMineableToken.modifyERC20LedgerApproval(  contractAddress, from ,to  , amount * -1 , mongoInterface) 


           await IndexerMineableToken.modifyERC20TransferredTotal(  contractAddress, from, to, amount , mongoInterface) 

       }
       else if(eventName == 'approval'){

           let from = web3utils.toChecksumAddress(outputs['0'] )
           let to = web3utils.toChecksumAddress(outputs['1'] )
           let amount = parseInt(outputs['2']) 

           await IndexerMineableToken.setERC20LedgerApproval(   contractAddress , from, to,  amount  , mongoInterface ) 

       }
       else if(eventName == 'mint'){

           let to = web3utils.toChecksumAddress(outputs['0'] ) 
           let amount = parseInt(outputs['1']) 
           let epochCount = parseInt(outputs['2']) 
           

           await IndexerMineableToken.modifyERC20LedgerBalance(   to ,contractAddress , amount  , mongoInterface)  
           await IndexerMineableToken.mint(  to, contractAddress, amount , epochCount, blockNumber,   mongoInterface)  

       }
       else if(eventName == 'deposit'){

           let to = web3utils.toChecksumAddress(outputs['0'] ) 
           let amount = parseInt(outputs['1']) 

           await IndexerMineableToken.modifyERC20LedgerBalance(   to ,contractAddress , amount , mongoInterface)  

       }

       else if(eventName == 'withdrawal'){

           let from = web3utils.toChecksumAddress(outputs['0'] ) 
           let amount = parseInt(outputs['1']) 

           await IndexerMineableToken.modifyERC20LedgerBalance(   from ,contractAddress , amount * -1 , mongoInterface)  

       }

      
   }


   static async mint(accountAddress, contractAddress, amountDelta, epochCount, blockNumber, mongoInterface){

        let collectionName = 'erc20_mints' 

        console.log('save mint as ', collectionName)

        await mongoInterface.insertOne(collectionName, {accountAddress: accountAddress, contractAddress: contractAddress, amount: amountDelta , epochCount:epochCount,  blockNumber: blockNumber, lastUpdatedAt: Date.now()}   )

    
    }

   static async modifyERC20LedgerBalance(accountAddress, contractAddress, amountDelta, mongoInterface){

       let collectionName = 'erc20_balances' 

       let existingFrom = await mongoInterface.findOne(collectionName, {accountAddress: accountAddress, contractAddress: contractAddress }  )

       if(existingFrom){
           await mongoInterface.updateCustomAndFindOne(collectionName, {accountAddress: accountAddress, contractAddress: contractAddress } , {  $inc: { amount: amountDelta } , $set:{ lastUpdatedAt:  (Date.now())  } } )
       }else{
           await mongoInterface.insertOne(collectionName, {accountAddress: accountAddress, contractAddress: contractAddress, amount: amountDelta , lastUpdatedAt:  (Date.now())}   )
       }
   }

   static async modifyERC20LedgerApproval( contractAddress, ownerAddress, spenderAddress,   amountDelta , mongoInterface){

       let collectionName = 'erc20_approval' 

       let existingFrom = await mongoInterface.findOne(collectionName, {ownerAddress: ownerAddress, spenderAddress: spenderAddress, contractAddress: contractAddress }  )

       if(existingFrom){
           await mongoInterface.updateCustomAndFindOne(collectionName, {ownerAddress: ownerAddress, spenderAddress: spenderAddress, contractAddress: contractAddress } , {  $inc: { amount: amountDelta } , $set:{ lastUpdatedAt:  (Date.now()) } } )
       }else{
           await mongoInterface.insertOne(collectionName, {ownerAddress: ownerAddress, spenderAddress: spenderAddress, contractAddress: contractAddress, amount: amountDelta , lastUpdatedAt:  (Date.now()) }   )
       }
   }

   static async modifyERC20TransferredTotal( contractAddress, from, to,   amountDelta , mongoInterface){

    let collectionName = 'erc20_transferred' 

    let existingFrom = await mongoInterface.findOne(collectionName, {from: from, to: to, contractAddress: contractAddress }  )

    if(existingFrom){
        await mongoInterface.updateCustomAndFindOne(collectionName, {from: from, to: to, contractAddress: contractAddress } , {  $inc: { amount: amountDelta }, $set:{ lastUpdatedAt:  (Date.now())} }  )
    }else{
        await mongoInterface.insertOne(collectionName, {from: from, to: to, contractAddress: contractAddress, amount: amountDelta, lastUpdatedAt: (Date.now()) }   )
    }
}

   static async setERC20LedgerApproval( contractAddress, ownerAddress, spenderAddress,   newAmount , mongoInterface ){

       let collectionName = 'erc20_approval' 

       let existingFrom = await mongoInterface.findOne(collectionName, {ownerAddress: ownerAddress, spenderAddress: spenderAddress, contractAddress: contractAddress }  )

       if(existingFrom){
           await mongoInterface.updateCustomAndFindOne(collectionName, {ownerAddress: ownerAddress, spenderAddress: spenderAddress, contractAddress: contractAddress } , {  $set: { amount: newAmount , lastUpdatedAt:  (Date.now())} } )
       }else{
           await mongoInterface.insertOne(collectionName, {ownerAddress: ownerAddress, spenderAddress: spenderAddress, contractAddress: contractAddress, amount: newAmount , lastUpdatedAt:  (Date.now()) }   )
       }
   }




}