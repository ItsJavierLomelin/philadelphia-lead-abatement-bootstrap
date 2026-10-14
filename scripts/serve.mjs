import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,extname,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const types={'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.jpg':'image/jpeg','.json':'application/json'};
http.createServer(async(req,res)=>{try{let path=resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(!path.startsWith(root+'/')&&path!==root)throw 0;if((await stat(path)).isDirectory())path+='/index.html';const body=await readFile(path);res.setHeader('Content-Type',types[extname(path)]||'application/octet-stream');res.end(body)}catch{res.statusCode=404;res.end('Not found')}}).listen(Number(process.env.PORT||8080),'127.0.0.1',()=>console.log('http://localhost:'+(process.env.PORT||8080)));
