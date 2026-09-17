(function(root){
'use strict';
const MAX_INPUT_BYTES=8388608;
const MAX_OUTPUT_UTF8_BYTES=1048576;
const OPERATION='document.extractText';
const ALLOWED_MEDIA=new Set(['text/plain','application/pdf']);
const SHA256_RE=/^[0-9a-f]{64}$/;
const bindingState={installed:false,active:0,ready:0,failed:0,lastError:null};
function makeError(code,message){const e=new Error(message);e.code=code;return e}
function mediaTypeFor(file){const type=String(file&&file.type||'').toLowerCase().split(';',1)[0].trim();const name=String(file&&file.name||'').toLowerCase();if(type==='application/pdf'||name.endsWith('.pdf'))return'application/pdf';if(type==='text/plain'||/\.(txt|md|log|csv|tsv|json|xml|yaml|yml)$/i.test(name))return'text/plain';return null}
function eligibility(file){if(!file||typeof file.arrayBuffer!=='function')return{ok:false,reason:'invalid-file'};if(Number(file.size)>MAX_INPUT_BYTES)return{ok:false,reason:'too-large'};const mediaType=mediaTypeFor(file);if(!mediaType||!ALLOWED_MEDIA.has(mediaType))return{ok:false,reason:'unsupported'};return{ok:true,mediaType}}
async function ensureBridgeHealthy(){const binding=root.AISNativeBridgeBinding;if(!binding||typeof binding.syncNativeBridgeHealth!=='function')throw makeError('AIS_INGEST_BRIDGE_BINDING_MISSING','Binding del ponte nativo non disponibile.');if(binding.state?.healthy===true)return true;const ok=await binding.syncNativeBridgeHealth();if(!ok)throw makeError('AIS_INGEST_BRIDGE_UNHEALTHY','Ponte nativo non disponibile per la lettura locale.');return true}
async function extractFile(file,expectedSHA256,options={}){const signal=options.signal;const eligible=eligibility(file);if(!eligible.ok)throw makeError(eligible.reason==='too-large'?'AIS_INGEST_CLIENT_INPUT_TOO_LARGE':'AIS_INGEST_CLIENT_UNSUPPORTED','File non idoneo alla lettura locale.');if(!SHA256_RE.test(String(expectedSHA256||'')))throw makeError('AIS_INGEST_CLIENT_SHA256_INVALID','SHA-256 sorgente non valido.');if(signal?.aborted)throw makeError('AIS_INGEST_CLIENT_ABORTED','Lettura locale annullata.');await ensureBridgeHealthy();throw makeError('AIS_INGEST_WEB_NO_NATIVE_EXTRACTION','La release web non espone il parser nativo.');}
function installAppBinding(){if(bindingState.installed)return true;if(typeof document==='undefined'||typeof state==='undefined')return false;if(typeof renderSources!=='function'||typeof updateRow!=='function'||typeof addMsg!=='function')return false;bindingState.installed=true;return true}
root.AISDocumentIngestBinding=Object.freeze({MAX_INPUT_BYTES,MAX_OUTPUT_UTF8_BYTES,operation:OPERATION,state:bindingState,eligibility,extractFile,installAppBinding});
installAppBinding();
})(window);
