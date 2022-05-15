<template>
  <div>
    <div class="section bg-gray-200 border-b-4 border-black px-0 lg:px-1">
      <div class=" ">
        <Navbar  />
      </div>
    </div>

    <div class="section border-b-2 border-black" style="background: #222">
      <div class=" ">
        <div class=" "></div>
        <div class="flex md:flex-row flex-col">
          <div class="md:w-1/2 w-full mt-8 py-8 px-8 text-center">
            
          

            <a :href="'https://github.com/OpenSourceMfers/open-0xbtc-api'"
             class="no-underline select-none text-white text-lg p-4 bg-teal-600 hover:bg-teal-500 border-2 border-neutral-800">
              API Documentation
            </a>
          </div>


          <div class="md:w-1/2 w-full text-center overflow-hidden">


          <BlobArt /> 
           
          </div>
        </div>
      </div>
    </div>

    <div class="  section bg-white border-b-2 border-black">
      <div class="w-container"></div>
    </div>

     
  </div>
</template>


<script>
 

 

import Navbar from "./components/Navbar.vue";

import BlobArt from "./components/BlobArt.vue"; 

import StarflaskAPIHelper from "../js/starflask-api-helper.js";
import FrontendHelper from "../js/frontend-helper.js";



import {resolveRestQuery} from '../js/rest-api-helper'

export default {
  name: "Home",
  props: [],
  components: { Navbar, BlobArt},
  data() {
    return {
        
    };
  },

  mounted() {
       this.fetchLatestBlockData()

       setInterval( this.fetchLatestBlockData.bind(this) , 60 * 1000 )
  },

  methods: {
   

    getRouteTo(dest) {
      return FrontendHelper.getRouteTo(dest);
    },


    async fetchLatestBlockData(){

        let baseURI = '/api/mints'
        let result = await resolveRestQuery(`${baseURI}`,{contractAddress:"0xb6ed7644c69416d67b522e20bc294a9a9b405b31"})
          

        if(result && result.success){
          this.latestBlockData = result.output[0]
          console.log('result',result)
        }

      },

      getCurrentHashrate(){

        let rawHashrate = this.latestBlockData.hashrate_avg8mint

        return ( rawHashrate / 1000000000000 ).toFixed(2)
      }
    
  },
};
</script>
