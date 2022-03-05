



import Web3 from 'web3'

//import {BN} from 'web3-utils'

import BigNumber from 'bignumber.js'

const web3utils = Web3.utils

    BigNumber.config({ POW_PRECISION: 0 })


    //a little number
    const _MINIMUM_TARGET = new BigNumber(2).pow(16)// 2**16;


    const _MAXIMUM_TARGET = new BigNumber(2).pow(234)// 2**234



export default class MintEstimateTasks {


  

    static async estimateDifficultyForAllMints(mongoInterface){
        
        BigNumber.config({ ROUNDING_MODE: 1 })//round down    


        let difficultyAdjustmentEra = 0

        let epochCount = difficultyAdjustmentEra*1024

        if(epochCount == 0) {epochCount = 2 } //fix since first mint is epoch of 2 


        let nextRow = await mongoInterface.findOne('erc20_mint',{epochCount: epochCount }) 

        while(nextRow){

            let {miningTarget, difficulty} = await MintEstimateTasks.estimateDifficultyTargetForEra( difficultyAdjustmentEra , mongoInterface )

            
            //console.log('mt', miningtarget)
            if(!miningTarget){
                break; 
            }

            console.log('miningTarget', miningTarget , difficulty )


            let upserted = await mongoInterface.upsertOne('erc20_difficulty_era', {difficultyEra: difficultyAdjustmentEra }, {difficultyEra: difficultyAdjustmentEra,estimatedDifficultyTarget: miningTarget, estimatedDifficulty: parseInt(difficulty)} )
            
            //console.log('upserted',upserted)


            difficultyAdjustmentEra++
            nextRow = await mongoInterface.findOne('erc20_mint',{epochCount: epochCount }) 
        }


    }

    static async estimateHashrateForAllMints(mongoInterface){
        
    }



    //estimate the target 
    static async estimateDifficultyTargetForEra(eraCount, mongoInterface){

        console.log('estimateDifficultyTargetForEra', eraCount  )
        if(eraCount == 0){
            console.log('miningtarget', _MAXIMUM_TARGET.toFixed(0))


            return {miningTarget:_MAXIMUM_TARGET.toNumber(),difficulty:1}
        }   

        let initialEpochCount = (eraCount-1)*1024 

        if(initialEpochCount == 0) initialEpochCount = 2 


        let firstRowOfEra =  await mongoInterface.findOne('erc20_mint',{epochCount: initialEpochCount }) 
        if(!firstRowOfEra){
            console.log('WARN: no first era ')
            return {miningTarget:null}
        }

        let lastRowOfEra = await mongoInterface.findOne('erc20_mint',{epochCount: ((eraCount)*1024) /*-1*/  })  // should be -1 ?
        if(!lastRowOfEra){
            console.log('WARN: no last era ')
            return  {miningTarget:null} 
        }

        let previousEraData = await mongoInterface.findOne('erc20_difficulty_era', {difficultyEra: eraCount-1} )
        let previousTarget =  new BigNumber(previousEraData.estimatedDifficultyTarget)


        let ethBlocksSinceLastDifficultyPeriod =  new BigNumber(lastRowOfEra.blockNumber).minus(firstRowOfEra.blockNumber)

        let epochsMined =  new BigNumber(1024);

        let targetEthBlocksPerDiffPeriod =  new BigNumber(epochsMined).times(60)


        let miningTarget = previousTarget

        //if there were less eth blocks passed in time than expected
        if( ethBlocksSinceLastDifficultyPeriod.lt( targetEthBlocksPerDiffPeriod ) )
        {

          console.log('targetEthBlocksPerDiffPeriod',targetEthBlocksPerDiffPeriod.toNumber())       
          console.log('ethBlocksSinceLastDifficultyPeriod',ethBlocksSinceLastDifficultyPeriod.toNumber())
         
          let excess_block_pct = (targetEthBlocksPerDiffPeriod.times(100)).div( ethBlocksSinceLastDifficultyPeriod );
          
          excess_block_pct = excess_block_pct.decimalPlaces(0,1)

          console.log('excess_block_pct',excess_block_pct.toNumber())

          let excess_block_pct_extra = MintEstimateTasks.limitLessThan(excess_block_pct.minus(100),new BigNumber(1000));
          excess_block_pct_extra = excess_block_pct_extra.decimalPlaces(0,1)
            
          console.log('excess_block_pct_extra',excess_block_pct_extra.toNumber())

          console.log('miningTargetBefore',miningTarget.toNumber())
          // If there were 5% more blocks mined than expected then this is 5.  If there were 100% more blocks mined than expected then this is 100.

          //make it harder
          miningTarget = miningTarget.minus(miningTarget.div(2000).times(excess_block_pct_extra));   //by up to 50 %
        
                    
        }else{
            let shortage_block_pct = (ethBlocksSinceLastDifficultyPeriod.times(100)).div( targetEthBlocksPerDiffPeriod );

            let shortage_block_pct_extra = MintEstimateTasks.limitLessThan(shortage_block_pct.minus(100),new BigNumber(1000)); //always between 0 and 1000

          //make it easier
          miningTarget = miningTarget.plus(miningTarget.div(2000).times(shortage_block_pct_extra));   //by up to 50 %
        }

        //expect(miningTarget).to.eql( previousTarget.dividedBy(2) )
        //miningTarget = previousTarget.dividedBy(2)

        let difficulty = _MAXIMUM_TARGET.dividedBy(miningTarget).toFixed(0)
        difficulty=parseInt(difficulty)

        
        console.log('miningtarget', miningTarget.toFixed(0))

        miningTarget = miningTarget.toNumber()

        return {miningTarget, difficulty}

    }


    static limitLessThan(a,b){
        if(a.gt(b)) return b;

        return a;
    }

     


}