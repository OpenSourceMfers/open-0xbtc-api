<template>

<div>

   <div class="section  bg-white border-b-2 border-black px-0 lg:px-1">

     <div class=" ">
        <Navbar 
        v-bind:web3Plug="web3Plug"
       />
     </div>


   </div>

  

   <div class="section  bg-white border-b-2 border-black">
     <div class="autospacing w-container">

 
          <div class="text-xl font-bold mb-8"> API Status </div>


           

          <div  class=" "  v-if="searchResults.length > 0" >
             
             <div class="mb-4 text-xl">

               <div v-for="result of searchResults"> 
 
                 <a v-bind:href="'/type/'.concat(result.name)" > {{result.name}} </a> 
               </div>
                


            </div>

            
  

          </div>


           <div  class=" " v-if="searchResults.length == 0" >
              No results found.
          </div>
          


             


        
     </div>
   </div>


    


    
  <Footer/>

</div>
</template>


<script>

import Vue from 'vue'

import Web3Plug from '../js/web3-plug.js' 


import Navbar from './components/Navbar.vue';
 
import Footer from './components/Footer.vue';

import GenericDropdown from './components/GenericDropdown.vue'
 


import SearchBar from './components/SearchBar.vue'

var updateTimer;

export default {
  name: 'Search',
  props: [ ],
  components: {Navbar, Footer, GenericDropdown, SearchBar},
  data() {
    return {
      web3Plug: new Web3Plug() ,
      initialQuery: null,
      searchResults: []
      
 
    }
  },
  computed: {
     
   
  },
  created(){
this.web3Plug.getPlugEventEmitter().on('stateChanged', function(connectionState) {
        console.log('stateChanged',connectionState);
         
        //this.activeAccountAddress = connectionState.activeAccountAddress
        //this.activeNetworkId = connectionState.activeNetworkId
 
         
      }.bind(this));
   this.web3Plug.getPlugEventEmitter().on('error', function(errormessage) {
        console.error('error',errormessage);
         
        //this.web3error = errormessage
       
      }.bind(this));

      this.web3Plug.reconnectWeb()
    
 
    

  },
  mounted () {
    
     this.$nextTick(() => {
        this.populateInitialquery()
    })
     
      
    
  }, 

  beforeDestroy(){
      
  },
  methods: {

    async populateInitialquery(){

        if(this.$route.params.query){
             this.initialQuery = this.$route.params.query 
           
             this.$refs.searchBar.setInitialQuery( this.initialQuery )

             this.fetchSearchResults( this.initialQuery )
          }

    } ,
    async fetchSearchResults(query){

         let chainId = this.web3Plug.getActiveNetId()

        if(chainId==null){
          chainId = 1 
          console.log('no web3 connection')
        } 

        this.searchResults= []

        let contractData = this.web3Plug.getContractDataForNetworkID(chainId)

        for(let [key,value] of Object.entries( contractData )){

          if(key.toLowerCase().includes(query.toLowerCase())){

            this.searchResults.push(value)
          }


        }


    },
    onSearchCallback(query){
        this.fetchSearchResults(query)
    }
        
          
 
  }
}
</script>
