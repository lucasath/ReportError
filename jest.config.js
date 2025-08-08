module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  testMatch: ['**/?(*.)+(test).[tj]s?(x)'], // ← Testes em qualquer pasta, exceto node_modules
  testPathIgnorePatterns: ['/node_modules/'], // ← Apenas para garantir
    transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest', // ← importante para JSX TSX
  },
};