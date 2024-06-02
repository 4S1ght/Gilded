import { defineConfig } from 'vite'

export default defineConfig({
    build: {
        lib: {
            entry: './src/index.ts',
            fileName: () => `index.js`,
            formats: ['es'],
        },
        rollupOptions: {
            // Add external dependencies here if you have any
            external: [],
            output: {
                dir: './build',
                globals: {}
            }
        }
    }
});
