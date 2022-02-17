
import Web3 from 'web3'


import BigNumber from 'bignumber.js'

import FileHelper from './file-helper.js'

const contractData = FileHelper.readJSONFile('./src/config/contractdata.json')
const tokenContractABI = FileHelper.readJSONFile('./src/contracts/ERC20ABI.json')
const nftContractABI = FileHelper.readJSONFile('./src/contracts/ERC721ABI.json')


let networkIds = {
    'mainnet':1,
    'goerli':5,
    'kovan':42,
    'matic':137,
  }


export default class Web3Helper{

   


    static async getNetworkId(web3){
        return await web3.eth.net.getId() 
    }


    static async getBlockNumber(web3){
        return await web3.eth.getBlockNumber() 
    }
    
    static getCustomContract(  contractABI, contractAddress, web3)
    { 
    var contract = new web3.eth.Contract(contractABI,contractAddress)

    return contract;
    }


    static getContractDataForNetwork(   netId ){
         

        let netName = Web3Helper.getWeb3NetworkName(netId)

        if(netName){
            return contractData[netName].contracts
        }

        return undefined
    }

    static getWeb3NetworkName(networkId){
         
  
        for (const [key, value] of Object.entries(networkIds)) {
          if(value == networkId){
            return key 
          }
        }
  
    
       console.error('Invalid network Id: ',networkId)
      return null
    }

    
}