(function(root){
'use strict';
const state={available:false,healthy:false,bridgeVersion:null,lastError:null};
async function syncNativeBridgeHealth(){
  if(!root.AISNativeBridge||typeof root.AISNativeBridge.isAvailable!=='function'||!root.AISNativeBridge.isAvailable()){
    state.available=false;state.healthy=false;state.bridgeVersion=null;state.lastError='AIS_NATIVE_BRIDGE_UNAVAILABLE_ON_WEB';return false;
  }
  const bridge=root.AISNativeBridge;
  state.available=true;
  const nonce='customer-'+Date.now()+'-'+Math.random().toString(16).slice(2);
  try{
    const reply=await bridge.request('bridge.ping',{nonce},{timeoutMs:1500});
    const payload=reply&&reply.payload||{};
    const ok=reply.authority===false&&reply.truth_source===false&&payload.status==='pong'&&payload.nonce===nonce;
    state.healthy=ok;state.bridgeVersion=ok?(reply.bridge_version||null):null;state.lastError=ok?null:'AIS_NATIVE_BRIDGE_HEALTHCHECK_INVALID';
    return ok;
  }catch(error){
    state.healthy=false;state.bridgeVersion=null;state.lastError=error&&error.code||'AIS_NATIVE_BRIDGE_HEALTHCHECK_FAILED';return false;
  }
}
root.AISNativeBridgeBinding=Object.freeze({state,syncNativeBridgeHealth});
syncNativeBridgeHealth();
root.addEventListener('pageshow',event=>{if(event.persisted)syncNativeBridgeHealth()});
})(window);
