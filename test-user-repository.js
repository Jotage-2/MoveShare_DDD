require('dotenv').config();

const PostgresUserRepository = require(
    './src/contexts/identity/infrastructure/PostgresUserRepository'
);

async function test() {

    const repository = new PostgresUserRepository();

    const users = await repository.findAll();

    console.log(users);

    process.exit();

}

test();