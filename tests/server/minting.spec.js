import pkg from 'chai';
const { expect } = pkg;



import MongoInterface from '../../server/lib/mongo-interface.js'

const envmode = process.env.NODE_ENV

let vibegraphInterface


describe("Test", async function() {

    before(async function( ){
        
        vibegraphInterface = new MongoInterface(  ) 
        await vibegraphInterface.init('vibegraph_'.concat(envmode), {})


        await vibegraphInterface.dropDatabase()
 
    });

      


    it("can stub data ", async function() {

        let stubRecords = []
        
        let insert = await vibegraphInterface.insertMany('erc20_mint',stubRecords)

        console.log('insert',insert)
        expect(insert).to.equal(true);
  
      });

    it("can expect", async function() {
     
      expect(true).to.equal(true);

    });


});