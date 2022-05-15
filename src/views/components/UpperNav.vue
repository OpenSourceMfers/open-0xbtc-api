<template>
  <nav role="navigation" class="w-full m-2 p-2 flex flex-row">
    <div class="w-full lg:w-auto block lg:inline-block" v-for="item in navConfig.dropdowns" :key="item.title">
     




  </div>


     

</nav>
</template>


<script> 
import Config from '../config/UpperNav.js'
export default {
  name: 'UpperNav',
  props: [    ],
  components:{ },
  data() {
    return {
      
      navConfig: null 
    }
  },
  created(){
    this.navConfig = Config;
    

   
  },
  methods: {
        
           
         
  }
}
</script>