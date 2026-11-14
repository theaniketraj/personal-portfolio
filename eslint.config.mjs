import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(import.meta.url);

const Module = require('node:module');
const origRequire = Module.prototype.require;
const nextConfigPath = require.resolve('eslint-config-next');
const nextParserPath = path.join(path.dirname(nextConfigPath), 'parser.js');
const nextParser = require(nextParserPath);

Module.prototype.require = function (id) {
    if (id === 'typescript-eslint') {
        return {
            default: {
                plugin: { rules: {} },
                parser: nextParser.default || nextParser
            }
        };
    }
    return origRequire.apply(this, arguments);
};

const nextConfigModule = await import('eslint-config-next');
const nextConfig = nextConfigModule.default;

const eslintConfig = [
    ...nextConfig.filter((c) => c.name !== 'next/typescript'),
    {
        rules: {
            'react-hooks/set-state-in-effect': 'warn'
        }
    },
    {
        ignores: ['.next/*', 'node_modules/*', 'public/*', 'dist/*']
    }
];

export default eslintConfig;
