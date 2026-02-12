// Importing database functions. DO NOT MODIFY THIS LINE.
import { central, db1, db2, db3, vault } from "./database.js";

getUserData(5).then((db) => {
console.log(db);
})

function getUserData(id) {
  const dbs = {
    db1: db1,
    db2: db2,
    db3: db3
  };

    return central(id) .then((db) => {
        return db;
    }).then((data) => {
        return Promise.all([dbs[data](id), vault(id)]).then(([result1,result2]) => {
            return Object.assign(result1,result2);
        });
    })
}