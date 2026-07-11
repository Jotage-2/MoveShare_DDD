class LogoutUserUseCase {
  execute(session) {
    return new Promise((resolve, reject) => {
      session.destroy(error => (error ? reject(error) : resolve()));
    });
  }
}

module.exports = LogoutUserUseCase;
