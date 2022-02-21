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
            {epochCount: 1024,blockNumber:5139071} //change me 
        
        ]
 
        
        let insert = await vibegraphInterface.insertMany('erc20_mint',stubRecords)

        //console.log('insert',insert)
        expect(insert.insertedCount).to.equal(stubRecords.length);
  
      });

    it("can estimate difficulty for all mints", async function() {

      await MintEstimateTasks.estimateDifficultyForAllMints(vibegraphInterface)
     
      expect(true).to.equal(true);

    });


});