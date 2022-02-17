


import Web3Helper from './web3-helper.js'
import BidPacketUtils from '../../src/js/bidpacket-utils.js'

import FileHelper from './file-helper.js'

const BTFContractABI = FileHelper.readJSONFile('./src/contracts/BuyTheFloorABI_2.json')
const ERC20ContractABI = FileHelper.readJSONFile('./src/contracts/ERC20ABI.json')


export default class PacketHelper  {


    static async storeNewBidPacket(packet,mongoInterface){

        let packetData = Object.assign({},packet)

        packetData.createdAt = Date.now()
        packetData.status = 'active'
        packetData.lastRefreshed = 0
        packetData.suspended = false

        let existingPacket = await mongoInterface.findOne('bidpackets', {'signature.signature': packetData.signature.signature })
        
        if(existingPacket){
            console.log('received duplicate packet')
            return {success:false, error:'duplicate packet'}
        }

        await mongoInterface.insertOne('bidpackets',packetData)
        return  {success:true, saved: packetData} 
    }


    static async findBidPackets(mongoInterface, query ){
        return  await mongoInterface.findAllSortedWithLimit('bidpackets',query,{},500)
    }
    static async findBidPacketBySignature(signature, mongoInterface){
        return  await mongoInterface.findOne('bidpackets',{"signature.signature":signature}, )
    }

    static checkPacketValidity(packet, serverConfig){
        let chainId = serverConfig.chainId

        let contractData = Web3Helper.getContractDataForNetwork(chainId)
        let BTFContractAddress = contractData['buythefloor'].address;

        let typedData = BidPacketUtils.getBidTypedDataFromParams(chainId, BTFContractAddress,packet.bidderAddress, packet.nftContractAddress, packet.currencyTokenAddress, packet.currencyTokenAmount, packet.requireProjectId,packet.projectId,  packet.expires   )
    
        console.log('typedData', typedData)
        let packetHash = BidPacketUtils.getBidTypedDataHash( typedData   )
        

        let recoveredAddress = BidPacketUtils.recoverBidPacketSigner(typedData, packet.signature.signature)

        return (recoveredAddress == packet.bidderAddress.toLowerCase())

    }


}
