const Session = require('../account/session');
const AccountTable = require('../account/table');
const { hash } = require('../account/helper');

const setSession = ({ databasename, username, res, sessionId, role_id }) => {
    return new Promise((resolve, reject) => {
        let session, sessionString;
        if (sessionId) {
            sessionString = Session.sessionString({ databasename, username, id: sessionId })
            setSessionCookie({ sessionString, res });

            resolve({ message: 'session restored', roleId: role_id });
        } else {
            session = new Session({ databasename, username });
            sessionString = session.toString();

            AccountTable.updateSessionId({
                databasename,
                sessionId: session.id,
                usernameHash: hash(username)
            })
                .then(() => {
                    setSessionCookie({ sessionString, res });

                    resolve({ message: 'session created', roleId: role_id });
                })
                .catch(error => reject(error));
        }
    });
}

const setSessionCookie = ({ sessionString, res }) => {
    res.cookie('sessionString', sessionString, {
        expire: Date.now() + 3600000,
        httpOnly: true,
        secure: true, // use with https
        sameSite: 'none'
    });
}

const authenticatedAccount = ({ sessionString }) => {
    return new Promise((resolve, reject) => {
        if (!sessionString || !Session.verify(sessionString)) {
            const error = new Error('Invalid session');

            error.statusCode = 400;

            return reject(error);
        } else {
            const { username, id, database } = Session.parse(sessionString);

            AccountTable.getAccount({ databasename: database, usernameHash: hash(username) })
                .then(({ account }) => {
                    const authenticated = account.sessionId === id;
                    const roleId = account.role_id;

                    resolve({ account, authenticated, username, roleId });
                })
                .catch(error => reject(error));
        }
    });
};

module.exports = { setSession, authenticatedAccount };