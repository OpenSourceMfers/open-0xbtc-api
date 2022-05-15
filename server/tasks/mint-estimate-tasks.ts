


import ExtensibleMongoDB , {DatabaseExtension} from 'extensible-mongoose'


import Web3 from 'web3'

//import {BN} from 'web3-utils'

import BigNumber from 'bignumber.js'
import { ERC20DifficultyEraDefinition, ERC20DifficultyEraSchema, ERC20MintDefinition } from '../dbextensions/ERC20DBExtensions'

const web3utils = Web3.utils

    BigNumber.config({ POW_PRECISION: 0 })


    //a little number
    const _MINIMUM_TARGET = new BigNumber(2).pow(16)// 2**16;


    const _MAXIMUM_TARGET = new BigNumber(2).pow(234)// 2**234



export default class MintEstimateTasks {


    static async getLatestDifficultyAdjustEra(  mongoInterface : ExtensibleMongoDB,contractAddress: string   ){

         
        let latestEra = await mongoInterface.getModel(ERC20DifficultyEraDefinition).findOne( {contractAddress:contractAddress}).sort({difficultyEra: -1})
 
        if(latestEra){
           
            return latestEra.difficultyEra
        }



        return 0
    }

    static async estimateDifficultyForRemainingEras(mongoInterface: ExtensibleMongoDB,contractAddress: string){

        let latestDiffEra = await MintEstimateTasks.getLatestDifficultyAdjustEra(mongoInterface,contractAddress)

        console.log('latest era found', latestDiffEra)
         
        return await MintEstimateTasks.estimateDifficultyForAllMints(mongoInterface,contractAddress, latestDiffEra)
    }

    static async estimateHashrateForRemainingMints(mongoInterface: ExtensibleMongoDB, contractAddress: string ){

        let latestMintWithHashrate = await mongoInterface.getModel(ERC20MintDefinition).findOne({contractAddress: contractAddress, hashrate_avg8mint: {$exists: true } }).sort( {epochCount: -1})
          

        let startEpochCount = 2
        if(latestMintWithHashrate){
            startEpochCount = latestMintWithHashrate.epochCount
        }

        console.log(' estimateHashrateForRemainingMints start at  ', startEpochCount)

        
        return await MintEstimateTasks.estimateHashrateForAllMints(mongoInterface, contractAddress, startEpochCount)
    }





    static async estimateDifficultyForAllMints( mongoInterface: ExtensibleMongoDB, contractAddress:string , initDiffAdjustEra: number ){
        
        BigNumber.config({ ROUNDING_MODE: 1 })//round down    



        let difficultyAdjustmentEra = initDiffAdjustEra ? initDiffAdjustEra : 0

        let epochCount = difficultyAdjustmentEra*1024

        if(epochCount < 2 ) {epochCount = 2 } //fix since first mint is epoch of 2 


       // let nextRow = await mongoInterface.findOne('erc20_mints',{epochCount: epochCount }) 


       console.log('estimateDifficultyForAllMints', epochCount)

        while(true){

            let {miningTarget, difficulty} = await MintEstimateTasks.estimateDifficultyTargetForEra( difficultyAdjustmentEra ,  contractAddress, mongoInterface )

             
            if(!miningTarget){
                break; 
            }

            console.log('miningTarget', miningTarget.toFixed(0) , difficulty.toFixed(0) )


            let upserted = await mongoInterface.getModel(ERC20DifficultyEraDefinition)
            .findOneAndUpdate(  {difficultyEra: difficultyAdjustmentEra }, {contractAddress: contractAddress , difficultyEra: difficultyAdjustmentEra,estimatedDifficultyTarget: miningTarget.toFixed(0), estimatedDifficulty: (difficulty.toFixed(0))}, {upsert:true} )
            
            
            difficultyAdjustmentEra++
            //nextRow = await mongoInterface.findOne('erc20_mints',{epochCount: epochCount }) 
        }


    }

    static async estimateHashrateForAllMints(mongoInterface: ExtensibleMongoDB,contractAddress:string , initEpochCount: number ){
        
        BigNumber.config({ ROUNDING_MODE: 1 })//round down    

 
        let epochCount = initEpochCount ? initEpochCount : 0  // difficultyAdjustmentEra*1024

        if(epochCount < 2 ) {epochCount = 2 } //fix since first mint is epoch of 2 
 
         
        let nextRow = await mongoInterface.getModel(ERC20MintDefinition).findOne( {contractAddress:contractAddress, epochCount: epochCount }) 
 
        while(nextRow){

            let estimatedHashrate = await MintEstimateTasks.estimateHashrateForMint( epochCount, contractAddress, mongoInterface )

            
            if(estimatedHashrate && estimatedHashrate.hashrate_avg8mint){

                let mintData = await MintEstimateTasks.getDataForMint( epochCount,contractAddress, mongoInterface )

                let updated = await mongoInterface.getModel(ERC20MintDefinition).updateOne(
                 
                {epochCount: epochCount,contractAddress:contractAddress}, 
                {hashrate_avg8mint: estimatedHashrate.hashrate_avg8mint.toFixed(0),
                estimatedDifficulty: mintData.estimatedDifficulty,
                estimatedDifficultyTarget: mintData.estimatedDifficultyTarget
                })

                console.log('estimatedHashrate',epochCount, estimatedHashrate.hashrate_avg8mint.toFixed(0))
            } 

            epochCount++;
            nextRow = await mongoInterface.getModel(ERC20MintDefinition).findOne({contractAddress:contractAddress, epochCount: epochCount}) 

        }
    }



    //estimate the target 
    static async estimateDifficultyTargetForEra(eraCount:number, contractAddress:string, mongoInterface: ExtensibleMongoDB){

        console.log('estimateDifficultyTargetForEra', eraCount  )
        if(eraCount == 0){
            //console.log('miningtarget 1st', _MAXIMUM_TARGET.toFixed(0))


            return {miningTarget:_MAXIMUM_TARGET ,difficulty:new BigNumber(1)}
        }   
        
        const deploymentBlock = 5039000 

        //at which epoch is the 'block number' stored ?  1024 ? 'latestDifficultyPeriodStarted'

        const INITIAL_OFFSET = 0  //is this correct? 
        const FINAL_OFFSET = 0 //is this correct ? 

        


        let initialEpochCount = ( (eraCount-1)*1024 ) + INITIAL_OFFSET 

        if(initialEpochCount < 2 ) initialEpochCount = 2 

        let finalEpochCount = eraCount * 1024 + FINAL_OFFSET 


        let firstRowOfEra =  await mongoInterface.getModel(ERC20MintDefinition).findOne({epochCount: initialEpochCount, contractAddress:contractAddress }) 
        if(!firstRowOfEra){
            console.log('WARN: no first era ')
            return {miningTarget:null}
        }

        let lastRowOfEra = await mongoInterface.getModel(ERC20MintDefinition).findOne({contractAddress:contractAddress, epochCount: finalEpochCount  })  // should be -1 ?
        if(!lastRowOfEra){
            console.log('WARN: no last era ')
            return  {miningTarget:null} 
        }

        let previousEraData = await mongoInterface.getModel(ERC20DifficultyEraDefinition).findOne({contractAddress:contractAddress, difficultyEra: eraCount-1} )
        let previousTarget =  new BigNumber(previousEraData.estimatedDifficultyTarget)

        console.log('previousTarget', previousEraData.estimatedDifficultyTarget, previousTarget.toFixed(0))

        

        let ethBlocksSinceLastDifficultyPeriod =  new BigNumber(lastRowOfEra.blockNumber).minus(firstRowOfEra.blockNumber)


        //the 'latestDifficultyPeriodStarted' variable is stored upon contract deployment, not on the first time the mining occurs 
        if( eraCount == 1 ){
            ethBlocksSinceLastDifficultyPeriod =  new BigNumber(lastRowOfEra.blockNumber).minus(deploymentBlock)
        }

        let epochsMined =  new BigNumber(1024);

        let targetEthBlocksPerDiffPeriod =  new BigNumber(epochsMined).times(60)


        let miningTarget = previousTarget

        //if there were less eth blocks passed in time than expected
        if( ethBlocksSinceLastDifficultyPeriod.lt( targetEthBlocksPerDiffPeriod ) )
        {

          console.log('targetEthBlocksPerDiffPeriod',targetEthBlocksPerDiffPeriod.toFixed())       
          console.log('ethBlocksSinceLastDifficultyPeriod',ethBlocksSinceLastDifficultyPeriod.toFixed())
         
          let excess_block_pct = (targetEthBlocksPerDiffPeriod.times(100)).div( ethBlocksSinceLastDifficultyPeriod );
          
          excess_block_pct = excess_block_pct.decimalPlaces(0,1)

           
          let excess_block_pct_extra = MintEstimateTasks.limitLessThan(excess_block_pct.minus(100),new BigNumber(1000));
          excess_block_pct_extra = excess_block_pct_extra.decimalPlaces(0,1)
            
          
          console.log('miningTargetBefore',miningTarget.toFixed(0))
          // If there were 5% more blocks mined than expected then this is 5.  If there were 100% more blocks mined than expected then this is 100.

          //make it harder
          miningTarget = miningTarget.minus((miningTarget.div(2000).decimalPlaces(0,1)).times(excess_block_pct_extra));   //by up to 50 %
        
                    
        }else{
            let shortage_block_pct = (ethBlocksSinceLastDifficultyPeriod.times(100)).div( targetEthBlocksPerDiffPeriod );

            shortage_block_pct = shortage_block_pct.decimalPlaces(0,1)

            let shortage_block_pct_extra = MintEstimateTasks.limitLessThan(shortage_block_pct.minus(100),new BigNumber(1000)); //always between 0 and 1000

            shortage_block_pct_extra = shortage_block_pct_extra.decimalPlaces(0,1)

          //make it easier
          miningTarget = miningTarget.plus((miningTarget.div(2000).decimalPlaces(0,1)).times(shortage_block_pct_extra));   //by up to 50 %
        }

        //expect(miningTarget).to.eql( previousTarget.dividedBy(2) )
        //miningTarget = previousTarget.dividedBy(2)

        let difficulty = _MAXIMUM_TARGET.dividedBy(miningTarget)//.toFixed(0)
        //difficulty=parseInt(difficulty)

         

        return {miningTarget, difficulty}

    }


    static async estimateHashrateForMint(epochCount:number, contractAddress:string, mongoInterface: ExtensibleMongoDB){


        let averageBlockSpan = 8//number of blocks to average over 

        let startEpochCount = epochCount-averageBlockSpan 
        let endEpochCount = epochCount 

        if(startEpochCount<2){
            return null 
        }

        let startEpochData = await MintEstimateTasks.getDataForMint( startEpochCount,contractAddress,mongoInterface ) 
        if(!startEpochData) {
            console.log('no start epoch data')
            return null 
        }

        let endEpochData = await MintEstimateTasks.getDataForMint( endEpochCount,contractAddress,mongoInterface ) 
        if(!endEpochData) {
            console.log('no end epoch data')
            return null
         }

        let eraMiningDifficulty = new BigNumber(endEpochData.estimatedDifficulty)


        // the number of blocks between this mint and the mint 8 mints ago 
        let blockNumberDelta = new BigNumber(endEpochData.blockNumber).minus(new BigNumber(startEpochData.blockNumber))

         
        let ethBlockSolveTimeSeconds = 15 

        let averageBlockSolveTimeSeconds = (blockNumberDelta.times( ethBlockSolveTimeSeconds )).dividedBy( averageBlockSpan )
        
          
        let difficultyFactor = eraMiningDifficulty.times( 4194304 )
        let hashrate_avg8mint = difficultyFactor.dividedBy( averageBlockSolveTimeSeconds )

         
        return {hashrate_avg8mint}

    }

    static async getDataForMint(epochCount:number,contractAddress:string,mongoInterface: ExtensibleMongoDB){

        let mintData = await mongoInterface.getModel(ERC20MintDefinition).findOne({epochCount: epochCount,contractAddress:contractAddress }) 

        if(!mintData){
            return null 
        }


        let eraCount = Math.floor( epochCount / 1024 )

        let eraData = await mongoInterface.getModel(ERC20DifficultyEraDefinition).findOne({difficultyEra: eraCount, contractAddress:contractAddress}  )

        if(!eraData){
            return null 
        }

        return Object.assign( mintData , { estimatedDifficulty: eraData.estimatedDifficulty, estimatedDifficultyTarget: eraData.estimatedDifficultyTarget } )

    }

    static limitLessThan(a:BigNumber,b:BigNumber){
        if(a.gt(b)) return b;

        return a;
    }

     


}