"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signIn_PSQL = void 0;
const signIn_PSQL = (signIn_PSQL_DATA, password, email) => {
    const passwordMatched = bcrypt.compareSync(password, signIn_PSQL_DATA[0].has);
    if (passwordMatched) {
        return db.select('*').from('users')
            .where('email', email)
            .then(user => {
            res.json(user[0]);
        })
            .catch(err => res.json('sign in passwordMatch db select error'));
    }
    else {
        res.json("wron email or password");
    }
};
exports.signIn_PSQL = signIn_PSQL;
try { }
catch (err) { }
res.json('/signin route db select error');
