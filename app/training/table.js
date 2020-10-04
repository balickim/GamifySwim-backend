// const { connectTo } = require('../../secrets/databaseConfiguration');

// class TrainingTable {
//     static training({ databasename, limit, offset }) {
//         const schoolPool = connectTo(databasename);
//         return new Promise((resolve, reject) => {
//             schoolPool.query(
//                 'SELECT * FROM traininglist LIMIT $1 OFFSET $2',
//                 [limit, offset],
//                 (error, response) => {
//                     if (error) return reject(error);

//                     resolve({ training: response.rows });
//                 }
//             );
//         });
//     }
// }

// module.exports = TrainingTable;