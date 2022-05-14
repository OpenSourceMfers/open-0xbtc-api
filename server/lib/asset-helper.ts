


import web3utils from 'web3-utils'
import FileHelper from './file-helper'

let assetConfig = FileHelper.readJSONFile('./server/assetconfig.json')

const networkNameLookup = {
    4:'rinkeby',
    1:'mainnet'

}

export default class AssetHelper  {


  

    static getNetworkNameFromChainId(chainId){

        return networkNameLookup[chainId]
    }

    static getMineableTokenAddressFromChainId(chainId){

        let networkName = AssetHelper.getNetworkNameFromChainId(chainId)
 

        return web3utils.toChecksumAddress(assetConfig[networkName].mineableTokenAddress)
    }



}