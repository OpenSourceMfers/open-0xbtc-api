const config={

  "apps":[
    {
      "Title": "Demo",
      "URL": "/app/demo",
      "Environment": "Staging",
      "Network": "Database",
      "Key": "aslknalsndfansdfn",
      "MedianResponse": "5",
      "Request": "25",
      "RateLimited": "2",
      "DaysonStarflask": "5", 
      "InvalidRequests": "2",
      "DailyRequests": [
        { "date": "Apr 14", "Requests": 0 },
        { "date": "Apr 15", "Requests": 1 },
        { "date": "Apr 16", "Requests": 2 },
        { "date": "Apr 17", "Requests": 1 },
        { "date": "Apr 18", "Requests": 5 },
        { "date": "Apr 19", "Requests": 3 },
        { "date": "Apr 20", "Requests": 2 }
      ]
    },
    {
      "Title": "My First App",
      "URL": "/app/myfirstapp",      
      "Environment": "Building",
      "Network": "Server",
      "Key": "qwerqewrnkq;lkwer;nq",
      "MedianResponse": "2",
      "Request": "12",
      "RateLimited": "6",
      "DaysonStarflask": "10",
      "InvalidRequests": "0",
      "DailyRequests": [
        { "date": "Apr 14", "Requests": 5 },
        { "date": "Apr 15", "Requests": 8 },
        { "date": "Apr 16", "Requests": 2 },
        { "date": "Apr 17", "Requests": 4 },
        { "date": "Apr 18", "Requests": 10 },
        { "date": "Apr 19", "Requests": 5 },
        { "date": "Apr 20", "Requests": 7 }
      ]
    }, 
    {
      "Title": "My Second App",
      "URL": "/app/mysecondapp",
      "Environment": "Production",
      "Network": "Apples",
      "Key": "zcvzxcvzcvzxcvzlkvlzknvnz",
      "MedianResponse": "15",
      "Request": "125",
      "RateLimited": "12",
      "DaysonStarflask": "15",
      "InvalidRequests": "20",
      "DailyRequests": [
        { "date": "Apr 14", "Requests": 10 },
        { "date": "Apr 15", "Requests": 11 },
        { "date": "Apr 16", "Requests": 12 },
        { "date": "Apr 17", "Requests": 11 },
        { "date": "Apr 18", "Requests": 15 },
        { "date": "Apr 19", "Requests": 13 },
        { "date": "Apr 20", "Requests": 12 }
      ]
    }, 
    {
      "Title": "The Last App",
      "URL": "/app/thelastapp",
      "Environment": "Another One",
      "Network": "Database",
      "Key": ";lknnonasdonfaoinf",
      "MedianResponse": "2",
      "Request": "65",
      "RateLimited": "0",
      "DaysonStarflask": "253",
      "InvalidRequests": "0",
      "DailyRequests": [
        { "date": "Apr 14", "Requests": 25 },
        { "date": "Apr 15", "Requests": 21 },
        { "date": "Apr 16", "Requests": 22 },
        { "date": "Apr 17", "Requests": 21 },
        { "date": "Apr 18", "Requests": 25 },
        { "date": "Apr 19", "Requests": 23 },
        { "date": "Apr 20", "Requests": 22 }
      ]
    }
  ]
}
export default config;
