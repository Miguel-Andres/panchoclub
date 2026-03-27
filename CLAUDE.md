# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Descripción del Proyecto

**Pancho Club** - Aplicación web Next.js 14 para un menú de pedidos de panchos con diseño en modo oscuro. Construida con TypeScript, Tailwind CSS y la librería de componentes NextUI.

## Comandos

```bash
npm run dev      # Iniciar servidor de desarrollo en http://localhost:3000
npm run build    # Compilar para producción
npm start        # Ejecutar servidor de producción
npm run lint     # Ejecutar ESLint
```

## Arquitectura

### Stack Tecnológico
- **Framework:** Next.js 14 con App Router
- **Lenguaje:** TypeScript 5 (modo estricto)
- **UI:** Librería de componentes NextUI + Tailwind CSS
- **Estilos:** Modo oscuro por defecto (estrategia de clase)

### Alias de Rutas
`@/*` mapea a `./src/*` - usar esto para imports.

### Archivos Clave
- `src/app/layout.tsx` - Layout raíz con NextUIProvider y modo oscuro
- `src/app/providers.tsx` - Configuración de NextUIProvider del lado del cliente
- `src/app/page.tsx` - Página principal
- `src/app/components/` - Componentes React (Card, Header)
- `src/app/data/data.json` - Datos del menú con items y precios

### Configuración
- **next.config.js:** Optimización de imágenes deshabilitada (`unoptimized: true`)
- **tailwind.config.ts:** Plugin NextUI integrado, utilidades de gradiente personalizadas
- **tsconfig.json:** Target ES5, módulos ESNext, modo estricto

## Notas del Estado Actual

1. **Componente Card:** Se exporta como `Example` pero conceptualmente es Card - inconsistencia de nombres
2. **Integración de Datos:** `data.json` existe pero el componente Card usa valores hardcodeados
3. **Rutas de Imágenes:** Card usa ruta relativa `"../public/hotdogs.png"` - debería usar `/hotdogs.png`
4. **Dependencias Sin Usar:** `framer-motion` y `matrix-rain` están instaladas pero no se usan
5. **Componente Header:** Implementación placeholder, necesita trabajo
