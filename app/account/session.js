const uuid = require('uuid/v4');
const { hash } = require('./helper');

const SEPARATOR = '|';

class Session {
    constructor({ databasename, username }) {
        this.username = username;
        this.id = uuid();
        this.database = databasename;
    }

    toString() {
        const { username, id, database } = this;

        return Session.sessionString({ databasename: database, username, id });
    }

    static parse(sessionString) {
        const sessionData = sessionString.split(SEPARATOR);

        return {
            username: sessionData[0],
            id: sessionData[1],
            sessionHash: sessionData[2],
            database: sessionData[3]
        };
    }

    static verify(sessionString) {
        const { username, id, sessionHash } = Session.parse(sessionString);

        const accountData = Session.accountData({ username, id });

        return hash(accountData) === sessionHash;
    }

    static accountData({ username, id }) {
        return `${username}${SEPARATOR}${id}`;
    }

    static sessionString({ databasename, username, id }) {
        const accountData = Session.accountData({ username, id });
        const database = databasename;

        return `${accountData}${SEPARATOR}${hash(accountData)}${SEPARATOR}${database}`;
    }
}

// const foo = new Session({ username: 'foo' });
// const fooString = foo.toString();
// console.log("Sesscion.parse(fooString)", Session.parse(fooString));

// console.log(Session.verify(fooString));

// const fake = `admin_${fooString}`;

// console.log(Session.verify(fake));

module.exports = Session;