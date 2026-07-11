class User {
  constructor({ id, firstName, lastName, email, dni, password, verified = false, createdAt }) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.dni = dni;
    this.password = password;
    this.verified = verified;
    this.createdAt = createdAt;
  }

  toJSON() { return { ...this }; }
}
module.exports = User;
