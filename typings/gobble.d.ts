type Transformer = string | GobbleTransformer | GobbleSimpleTransformer;

declare interface Gobble {
  (input: string | Array<Gobble>, options?: {id?: string}): Gobble;
  transform(transformer: Transformer, options?: any) : Gobble;
  transformIf(condition: boolean, transformer: Transformer, options?: any) : Gobble;
  observe(observer: GobbleObserver, options?: any) : Gobble;
  observeIf(condition: boolean, observer: GobbleObserver, options?: any) : Gobble;
  include(patterns: string | Array<string>) : Gobble;
  exclude(patterns: string | Array<string>) : Gobble;
  grab(path: string) : Gobble;
  moveTo(path: string) : Gobble;
  serve(options?: {port?: number; gobbledir?: string}) : GobbleTask
  build(options?: {port?: number; gobbledir?: string}) : GobbleBuildTask
}

declare interface GobbleBuildTask extends GobbleTask {
  then(callback: Function);
  catch(errback: Function);
}

declare interface GobbleTask {
  pause(): void;
  resume(node: Gobble): void;
  close(): void;
}

declare interface GobblePromise {}

declare interface GobbleError {
  file?: string;
  line?: number;
  column?: number;
  message?: string;
}

declare interface GobbleErrorCallback {
  (error?: GobbleError) : void;
}

declare interface GobbleTransformer {
  (inputdir: string, outputdir: string, options: any, callback?: GobbleErrorCallback) : void | GobblePromise
}

declare interface GobbleSimpleTransformer {
  (input: string, options: any): { code: string; map: string}
  defaults?: {
    accept?: string[];
    ext?: string;
  }
}

declare interface GobbleObserver {
  (inputDir: string, options: any, callback?: GobbleErrorCallback): void | GobblePromise
}

declare module "gobble" {
    export = Gobble;
}