
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


    
  export const ERC20DifficultyEraSchema = new Schema<ERC20DifficultyEra>({    
    contractAddress: {type: String, index:true},
    difficultyEra: Number,
    estimatedDifficultyTarget: Number, 
    estimatedDifficulty: Number 

  })
  
 
   export const ERC20MintDefinition: TableDefinition = {tableName:'erc20_mints', schema:Erc20MintSchema}
   export const ERC20DifficultyEraDefinition: TableDefinition = {tableName: 'erc20_difficulty_eras', schema: ERC20DifficultyEraSchema}

export default class ERC20DBExtension extends DatabaseExtension  {
 


 
      getBindableModels() : Array<TableDefinition>{

        return [
          ERC20MintDefinition,
          ERC20DifficultyEraDefinition 
        ]
    }


}