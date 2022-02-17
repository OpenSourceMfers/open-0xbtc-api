 
import FileHelper from './lib/file-helper.js'

import VibeGraph from 'vibegraph'
 

import Web3 from 'web3'


import  IndexerBurnBook  from './indexers/IndexerBurnBook.js'
 

let BurnbookABI = FileHelper.readJSONFile('./server/abi/BurnBook.json')
 




let envmode = process.env.NODE_ENV


let serverConfigFile = FileHelper.readJSONFile('./server/serverconfig.json')
let serverConfig = serverConfigFile[envmode]

let dataghostConfigFile = FileHelper.readJSONFile('./server/dataghostconfig.json')
let dataghostConfig = dataghostConfigFile[envmode]

  async function start(){

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
        type:'BurnBook', 
        abi: BurnbookABI ,  
        handler: IndexerBurnBook
     }]
       
       
  }



    let vibeGraph = new VibeGraph()
    await vibeGraph.init( vibeGraphConfig )
    vibeGraph.startIndexing( web3, vibeGraphConfig )  

  
     

} 
 



 
 start()