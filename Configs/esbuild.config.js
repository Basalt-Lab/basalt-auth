import esbuild from 'esbuild';

import pkg from '../package.json' with { type: 'json' };

const safePkg = pkg;
const dependencies = safePkg.dependencies ? Object.keys(safePkg.dependencies) : undefined;
const devDependencies = safePkg.devDependencies ? Object.keys(safePkg.devDependencies) : undefined;
 
const external = [...(dependencies || []), ...(devDependencies || [])];

const options = {
    bundle: true,
    color: true,
    entryPoints: ['./Source/App.ts'],
    external,
    format: 'esm',
    keepNames: true,
    loader: { '.ts': 'ts' }, 
    minify: true,
    outfile: './Build/App.js',
    platform: 'node',
    sourcemap: 'linked',
    treeShaking: true,
    tsconfig: './tsconfig.json',
};

esbuild.build(options);