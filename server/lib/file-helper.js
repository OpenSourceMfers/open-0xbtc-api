
 
import fs from 'fs'
import path from 'path'
export default class FileHelper{


    static  readJSONFile(uri){

         let input =  fs.readFileSync(path.resolve( uri),   {encoding:'utf8', flag:'r'}); 

         return JSON.parse(input)
    }



}