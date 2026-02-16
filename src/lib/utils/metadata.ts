import { BlobReader, ZipReader, BlobWriter } from '@zip.js/zip.js';

export interface ExtractedMetadata {
    title: string;
    author: string;
    coverBlob: Blob | null;
    totalPages: number;
}

export async function extractMetadata(file: File): Promise<ExtractedMetadata> {
    const extension = file.name.split('.').pop()?.toLowerCase();

    switch (extension) {
        case 'epub':
            return extractEpubMetadata(file);
        case 'pdf':
            return extractPdfMetadata(file);
        case 'cbz':
            return extractComicMetadata(file);
        case 'cbr':
            return extractCbrMetadata(file);
        default:
            return {
                title: file.name.replace(/\.[^/.]+$/, ""),
                author: 'Unknown',
                coverBlob: null,
                totalPages: 0
            };
    }
}

async function extractEpubMetadata(file: File): Promise<ExtractedMetadata> {
    try {
        // Dynamic import to avoid SSR issues
        const { default: ePub } = await import('epubjs');

        const arrayBuffer = await file.arrayBuffer();
        const book = ePub(arrayBuffer);
        const metadata = await book.loaded.metadata;
        const coverUrl = await book.coverUrl();

        let coverBlob = null;
        if (coverUrl) {
            const response = await fetch(coverUrl);
            coverBlob = await response.blob();
        }

        return {
            title: metadata.title || file.name,
            author: metadata.creator || 'Unknown',
            coverBlob,
            totalPages: 0
        };
    } catch (e) {
        console.error('Error extracting EPUB metadata:', e);
        return { title: file.name, author: 'Unknown', coverBlob: null, totalPages: 0 };
    }
}

async function extractPdfMetadata(file: File): Promise<ExtractedMetadata> {
    try {
        // Dynamic import to avoid SSR issues
        const pdfjs = await import('pdfjs-dist');

        // Set worker source
        if (!pdfjs.GlobalWorkerOptions.workerSrc) {
            pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
        }

        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        const info: any = await pdf.getMetadata();

        // Generate thumbnail from first page
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 0.5 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        if (context) {
            await page.render({ canvasContext: context, viewport, canvas }).promise;
        }

        const coverBlob = await new Promise<Blob | null>((resolve) => {
            canvas.toBlob(resolve, 'image/jpeg', 0.8);
        });

        return {
            title: info.info?.Title || file.name,
            author: info.info?.Author || 'Unknown',
            coverBlob,
            totalPages: pdf.numPages
        };
    } catch (e) {
        console.error('Error extracting PDF metadata:', e);
        return { title: file.name, author: 'Unknown', coverBlob: null, totalPages: 0 };
    }
}

async function extractComicMetadata(file: File): Promise<ExtractedMetadata> {
    try {
        const blobReader = new BlobReader(file);
        const zipReader = new ZipReader(blobReader);
        const entries = await zipReader.getEntries();

        const imageEntries = entries
            .filter(e => /\.(jpg|jpeg|png|webp|gif)$/i.test(e.filename))
            .sort((a, b) => a.filename.localeCompare(b.filename, undefined, { numeric: true }));

        let coverBlob = null;
        if (imageEntries.length > 0) {
            const firstImage = imageEntries[0] as any;
            if (firstImage.getData) {
                const blob = await firstImage.getData(new BlobWriter());
                coverBlob = blob;
            }
        }

        await zipReader.close();

        return {
            title: file.name.replace(/\.[^/.]+$/, ""),
            author: 'Unknown',
            coverBlob,
            totalPages: imageEntries.length
        };
    } catch (e) {
        console.error('Error extracting Comic metadata:', e);
        return { title: file.name, author: 'Unknown', coverBlob: null, totalPages: 0 };
    }
}
async function extractCbrMetadata(file: File): Promise<ExtractedMetadata> {
    try {
        /*
        const { createExtractorFromData } = await import('unrar-js');
        const arrayBuffer = await file.arrayBuffer();
        const extractor = await createExtractorFromData(arrayBuffer);
        const list = extractor.getFileList();

        const imageFiles = list.arcHeader.fileHeaders
            .filter(h => /\.(jpg|jpeg|png|webp|gif)$/i.test(h.name))
            .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

        let coverBlob = null;
        if (imageFiles.length > 0) {
            const extracted = extractor.extractFiles([imageFiles[0].name]);
            const fileData = extracted.files[0];
            if (fileData.extraction) {
                coverBlob = new Blob([fileData.extraction]);
            }
        }

        return {
            title: file.name.replace(/\.[^/.]+$/, ""),
            author: 'Unknown',
            coverBlob,
            totalPages: imageFiles.length
        };
        */
        return { title: file.name, author: 'Unknown', coverBlob: null, totalPages: 0 };
    } catch (e) {
        console.error('Error extracting CBR metadata:', e);
        return { title: file.name, author: 'Unknown', coverBlob: null, totalPages: 0 };
    }
}
