 
    import Web3Helper from './web3-helper.js'
    import BidPacketUtils from '../../src/js/bidpacket-utils.js'
    
    import FileHelper from './file-helper.js'

    import web3utils from 'web3-utils'

   import ethJsUtil from 'ethereumjs-util' 
    
 
    export default class AccessHelper  {
    
        constructor(   ){
           
           
        }

        //http://localhost:3000/api/v1/somestuff
        static async generateAccessChallenge(publicAddress, mongoInterface){

            let unixTime = Date.now()

            publicAddress = web3utils.toChecksumAddress(publicAddress)

            let accessChallenge = `Signing in to Starflask API as ${publicAddress.toString()} at ${unixTime.toString()}` 

            await mongoInterface.upsertOne('access_challenge', {publicAddress: publicAddress}, { publicAddress: publicAddress, accessChallenge:accessChallenge })

            return accessChallenge
          
        }

        static async findAccessChallengeForUser(publicAddress,mongoInterface){

            publicAddress = web3utils.toChecksumAddress(publicAddress)

            return await mongoInterface.findOne('access_challenge', {publicAddress: publicAddress})
        }

        static async generateAccessToken(publicAddress, signature, mongoInterface){

            publicAddress = web3utils.toChecksumAddress(publicAddress)

            let accessChallengeData = await this.findAccessChallengeForUser( publicAddress,mongoInterface)   

            //verify using ecrecover 


            // store random number  => token 


            var recoveredAddress = await AccessHelper.ethJsUtilecRecover(accessChallengeData.accessChallenge, signature)

             

            if(publicAddress.toLowerCase() == recoveredAddress.toLowerCase()){
                let accessToken = web3utils.randomHex(32 )
                //save it to mongo 

                await mongoInterface.upsertOne('access_token',{publicAddress:publicAddress}, {accessToken: accessToken, publicAddress:publicAddress, createdAt: Date.now() } )
    
                return accessToken
            }else{
                console.log('error: mismatching ecrecover address', recoveredAddress )
                return false 
            }

           

        }

        static async findAccessToken(accessToken, mongoInterface){
            let accessTokenData = await mongoInterface.findOne('access_token',{accessToken:accessToken})

            if(!accessTokenData){
                return null 
            }

            const ONE_DAY = 1000*60*60*24

            accessTokenData.isValid = ( accessTokenData.createdAt > Date.now() - ONE_DAY    ) 

            return accessTokenData
        }

            
            static async ethJsUtilecRecover(msg,signature)
            {



                console.log('ecrecover ', msg, signature)
                var res = ethJsUtil.fromRpcSig(signature)

                const msgHash = ethJsUtil.hashPersonalMessage(Buffer.from( msg ) );


                var pubKey = ethJsUtil.ecrecover( ethJsUtil.toBuffer(msgHash) , res.v, res.r, res.s);
                const addrBuf = ethJsUtil.pubToAddress(pubKey);
                const recoveredSignatureSigner    = ethJsUtil.bufferToHex(addrBuf);
                console.log('rec:', recoveredSignatureSigner)


                return recoveredSignatureSigner;

            }
            
         
    }