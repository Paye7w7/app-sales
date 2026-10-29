# Sistema de Ventas – Angular

**Desarrollador:** Manuel Paye  
**Rama:** `manuel.paye`

## Descripción

Aplicación frontend desarrollada en Angular que permite gestionar visualmente el registro de ventas, consultar productos disponibles y aplicar descuentos, mediante la integración con una API REST desarrollada en Laravel.

## Funcionalidades desarrolladas

- Implementación de la interfaz para visualizar productos.
- Integración con la API REST de Laravel.
- Registro de ventas con múltiples productos.
- Selección de cantidades y descuentos por producto.
- Cálculo de subtotales, descuentos y total de la venta.
- Visualización del historial de ventas.
- Actualización de la información de productos y ventas.
- Mejoras en la navegación, componentes y estilos de la aplicación.
- Creación de servicios Angular para consumir los endpoints de productos y ventas.

## Instalación y ejecución

**1. Clonar el repositorio**

```bash
git clone -b manuel.paye https://github.com/Paye7w7/app-sales.git
cd app-sales
```

**2. Instalar dependencias**

```bash
npm install
```

**3. Iniciar el backend Laravel**

Antes de ejecutar Angular, iniciar la API Laravel siguiendo las instrucciones del repositorio backend.

Por defecto, Laravel se ejecuta en:

`http://127.0.0.1:8000`

**4. Iniciar Angular**

```bash
npm start
```

Si el proyecto utiliza la configuración de proxy incluida en `proxy.conf.json`, verificar que el comando de inicio la aplique. En caso contrario, se puede iniciar con:

```bash
npx ng serve --proxy-config proxy.conf.json
```

**5. Abrir la aplicación**

Por defecto, Angular estará disponible en:

`http://localhost:4200`

## Comunicación con la API

El frontend utiliza servicios Angular para consumir la API Laravel.

Los servicios permiten:

- Obtener productos disponibles.
- Registrar ventas.
- Consultar el historial de ventas.
- Enviar descuentos y cantidades seleccionadas.
- Mostrar los resultados de las operaciones.

Para el funcionamiento completo del sistema, es necesario mantener el backend Laravel en ejecución.

## Repositorio Backend

https://github.com/Paye7w7/api-sales/tree/manuel.paye