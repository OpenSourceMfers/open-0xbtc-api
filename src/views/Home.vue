<template>
  <div>
    <div class="section bg-gray-200 border-b-4 border-black px-0 lg:px-1">
      <div class=" ">
        <Navbar v-bind:web3Plug="web3Plug" v-bind:accessPlug="accessPlug" />
      </div>
    </div>

    <div class="section border-b-2 border-black" style="background: #222">
      <div class=" ">
        <div class=" "></div>
        <div class="flex md:flex-row flex-col">
          <div class="md:w-1/2 w-full mt-8 py-8 px-8 text-center">
            
          

            <a :href="'https://apidocs.0xbtc.io'" class="text-white text-lg">
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

export default {
  name: "Home",
  props: [],
  components: { Navbar, BlobArt},
  data() {
    return {
        
    };
  },

  created() {
     
  },

  methods: {
   

    getRouteTo(dest) {
      return FrontendHelper.getRouteTo(dest);
    },

    
  },
};
</script>
