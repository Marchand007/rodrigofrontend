const pool = require('./DBPool');
const HttpError = require('../HttpError');

const createUserAccount = async (userAccountEmail, fullname, passwordHash, passwordSalt) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const existingUserAccount = await getLoginByUserAccountEmail(userAccountEmail, client);
        if (existingUserAccount) {
            throw new HttpError(409, `Un compte avec le courriel ${userAccountEmail} existe déjà`);
        }

        const result = await (client || pool).query(
            `INSERT INTO utilisateur (courriel_utilisateur, nom_complet, password_hash, password_salt)
            VALUES($1, $2, $3, $4)`,
            [userAccountEmail, fullname, passwordHash, passwordSalt]
        );

        const userAccount = getLoginByUserAccountEmail(userAccountEmail, client);

        client.query('COMMIT');

        return userAccount;

    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

exports.createUserAccount = createUserAccount;

const getLoginByUserAccountEmail = async (userAccountEmail, client) => {
    const result = await (client || pool).query(
        `SELECT courriel_utilisateur, nom_complet, password_hash, password_salt, is_active, is_admin
        FROM utilisateur
        WHERE courriel_utilisateur = $1`,
        [userAccountEmail]
    );

    const row = result.rows[0];
    if (row) {
        return {
            courrielUtilisateur: row.courriel_utilisateur,
            nomComplet: row.nom_complet,
            passwordHash: row.password_hash,
            passwordSalt: row.password_salt,
            isActive: row.is_active,
            isAdmin: row.is_admin
        };
    }
    return undefined;
};

exports.getLoginByUserAccountEmail = getLoginByUserAccountEmail;

