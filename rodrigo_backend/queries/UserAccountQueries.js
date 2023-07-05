const pool = require('./DBPool');

const getLoginByUserAccountEmail = async(userAccountEmail, client) => {
    const result = await (client || pool).query(
        `SELECT courriel_utilisateur, nom_complet, password_hash, password_salt, is_active, is_admin
        FROM utilisateur
        WHERE courriel_utilisateur = $1`,
        [userAccountEmail]
    );
    
    const row = result.rows[0];
    if(row){
        return {
            courrielUtilisateur: row.courriel_utilisateur,
            nomComplet: row.nom_complet,
            passwordHash: row.password_hash,
            passwordSalt: row.password_salt,
            isActive: row.is_active,
            isAdmin:row.is_admin
        };
    }
    return undefined;
};

exports.getLoginByUserAccountEmail = getLoginByUserAccountEmail;

