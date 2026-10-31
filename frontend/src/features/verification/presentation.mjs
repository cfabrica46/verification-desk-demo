const DEFAULT = 'No pudimos completar la consulta. Inténtalo nuevamente.';

export function presentVerification(response) {
  if (!response || typeof response.status !== 'string') {
    return {type:'error', title:'Respuesta inesperada', message:DEFAULT, retryable:true};
  }
  switch(response.status) {
    case 'success': {
      const code = response.code;
      if (typeof code !== 'string' || !/^\d{6}$/.test(code)) {
        return {type:'error', title:'Código inválido', message:DEFAULT, retryable:false};
      }
      const ref = response.reference;
      const label = typeof ref === 'string' && /^DEMO-\d{4}$/.test(ref)
        ? `Referencia: ${ref}. Código de prueba; no autentica operaciones reales.`
        : 'Código ficticio encontrado.';
      return {type:'success', title:'Código encontrado', message:label, code, retryable:false};
    }
    case 'not_found':
      return {type:'empty', title:'Sin resultados', message:'La referencia de prueba no existe.', retryable:false};
    case 'invalid_input':
      return {type:'error', title:'Revisa la referencia', message:'Usa DEMO-1001 o una URL ficticia que contenga esa referencia.', retryable:false};
    case 'unavailable':
      return {type:'error', title:'Almacén no disponible', message:'No fue posible consultar los datos de prueba. Vuelve a intentar.', retryable:true};
    default:
      return {type:'error', title:'Ocurrió un problema', message:DEFAULT, retryable:false};
  }
}
