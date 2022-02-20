


import MongoInterface from './lib/mongo-interface.js'

import MintEstimateTasks from './lib/mint-estimate-tasks.js'

import FileHelper from './lib/file-helper.js'
  
import Web3 from 'web3'

let envmode = process.env.NODE_ENV

let serverConfigFile = FileHelper.readJSONFile('./server/serverconfig.json')
let serverConfig = serverConfigFile[envmode]

let assetConfig = FileHelper.readJSONFile('./server/assetconfig.json')
 

  async function start(){

    console.log('server config: ',serverConfig)


    let mongoInterface = new MongoInterface( 'open_0xbtc_api_'.concat(envmode) ) 

    let vibegraphInterface = new MongoInterface( 'vibegraph_'.concat(envmode) ) 


    let web3 = new Web3( serverConfig.web3provider  )

    console.log('web3 ready with provider ',serverConfig.web3provider )

    
    await MintEstimateTasks.estimateDifficultyForAllMints(vibegraphInterface)
    await MintEstimateTasks.estimateHashrateForAllMints(vibegraphInterface)


}

 
 start()