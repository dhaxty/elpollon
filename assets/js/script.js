/**
 * EL POLLÓN - SCRIPT PRINCIPAL (Vanilla JavaScript)
 * Funcionalidad:
 * 1. Control del menú hamburguesa y navegación móvil (drawer + backdrop).
 * 2. Botón flotante 'Volver arriba' con detección de scroll.
 * 3. Actualización dinámica del año en el copyright del footer.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // =========================================================================
  // 1. CONTROL DEL MENÚ HAMBURGUESA Y DRAWER MÓVIL
  // =========================================================================
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navDrawer = document.getElementById('nav-drawer');
  const navBackdrop = document.getElementById('nav-backdrop');
  const navLinks = document.querySelectorAll('.nav-link');

  /**
   * Abre o cierra el menú móvil alternando las clases activas.
   */
  const toggleMenu = () => {
    const isExpanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
    const newState = !isExpanded;

    hamburgerBtn.classList.toggle('is-active', newState);
    navDrawer.classList.toggle('is-open', newState);
    navBackdrop.classList.toggle('is-active', newState);
    hamburgerBtn.setAttribute('aria-expanded', String(newState));

    // Previene el scroll del fondo en dispositivos móviles cuando el menú está abierto
    document.body.style.overflow = newState ? 'hidden' : '';
  };

  /**
   * Cierra el menú móvil de forma explícita.
   */
  const closeMenu = () => {
    hamburgerBtn.classList.remove('is-active');
    navDrawer.classList.remove('is-open');
    navBackdrop.classList.remove('is-active');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  // Evento click en el botón hamburguesa
  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', toggleMenu);
  }

  // Cierra al hacer click en el fondo oscuro (backdrop)
  if (navBackdrop) {
    navBackdrop.addEventListener('click', closeMenu);
  }

  // Cierra al hacer click en cualquiera de los enlaces de navegación
  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Cierra al pulsar la tecla Escape (accesibilidad)
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navDrawer.classList.contains('is-open')) {
      closeMenu();
    }
  });

  // =========================================================================
  // 2. BOTÓN FLOTANTE "VOLVER ARRIBA"
  // =========================================================================
  const backToTopBtn = document.getElementById('back-to-top');

  /**
   * Muestra u oculta el botón flotante según la posición de scroll vertical.
   */
  const handleScroll = () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('is-visible');
    } else {
      backToTopBtn.classList.remove('is-visible');
    }
  };

  // Escuchar el evento scroll de la ventana
  window.addEventListener('scroll', handleScroll, { passive: true });

  // Desplazamiento suave al inicio al pulsar el botón
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // =========================================================================
  // 4. COTIZADOR INTERACTIVO "ARMA TU PEDIDO" (PRÁCTICAS DE JAVASCRIPT)
  // =========================================================================

  // MÓDULO 3: Arreglo de Objetos base (Catálogo de la pollería)
  const catalogoPlatos = [
    { id: 1, nombre: "1 Pollo a la Brasa Entero", precio: 68.00 },
    { id: 2, nombre: "1/2 Pollo a la Brasa", precio: 36.00 },
    { id: 3, nombre: "1/4 Pollo a la Brasa", precio: 20.00 },
    { id: 4, nombre: "Mostrito Pollón", precio: 24.00 },
    { id: 5, nombre: "Pollo Broaster Crujiente", precio: 22.00 },
    { id: 6, nombre: "Parrilla Mixta El Pollón", precio: 52.00 },
    { id: 7, nombre: "Papas Fritas Extra", precio: 12.00 },
    { id: 8, nombre: "Chicha Morada Artesanal (1L)", precio: 14.00 },
    { id: 9, nombre: "Gaseosa 1.5L", precio: 10.00 }
  ];

  // MÓDULO 3: Arreglo dinámico que almacena los platos del pedido ([] de {})
  const carritoPedido = [];

  // Elementos del DOM capturados
  const btnAgregarPlato = document.getElementById("btn-agregar-plato");
  const btnEnviarWhatsApp = document.getElementById("btn-enviar-whatsapp");
  const tablaBody = document.getElementById("tabla-pedido-body");
  const feedbackMsg = document.getElementById("mensaje-feedback");

  // MÓDULO 1: Manipulación de Cadenas y Fundamentos del DOM
  // Función para mostrar mensajes de feedback dinámicos con template literals e innerHTML
  const mostrarFeedback = (mensaje, tipo) => {
    if (!feedbackMsg) return;
    feedbackMsg.className = `mensaje-feedback ${tipo}`;
    feedbackMsg.innerHTML = mensaje;
  };

  // MÓDULO 2: Operadores, Funciones y Estructuras Condicionales
  // Función modular para calcular subtotal de un ítem
  function calcularSubtotalItem(precioUnitario, cantidad) {
    return precioUnitario * cantidad;
  }

  // MÓDULO 2: Estructuras condicionales if / else if / else para rangos de descuento
  function calcularDescuento(subtotal, cupon) {
    let porcentaje = 0;

    if (cupon === "POLLON15") {
      porcentaje = 0.15; // 15% por cupón especial
    } else if (cupon === "POLLON10" || subtotal >= 150) {
      porcentaje = 0.10; // 10% por cupón o por compra mayor o igual a S/ 150
    } else if (subtotal >= 80) {
      porcentaje = 0.05; // 5% por compra mayor o igual a S/ 80
    } else {
      porcentaje = 0;    // Sin descuento
    }

    return subtotal * porcentaje;
  }

  // MÓDULO 4: Funciones de flecha (Arrow functions) para cálculos y formateo
  const formatearSoles = monto => `S/ ${monto.toFixed(2)}`;

  // MÓDULO 4: Búsqueda de extremos (plato de mayor valor) y acumuladores
  const calcularEstadisticas = () => {
    let totalUnidades = 0;
    let platoMayorValor = null;

    // Recorrido con forEach y acumulador
    carritoPedido.forEach(item => {
      totalUnidades += item.cantidad; // Acumulador de cantidad

      // Búsqueda de extremo máximo
      if (!platoMayorValor || item.subtotal > platoMayorValor.subtotal) {
        platoMayorValor = item;
      }
    });

    return { totalUnidades, platoMayorValor };
  };

  // MÓDULO 3: Manipulación del DOM y renderizado de la tabla dinámica
  function actualizarTablaYTotales() {
    if (!tablaBody) return;

    // Limpiar tabla antes de redibujar
    tablaBody.innerHTML = "";

    if (carritoPedido.length === 0) {
      tablaBody.innerHTML = `<tr><td colspan="6" class="text-center empty-msg">Aún no has agregado platos a tu pedido.</td></tr>`;
      document.getElementById("resumen-subtotal").textContent = "S/ 0.00";
      document.getElementById("resumen-descuento").textContent = "- S/ 0.00";
      document.getElementById("resumen-total").textContent = "S/ 0.00";
      document.getElementById("stat-total-items").textContent = "0";
      document.getElementById("stat-plato-caro").textContent = "Ninguno";
      return;
    }

    let subtotalGeneral = 0;

    // MÓDULO 3: Iteración y recorrido con forEach()
    carritoPedido.forEach((item, index) => {
      subtotalGeneral += item.subtotal;

      // Inyección dinámica de filas en <tbody> usando Template Literals
      tablaBody.innerHTML += `
        <tr>
          <td>${index + 1}</td>
          <td><strong>${item.nombre}</strong></td>
          <td>${item.cantidad}</td>
          <td>${formatearSoles(item.precio)}</td>
          <td><strong>${formatearSoles(item.subtotal)}</strong></td>
          <td>
            <button type="button" class="btn-delete-row" onclick="eliminarPlatoDelPedido(${index})">
              Quitar
            </button>
          </td>
        </tr>
      `;
    });

    // MÓDULO 1: Captura, trim() y toUpperCase() para el cupón
    const cuponRaw = document.getElementById("cliente-cupon").value;
    const cuponLimpio = cuponRaw.trim().toUpperCase();

    // MÓDULO 2: Cálculo de descuento y total
    const descuento = calcularDescuento(subtotalGeneral, cuponLimpio);
    const totalFinal = subtotalGeneral - descuento;

    // Actualizar resumen en el DOM
    document.getElementById("resumen-subtotal").textContent = formatearSoles(subtotalGeneral);
    document.getElementById("resumen-descuento").textContent = `- ${formatearSoles(descuento)}`;
    document.getElementById("resumen-total").textContent = formatearSoles(totalFinal);

    // MÓDULO 4: Métricas y extremos en el DOM
    const stats = calcularEstadisticas();
    document.getElementById("stat-total-items").textContent = stats.totalUnidades;
    document.getElementById("stat-plato-caro").textContent = stats.platoMayorValor 
      ? `${stats.platoMayorValor.nombre} (${formatearSoles(stats.platoMayorValor.subtotal)})`
      : "Ninguno";
  }

  // Función global para quitar un plato por índice (MÓDULO 3)
  window.eliminarPlatoDelPedido = (indice) => {
    carritoPedido.splice(indice, 1);
    actualizarTablaYTotales();
    mostrarFeedback("Plato retirado del pedido.", "success");
  };

  // Evento al hacer click en "Agregar Plato"
  if (btnAgregarPlato) {
    btnAgregarPlato.addEventListener("click", () => {
      const selectPlato = document.getElementById("select-plato");
      const inputCantidad = document.getElementById("input-cantidad");

      // MÓDULO 2: Conversión numérica con parseFloat y control con isNaN()
      const platoId = parseInt(selectPlato.value);
      const cantidad = parseFloat(inputCantidad.value);

      // MÓDULO 2: Validaciones obligatorias de cantidad
      if (isNaN(cantidad) || cantidad <= 0) {
        mostrarFeedback("⚠️ Por favor ingresa una cantidad válida mayor a cero.", "error");
        return;
      }

      // Buscar plato en el catálogo
      const platoSeleccionado = catalogoPlatos.find(p => p.id === platoId);
      if (!platoSeleccionado) return;

      const subtotalItem = calcularSubtotalItem(platoSeleccionado.precio, cantidad);

      // MÓDULO 3: Estructura de datos y adición con push()
      const nuevoItem = {
        id: platoSeleccionado.id,
        nombre: platoSeleccionado.nombre,
        precio: platoSeleccionado.precio,
        cantidad: cantidad,
        subtotal: subtotalItem
      };

      carritoPedido.push(nuevoItem);

      // MÓDULO 1: Actualizar estado del cliente usando length e includes()
      const nombreRaw = document.getElementById("cliente-nombre").value;
      const nombreLimpio = nombreRaw.trim();
      const statCliente = document.getElementById("stat-cliente-info");
      if (statCliente) {
        if (nombreLimpio.length > 0) {
          statCliente.textContent = nombreLimpio.toUpperCase();
        } else {
          statCliente.textContent = "Sin nombre registrado";
        }
      }

      // Resetear campo cantidad y refrescar tabla
      inputCantidad.value = "1";
      mostrarFeedback(`✅ Se agregó "${platoSeleccionado.nombre}" al pedido.`, "success");
      actualizarTablaYTotales();
    });
  }

  // Evento al hacer click en "Enviar Pedido por WhatsApp" (MÓDULO 1, 2 y 4)
  if (btnEnviarWhatsApp) {
    btnEnviarWhatsApp.addEventListener("click", () => {
      // MÓDULO 1: Captura de formulario y métodos de String
      const inputNombre = document.getElementById("cliente-nombre");
      const inputTelefono = document.getElementById("cliente-telefono");
      const inputCupon = document.getElementById("cliente-cupon");

      const nombre = inputNombre.value.trim();
      const telefono = inputTelefono.value.trim();
      const cupon = inputCupon.value.trim().toUpperCase();

      // MÓDULO 1 & 2: Validaciones con length y control condicional
      if (nombre.length === 0) {
        mostrarFeedback("⚠️ Por favor ingresa el nombre del cliente para continuar.", "error");
        inputNombre.focus();
        return;
      }

      if (telefono.length < 9) {
        mostrarFeedback("⚠️ El número de teléfono debe tener al menos 9 dígitos.", "error");
        inputTelefono.focus();
        return;
      }

      // MÓDULO 1: Uso de includes() para validar si el teléfono contiene espacios o no es numérico
      if (telefono.includes(" ") || isNaN(Number(telefono))) {
        mostrarFeedback("⚠️ El teléfono solo debe contener números sin espacios.", "error");
        inputTelefono.focus();
        return;
      }

      if (carritoPedido.length === 0) {
        mostrarFeedback("⚠️ Agrega al menos un plato a tu pedido antes de enviarlo.", "error");
        return;
      }

      // MÓDULO 4: Resumen y métricas consolidadas
      const stats = calcularEstadisticas();
      let subtotalTotal = 0;
      carritoPedido.forEach(i => subtotalTotal += i.subtotal);
      const descuento = calcularDescuento(subtotalTotal, cupon);
      const totalPagar = subtotalTotal - descuento;

      // MÓDULO 1: Construcción de mensaje con Template Literals
      let mensaje = `🍗 *PEDIDO WEB - EL POLLÓN* 🍗\n`;
      mensaje += `*Cliente:* ${nombre.toUpperCase()}\n`;
      mensaje += `*Teléfono:* ${telefono}\n`;
      if (cupon.length > 0) {
        mensaje += `*Cupón:* ${cupon}\n`;
      }
      mensaje += `\n*Detalle del pedido (${stats.totalUnidades} unidades):*\n`;

      carritoPedido.forEach(item => {
        mensaje += `- ${item.cantidad}x ${item.nombre} = S/ ${item.subtotal.toFixed(2)}\n`;
      });

      if (stats.platoMayorValor) {
        mensaje += `\n*Plato estrella del pedido:* ${stats.platoMayorValor.nombre}\n`;
      }

      mensaje += `\n*Subtotal:* S/ ${subtotalTotal.toFixed(2)}\n`;
      if (descuento > 0) {
        mensaje += `*Descuento:* - S/ ${descuento.toFixed(2)}\n`;
      }
      mensaje += `*TOTAL A PAGAR:* S/ ${totalPagar.toFixed(2)}\n\n`;
      mensaje += `¡Muchas gracias por su preferencia!`;

      // Enviar a WhatsApp
      const url = `https://wa.me/51999999999?text=${encodeURIComponent(mensaje)}`;
      window.open(url, "_blank");
    });
  }

  // =========================================================================
  // 5. AÑO DINÁMICO EN EL COPYRIGHT DEL FOOTER
  // =========================================================================
  const currentYearSpan = document.getElementById('current-year');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }
});
