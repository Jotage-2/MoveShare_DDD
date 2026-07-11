// ======================================================
// Class
// ======================================================

class SendVerificationEmailUseCase {
    constructor(emailService) {
        this.emailService = emailService;
    }

    execute({ email, firstName, code }) {
        return this.emailService.sendVerificationEmail(
            email,
            firstName,
            code
        );
    }
}


// ======================================================
// Export
// ======================================================

module.exports = SendVerificationEmailUseCase;