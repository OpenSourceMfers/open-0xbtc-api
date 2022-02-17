<template>
<div class="inline-block text-white text-xs">
  <div  v-html="outputText" class="" > </div>  

  
</div>
</template>


<script>
export default {
  name: 'AccessButton',
  props: ['inputText' ],
  components: {},
  data() {
    return {
      outputText: "",
      textDrawIndex: 0
      
    }
  },
   created: async function()
  { 
      this.updateText()
      setInterval(function(){ this.updateText()  }.bind(this)  , 100)
  },
  
  methods: {
    updateText(){
 

      if(this.textDrawIndex < this.inputText.length){
        this.textDrawIndex = this.textDrawIndex + 1;
      }

      this.outputText = this.inputText.slice(0,this.textDrawIndex)
    }
   
  }
}
</script>