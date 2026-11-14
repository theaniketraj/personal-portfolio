import fs from 'node:fs';
import path from 'node:path';

export interface ConvertSvgOptions {
    width?: number;
    height?: number;
    density?: number;
    quality?: number;
    compressionLevel?: number;
}

export interface GeneratedOgImageResult {
    slug: string;
    sourcePath: string;
    pngPath: string;
    width: number;
    height: number;
    size: number;
    cached?: boolean;
}

// 2x Retina resolution for razor-sharp social previews on high-DPI screens and mobile devices
const DEFAULT_WIDTH = 2400;
const DEFAULT_HEIGHT = 1260;
const DEFAULT_DENSITY = 144; // 2x base 72 DPI

const DEFAULT_SVG_DIR = path.join(process.cwd(), 'public', 'svgs');
const DEFAULT_OUTPUT_DIR = path.join(process.cwd(), 'public', 'images', 'og');

/**
 * Dynamically loads sharp to avoid bundling native C++ binary on client or non-node runtimes.
 */
async function getSharp() {
    const sharpModule = await import('sharp');
    return sharpModule.default || sharpModule;
}

/**
 * Converts an SVG file path or Buffer to a high-quality PNG buffer, optionally writing to outputPath.
 * Defaults to 2400x1260 (2x Retina, 144 DPI) for crisp text and diagram rendering.
 */
export async function convertSvgToPng(
    input: string | Buffer,
    outputPath?: string,
    options: ConvertSvgOptions = {}
): Promise<Buffer> {
    const sharp = await getSharp();

    const width = options.width ?? DEFAULT_WIDTH;
    const height = options.height ?? DEFAULT_HEIGHT;
    // Scale density proportionally if custom width is passed, defaulting to 144 DPI (2x Retina)
    const density =
        options.density ?? (width >= 2400 ? DEFAULT_DENSITY : Math.max(72, Math.round(72 * (width / 1200))));
    const quality = options.quality ?? 100;
    const compressionLevel = options.compressionLevel ?? 8;

    const inputBuffer = typeof input === 'string' ? fs.readFileSync(input) : input;

    const pngBuffer = await sharp(inputBuffer, { density })
        .resize(width, height, {
            fit: 'contain',
            background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .png({
            quality,
            compressionLevel,
            adaptiveFiltering: true
        })
        .toBuffer();

    if (outputPath) {
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
        fs.writeFileSync(outputPath, pngBuffer);
    }

    return pngBuffer;
}

/**
 * Converts all dedicated blog SVGs in public/svgs into high-quality PNGs in public/images/og.
 * Uses incremental time caching so only new or updated SVGs are re-rendered.
 */
export async function generateBlogOgImages(
    options: {
        svgDir?: string;
        outputDir?: string;
        force?: boolean;
        width?: number;
        height?: number;
        density?: number;
    } = {}
): Promise<GeneratedOgImageResult[]> {
    const svgDir = options.svgDir ?? DEFAULT_SVG_DIR;
    const outputDir = options.outputDir ?? DEFAULT_OUTPUT_DIR;
    const targetWidth = options.width ?? DEFAULT_WIDTH;
    const targetHeight = options.height ?? DEFAULT_HEIGHT;
    const targetDensity = options.density ?? DEFAULT_DENSITY;

    if (!fs.existsSync(svgDir)) {
        console.warn(`[Blog OG Generator] SVG directory does not exist: ${svgDir}`);
        return [];
    }

    fs.mkdirSync(outputDir, { recursive: true });

    const svgFiles = fs.readdirSync(svgDir).filter((file) => file.endsWith('.svg'));

    return Promise.all(
        svgFiles.map(async (file) => {
            const slug = path.basename(file, '.svg');
            const svgPath = path.join(svgDir, file);
            const pngOutputPath = path.join(outputDir, `${slug}.png`);

            const svgStat = fs.statSync(svgPath);
            const pngExists = fs.existsSync(pngOutputPath);

            const isUpToDate =
                !options.force &&
                pngExists &&
                fs.statSync(pngOutputPath).mtimeMs >= svgStat.mtimeMs &&
                fs.statSync(pngOutputPath).size > 0;

            let pngBuffer: Buffer;
            let cached = false;

            if (isUpToDate) {
                pngBuffer = fs.readFileSync(pngOutputPath);
                cached = true;
            } else {
                pngBuffer = await convertSvgToPng(svgPath, pngOutputPath, {
                    width: targetWidth,
                    height: targetHeight,
                    density: targetDensity
                });
            }

            return {
                slug,
                sourcePath: svgPath,
                pngPath: pngOutputPath,
                width: targetWidth,
                height: targetHeight,
                size: pngBuffer.length,
                cached
            };
        })
    );
}
