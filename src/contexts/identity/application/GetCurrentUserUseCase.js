const AppError = require('../../../shared/domain/AppError');

class GetCurrentUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  execute(userId) {
    if (!userId) {
      throw new AppError('No autenticado.', 401);
    }

    const user = this.userRepository.findById(userId);

    if (!user) {
      throw new AppError('Usuario no encontrado.', 404);
    }

    return user;
  }
}

module.exports = GetCurrentUserUseCase;