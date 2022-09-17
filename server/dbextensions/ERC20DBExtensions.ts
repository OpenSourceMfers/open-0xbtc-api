
import {Mongoose, Schema, Model} from 'mongoose'
 
import ExtensibleMongoDatabase, { RegisteredModel, DatabaseExtension , TableDefinition} from 'extensible-mongoose'

 
   
export interface ERC20Mint {
  accountAddress: string,
  contractAddress: string,
  amount: number,
  epochCount: number, 
  blockNumber: number, 
  lastUpdatedAt: number ,
  hashrate_avg8mint: number,
  estimatedDifficulty: number, 
  estimatedDifficultyTarget: number 
}

export interface ERC20Balance {
  accountAddress: string,
  contractAddress: string,
  amount: number,
  lastUpdatedAt: number ,
  
}

export interface ERC20Transfer {
  from: string,
  to: string,
  contractAddress: string,
  amount: number,
  lastUpdatedAt: number 
}

export interface ERC20Approval {
  ownerAddress: string,
  spenderAddress: string,
  contractAddress: string,
  amount: number,
  lastUpdatedAt: number 
  
}
  

  
export interface ERC20DifficultyEra {
    contractAddress:  string,
    difficultyEra: number,
    estimatedDifficultyTarget: number, 
    estimatedDifficulty: number 
  
  }

 
   
  export const Erc20MintSchema = new Schema<ERC20Mint>({    
    accountAddress: {type: String },
    contractAddress: {type: String, index:true},
    amount: Number,
    epochCount: {type: Number, index:true}, 
    blockNumber: Number, 
    lastUpdatedAt: Number  ,
    hashrate_avg8mint: Number,
    estimatedDifficulty: Number, 
    estimatedDifficultyTarget: Number 
  })


   
  export const Erc20BalanceSchema = new Schema<ERC20Balance>({    
    accountAddress: {type: String, index:true},
    contractAddress: {type: String, index:true},
    amount: Number,
    lastUpdatedAt: Number 
  })


   
  export const Erc20TransferSchema = new Schema<ERC20Transfer>({    
    from: {type: String, index:true},
    to: {type: String, index:true},
    contractAddress: {type: String, index:true},
    amount: Number,
    lastUpdatedAt: Number 
  })


   
  export const Erc20ApprovalSchema = new Schema<ERC20Approval>({    
    ownerAddress: {type: String, index:true},
    spenderAddress: {type: String, index:true},
    contractAddress: {type: String, index:true},
    amount: Number,
    lastUpdatedAt: Number 
  })


    
  export const ERC20DifficultyEraSchema = new Schema<ERC20DifficultyEra>({    
    contractAddress: {type: String, index:true},
    difficultyEra: Number,
    estimatedDifficultyTarget: Number, 
    estimatedDifficulty: Number 

  })
  
 
   export const ERC20MintDefinition: TableDefinition = {tableName:'erc20_mints', schema:Erc20MintSchema}
   export const ERC20DifficultyEraDefinition: TableDefinition = {tableName: 'erc20_difficulty_eras', schema: ERC20DifficultyEraSchema}
   export const ERC20BalanceDefinition: TableDefinition = {tableName: 'erc20_balances', schema: Erc20BalanceSchema}
   export const ERC20TransferDefinition: TableDefinition = {tableName: 'erc20_transfers', schema: Erc20TransferSchema}
   export const ERC20ApprovalDefinition: TableDefinition = {tableName: 'erc20_approvals', schema: Erc20ApprovalSchema}

export default class ERC20DBExtension extends DatabaseExtension  {
 
      getBindableModels() : Array<TableDefinition>{

        return [
          ERC20MintDefinition,
          ERC20DifficultyEraDefinition ,
          ERC20BalanceDefinition,
          ERC20TransferDefinition,
          ERC20ApprovalDefinition
        ]
    }


}