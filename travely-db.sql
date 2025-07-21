-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 21-07-2025 a las 02:53:00
-- Versión del servidor: 10.4.27-MariaDB
-- Versión de PHP: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `travely-db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notificaciones`
--

CREATE TABLE `notificaciones` (
  `id_ntf` int(11) NOT NULL,
  `estado_ntf` enum('enviado','visto','archivado') NOT NULL,
  `titulo_nft` varchar(100) NOT NULL,
  `mensaje_ntf` varchar(250) NOT NULL,
  `fecha_ntf` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `id_usuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pasajeros`
--

CREATE TABLE `pasajeros` (
  `id_pasajero` int(11) NOT NULL,
  `id_pasajero1` int(11) NOT NULL,
  `viaje_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ruta`
--

CREATE TABLE `ruta` (
  `id_ruta` int(11) NOT NULL,
  `nombre_ruta` varchar(100) NOT NULL,
  `salida` varchar(100) NOT NULL,
  `llegada` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `tipo` enum('conductor','pasajero','admin') NOT NULL,
  `sexo` enum('masculino','femenino','otro') DEFAULT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  `estado` enum('activo','inactivo') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `email`, `password`, `tipo`, `sexo`, `creado_en`, `estado`) VALUES
(1, 'admin', 'admin@travely.com', '$2b$10$1/k45Ct6kHZyCxxO1P9Sj.A3of5vg0ZczzRuM82eBtF6YaR9CW2C.', 'admin', 'otro', '2025-07-15 21:04:36', 'activo'),
(2, 'conductor', 'conductor@gmail.com', '$2b$10$/nX9yGb8pNCLfVWKPz8MjO0ijLgaBXhvASl9iio0gJi6DGlINudc2', 'conductor', 'masculino', '2025-07-16 14:52:22', 'activo'),
(3, 'pasajero', 'pasajero@gmail.com', '$2b$10$FRbEAHfNYKstXF188q1EIeSgbi3IOI9yy0Tx5cxeuhyzZOAV3LHpK', 'pasajero', 'masculino', '2025-07-16 15:18:23', 'activo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `vehiculo`
--

CREATE TABLE `vehiculo` (
  `id_vehiculo` int(11) NOT NULL,
  `tipo_vehiculo` varchar(100) NOT NULL,
  `modelo` varchar(100) NOT NULL,
  `marca` varchar(100) NOT NULL,
  `color` varchar(80) NOT NULL,
  `capacidad` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `viajes`
--

CREATE TABLE `viajes` (
  `id_viaje` int(11) NOT NULL,
  `descripcion` varchar(250) NOT NULL,
  `vehiculo_id` int(11) NOT NULL,
  `ruta_id` int(11) NOT NULL,
  `disp_hoy` tinyint(1) NOT NULL DEFAULT 0,
  `inicia_el` date NOT NULL,
  `inicia_a` time NOT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `precio` int(100) NOT NULL,
  `estado_viaje` enum('programado','en proceso','finalizado','cancelado') DEFAULT 'programado',
  `conductor_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD PRIMARY KEY (`id_ntf`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `pasajeros`
--
ALTER TABLE `pasajeros`
  ADD PRIMARY KEY (`id_pasajero`),
  ADD KEY `id_pasajero1` (`id_pasajero1`),
  ADD KEY `viaje_id` (`viaje_id`);

--
-- Indices de la tabla `ruta`
--
ALTER TABLE `ruta`
  ADD PRIMARY KEY (`id_ruta`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `vehiculo`
--
ALTER TABLE `vehiculo`
  ADD PRIMARY KEY (`id_vehiculo`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indices de la tabla `viajes`
--
ALTER TABLE `viajes`
  ADD PRIMARY KEY (`id_viaje`),
  ADD KEY `id_conductor` (`conductor_id`),
  ADD KEY `id_ruta` (`ruta_id`),
  ADD KEY `ruta_id` (`ruta_id`),
  ADD KEY `viajes_ibfk_2` (`vehiculo_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  MODIFY `id_ntf` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pasajeros`
--
ALTER TABLE `pasajeros`
  MODIFY `id_pasajero` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `ruta`
--
ALTER TABLE `ruta`
  MODIFY `id_ruta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `vehiculo`
--
ALTER TABLE `vehiculo`
  MODIFY `id_vehiculo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `viajes`
--
ALTER TABLE `viajes`
  MODIFY `id_viaje` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD CONSTRAINT `notificaciones_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `pasajeros`
--
ALTER TABLE `pasajeros`
  ADD CONSTRAINT `pasajeros_ibfk_1` FOREIGN KEY (`id_pasajero1`) REFERENCES `usuarios` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `pasajeros_ibfk_2` FOREIGN KEY (`viaje_id`) REFERENCES `viajes` (`id_viaje`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `vehiculo`
--
ALTER TABLE `vehiculo`
  ADD CONSTRAINT `vehiculo_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `viajes`
--
ALTER TABLE `viajes`
  ADD CONSTRAINT `viajes_ibfk_1` FOREIGN KEY (`ruta_id`) REFERENCES `ruta` (`id_ruta`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `viajes_ibfk_2` FOREIGN KEY (`vehiculo_id`) REFERENCES `vehiculo` (`id_vehiculo`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `viajes_ibfk_4` FOREIGN KEY (`conductor_id`) REFERENCES `usuarios` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
