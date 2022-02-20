



import Web3 from 'web3'

import BN from 'web3-utils'

const web3utils = Web3.utils



    //a little number
    const _MINIMUM_TARGET = new BN(2).pow(16)// 2**16;


    const _MAXIMUM_TARGET = new BN(2).pow(234)// 2**234



export default class MintEstimateTasks {





    static async estimateDifficultyForAllMints(mongoInterface){


        let difficultyAdjustmentEra = 0

        let nextRow = await mongoInterface.findOne('erc20_mint',{epochCount: difficultyAdjustmentEra*1024 }) 

        while(nextRow){

            let estimatedTarget = await MintEstimateTasks.estimateDifficultyTargetForEra( difficultyAdjustmentEra , mongoInterface )

            if(!estimatedTarget){
                break; 
            }
            let updated = await mongoInterface.upsertOne('erc20_difficulty_era', {difficultyEra: difficultyAdjustmentEra }, {estimatedDifficultyTarget: estimatedTarget} )
 
            difficultyAdjustmentEra++
            nextRow = await mongoInterface.findOne('erc20_mint',{epochCount: difficultyAdjustmentEra*1024 }) 
        }


    }

    static async estimateHashrateForAllMints(mongoInterface){
        
    }



    //estimate the target 
    static async estimateDifficultyTargetForEra(eraCount, mongoInterface){

        if(eraCount == 0){
            return _MAXIMUM_TARGET
        }


        let firstRowOfEra =  await mongoInterface.findOne('erc20_mint',{epochCount: eraCount*1024 }) 
        if(!firstRowOfEra){
            return null 
        }

        let lastRowOfEra = await mongoInterface.findOne('erc20_mint',{epochCount: ((eraCount+1)*1024) - 1 }) 
        if(!lastRowOfEra){
            return null 
        }

        let previousEraData = await mongoInterface.findOne('erc20_difficulty_era', {difficultyEra: eraCount-1} )
        let previousTarget = new BN(previousEraData.estimatedDifficultyTarget)


        let ethBlocksSinceLastDifficultyPeriod = new BN(lastRowOfEra.blockNumber).sub(firstRowOfEra.blockNumber)

        let epochsMined = new BN(1024);

        let targetEthBlocksPerDiffPeriod = new BN(epochsMined).mul(60)


        let miningTarget = previousTarget

        //if there were less eth blocks passed in time than expected
        if( ethBlocksSinceLastDifficultyPeriod < targetEthBlocksPerDiffPeriod )
        {
          let excess_block_pct = (targetEthBlocksPerDiffPeriod.mul(100)).div( ethBlocksSinceLastDifficultyPeriod );

          let excess_block_pct_extra = MintEstimateTasks.limitLessThan(excess_block_pct.sub(100),1000);
          // If there were 5% more blocks mined than expected then this is 5.  If there were 100% more blocks mined than expected then this is 100.

          //make it harder
          miningTarget = miningTarget.sub(miningTarget.div(2000).mul(excess_block_pct_extra));   //by up to 50 %
        }else{
            let shortage_block_pct = (ethBlocksSinceLastDifficultyPeriod.mul(100)).div( targetEthBlocksPerDiffPeriod );

            let shortage_block_pct_extra = MintEstimateTasks.limitLessThan(shortage_block_pct.sub(100),1000); //always between 0 and 1000

          //make it easier
          miningTarget = miningTarget.add(miningTarget.div(2000).mul(shortage_block_pct_extra));   //by up to 50 %
        }




        return miningTarget 

    }


    static limitLessThan(a,b){
        if(a > b) return b;

        return a;
    }

     


}