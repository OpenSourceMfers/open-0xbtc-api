



import Web3 from 'web3'

//import {BN} from 'web3-utils'

import BigNumber from 'bignumber.js'

const web3utils = Web3.utils

 

export default class DatabaseTasks {
 

    static async deleteDifficultyAndHashrateData(mongoInterface){
         await mongoInterface.deleteMany('erc20_difficulty_era')
         await mongoInterface.updateManyCustom('erc20_mints',{hashrate_avg8mint:{$exists:true}},         
         { $unset: { hashrate_avg8mint: "", estimatedDifficulty: "", estimatedDifficultyTarget: ""} }
        )
    }

     


}