import preprocess from "svelte-preprocess";
import vercel from '@sveltejs/adapter-vercel';
import path from "path";

const subpackage = ['mo.umd']
const config = {
    onwarn: (warning, handler) => {
        const { code, frame } = warning;
        // console.log('-----------------------------', code, '-----------------------------')
        const _warning = [
            'a11y-invalid-attribute',
            'css-unused-selector',
            'a11y-label-has-associated-control',
            'unused-export-let',
            'a11y-missing-attribute',
            'a11y-missing-content',
            'a11y-mouse-events-have-key-events'
        ]
        if (_warning.includes(code))
            return;

        handler(warning);
    },
    kit: {
        prerender: {
            default: true
        },
        adapter: vercel(),
        vite: () => ({
            // mode: 'production',
            // mode: 'development',
            manifest: true,
            sourcemap: true,
            emptyOutDir: true,
            target: "es2018",
            overlay: false,
            resolve: {
                alias: {
                    $utils: path.resolve('./src/utils'),
                    $api: path.resolve('./src/api'),
                    $lib: path.resolve('./src/lib')
                }
            },
            server: {
                proxy: {
                    '/prod-api': {
                        target: 'http://zsdn.zhihuihedao.cn',
                        changeOrigin: true,
                        rewrite: path => path.replace(/^\/prod-api/, '')
                    }
                },
                '/upload': {
                    target: 'https://zsdn.zhihuihedao.cn',
                    changeOrigin: true,
                }
            },
            build: {
                // rollupOptions: {
                //     onwarn: (warning, handler) => {
                //         const { code, frame } = warning;
                //         if (code === "css-unused-selector")
                //             return;

                //         handler(warning);
                //     },
                //     output: {
                //         manualChunks(id) {
                //             if (id.includes('node_modules')) {
                //                 const hassSubpackage = subpackage.findIndex(val => id.indexOf(val) !== -1)
                //                 if (hassSubpackage !== -1) {
                //                     return id.toString().split('node_modules/')[1].split('/')[0].toString()
                //                 }
                //                 return 'vendor'
                //             }
                //         }
                //     }
                // }
            }
        })
    },

    preprocess: [
        preprocess({
            postcss: true,
        }),
    ]
};

export default config;
