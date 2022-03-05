import pkg from 'chai';
const { expect } = pkg;



import MongoInterface from '../../server/lib/mongo-interface.js'

import MintEstimateTasks from '../../server/tasks/mint-estimate-tasks.js'



const envmode = process.env.NODE_ENV

let vibegraphInterface


describe("Test", async function() {

    before(async function( ){
        
        vibegraphInterface = new MongoInterface(  ) 
        await vibegraphInterface.init('vibegraph_'.concat(envmode), {})


        await vibegraphInterface.dropDatabase()
 
    });

      


    it("can stub data ", async function() {


        
        let stubRecords = [
            
            {epochCount: 2,blockNumber:5039071,accountAddress:"0x530d92dfb5caa11347F26eE741910Dee6eed3208", contractAddress:"0xB6eD7644C69416d67B522e20bC294A9a9B405B31"},
            {epochCount: 1024,blockNumber:5085562,}, //change me 
            {epochCount: 2048,blockNumber:5090942,},
            {epochCount: 3072,blockNumber:5095807,},
            {epochCount: 4096,blockNumber:5100227,} 
 

            
        ]
 
        
        let insert = await vibegraphInterface.insertMany('erc20_mint',stubRecords)

        //console.log('insert',insert)
        expect(insert.insertedCount).to.equal(stubRecords.length);
  
      });

    it("can estimate difficulty for all mints", async function() {

      await MintEstimateTasks.estimateDifficultyForAllMints(vibegraphInterface)
      


      let secondEra = await vibegraphInterface.findOne('erc20_difficulty_era', {difficultyEra:1})


      expect(secondEra).to.exist 
      expect(secondEra.estimatedDifficultyTarget).to.eql('27165273620967659067343199073922372180847564914462641481119695344874048')


      let thirdEra = await vibegraphInterface.findOne('erc20_difficulty_era', {difficultyEra:2}) 

      expect(thirdEra.estimatedDifficultyTarget).to.eql('13582636810483829533671599536961186090423782457231320740559847672437048')
    }); 


});