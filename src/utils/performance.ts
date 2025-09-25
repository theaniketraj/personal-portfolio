// Performance monitoring utilities
export const performance = {
    // Measure and log build time for pages
    measurePageBuild: (pageName: string) => {
        const start = Date.now();
        return {
            end: () => {
                const duration = Date.now() - start;
                console.log(`📊 Page build time for ${pageName}: ${duration}ms`);
                return duration;
            }
        };
    },

    // Measure payload size
    measurePayloadSize: (data: any, pageName: string) => {
        const bytes = Buffer.byteLength(JSON.stringify(data), 'utf8');
        const sizeKB = Math.round(bytes / 1024);
        const sizeMB = (bytes / (1024 * 1024)).toFixed(1);

        console.log(`📦 Payload size for ${pageName}: ${sizeKB} KB (${sizeMB}MB)`);

        // Warn if payload is large
        if (bytes > 128 * 1024) {
            // 128KB threshold
            console.warn(`⚠️  Large payload detected for ${pageName}. Consider optimizing.`);
        }

        return { bytes, sizeKB, sizeMB };
    },

    // Memory usage tracking
    logMemoryUsage: (context: string) => {
        if (typeof process !== 'undefined' && process.memoryUsage) {
            const usage = process.memoryUsage();
            const usageMB = {
                rss: Math.round(usage.rss / 1024 / 1024),
                heapTotal: Math.round(usage.heapTotal / 1024 / 1024),
                heapUsed: Math.round(usage.heapUsed / 1024 / 1024),
                external: Math.round(usage.external / 1024 / 1024)
            };

            console.log(`🧠 Memory usage at ${context}:`, usageMB);

            // Warn if memory usage is high
            if (usageMB.heapUsed > 512) {
                console.warn(`⚠️  High memory usage detected: ${usageMB.heapUsed}MB`);
            }

            return usageMB;
        }
        return null;
    },

    // Performance timing marks
    mark: (name: string) => {
        if (typeof globalThis !== 'undefined' && globalThis.performance && globalThis.performance.mark) {
            globalThis.performance.mark(name);
        }
    },

    measure: (name: string, startMark: string, endMark: string) => {
        if (
            typeof globalThis !== 'undefined' &&
            globalThis.performance &&
            globalThis.performance.measure &&
            globalThis.performance.getEntriesByName
        ) {
            globalThis.performance.measure(name, startMark, endMark);
            const measure = globalThis.performance.getEntriesByName(name)[0];
            console.log(`⏱️  ${name}: ${Math.round(measure.duration)}ms`);
            return measure.duration;
        }
        return 0;
    }
};

// Bundle analyzer helper
export const bundleAnalyzer = {
    shouldAnalyze: () => process.env.ANALYZE === 'true',

    logBundleInfo: (info: any) => {
        if (bundleAnalyzer.shouldAnalyze()) {
            console.log('📊 Bundle Analysis:', info);
        }
    }
};
