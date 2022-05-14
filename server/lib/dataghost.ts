 
import FileHelper from './file-helper'

import VibeGraph from 'vibegraph'
 

import Web3 from 'web3'

 

import IndexerMineableToken  from '../indexers/IndexerMineableToken' 

let SuperERC20ABI = FileHelper.readJSONFile('./server/abi/SuperERC20ABI.json')
 



let envmode = process.env.NODE_ENV ? process.env.NODE_ENV : 'development'


 

let dataghostConfigFile = FileHelper.readJSONFile('./server/dataghostconfig.json')
let dataghostConfig = dataghostConfigFile[envmode]


export default class DataGhost {


  async init(serverConfig){

    console.log('dataghost config: ',dataghostConfig)


    
    let web3 = new Web3( serverConfig.web3provider  )
 
    console.log('web3 ready with provider ',serverConfig.web3provider )

  
    
    let vibeGraphConfig = {  
      contracts:dataghostConfig.vibeGraphConfig.contracts,
       
      dbName: dataghostConfig.vibeGraphConfig.dbName, 

      indexRate: 10*1000,
      fineBlockGap: dataghostConfig.vibeGraphConfig.fineBlockGap,
      courseBlockGap: dataghostConfig.vibeGraphConfig.courseBlockGap,
      logging: dataghostConfig.vibeGraphConfig.logging ,
      customIndexers:[{
        type:'MineableToken', 
        abi: SuperERC20ABI ,  
        handler: IndexerMineableToken
     }]
       
       
  }



    let vibeGraph = new VibeGraph()
    await vibeGraph.init( vibeGraphConfig )
    vibeGraph.startIndexing( web3, vibeGraphConfig )  

  
     

} 

}
 



  