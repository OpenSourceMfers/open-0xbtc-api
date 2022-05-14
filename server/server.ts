

 
 
 
import ExtensibleMongoDB , {DatabaseExtension} from 'extensible-mongoose'


import FileHelper from './lib/file-helper'
  


import AssetHelper from './lib/asset-helper'


import DataGhost from './lib/dataghost'

import MintEstimateTasks from './tasks/mint-estimate-tasks.js'

import SingletonLoopMethod from './lib/singleton-loop-method.js'

import Web3 from 'web3'
import ERC20DBExtension from './dbextensions/ERC20DBExtensions'
import APIController from './controllers/APIController'
import WebServer from './lib/web-server'

let envmode = process.env.NODE_ENV

let serverConfigFile = FileHelper.readJSONFile('./server/serverconfig.json')
let serverConfig = serverConfigFile[envmode]

let assetConfig = FileHelper.readJSONFile('./server/assetconfig.json')
 

  async function start(){

    console.log('server config: ',serverConfig)


    let mongoInterface = new ExtensibleMongoDB(  ) 
    await mongoInterface.init(  'open_0xbtc_api_'.concat(envmode) )

 
    let web3 = new Web3( serverConfig.web3provider  )

    console.log('web3 ready with provider ',serverConfig.web3provider )

    const erc20DBExtension = new ERC20DBExtension(mongoInterface)
    erc20DBExtension.bindModelsToDatabase()

    //let apiInterface = new APIInterface(web3, mongoInterface, vibegraphInterface, serverConfig)
 
      
    let dataghost = new DataGhost()
    dataghost.init(serverConfig)

     

    let contractAddress = AssetHelper.getMineableTokenAddressFromChainId( serverConfig.chainId ) 
  
    let estDiffLoop = new SingletonLoopMethod(MintEstimateTasks.estimateDifficultyForRemainingEras, [mongoInterface,contractAddress])
    estDiffLoop.start(1000)

    let estHashrateLoop = new SingletonLoopMethod(MintEstimateTasks.estimateHashrateForRemainingMints, [mongoInterface,contractAddress])
    estHashrateLoop.start(1000)


    let apiControllers = [
      {name:'api', controller: new APIController(mongoInterface)},
     
    ]

         

    let webserver = new WebServer(web3, serverConfig, apiControllers)
    await webserver.start()

  }

 
 start()