import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

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
                sourcemap: true,
                globals: {}
            }
        }
    },
    plugins: [dts({
        outDir: './build',
        rollupTypes: true
    })]
});
