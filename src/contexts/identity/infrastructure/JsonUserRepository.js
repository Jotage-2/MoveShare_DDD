const path = require('path');

const UserRepository = require('../domain/UserRepository');
const JsonFileStorage = require('../../../shared/infrastructure/JsonFileStorage');

class JsonUserRepository extends UserRepository {
    constructor(
        filePath = path.join(
            __dirname,
            '../../../../data/users.json'
        )
    ) {
        super();

        this.storage = new JsonFileStorage(filePath);
    }

    findAll() {
        return this.storage.read([]);
    }

    findByEmail(email) {
        const normalized = String(email || '').toLowerCase();

        return (
            this.findAll().find(
                (user) =>
                    String(user.email || '').toLowerCase() ===
                    normalized
            ) || null
        );
    }

    findById(id) {
        return (
            this.findAll().find(
                (user) => String(user.id) === String(id)
            ) || null
        );
    }

    create(user) {
        const users = this.findAll();

        const data =
            typeof user.toJSON === 'function'
                ? user.toJSON()
                : user;

        users.push(data);

        if (!this.storage.write(users)) {
            throw new Error(
                'No se pudo guardar el usuario.'
            );
        }

        return data;
    }

    update(id, updates) {
        const users = this.findAll();

        const index = users.findIndex(
            (user) => String(user.id) === String(id)
        );

        if (index === -1) {
            return null;
        }

        users[index] = {
            ...users[index],
            ...updates
        };

        if (!this.storage.write(users)) {
            throw new Error(
                'No se pudo actualizar el usuario.'
            );
        }

        return users[index];
    }
}

module.exports = JsonUserRepository;