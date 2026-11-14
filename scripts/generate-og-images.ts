import fs from 'node:fs';
import path from 'node:path';
import { generateBlogOgImages } from '../src/lib/og-generator';

async function main() {
    const force = process.argv.includes('--force');
    const watch = process.argv.includes('--watch');

    console.log(`Generating High-Quality Social Preview Images${force ? ' [force re-render]' : ''}...\n`);
    const start = Date.now();

    try {
        const blogResults = await generateBlogOgImages({ force });

        let freshCount = 0;
        let cachedCount = 0;

        console.log('Blog OG Images (from public/svgs):');
        for (const item of blogResults) {
            const kb = (item.size / 1024).toFixed(1);
            if (item.cached) {
                cachedCount++;
                console.log(`  ⚡ ${item.slug}.png (${item.width}x${item.height}, ${kb} KB) [cached]`);
            } else {
                freshCount++;
                console.log(`  ✓ ${item.slug}.png (${item.width}x${item.height}, ${kb} KB) [rendered]`);
            }
        }

        const projectLogosDir = path.join(process.cwd(), 'public', 'project-logo');
        if (fs.existsSync(projectLogosDir)) {
            const logos = fs.readdirSync(projectLogosDir).filter((f) => /\.(png|jpe?g|webp|svg)$/i.test(f));
            console.log(`\nProject Logos (served directly from public/project-logo):`);
            for (const logo of logos) {
                console.log(`  ✓ ${logo} (mapped as-is)`);
            }
        }

        const elapsed = ((Date.now() - start) / 1000).toFixed(2);
        console.log(
            `\n🎉 Processed ${blogResults.length} blog OG images (${freshCount} rendered, ${cachedCount} cached) in ${elapsed}s!\n`
        );

        if (watch) {
            const svgsDir = path.join(process.cwd(), 'public', 'svgs');
            console.log(`👀 Watching for changes in:`);
            console.log(`   - ${svgsDir}\n`);

            let isRunning = false;
            let pendingRerun = false;

            const trigger = async () => {
                if (isRunning) {
                    pendingRerun = true;
                    return;
                }
                isRunning = true;
                try {
                    console.log(`[Watcher] Change detected. Regenerating OG images...`);
                    await generateBlogOgImages({ force: false });
                    console.log(`[Watcher] Completed.`);
                } catch (err) {
                    console.error('[Watcher] Error regenerating OG images:', err);
                } finally {
                    isRunning = false;
                    if (pendingRerun) {
                        pendingRerun = false;
                        await trigger();
                    }
                }
            };

            if (fs.existsSync(svgsDir)) {
                fs.watch(svgsDir, { persistent: true }, () => trigger());
            }
        }
    } catch (error) {
        console.error('Failed to generate OG images:', error);
        process.exit(1);
    }
}

main().catch((error) => {
    console.error('Unhandled failure:', error);
    process.exit(1);
});
