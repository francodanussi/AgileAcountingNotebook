Hello!

This assumes you have Node and Docker / Docker-Compose installed in your machine.

To run this application please go to root folder of this project and run docker-compose up.

This will start an API service in port 3005 and a mini React App in port 3002. 


API: 


POST -
'/credit' { amount: Number }
'/debit'  { amount: Number }

GET - 
'/userInfo'
'/transactions/:id'
'/accountHistory'
'/clearHistory'



Alternative: If you don't have Docker installed you can go to /service and run node service.js. Then go to /front and run npm start

You are ready to go!
