const server = require('express');

const app = server();
const PORT = process.env.PORT || 3000;


app.get('/', (res,req) => {

})


app.listen(PORT, () => {
  console.log(`server started on PORT ${PORT}`)
})

