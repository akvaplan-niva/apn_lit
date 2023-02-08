// serveDir(request, {
//   fsRoot: import.meta.resolve("./").replace("file:/", ""),
// });

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { serveDir } from "https://deno.land/std@0.177.0/http/file_server.ts";

const opts = { fsRoot: ".", enableCors: true, showDirListing: true };

const handler = (request: Request) => serveDir(request, opts);
serve(handler, { port: 7777 });
