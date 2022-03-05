



export default class SingletonLoopMethod {

    constructor(callback, args){
        this.registerMethod(callback,args)
    }


    //callback should be a promise 
    registerMethod(  callback, args  ){
        //console.log('typeof callback', typeof callback)
        //if(typeof callback!='Promise') throw 'Must be a promise'

        this.callback = callback;
        this.args=args;
    } 

    start(intervalMs){

        let interval = intervalMs ? intervalMs : 1000

        
        this.interval = setInterval( this.execute.bind(this) , interval )

    }

    stop(){
        clearInterval(this.interval)
    }

    async execute(){
        if(this.executing){
            console.error('ALREADY EXECUTING')
            return
        }; 

        console.log('its',this.callback)

        this.executing=true
        await this.callback(...this.args)
        this.executing=false
    }


}

