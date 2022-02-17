
 
    export default class WolfpackConnector  {
    
        constructor(   ){
           
           
        }

        //http://localhost:3000/api/v1/somestuff
        static async handleApiRequest(request, mongoInterface){
            console.log('got api request', request.params )

            return 'This is the API'
        }
    
         
    }