
import ExtensibleMongoDB , {DatabaseExtension} from 'extensible-mongoose'

import Web3 from 'web3'
import { ERC20ApprovalDefinition, ERC20BalanceDefinition, ERC20MintDefinition, ERC20TransferDefinition } from '../dbextensions/ERC20DBExtensions'


const web3utils = Web3.utils



export default class IndexerMineableToken {
 

    constructor(public mongoInterface:ExtensibleMongoDB){


    }
   
 
    async modifyLedgerByEvent(event){

        await IndexerMineableToken.modifyERC20LedgerByEvent(event,this.mongoInterface)

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

     

        await mongoInterface.getModel(ERC20MintDefinition).create({accountAddress: accountAddress, contractAddress: contractAddress, amount: amountDelta , epochCount:epochCount,  blockNumber: blockNumber, lastUpdatedAt: Date.now()}   )

    
    }

   static async modifyERC20LedgerBalance(accountAddress, contractAddress, amountDelta, mongoInterface){

      

       let existingFrom = await mongoInterface.getModel(ERC20BalanceDefinition).findOne({accountAddress: accountAddress, contractAddress: contractAddress }  )

       if(existingFrom){
           await mongoInterface.getModel(ERC20BalanceDefinition).findOneAndUpdate( {accountAddress: accountAddress, contractAddress: contractAddress } , {  $inc: { amount: amountDelta } , $set:{ lastUpdatedAt:  (Date.now())  } } )
       }else{
           await mongoInterface.getModel(ERC20BalanceDefinition).create( {accountAddress: accountAddress, contractAddress: contractAddress, amount: amountDelta , lastUpdatedAt:  (Date.now())}   )
       }
   }

   static async modifyERC20LedgerApproval( contractAddress, ownerAddress, spenderAddress,   amountDelta , mongoInterface){
 

       let existingFrom = await mongoInterface.getModel(ERC20ApprovalDefinition).findOne( {ownerAddress: ownerAddress, spenderAddress: spenderAddress, contractAddress: contractAddress }  )

       if(existingFrom){
           await mongoInterface.getModel(ERC20ApprovalDefinition).findOneAndUpdate( {ownerAddress: ownerAddress, spenderAddress: spenderAddress, contractAddress: contractAddress } , {  $inc: { amount: amountDelta } , $set:{ lastUpdatedAt:  (Date.now()) } } )
       }else{
           await mongoInterface.getModel(ERC20ApprovalDefinition).create( {ownerAddress: ownerAddress, spenderAddress: spenderAddress, contractAddress: contractAddress, amount: amountDelta , lastUpdatedAt:  (Date.now()) }   )
       }
   }

   static async modifyERC20TransferredTotal( contractAddress, from, to,   amountDelta , mongoInterface){
 

    let existingFrom = await mongoInterface.getModel(ERC20TransferDefinition).findOne( {from: from, to: to, contractAddress: contractAddress }  )

    if(existingFrom){
        await mongoInterface.getModel(ERC20TransferDefinition).findOneAndUpdate( {from: from, to: to, contractAddress: contractAddress } , {  $inc: { amount: amountDelta }, $set:{ lastUpdatedAt:  (Date.now())} }  )
    }else{
        await mongoInterface.getModel(ERC20TransferDefinition).create( {from: from, to: to, contractAddress: contractAddress, amount: amountDelta, lastUpdatedAt: (Date.now()) }   )
    }
}

   static async setERC20LedgerApproval( contractAddress, ownerAddress, spenderAddress,   newAmount , mongoInterface ){
 

       let existingFrom = await mongoInterface.getModel(ERC20ApprovalDefinition).findOne( {ownerAddress: ownerAddress, spenderAddress: spenderAddress, contractAddress: contractAddress }  )

       if(existingFrom){
           await mongoInterface.getModel(ERC20ApprovalDefinition).findOneAndUpdate(  {ownerAddress: ownerAddress, spenderAddress: spenderAddress, contractAddress: contractAddress } , {  $set: { amount: newAmount , lastUpdatedAt:  (Date.now())} } )
       }else{
           await mongoInterface.getModel(ERC20ApprovalDefinition).create( {ownerAddress: ownerAddress, spenderAddress: spenderAddress, contractAddress: contractAddress, amount: newAmount , lastUpdatedAt:  (Date.now()) }   )
       }
   }




}