module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/unit/setupTests.ts'],
  testMatch: ['<rootDir>/tests/unit/**/*.test.{ts,tsx}'],
  moduleNameMapper: {
    '^react-leaflet$': '<rootDir>/tests/unit/__mocks__/react-leaflet.tsx',
    '^leaflet$': '<rootDir>/tests/unit/__mocks__/leaflet.ts',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx',
        target: 'es2023',
        lib: ['es2023', 'dom'],
        types: ['jest', 'node', '@testing-library/jest-dom']
      }
    }]
  },
  reporters: [
    'default',
    [
      'jest-html-reporter',
      {
        pageTitle: 'Unit Test Report',
        outputPath: './tests/unit-report.html',
        includeFailureMsg: true,
        includeConsoleLog: true
      }
    ]
  ]
};