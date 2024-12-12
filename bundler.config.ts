import pkg from './package.json';

const dependencies = 'dependencies' in pkg ? Object.keys(pkg.dependencies ?? {}) : [];
const devDependencies = 'devDependencies' in pkg ? Object.keys(pkg.devDependencies ?? {}) : [];
const peerDependencies = 'peerDependencies' in pkg ? Object.keys(pkg.peerDependencies ?? {}) : [];

await Bun.build({
    external: [...dependencies, ...devDependencies, ...peerDependencies],
    root: './source',
    entrypoints: [
        './source/index.ts',
        './source/common/error/index.ts',
        './source/common/type/data/index.ts',
        './source/domain/service/basaltToken.service.ts',
        './source/common/i18n/index.ts'
    ],
    outdir: './build',
    splitting: true,
    format: 'esm',
    minify: true,
    sourcemap: process.env.NODE_ENV === 'development' ? 'external' : 'none',
    target: 'node',
});