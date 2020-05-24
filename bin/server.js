var os = require('os');
const app = require('../app');

const networkInterfaces = os.networkInterfaces();
let serverIP = networkInterfaces['enp4s0'][0]['address'];

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on address ${serverIP}:${PORT}`));