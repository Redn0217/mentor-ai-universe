declare module 'express' {
  export * from 'express';
}

declare module 'cors' {
  import { RequestHandler } from 'express';
  
  function cors(options?: cors.CorsOptions | cors.CorsOptionsDelegate): RequestHandler;
  
  namespace cors {
    interface CorsOptions {
      origin?: boolean | string | RegExp | (string | RegExp)[] | ((origin: string, callback: (err: Error | null, allow?: boolean) => void) => void);
      methods?: string | string[];
      allowedHeaders?: string | string[];
      exposedHeaders?: string | string[];
      credentials?: boolean;
      maxAge?: number;
      preflightContinue?: boolean;
      optionsSuccessStatus?: number;
    }
    
    interface CorsOptionsDelegate {
      (req: any, callback: (err: Error | null, options?: CorsOptions) => void): void;
    }
  }
  
  export = cors;
}
