


import MongoInterface from './lib/mongo-interface.js'

import APIInterface from './lib/api-interface.js'

import FileHelper from './lib/file-helper.js'
 
import CoinDataCollector from './lib/coin-data-collector.js'

import DataGhost from './lib/dataghost.js'

import MintEstimateTasks from './tasks/mint-estimate-tasks.js'

import SingletonLoopMethod from './lib/singleton-loop-method.js'

import Web3 from 'web3'

let envmode = process.env.NODE_ENV

let serverConfigFile = FileHelper.readJSONFile('./server/serverconfig.json')
let serverConfig = serverConfigFile[envmode]

let assetConfig = FileHelper.readJSONFile('./server/assetconfig.json')
 

  async function start(){

    console.log('server config: ',serverConfig)


    let mongoInterface = new MongoInterface(  ) 
    await mongoInterface.init(  'open_0xbtc_api_'.concat(envmode) )


    let vibegraphInterface = new MongoInterface( ) 
    await vibegraphInterface.init(  'vibegraph_'.concat(envmode) )

    let web3 = new Web3( serverConfig.web3provider  )

    console.log('web3 ready with provider ',serverConfig.web3provider )

    
    let coinDataCollector = new CoinDataCollector(web3, assetConfig,mongoInterface)

 //   coinDataCollector.init(  ) 


  //  let apiInterface = new APIInterface(web3, mongoInterface, vibegraphInterface, serverConfig)
 
      
    let dataghost = new DataGhost()
    dataghost.init(serverConfig)

    //let packetCustodian = new PacketCustodian(web3,mongoInterface, serverConfig)


   
    let estDiffLoop = new SingletonLoopMethod(MintEstimateTasks.estimateDifficultyForRemainingEras, [vibegraphInterface])
    estDiffLoop.start(1000)

    let estHashrateLoop = new SingletonLoopMethod(MintEstimateTasks.estimateHashrateForRemainingMints, [vibegraphInterface])
    estHashrateLoop.start(1000)

  }

 
 start()