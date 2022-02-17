<template> 
<div class="pt-8 relative pb-2 mb-12" style="min-height:300px">
            
            
    <img   src="@/assets/images/squiggle.png" width="256" height="256" alt="" style="margin: auto">

        

 </div>
 </template>



<script>
    export default {
    name: 'FrontPageMedia',
    props: [ ],
    data() {
        return {
            startTime: 0
        }
    },
    created(){
        this.startTime= Date.now()

        setInterval(this.update,500)
    },
    methods: {
         update(){
             this.$forceUpdate()
         },
         getTimeElapsed(){
             return Date.now() - this.startTime
         }
    }
    }
</script>
