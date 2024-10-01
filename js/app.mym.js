var APP = {
	cargador: '<span class="cargador"><span class="progreso"></span></span>',
	mostrarCargador: function(e){
		var el = $(e.target);
		if(!el.hasClass('sin-cargador')){
			el.addClass('oculto');
			el.after(APP.cargador);
		}
	},
	eliminarFila: function(id,t){
		datos = 'id='+id+'&t='+t;		
		$.ajax({
			data: datos,
			type: "POST",
			dataType: "html",
			url: 'ajax/eliminar-bd.ajax.php',
			success: function(respuesta){ 
				if(respuesta.match(/^ERROR/)){
					alert(respuesta);
				} else {				
					$('tr[data-fila="'+id+'"]').fadeOut(400,function(){
						$('tr[data-fila="'+id+'"]').remove();
					});
				}
			}
		});
	},
	anadirMoldura: function(ida){
		var m = $('#molduras-'+ida+' option:selected');
		var idm = m.val();
		$('#molduras-'+ida).val('');
		var ex = ida+'_m_'+idm;		
		if(
			(idm!='')&&
			($('#'+ex).length==0)
		){			
			datos = 'ida='+ida+'&idm='+idm;			
			$.ajax({
				data: datos,
				type: "POST",
				dataType: "html",
				url: 'ajax/pedido-moldura.ajax.php',
				success: function(respuesta){ 
					if(respuesta.match(/^ERROR/)){
						alert(respuesta);
					} else {				
						$('#buscador-molduras-'+ida).val('');
						$('#lista-molduras-'+ida).append(respuesta);
						APP.tempoPrev(ida);
					}
				}
			});
		}
	},
	anadirPaspartu: function(ida){
		var p = $('#paspartus-'+ida+' option:selected');
		var idp = p.val();
		$('#paspartus-'+ida).val('');
		var ex = ida+'_p_'+idp;		
		if(
			(idp!='')&&
			($('#'+ex).length==0)
		){			
			datos = 'ida='+ida+'&idp='+idp;				
			$.ajax({
				data: datos,
				type: "POST",
				dataType: "html",
				url: 'ajax/pedido-paspartu.ajax.php',
				success: function(respuesta){ 
					if(respuesta.match(/^ERROR/)){
						alert(respuesta);
					} else {				
						$('#buscador-paspartus-'+ida).val('');
						$('#lista-paspartus-'+ida).append(respuesta);
						APP.escuchasArticulo($('#lista-paspartus-'+ida+' .paspartu').last().attr('id'),true);
						APP.tempoPrev(ida);
					}
				}
			});
		}
	},
	eliminarOpcion: function(id){
		var ida = $('#'+id).closest('.articulo').attr('data-id');
		$('#'+id).remove();		
		APP.tempoPrev(ida);
	},
	anadirArticulo: function(){
		$.ajax({
			type: "POST",
			dataType: "html",
			url: 'ajax/pedido-articulo.ajax.php',
			success: function(respuesta){ 
				if(respuesta.match(/^ERROR/)){
					alert(respuesta);
				} else {				
					$('#b-anadir-articulo').before(respuesta);
					APP.listarArticulos();
					APP.escuchasArticulo($('.articulo').last().attr('data-id'));
				}
			}
		});
	},
	eliminarArticulo: function(id){
		$('.articulo[data-id="'+id+'"]').remove();
		APP.listarArticulos();
		$.ajax({
			data: 'id='+id,
			type: "POST",
			dataType: "html",
			url: 'ajax/pedido-eliminar-articulo.ajax.php'
		});
	},
	listarArticulos: function(){
		var arts = [];
		$('.articulo').each(function(){
			arts.push($(this).attr('data-id'));
		});
		$('#_ARTICULOS').val(arts.join(','));
	},
	escuchasArticulo: function(id,p = false){
		var ob = '.articulo[data-id="'+id+'"]';
		if(p){
			ob = '#'+id;
			id = $(ob).closest('.articulo').attr('data-id');
		} else {
			$(ob+' input[type="radio"]').change(APP.tempoPrev.bind(null,id));
			$(ob+' .c-lista-articulos input').on('change',APP.activarPaspartu.bind(null,id));
			$(ob+' input[id|="cristal"],'+ob+' input[id|="trasera"]').on('change',APP.activarMargenes.bind(null,id));
			$(ob+' .buscador').on('input',APP.buscador);
		}
		$(ob+' .caja-medida input').on('input',APP.tempoPrev.bind(null,id));
		$(ob+' select[id|="bastidor"]').on('change',APP.tempoPrev.bind(null,id));
	},
	activarPaspartu: function(id){
		var a = $('.articulo[data-id="'+id+'"] .c-lista-articulos input:checked').val();
		if(a=='M'){
			$('#p-paspartus-'+id+',#p-imagen-'+id).removeClass('deshabilitado');
			$('#p-paspartus-'+id+' .s-acumulable select').prop('disabled',false);	
			$('.articulo[data-id="'+id+'"] .lb-obs span,#no-bastidor-'+id+',#c-montaje-'+id).removeClass('oculto');
			$('#bastidor-'+id).addClass('oculto');	
		} else if(a=='B'){
			$('#no-bastidor-'+id+',#c-montaje-'+id).addClass('oculto');	
			$('#bastidor-'+id).removeClass('oculto');	
		} else {
			$('#p-paspartus-'+id+',#p-imagen-'+id).addClass('deshabilitado');
			$('#p-paspartus-'+id+' .s-acumulable select').prop('disabled',true);
			$('#lista-paspartus-'+id).html('');				
			$('.articulo[data-id="'+id+'"] .lb-obs span').addClass('oculto');
			$('#no-bastidor-'+id+',#c-montaje-'+id).removeClass('oculto');
			$('#bastidor-'+id).addClass('oculto');	
		}		
	},
	activarMargenes: function(id){
		var c = $('.articulo[data-id="'+id+'"] input[id|="cristal"]:checked').val();
		var t = $('.articulo[data-id="'+id+'"] input[id|="trasera"]:checked').val();
		var ct = $('#cristales-traseros-'+id).val().split(',');
		if(
			(c!==undefined)&&
			(c!='N')&&
			(t!==undefined)&&
			(t!='N')&&
			(ct.indexOf(t)!=-1)
		){			
			$('#medidas-margenes-'+id).removeClass('deshabilitado');
			$('#medidas-margenes-'+id+' input').prop('disabled',false);
		} else {
			$('#medidas-margenes-'+id).addClass('deshabilitado');
			$('#medidas-margenes-'+id+' input').prop('disabled',true).val('');		
		}		
	},
	buscador: function(e){
		var el = $(e.target);
		var v = el.val();
		var id = el.attr('id');
		var sid = id.replace('buscador-','');
		var x = '';
		eval('var regexp = /^'+v+'/g;');
		$('#'+sid+' option').each(function(){
			if($(this).text().match(regexp)){
				x = $(this).val();
				return false;
			}
		});
		$('#'+sid).val(x);
	},
	prev: false,
	tempoPrev: function(id){
		clearTimeout(APP.prev);
		APP.prev = setTimeout(APP.montaje.bind(null,id),1000);
	},
	montaje: function(id){
		$('#montaje-'+id).html(APP.cargador);
		$('#totales span').html('');
		datos = 'id='+id+'&'+$('.articulo[data-id="'+id+'"]').find('input[name],select[name]').serialize()+'&_ARTICULOS='+$('#_ARTICULOS').val();		
		
		console.log(datos);
		
		$.ajax({
			data: datos,
			type: "POST",
			dataType: "html",
			url: 'ajax/pedido-montaje.ajax.php',
			success: function(respuesta){ 
				$('#montaje-'+id+' .cargador').remove();
				if(respuesta){
					
					console.log(respuesta);
					
					var r = JSON.parse(respuesta);
					$('#importe-articulo-'+id).html(r['imp_f']+'€');
					$('#importe-'+id).val(r['imp']);
					$('#montaje-'+id).html(r['html']);
					APP.totales();
				}
			}
		});
	},
	totales: function(){
		var i = [];
		$('.importe-oculto').each(function(){
			i.push($(this).val());
		});
		datos = 'i='+i.join('|');		
		$.ajax({
			data: datos,
			type: "POST",
			dataType: "html",
			url: 'ajax/pedido-totales.ajax.php',
			success: function(respuesta){ 
				if(respuesta){
					var r = JSON.parse(respuesta);
					$('#imp-subtotal').html(r['sub_f']+'€');
					$('#subtotal').val(r['sub']);
					$('#imp-iva').html(r['iva_f']+'€');
					$('#iva').val(r['iva']);
					$('#imp-total').html(r['tot_f']+'€');
					$('#total').val(r['tot']);					
					APP.totales();
				}
			}
		});
	},
	modal: function(tit,t,txt,a = false){
		$('#modal .panel-titulo b').html(tit);
		if(a){
			$('#modal .panel-contenido').html(APP.cargador);
		} else {
			$('#modal .panel-contenido').html('<div class="mensaje '+t+'">'+txt+'</div>');
		}
		$('#modal').removeClass('oculto');
	},
	cerrarModal: function(){
		$('#modal .panel-titulo b,#modal .panel-contenido').html('');
		$('#modal').addClass('oculto');
	},
	actualizarCoste: function(id){
		var p = $('input.pvp[data-id="'+id+'"]').val();
		var c = $('input.coste[data-id="'+id+'"]').val();
		
		console.log(p);
		console.log(c);
		
		if(
			(p=='')||
			(c=='')			
		){
			APP.modal('ERROR','error','Debe indicar ambas cifras.');
		} else {
			datos = 'id='+id+'&p='+p+'&c='+c;												
			$.ajax({
				data: datos,
				type: "POST",
				dataType: "html",
				url: 'ajax/actualizar-coste.ajax.php',
				success: function(respuesta){ 
					var r = JSON.parse(respuesta);
					if(r.error){
						APP.modal('ERROR','error',r.txt);
					} else {
						var ref = $('tr[data-fila="'+id+'"] .td-ref').text();
						var desc = $('tr[data-fila="'+id+'"] .td-desc').text();
						APP.modal('Actualización de precio','exito','El precio de '+ref+' ('+desc+') se ha actualizado con éxito.');
					}
				}
			});	
		}
	},
	procesarArticulos: function(d){
		var restantes = $('.articulo[data-procesado="0"]').length;
		if(restantes==0){
			window.location = d;
		} else {
			var id = $('.articulo[data-procesado="0"]').eq(0).attr('data-id');
			var o = $('#observaciones-'+id).val();			
			var datos = new FormData();
			var a = $('input[name="articulo_'+id+'"]:checked').val();			
			var img = document.getElementById('imagen-'+id).files;
			datos.append('id',id);									
			datos.append('a',a);			
			datos.append('o',o);			
			if(img[0] !== undefined){
				datos.append('img',img[0],img[0].name);
			} 
			var xhr = new XMLHttpRequest();
			xhr.open('POST','/ajax/procesar-articulo.ajax.php', true);
			xhr.onload = function () {
				if (xhr.status === 200) {
					var r = JSON.parse(xhr.response);
					if(r.error){
						APP.modal('ERROR','error',r.txt);
					} else {
						
						//console.log(r);
						
						$('.articulo[data-id="'+id+'"]').attr('data-procesado','1');
						APP.procesarArticulos(d);
					}
				} 
			};
			xhr.send(datos);
		}
	},
	flujo: function(e){
		var b = $(e.target);
		var d = b.attr('data-dest');
		var s = b.attr('data-sent');
		var f = $('#flujo-nav').attr('data-fase');		
		if(s=='A'){
			window.location = d;
		} else {
			switch(f){
				case '1':
					if($('.articulo').length==0){
						APP.modal('ERROR','error','Debe añadir al menos un artículo.');
					} else {
						datos = '_ARTICULOS='+$('#_ARTICULOS').val();												
						$.ajax({
							data: datos,
							type: "POST",
							dataType: "html",
							url: 'ajax/pedido-comprobar.ajax.php',
							success: function(respuesta){ 
								var r = JSON.parse(respuesta);
								
								//console.log(r);
								
								if(r.error){
									APP.modal('ERROR','error',r.html);
								} else {
									APP.procesarArticulos(d);
								}
							}
						});				
					}
					break;
				case '2':
					$('em.f-err').remove();
					$('.f-err').removeClass('f-err');
					datos = $('#f-datos-cliente').serialize();						
					$.ajax({
						data: datos,
						type: "POST",
						dataType: "html",
						url: 'ajax/pedido-datos-cliente.ajax.php',
						success: function(respuesta){ 
						
							var r = JSON.parse(respuesta);
							if(r.error){
								$.each(r.errores,function(c,v){
									var i = $('input[name="'+c+'"]');
									var f = i.attr('id');
									$('label[for="'+f+'"]').addClass('f-err');
									i.after('<em class="f-err">'+v+'</em>');
								});								
								APP.modal('ERROR','error',r.txt);
							} else {
								window.location = d;
							}
						}
					});
					break;
				default:
					window.location = d;
					break;
					
			}
		}
	},
	verSolicitud: function(id){
		APP.modal('Solicitud '+id,false,false,true);					
		$.ajax({
			data: 'id='+id,
			type: "POST",
			dataType: "html",
			url: 'ajax/ver-solicitud.ajax.php',
			success: function(respuesta){ 
				$('#modal .panel-contenido').html(respuesta);
			}
		});
	},
	descargarTabla: function(t,na){		
		var dt = new Date();
		var ms = dt.getTime();
		var tb = btoa(unescape(encodeURIComponent($('#'+t).html())));		
		var f = $('<form id="'+ms+'" target=_blank" method="post" action="descargar-tabla"><input type="hidden" name="tb" value="'+tb+'"><input type="hidden" name="na" value="'+na+'"></form>');
		APP.formOculto(f);		
	},
	formOculto: function(f){
		$('body').append(f);
		f.submit();
		setTimeout(function(){
			f.remove();
		},100);
	},
	estadoSolicitud: function(e){		
		var b = $(e.target);
		var c = 'N';
		var txt = 'Pendiente';
		if(b.attr('data-comp')=='N'){
			c = 'S';
			txt = 'Completado';
		}		
		var id = b.attr('data-id');
		var datos = 'id='+id+'&c='+c;		
		$.ajax({
			data: datos,
			type: "POST",
			dataType: "html",
			url: 'ajax/estado-solicitud.ajax.php',
			success: function(respuesta){ 
				b.attr('data-comp',c).html(txt);
			}
		});
	},
	camposReferencia: function(){
		var t = $('#f-referencia #tipo').val();
		var datos = 't='+t;		
		$.ajax({
			data: datos,
			type: "POST",
			dataType: "html",
			url: 'ajax/campos-referencia.ajax.php',
			success: function(respuesta){ 			
				$('li[data-campo-ref="1"]').remove();
				$('#i-pvp').before(respuesta);
			}
		});
	},
	repetirSolicitud: function(id){
		datos = 'id='+id;		
		$.ajax({
			data: datos,
			type: "POST",
			dataType: "html",
			url: 'ajax/repetir-solicitud.ajax.php',
			success: function(respuesta){ 
				window.location.href = 'pedido-articulos';
			}
		});
	},
}

$(document).ready(function(){
	$('.boton:not(.sin-cargador)').click(APP.mostrarCargador);
	if($('.articulo').length){
		$('.articulo').each(function(){
			APP.escuchasArticulo($(this).attr('data-id'));
		});
	}
	if($('#flujo-nav').length){
		$('#flujo-nav .boton').click(APP.flujo);
	}
	if($('#f-pedido-articulos[data-previo="1"]').length){
		var id = $('.articulo').last().attr('data-id');
		APP.montaje(id);
	}
	
	if($('#t-solicitudes').length){
		$('#t-solicitudes .estado[data-ed="1"]').click(APP.estadoSolicitud);
	}
	if($('#f-referencia').length){
		$('#f-referencia #tipo').change(APP.camposReferencia);
	}



    $("#btnSiguiente").click(function() {
        // Obtener el valor del atributo data-dest
        var destino = $("#seguir").val();
        // Redirigir a la página
        window.location.href = destino + ".html"; // Asegúrate de que el archivo esté en el mismo directorio
    });
});