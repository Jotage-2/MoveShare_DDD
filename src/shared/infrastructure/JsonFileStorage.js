const fs = require('fs');
const path = require('path');

class JsonFileStorage {
  constructor(filePath) {
    this.filePath = path.resolve(filePath);
  }

  read(defaultValue = []) {
    try {
      if (!fs.existsSync(this.filePath)) {
        this.write(defaultValue);
        return defaultValue;
      }
      const raw = fs.readFileSync(this.filePath, 'utf8');
      if (!raw || !raw.trim()) return defaultValue;
      return JSON.parse(raw);
    } catch (error) {
      console.error(`[JsonFileStorage] Error leyendo ${this.filePath}:`, error.message);
      return defaultValue;
    }
  }

  write(value) {
    try {
      fs.mkdirSync(path.dirname(this.filePath), { recursive: true });
      fs.writeFileSync(this.filePath, JSON.stringify(value, null, 2), 'utf8');
      return true;
    } catch (error) {
      console.error(`[JsonFileStorage] Error escribiendo ${this.filePath}:`, error.message);
      return false;
    }
  }
}

module.exports = JsonFileStorage;
