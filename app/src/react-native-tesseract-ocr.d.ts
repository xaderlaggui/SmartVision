declare module 'react-native-tesseract-ocr' {
    export default class TesseractOcr {
        static recognize(
            path: string,
            language: string,
            options?: {
                whitelist?: string | null;
                blacklist?: string | null;
            }
        ): Promise<string>;
    }
}
