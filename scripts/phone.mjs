export function normalizePhone(value) {
 const digits=String(value??'').replace(/\D/g,'');
 const local=digits.length===11&&digits.startsWith('1')?digits.slice(1):digits;
 if(local.length!==10)throw new Error('Phone config must contain a 10-digit US number.');
 return {display:`(${local.slice(0,3)}) ${local.slice(3,6)}-${local.slice(6)}`,tel:`+1${local}`};
}
