# Sistema de Recuperación de Contraseña

## Descripción
Se ha implementado un sistema completo de recuperación de contraseña que permite a los usuarios recuperar el acceso a sus cuentas de forma segura mediante correo electrónico.

## Componentes Implementados

### 1. AuthService (src/app/services/auth/auth.service.ts)
Se agregaron los siguientes métodos:
- `forgotPassword(email: string)`: Envía un enlace de recuperación al correo del usuario
- `resetPassword(token: string, newPassword: string)`: Restablece la contraseña usando el token
- `validateResetToken(token: string)`: Valida que el token de recuperación sea válido

### 2. Componente Forgot Password (src/app/pages/authentication/forgot-password/)
- **Archivo TypeScript**: `forgot-password.component.ts`
- **Archivo HTML**: `forgot-password.component.html`
- **Funcionalidad**: Permite al usuario ingresar su correo electrónico para solicitar la recuperación

### 3. Componente Reset Password (src/app/pages/authentication/reset-password/)
- **Archivo TypeScript**: `reset-password.component.ts`
- **Archivo HTML**: `reset-password.component.html`
- **Funcionalidad**: Permite restablecer la contraseña usando el token enviado por correo

### 4. Actualización del Login
- Se modificó el enlace "¿Olvidaste tu contraseña?" para dirigir a `/authentication/forgot-password`

### 5. Rutas Configuradas
Se agregaron las siguientes rutas en `authentication.routes.ts`:
- `/authentication/forgot-password`: Formulario de solicitud de recuperación
- `/authentication/reset-password`: Formulario de restablecimiento de contraseña

## Flujo del Sistema

### 1. Solicitud de Recuperación
1. Usuario hace clic en "¿Olvidaste tu contraseña?" en la pantalla de login
2. Se redirige a `/authentication/forgot-password`
3. Usuario ingresa su correo electrónico
4. Se envía petición al backend con el email
5. El backend envía un correo con un enlace único al usuario

### 2. Restablecimiento de Contraseña
1. Usuario hace clic en el enlace del correo
2. Se redirige a `/authentication/reset-password?token=XXXXX`
3. El sistema valida el token automáticamente
4. Si el token es válido, se muestra el formulario de nueva contraseña
5. Usuario ingresa su nueva contraseña dos veces
6. Se envía la nueva contraseña al backend
7. Se actualiza la contraseña en la base de datos
8. Usuario es redirigido al login

## Características de Seguridad

- **Tokens únicos**: Cada solicitud genera un token único y temporal
- **Validación de token**: Se valida el token antes de permitir el restablecimiento
- **Expiración**: Los tokens tienen tiempo de vida limitado
- **Validación de contraseñas**: Se requiere confirmación de la nueva contraseña
- **Mensajes informativos**: Feedback claro al usuario en cada paso

## Endpoints del Backend Requeridos

El backend debe implementar los siguientes endpoints:

### POST /auth/forgot-password
```json
{
  "email": "usuario@ejemplo.com"
}
```

### POST /auth/validate-reset-token
```json
{
  "token": "token_generado"
}
```

### POST /auth/reset-password
```json
{
  "token": "token_generado",
  "newPassword": "nueva_contraseña"
}
```

## Interfaz de Usuario

### Pantalla de Recuperación
- Diseño consistente con el resto de la aplicación
- Icono de candado para identificación visual
- Formulario con validación de email
- Botón de envío con estado de carga
- Enlace para volver al login

### Pantalla de Restablecimiento
- Validación automática del token al cargar
- Estados de carga mientras se valida el token
- Formulario de nueva contraseña con confirmación
- Validación en tiempo real de coincidencia de contraseñas
- Mensajes de error claros

## Notificaciones
Se utiliza SweetAlert2 para mostrar:
- Confirmación de envío de correo
- Errores de validación
- Confirmación de restablecimiento exitoso
- Mensajes de token inválido o expirado

## Integración
El sistema se integra perfectamente con:
- El sistema de autenticación existente
- El guard de autenticación
- Los estilos y componentes de Material Design
- La estructura de rutas existente
