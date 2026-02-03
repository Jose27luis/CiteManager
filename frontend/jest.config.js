const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Proporciona la ruta a tu aplicación Next.js para cargar next.config.js y los archivos .env
  dir: './',
})

// Configuraciones personalizadas para Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    // Manejar alias (si usas @/ en tu proyecto)
    '^@/(.*)$': '<rootDir>/src/$1',
  },
}

// createJestConfig se exporta de esta manera para asegurar que next/jest pueda cargar la configuración de Next.js
module.exports = createJestConfig(customJestConfig)
