-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 28-03-2026 a las 03:33:36
-- Versión del servidor: 8.4.6-6
-- Versión de PHP: 8.2.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `dbeaag3s1tjjr4`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `acta`
--

CREATE TABLE `acta` (
  `id_Acta` int NOT NULL,
  `name_Acta` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci DEFAULT NULL,
  `file_name` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci DEFAULT NULL,
  `grado_Acta` int DEFAULT NULL,
  `fecha_Acta` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf16;

--
-- Volcado de datos para la tabla `acta`
--

INSERT INTO `acta` (`id_Acta`, `name_Acta`, `file_name`, `grado_Acta`, `fecha_Acta`) VALUES
(2, 'Acta Número 3', '7626-ACTA-30-03-2023.pdf', 1, '2023-03-30');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `biblioteca`
--

CREATE TABLE `biblioteca` (
  `id_Libro` int NOT NULL,
  `nombre_Libro` varchar(250) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci DEFAULT NULL,
  `autor_Libro` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci DEFAULT NULL,
  `file_name` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci DEFAULT NULL,
  `grado_Libro` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf16;

--
-- Volcado de datos para la tabla `biblioteca`
--

INSERT INTO `biblioteca` (`id_Libro`, `nombre_Libro`, `autor_Libro`, `file_name`, `grado_Libro`) VALUES
(1, 'Libro del Aprendiz', 'Oswald Wirth', '8069-ElLibroDelAprendiz.pdf', 1),
(2, 'El Libro del Compañero', 'Oswald Wirth', '7628-oswald-wirth-libro-del-compac3b1ero.pdf', 2),
(3, 'Los 21 Temas del Compañero Masón', 'Adolfo Terrones Benítez - Alfonso León García', '6246-los-21-temas-del-compaero-mason.pdf', 2),
(4, '21 trabajos para la reflexión en cámara de aprendiz', 'Ricardo Colaneri', '4779-21 trabajos para la reflexion en camara de aprendiz - Ricardo Colaneri.pdf', 1),
(5, 'Al Aprendiz - Mi visión del Grado', 'Jorge Trigo', '8328-Al Aprendiz - Mi vision del Grado - Jorge Trigo.pdf', 1),
(6, 'Cuadernos Docentes - Tomo 1', 'Gran logia de Chile', '9133-Cuadernos Docentes - Tomo 1 - Gran logia de Chile.pdf', 1),
(7, 'Cuadernos Docentes - Tomo 2', 'Gran logia de Chile', '3145-Cuadernos Docentes - Tomo 2 - Gran logia de Chile.pdf', 1),
(8, 'El Aprendiz Mason', 'Tomas Caimi', '1594-El aprendiz Mason - Tomas Caimi.pdf', 1),
(9, 'El Aprendiz y sus misterios', 'Jorge Adoum', '5926-El Aprendiz y sus misterios - Jorge Adoum.pdf', 1),
(10, 'El Ideal Iniciático', 'Oswald Wirth', '7241-El Ideal Iniciático - Oswald Wirth.pdf', 1),
(11, 'El Templo', 'Ricardo Falero; Fernando Quarneti; Bernardo Srulevich', '6375-El Templo - Falero-Quarneti-Srulevich.pdf', 1),
(12, 'La aventuranza de Juan Pueblo', 'Rafael Goldenberg', '8657-La aventuranza de Juan Pueblo -Juan Pueblo - Juan Pedro - J.P..pdf', 1),
(13, 'Simbolismo hermético', 'Oswald Wirth', '2518-Oswald Wirth - Simbolismo hermético.pdf', 1),
(14, 'Teoría y símbolos de la filosofía hermetica', 'Oswald Wirth', '4469-Oswald Wirth - teoria_y_simbolos__de_la_filosofia_hermetica.pdf', 1),
(15, 'Por qué soy Masón', 'Armando Hurtado', '4933-Por Qué Soy Masón - Armando Hurtado.pdf', 1),
(16, 'Puertas adentro - Algunos trabajos y fragmentos de otros', 'Luis M. Rivas Ortiz', '8871-Puertas adentro - Algunos trabajos y fragmentos de otros - Luis M. Rivas Ortiz.pdf', 1),
(17, 'Temas de Reflexión', 'Oclides Vázquez', '8837-Temas de Reflexion - Oclides Vázquez.pdf', 1),
(18, 'Los 33 Temas del Aprendiz Mason y Estatutos de la Orden', 'Adolfo Terrones Benítez; Alfonso García', '7663-Los 33 Temas del Aprendiz Mason y Estatutos de la Orden - Adolfo Terrones Benítez. Alfonso García.pdf', 1),
(19, 'Trazados masónicos de primer grado', 'Robert Pose', '6645-Trazados masonicos de primer grado - Robert Pose.pdf', 1),
(20, 'Trazados masónicos de primer grado', 'Robert Pose', '1982-Trazados masonicos de primer grado - Robert Pose.pdf', 1),
(21, 'El ideal iniciático', 'Wirth Oswald', '1906-Wirth Oswald - El ideal iniciatico.pdf', 1),
(22, 'Simbolismo astrológico', 'Wirth Oswald', '8874-Wirth Oswald - Simbolismo astrologico.pdf', 1),
(23, 'Acerca de 30 propuestas en cámara de aprendiz', 'Ricardo Colaneri', '6836-Acerca de 30 propuestas en camara de aprendiz - Ricardo Colaneri.pdf', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `boletin`
--

CREATE TABLE `boletin` (
  `id_Boletin` int NOT NULL,
  `titulo_Boletin` varchar(250) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci DEFAULT NULL,
  `file_name` varchar(250) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci DEFAULT NULL,
  `grado_Boletin` int DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf16;

--
-- Volcado de datos para la tabla `boletin`
--

INSERT INTO `boletin` (`id_Boletin`, `titulo_Boletin`, `file_name`, `grado_Boletin`, `created_at`) VALUES
(1, 'Boletín Eternos Aprendices Nº1', '7433-Boletín Eternos Aprendices N°1.pdf', 1, '2023-03-28 01:56:28'),
(2, 'Boletín Eternos Aprendices Nº2', '8772-Boletín Eternos Aprendices N°2.pdf', 1, '2023-03-28 01:57:02'),
(3, 'Boletín Eternos Aprendices Nº3', '8448-Boletín Eternos Aprendices N°3.pdf', 1, '2023-03-28 01:57:13'),
(4, 'Boletín Eternos Aprendices Nº4', '7554-Boletín Eternos Aprendices N°4.pdf', 1, '2023-03-28 01:58:22'),
(5, 'Boletín Eternos Aprendices Nº5', '8785-Boletín Eternos Aprendices Nº5.pdf', 1, '2023-03-28 01:58:40'),
(6, 'Boletín Eternos Aprendices Nº6', '4383-Boletín Eternos Aprendices N°6.pdf', 1, '2023-03-28 01:59:01'),
(7, 'Boletín Eternos Aprendices Nº7', '1250-Boletín Eternos Aprendices N°7.pdf', 1, '2023-03-28 01:59:10'),
(8, 'Boletín Eternos Aprendices Nº8', '4001-Boletín Eternos Aprendices N°8.pdf', 1, '2023-03-28 01:59:19'),
(9, 'Boletín Eternos Aprendices Nº9', '6436-Boletín Eternos Aprendices N°9.pdf', 1, '2023-03-28 01:59:40'),
(10, 'Boletín Eternos Aprendices Nº10', '4550-Boletín Eternos Aprendices N°10.pdf', 1, '2023-03-28 01:59:48'),
(11, 'Boletín Eternos Aprendices Nº11', '6917-Boletín Eternos Aprendices N°11.pdf', 1, '2023-03-28 01:59:55'),
(12, 'Boletín Eternos Aprendices Nº12', '8411-Boletín Eternos Aprendices N°12.pdf', 1, '2023-03-28 02:00:08'),
(13, 'Boletín Eternos Aprendices Nº13', '2126-Boletín Eternos Aprendices Nº13.pdf', 1, '2023-03-28 02:00:25'),
(14, 'Boletín Eternos Aprendices Nº14', '8971-Boletín Eternos Aprendices Nº14.pdf', 1, '2023-03-28 02:00:35'),
(15, 'Boletín Eternos Aprendices Nº16', '5921-Boletín Eternos Aprendices Nº16.pdf', 1, '2023-03-28 02:01:20'),
(16, 'Boletín Eternos Aprendices Nº18', '3875-Boletín Eternos Aprendices Nº18.pdf', 1, '2023-03-28 02:01:30'),
(17, 'Boletín Construyendo las Gradas N°1', '9567-Boletín Construyendo las Gradas N°1.pdf', 2, '2023-03-28 11:01:05'),
(18, 'Boletín Construyendo las Gradas N°2', '6794-Boletín Construyendo las Gradas N°2.pdf', 2, '2023-03-28 11:02:25'),
(19, 'Boletín Construyendo las Gradas N°3', '7443-Boletín Construyendo las Gradas N°3.pdf', 2, '2023-03-28 11:02:39'),
(20, 'Boletín Construyendo las Gradas N°4', '1501-Boletín Construyendo las Gradas N°4.pdf', 2, '2023-03-28 11:02:53'),
(21, 'Boletín Construyendo las Gradas N°5', '3825-Boletín Construyendo las Gradas N°5.pdf', 2, '2023-03-28 11:03:09'),
(22, 'Boletín Construyendo las Gradas N°6', '5968-Boletín Construyendo las Gradas N°6.pdf', 2, '2023-03-28 11:03:25'),
(23, 'Boletín Construyendo las Gradas N°7', '3972-Boletín Construyendo las Gradas N°7.pdf', 2, '2023-03-28 11:03:37'),
(24, 'Boletín Construyendo las Gradas N°8', '9066-Boletín Construyendo las Gradas N°8.pdf', 2, '2023-03-28 11:03:57'),
(25, 'Boletín Construyendo las Gradas N°9', '2866-Boletín Construyendo las Gradas N°9.pdf', 2, '2023-03-28 11:04:10'),
(26, 'Boletín Construyendo las Gradas N°10', '9308-Boletín Construyendo las Gradas N°10.pdf', 2, '2023-03-28 11:04:21'),
(27, 'Boletín Construyendo las Gradas N°11', '6335-Boletín Construyendo las Gradas N°11.pdf', 2, '2023-03-28 11:04:36'),
(28, 'Boletín Construyendo las Gradas N°12', '9590-Boletín Construyendo las Gradas N°12.pdf', 2, '2023-03-28 11:05:03');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categoryevent`
--

CREATE TABLE `categoryevent` (
  `id_Category` int NOT NULL,
  `nombre_Category` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf16;

--
-- Volcado de datos para la tabla `categoryevent`
--

INSERT INTO `categoryevent` (`id_Category`, `nombre_Category`) VALUES
(1, 'Tenida de Primero'),
(2, 'Tenida de Segundo'),
(3, 'Tenida de Tercero'),
(4, 'Otro Evento');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categoryfeed`
--

CREATE TABLE `categoryfeed` (
  `id_Category` int NOT NULL,
  `nombre_Category` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf16;

--
-- Volcado de datos para la tabla `categoryfeed`
--

INSERT INTO `categoryfeed` (`id_Category`, `nombre_Category`) VALUES
(1, 'Tenidas'),
(2, 'Camaras'),
(3, 'Eventos'),
(4, 'Noticias'),
(5, 'General');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `commentsfeed`
--

CREATE TABLE `commentsfeed` (
  `id_Comment` int NOT NULL,
  `user_Comment` int DEFAULT NULL,
  `feed_Comment` int DEFAULT NULL,
  `message_Comment` varchar(300) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf16;

--
-- Volcado de datos para la tabla `commentsfeed`
--

INSERT INTO `commentsfeed` (`id_Comment`, `user_Comment`, `feed_Comment`, `message_Comment`, `created_at`) VALUES
(1, 38, 5, 'Muy buena su actividad', '2023-12-07 18:03:35'),
(2, 38, 3, 'Felicito VH Edgardo muy bonita la hfoto cómo su pagina ', '2023-12-07 18:05:01'),
(3, 53, 16, 'Bibliografía\r\nBoucher, J. (1948). El simbolismo masónico: historia y tradición. París: Dervy.\r\nGuénon, R. (1946). Apercepciones sobre la iniciación. Buenos Aires: Kier.\r\nRagon, J. M. (1853). Curso filosófico de las iniciaciones antiguas y modernas. París: Germer-Baillière.\r\nWirth, O. (1894/2019). El', '2025-05-22 15:42:16'),
(4, 53, 17, 'Desarrollo: \r\n\r\nLa marca en el pecho es un símbolo que aparece hacia el final del ritual de iniciación del Aprendiz Masón. No se trata de una herida, ni de un tatuaje ni de una marca visible para los ojos profanos. Es, más bien, un signo interior, un sello ético y espiritual que queda grabado en la ', '2025-05-22 15:50:20'),
(5, 53, 18, 'La marca en el pecho es un símbolo que aparece hacia el final del ritual de iniciación del Aprendiz Masón. No se trata de una herida, ni de un tatuaje ni de una marca visible para los ojos profanos. Es, más bien, un signo interior, un sello ético y espiritual que queda grabado en la conciencia del i', '2025-05-22 15:53:48'),
(6, 53, 18, 'La marca en el pecho es un símbolo que aparece hacia el final del ritual de iniciación del Aprendiz Masón. No se trata de una herida, ni de un tatuaje ni de una marca visible para los ojos profanos. Es, más bien, un signo interior, un sello ético y espiritual que queda grabado en la conciencia del i', '2025-05-22 15:53:52'),
(7, 53, 19, 'La marca en el pecho es un símbolo que aparece hacia el final del ritual de iniciación del Aprendiz Masón. No se trata de una herida, ni de un tatuaje ni de una marca visible para los ojos profanos. Es, más bien, un signo interior, un sello ético y espiritual que queda grabado en la conciencia del i', '2025-05-22 21:42:17');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `documents`
--

CREATE TABLE `documents` (
  `id_Doc` int NOT NULL,
  `name_Doc` varchar(150) DEFAULT NULL,
  `file_name` varchar(100) DEFAULT NULL,
  `date_Doc` date DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf16;

--
-- Volcado de datos para la tabla `documents`
--

INSERT INTO `documents` (`id_Doc`, `name_Doc`, `file_name`, `date_Doc`, `created_at`) VALUES
(1, 'Decreto Autorización Instalación Logia Caleuche N°250 ', '8733-AUTORIZA INSTALACIÓN LOGIA J Y P CALEUCHE 250.pdf', '2023-05-19', '2023-10-23 13:41:00'),
(2, 'Historia Logia En Instancia Caleuche', '6708-HISTORIA LOGIA EN INSTANCIA CALEUCHE.pdf', '2020-08-24', '2023-10-23 13:43:39'),
(3, 'Acta Instalación Logia En Instancia \"Caleuche\"', '3125-ACTA INSTALACION LOGIA EN INSTANCIA.pdf', '2021-10-21', '2023-10-23 13:44:46'),
(4, 'Primer Aniversario Logia En Instancia \"Caleuche\"', '9985-PRIMER  ANIVERSARIO LOGIA EN INSTANCIA.pdf', '2022-10-20', '2023-10-23 13:46:46'),
(5, 'Caleuche, ¿Qué debe significar para la masonería chiloense? ¿Qué nos falta por hacer?', '3057-Caleuche, qué significa para la masoneria chilota.pdf', '2023-03-23', '2023-10-23 13:48:38');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `entradadinero`
--

CREATE TABLE `entradadinero` (
  `id_Entrada` int NOT NULL,
  `id_User` int DEFAULT NULL,
  `entrada_Mes` varchar(16) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci DEFAULT NULL,
  `entrada_Ano` varchar(16) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci DEFAULT NULL,
  `entrada_Motivo` int DEFAULT NULL,
  `entrada_Monto` decimal(10,2) DEFAULT NULL,
  `entrada_MovimientoFecha` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf16;

--
-- Volcado de datos para la tabla `entradadinero`
--

INSERT INTO `entradadinero` (`id_Entrada`, `id_User`, `entrada_Mes`, `entrada_Ano`, `entrada_Motivo`, `entrada_Monto`, `entrada_MovimientoFecha`) VALUES
(1, 30, '12 - Diciembre', '2023', 1, 43000.00, '2023-11-30 00:00:00'),
(2, 38, '12 - Diciembre', '2023', 5, 235050.00, '2023-12-07 00:00:00'),
(3, 36, '12 - Diciembre', '2023', 1, 43000.00, '2023-12-07 00:00:00'),
(4, 36, '01 - Enero', '2024', 1, 43000.00, '2023-12-08 00:00:00'),
(5, 28, '12 - Diciembre', '2023', 1, 43000.00, '2023-12-07 00:00:00'),
(6, 28, '01 - Enero', '2024', 5, 22000.00, '2023-12-08 00:00:00'),
(7, 38, '12 - Diciembre', '2023', 1, 43000.00, '2023-12-07 00:00:00'),
(8, 38, '01 - Enero', '2024', 1, 43000.00, '2024-01-03 00:00:00'),
(9, 43, '12 - Diciembre', '2023', 1, 43000.00, '2023-12-07 00:00:00'),
(10, 29, '12 - Diciembre', '2023', 1, 43000.00, '2023-12-07 00:00:00'),
(11, 29, '01 - Enero', '2024', 1, 43000.00, '2023-12-08 00:00:00'),
(12, 40, '12 - Diciembre', '2023', 1, 43000.00, '2023-12-07 00:00:00'),
(13, 46, '12 - Diciembre', '2023', 1, 43000.00, '2023-12-07 00:00:00'),
(14, 46, '01 - Enero', '2024', 1, 43000.00, '2023-12-08 00:00:00'),
(15, 7, '12 - Diciembre', '2023', 1, 43000.00, '2023-12-07 00:00:00'),
(16, 7, '01 - Enero', '2024', 1, 43000.00, '2023-12-08 00:00:00'),
(17, 30, '01 - Enero', '2024', 1, 43000.00, '2023-12-07 00:00:00'),
(18, 30, '02 - Febrero', '2024', 5, 22000.00, '2023-12-08 00:00:00'),
(19, 11, '11 - Noviembre', '2023', 4, 45700.00, '2023-11-23 00:00:00'),
(20, 11, '12 - Diciembre', '2023', 1, 43000.00, '2023-12-08 00:00:00'),
(21, 27, '11 - Noviembre', '2023', 1, 33000.00, '2023-11-30 00:00:00'),
(22, 27, '12 - Diciembre', '2023', 1, 43000.00, '2023-12-08 00:00:00'),
(23, 26, '12 - Diciembre', '2023', 1, 43000.00, '2023-12-07 00:00:00'),
(24, 26, '01 - Enero', '2024', 1, 43000.00, '2023-12-08 00:00:00'),
(25, 36, '12 - Diciembre', '2023', 5, 17340.00, '2023-12-12 00:00:00'),
(26, 7, '02 - Febrero', '2024', 1, 43000.00, '2023-12-14 00:00:00'),
(27, 7, '03 - Marzo', '2024', 1, 43000.00, '2023-12-14 00:00:00'),
(28, 7, '04 - Abril', '2024', 1, 43000.00, '2023-12-14 00:00:00'),
(29, 7, '05 - Mayo', '2024', 1, 43000.00, '2023-12-14 00:00:00'),
(30, 7, '06 - Junio', '2024', 1, 43000.00, '2023-12-14 00:00:00'),
(31, 7, '07 - Julio', '2024', 1, 43000.00, '2023-12-14 00:00:00'),
(32, 7, '08 - Agosto', '2024', 1, 43000.00, '2023-12-14 00:00:00'),
(33, 7, '09 - Septiembre', '2024', 1, 43000.00, '2023-12-14 00:00:00'),
(34, 7, '10 - Octubre', '2024', 1, 43000.00, '2023-12-14 00:00:00'),
(35, 7, '11 - Noviembre', '2024', 1, 43000.00, '2023-12-14 00:00:00'),
(36, 7, '12 - Diciembre', '2024', 1, 43000.00, '2023-12-14 00:00:00'),
(37, 48, '01 - Enero', '2024', 1, 43000.00, '2023-12-26 00:00:00'),
(38, 48, '02 - Febrero', '2024', 1, 43000.00, '2023-12-26 00:00:00'),
(39, 45, '12 - Diciembre', '2023', 1, 70000.00, '2024-01-02 00:00:00'),
(40, 42, '12 - Diciembre', '2023', 1, 10000.00, '2024-01-05 00:00:00'),
(41, 42, '01 - Enero', '2024', 1, 10000.00, '2024-01-05 00:00:00'),
(42, 34, '12 - Diciembre', '2023', 1, 10000.00, '2024-01-05 00:00:00'),
(43, 34, '01 - Enero', '2024', 1, 10000.00, '2024-01-05 00:00:00'),
(44, 35, '12 - Diciembre', '2023', 1, 30000.00, '2024-01-05 00:00:00'),
(45, 35, '01 - Enero', '2024', 1, 30000.00, '2024-01-05 00:00:00'),
(46, 36, '02 - Febrero', '2024', 1, 43000.00, '2024-01-07 00:00:00'),
(47, 36, '03 - Marzo', '2024', 1, 43000.00, '2024-01-07 00:00:00'),
(48, 36, '04 - Abril', '2024', 1, 43000.00, '2024-01-07 00:00:00'),
(49, 36, '05 - Mayo', '2024', 1, 43000.00, '2024-01-07 00:00:00'),
(50, 33, '12 - Diciembre', '2023', 1, 70000.00, '2024-01-08 00:00:00'),
(51, 41, '12 - Diciembre', '2023', 1, 10000.00, '2024-01-09 00:00:00'),
(52, 41, '01 - Enero', '2024', 1, 10000.00, '2024-01-09 00:00:00'),
(53, 41, '02 - Febrero', '2024', 1, 10000.00, '2024-01-09 00:00:00'),
(54, 41, '03 - Marzo', '2024', 1, 10000.00, '2024-01-09 00:00:00'),
(55, 41, '04 - Abril', '2024', 1, 10000.00, '2024-01-09 00:00:00'),
(56, 41, '05 - Mayo', '2024', 1, 10000.00, '2024-01-09 00:00:00'),
(57, 27, '01 - Enero', '2024', 1, 43000.00, '2024-01-19 00:00:00'),
(58, 39, '12 - Diciembre', '2023', 1, 45000.00, '2024-01-23 00:00:00'),
(59, 38, '02 - Febrero', '2024', 1, 43000.00, '2024-01-26 00:00:00'),
(60, 38, '03 - Marzo', '2024', 1, 43000.00, '2024-01-26 00:00:00'),
(61, 31, '12 - Diciembre', '2023', 1, 30000.00, '2024-01-01 00:00:00'),
(62, 7, '01 - Enero', '2024', 5, 22000.00, '2024-01-30 00:00:00'),
(63, 26, '01 - Enero', '2024', 5, 22000.00, '2024-01-30 00:00:00'),
(64, 43, '01 - Enero', '2024', 5, 22000.00, '2024-01-31 00:00:00'),
(65, 27, '01 - Enero', '2024', 5, 22000.00, '2024-01-31 00:00:00'),
(66, 47, '01 - Enero', '2024', 5, 22000.00, '2024-01-31 00:00:00'),
(67, 41, '02 - Febrero', '2024', 5, 22000.00, '2024-02-01 00:00:00'),
(68, 40, '02 - Febrero', '2024', 5, 22000.00, '2024-02-05 00:00:00'),
(69, 45, '02 - Febrero', '2024', 5, 22000.00, '2024-02-05 00:00:00'),
(70, 39, '02 - Febrero', '2024', 5, 20000.00, '2024-02-06 00:00:00'),
(71, 11, '02 - Febrero', '2024', 5, 22000.00, '2024-02-06 00:00:00'),
(72, 28, '01 - Enero', '2024', 1, 43000.00, '2024-02-06 00:00:00'),
(73, 28, '02 - Febrero', '2024', 1, 43000.00, '2024-02-06 00:00:00'),
(74, 28, '03 - Marzo', '2024', 1, 43000.00, '2024-02-06 00:00:00'),
(75, 11, '01 - Enero', '2024', 1, 43000.00, '2024-02-09 00:00:00'),
(76, 30, '02 - Febrero', '2024', 1, 43000.00, '2024-02-12 00:00:00'),
(77, 47, '12 - Diciembre', '2023', 1, 30000.00, '2024-02-12 00:00:00'),
(78, 47, '01 - Enero', '2024', 1, 43000.00, '2024-02-12 00:00:00'),
(79, 47, '02 - Febrero', '2024', 1, 43000.00, '2024-02-12 00:00:00'),
(80, 29, '02 - Febrero', '2024', 1, 43000.00, '2024-02-13 00:00:00'),
(81, 48, '03 - Marzo', '2024', 1, 43000.00, '2024-02-19 00:00:00'),
(82, 48, '04 - Abril', '2024', 1, 43000.00, '2024-02-19 00:00:00'),
(83, 31, '01 - Enero', '2024', 1, 43000.00, '2024-02-19 00:00:00'),
(84, 7, '02 - Febrero', '2024', 1, 43000.00, '2024-02-19 00:00:00'),
(85, 26, '02 - Febrero', '2024', 1, 43000.00, '2024-02-19 00:00:00'),
(86, 27, '02 - Febrero', '2024', 1, 43000.00, '2024-02-21 00:00:00'),
(87, 42, '02 - Febrero', '2024', 1, 10000.00, '2024-03-01 00:00:00'),
(88, 42, '03 - Marzo', '2024', 1, 10000.00, '2024-03-01 00:00:00'),
(89, 42, '04 - Abril', '2024', 1, 10000.00, '2024-03-01 00:00:00'),
(90, 11, '02 - Febrero', '2024', 1, 43000.00, '2024-03-01 00:00:00'),
(91, 29, '03 - Marzo', '2024', 1, 43000.00, '2024-03-03 00:00:00'),
(92, 29, '04 - Abril', '2024', 1, 43000.00, '2024-03-03 00:00:00'),
(93, 29, '05 - Mayo', '2024', 1, 10000.00, '2024-03-04 00:00:00'),
(94, 43, '01 - Enero', '2024', 1, 43000.00, '2024-03-08 00:00:00'),
(95, 43, '02 - Febrero', '2024', 1, 43000.00, '2024-03-08 00:00:00'),
(96, 30, '03 - Marzo', '2024', 1, 43000.00, '2024-03-13 00:00:00'),
(97, 34, '02 - Febrero', '2024', 1, 10000.00, '2024-03-14 00:00:00'),
(98, 34, '03 - Marzo', '2024', 1, 10000.00, '2024-03-14 00:00:00'),
(99, 26, '03 - Marzo', '2024', 1, 43000.00, '2024-03-15 00:00:00'),
(100, 40, '01 - Enero', '2024', 1, 43000.00, '2024-03-18 00:00:00'),
(101, 40, '02 - Febrero', '2024', 1, 43000.00, '2024-03-18 00:00:00'),
(102, 40, '03 - Marzo', '2024', 1, 43000.00, '2024-03-18 00:00:00'),
(103, 7, '03 - Marzo', '2024', 6, 18000.00, '2024-03-22 00:00:00'),
(104, 7, '01 - Enero', '2024', 6, 17000.00, '2024-03-22 00:00:00'),
(105, 35, '02 - Febrero', '2024', 1, 30000.00, '2024-03-07 00:00:00'),
(106, 35, '03 - Marzo', '2024', 1, 30000.00, '2024-03-07 00:00:00'),
(107, 38, '04 - Abril', '2024', 1, 43000.00, '2024-03-31 00:00:00'),
(108, 39, '01 - Enero', '2024', 1, 10000.00, '2024-04-01 00:00:00'),
(109, 39, '02 - Febrero', '2024', 1, 10000.00, '2024-04-01 00:00:00'),
(110, 39, '03 - Marzo', '2024', 1, 10000.00, '2024-04-01 00:00:00'),
(111, 39, '04 - Abril', '2024', 1, 10000.00, '2024-04-01 00:00:00'),
(112, 39, '05 - Mayo', '2024', 1, 10000.00, '2024-04-01 00:00:00'),
(113, 34, '04 - Abril', '2024', 1, 10000.00, '2024-04-01 00:00:00'),
(114, 34, '05 - Mayo', '2024', 1, 10000.00, '2024-04-01 00:00:00'),
(115, 34, '06 - Junio', '2024', 1, 10000.00, '2024-04-03 00:00:00'),
(116, 34, '07 - Julio', '2024', 1, 10000.00, '2024-04-03 00:00:00'),
(117, 49, '04 - Abril', '2024', 2, 65000.00, '2024-04-02 00:00:00'),
(118, 27, '03 - Marzo', '2024', 1, 43000.00, '2024-04-03 00:00:00'),
(119, 50, '04 - Abril', '2024', 2, 65000.00, '2024-04-04 00:00:00'),
(120, 47, '03 - Marzo', '2024', 1, 43000.00, '2024-04-04 00:00:00'),
(121, 47, '04 - Abril', '2024', 1, 43000.00, '2024-04-04 00:00:00'),
(122, 29, '05 - Mayo', '2024', 1, 43000.00, '2024-04-08 00:00:00'),
(123, 30, '04 - Abril', '2024', 1, 43000.00, '2024-04-12 00:00:00'),
(124, 11, '04 - Abril', '2024', 6, 16000.00, '2024-04-15 00:00:00'),
(125, 11, '03 - Marzo', '2024', 1, 43000.00, '2024-04-15 00:00:00'),
(126, 45, '01 - Enero', '2024', 1, 10000.00, '2024-04-15 00:00:00'),
(127, 45, '02 - Febrero', '2024', 1, 10000.00, '2024-04-15 00:00:00'),
(128, 45, '03 - Marzo', '2024', 1, 10000.00, '2024-04-15 00:00:00'),
(129, 45, '04 - Abril', '2024', 1, 10000.00, '2024-04-15 00:00:00'),
(130, 45, '05 - Mayo', '2024', 1, 10000.00, '2024-04-15 00:00:00'),
(131, 46, '02 - Febrero', '2024', 1, 43000.00, '2024-04-15 00:00:00'),
(132, 46, '03 - Marzo', '2024', 1, 43000.00, '2024-04-15 00:00:00'),
(133, 46, '04 - Abril', '2024', 1, 43000.00, '2024-04-15 00:00:00'),
(134, 46, '05 - Mayo', '2024', 1, 43000.00, '2024-04-15 00:00:00'),
(135, 46, '07 - Julio', '2024', 1, 43000.00, '2024-04-15 00:00:00'),
(136, 46, '06 - Junio', '2024', 1, 43000.00, '2024-04-15 00:00:00'),
(137, 43, '03 - Marzo', '2024', 1, 43000.00, '2024-04-16 00:00:00'),
(138, 31, '03 - Marzo', '2024', 1, 43000.00, '2024-04-19 00:00:00'),
(139, 31, '04 - Abril', '2024', 1, 43000.00, '2024-04-19 00:00:00'),
(140, 33, '02 - Febrero', '2024', 1, 10000.00, '2024-04-19 00:00:00'),
(141, 33, '03 - Marzo', '2024', 1, 10000.00, '2024-04-19 00:00:00'),
(142, 51, '04 - Abril', '2024', 2, 65000.00, '2024-04-25 00:00:00'),
(143, 27, '04 - Abril', '2024', 1, 43000.00, '2024-04-25 00:00:00'),
(144, 35, '04 - Abril', '2024', 1, 30000.00, '2024-04-30 00:00:00'),
(145, 35, '05 - Mayo', '2024', 1, 30000.00, '2024-04-30 00:00:00'),
(146, 38, '05 - Mayo', '2024', 1, 43000.00, '2024-05-01 00:00:00'),
(147, 11, '04 - Abril', '2024', 1, 43000.00, '2024-05-01 00:00:00'),
(148, 47, '05 - Mayo', '2024', 1, 43000.00, '2024-05-02 00:00:00'),
(149, 47, '06 - Junio', '2024', 1, 43000.00, '2024-05-02 00:00:00'),
(150, 49, '05 - Mayo', '2024', 1, 43000.00, '2024-05-06 00:00:00'),
(151, 29, '06 - Junio', '2024', 1, 43000.00, '2024-05-06 00:00:00'),
(152, 30, '05 - Mayo', '2024', 1, 43000.00, '2024-05-14 00:00:00'),
(153, 11, '05 - Mayo', '2024', 1, 43000.00, '2024-05-17 00:00:00'),
(154, 27, '05 - Mayo', '2024', 1, 43000.00, '2024-05-17 00:00:00'),
(155, 48, '05 - Mayo', '2024', 1, 43000.00, '2024-05-17 00:00:00'),
(156, 48, '06 - Junio', '2024', 1, 43000.00, '2024-05-17 00:00:00'),
(157, 43, '04 - Abril', '2024', 1, 43000.00, '2024-05-18 00:00:00'),
(158, 43, '05 - Mayo', '2024', 1, 43000.00, '2024-05-18 00:00:00'),
(159, 43, '06 - Junio', '2024', 1, 43000.00, '2024-05-18 00:00:00'),
(160, 28, '04 - Abril', '2024', 1, 43000.00, '2024-05-22 00:00:00'),
(161, 40, '04 - Abril', '2024', 1, 43000.00, '2024-05-22 00:00:00'),
(162, 40, '05 - Mayo', '2024', 1, 43000.00, '2024-05-22 00:00:00'),
(163, 40, '06 - Junio', '2024', 1, 43000.00, '2024-05-22 00:00:00'),
(164, 38, '06 - Junio', '2024', 1, 43000.00, '2024-06-03 00:00:00'),
(165, 49, '06 - Junio', '2024', 1, 43000.00, '2024-06-03 00:00:00'),
(166, 52, '05 - Mayo', '2024', 1, 30000.00, '2024-06-04 00:00:00'),
(167, 52, '06 - Junio', '2024', 1, 30000.00, '2024-06-04 00:00:00'),
(168, 29, '07 - Julio', '2024', 1, 43000.00, '2024-06-04 00:00:00'),
(170, 43, '12 - Diciembre', '2023', 6, 301211.00, '2024-06-07 00:00:00'),
(171, 30, '06 - Junio', '2024', 1, 43000.00, '2024-06-11 00:00:00'),
(172, 41, '06 - Junio', '2024', 1, 10000.00, '2024-06-12 00:00:00'),
(173, 41, '07 - Julio', '2024', 1, 10000.00, '2024-06-12 00:00:00'),
(174, 41, '08 - Agosto', '2024', 1, 10000.00, '2024-06-12 00:00:00'),
(175, 41, '09 - Septiembre', '2024', 1, 10000.00, '2024-06-12 00:00:00'),
(176, 41, '10 - Octubre', '2024', 1, 10000.00, '2024-06-12 00:00:00'),
(177, 41, '11 - Noviembre', '2024', 1, 10000.00, '2024-06-12 00:00:00'),
(178, 11, '06 - Junio', '2024', 1, 43000.00, '2024-06-12 00:00:00'),
(179, 11, '06 - Junio', '2024', 6, 197000.00, '2024-06-14 00:00:00'),
(180, 31, '05 - Mayo', '2024', 1, 43000.00, '2024-06-18 00:00:00'),
(181, 31, '06 - Junio', '2024', 1, 43000.00, '2024-06-18 00:00:00'),
(182, 43, '07 - Julio', '2024', 1, 43000.00, '2024-06-18 00:00:00'),
(183, 27, '06 - Junio', '2024', 1, 43000.00, '2024-06-19 00:00:00'),
(184, 40, '07 - Julio', '2024', 1, 43000.00, '2024-06-25 00:00:00'),
(185, 40, '08 - Agosto', '2024', 1, 43000.00, '2024-06-25 00:00:00'),
(186, 52, '07 - Julio', '2024', 1, 30000.00, '2024-06-27 00:00:00'),
(187, 52, '08 - Agosto', '2024', 1, 30000.00, '2024-06-27 00:00:00'),
(188, 26, '04 - Abril', '2024', 1, 43000.00, '2024-06-28 00:00:00'),
(189, 26, '05 - Mayo', '2024', 1, 43000.00, '2024-06-28 00:00:00'),
(190, 38, '07 - Julio', '2024', 1, 43000.00, '2024-06-30 00:00:00'),
(191, 34, '08 - Agosto', '2024', 1, 10000.00, '2024-07-01 00:00:00'),
(192, 34, '09 - Septiembre', '2024', 1, 10000.00, '2024-07-01 00:00:00'),
(193, 49, '07 - Julio', '2024', 1, 43000.00, '2024-07-01 00:00:00'),
(194, 29, '08 - Agosto', '2024', 1, 43000.00, '2024-07-01 00:00:00'),
(195, 42, '05 - Mayo', '2024', 1, 10000.00, '2024-07-02 00:00:00'),
(196, 42, '06 - Junio', '2024', 1, 10000.00, '2024-07-02 00:00:00'),
(197, 42, '07 - Julio', '2024', 1, 10000.00, '2024-07-02 00:00:00'),
(198, 42, '08 - Agosto', '2024', 1, 10000.00, '2024-07-02 00:00:00'),
(199, 42, '09 - Septiembre', '2024', 1, 10000.00, '2024-07-02 00:00:00'),
(200, 42, '10 - Octubre', '2024', 1, 10000.00, '2024-07-02 00:00:00'),
(201, 42, '11 - Noviembre', '2024', 1, 10000.00, '2024-07-02 00:00:00'),
(202, 42, '12 - Diciembre', '2024', 1, 10000.00, '2024-07-02 00:00:00'),
(203, 39, '06 - Junio', '2024', 1, 10000.00, '2024-07-02 00:00:00'),
(204, 39, '07 - Julio', '2024', 1, 10000.00, '2024-07-02 00:00:00'),
(205, 39, '08 - Agosto', '2024', 1, 10000.00, '2024-07-02 00:00:00'),
(206, 39, '09 - Septiembre', '2024', 1, 10000.00, '2024-07-02 00:00:00'),
(207, 11, '07 - Julio', '2024', 5, 180000.00, '2024-07-04 00:00:00'),
(208, 28, '05 - Mayo', '2024', 1, 43000.00, '2024-07-09 00:00:00'),
(209, 33, '04 - Abril', '2024', 1, 10000.00, '2024-07-10 00:00:00'),
(210, 33, '05 - Mayo', '2024', 1, 10000.00, '2024-07-10 00:00:00'),
(211, 33, '06 - Junio', '2024', 1, 10000.00, '2024-07-10 00:00:00'),
(212, 33, '07 - Julio', '2024', 1, 10000.00, '2024-07-10 00:00:00'),
(213, 33, '08 - Agosto', '2024', 1, 10000.00, '2024-07-10 00:00:00'),
(214, 33, '09 - Septiembre', '2024', 1, 10000.00, '2024-07-10 00:00:00'),
(215, 33, '10 - Octubre', '2024', 1, 10000.00, '2024-07-10 00:00:00'),
(216, 33, '11 - Noviembre', '2024', 1, 10000.00, '2024-07-10 00:00:00'),
(217, 35, '06 - Junio', '2024', 1, 30000.00, '2024-07-10 00:00:00'),
(218, 35, '07 - Julio', '2024', 1, 30000.00, '2024-07-10 00:00:00'),
(219, 51, '05 - Mayo', '2024', 1, 43000.00, '2024-07-10 00:00:00'),
(220, 51, '06 - Junio', '2024', 1, 43000.00, '2024-07-10 00:00:00'),
(221, 11, '07 - Julio', '2024', 6, 133000.00, '2024-07-10 00:00:00'),
(222, 30, '07 - Julio', '2024', 1, 43000.00, '2024-07-10 00:00:00'),
(223, 36, '06 - Junio', '2024', 1, 43000.00, '2024-07-11 00:00:00'),
(224, 36, '07 - Julio', '2024', 1, 43000.00, '2024-07-11 00:00:00'),
(225, 36, '08 - Agosto', '2024', 1, 43000.00, '2024-07-11 00:00:00'),
(226, 36, '09 - Septiembre', '2024', 1, 43000.00, '2024-07-11 00:00:00'),
(227, 36, '10 - Octubre', '2024', 1, 43000.00, '2024-07-11 00:00:00'),
(228, 26, '06 - Junio', '2024', 1, 43000.00, '2024-07-19 00:00:00'),
(229, 43, '08 - Agosto', '2024', 1, 43000.00, '2024-07-19 00:00:00'),
(230, 31, '07 - Julio', '2024', 1, 43000.00, '2024-07-25 00:00:00'),
(231, 31, '08 - Agosto', '2024', 1, 43000.00, '2024-07-25 00:00:00'),
(232, 31, '09 - Septiembre', '2024', 1, 43000.00, '2024-07-25 00:00:00'),
(233, 27, '07 - Julio', '2024', 1, 43000.00, '2024-07-29 00:00:00'),
(234, 49, '08 - Agosto', '2024', 1, 43000.00, '2024-08-01 00:00:00'),
(235, 29, '09 - Septiembre', '2024', 1, 43000.00, '2024-08-05 00:00:00'),
(236, 36, '11 - Noviembre', '2024', 1, 43000.00, '2024-08-05 00:00:00'),
(237, 36, '12 - Diciembre', '2025', 1, 43000.00, '2024-08-05 00:00:00'),
(238, 48, '07 - Julio', '2024', 1, 43000.00, '2024-08-07 00:00:00'),
(239, 48, '08 - Agosto', '2024', 1, 43000.00, '2024-08-07 00:00:00'),
(240, 35, '08 - Agosto', '2024', 1, 30000.00, '2024-08-07 00:00:00'),
(241, 35, '09 - Septiembre', '2024', 1, 30000.00, '2024-08-07 00:00:00'),
(242, 51, '07 - Julio', '2024', 1, 43000.00, '2024-08-07 00:00:00'),
(243, 11, '08 - Agosto', '2024', 6, 25000.00, '2024-08-07 00:00:00'),
(244, 38, '08 - Agosto', '2024', 1, 43000.00, '2024-08-08 00:00:00'),
(245, 30, '08 - Agosto', '2024', 1, 43000.00, '2024-08-14 00:00:00'),
(246, 40, '09 - Septiembre', '2024', 1, 43000.00, '2024-08-19 00:00:00'),
(247, 43, '09 - Septiembre', '2024', 1, 43000.00, '2024-08-19 00:00:00'),
(248, 27, '08 - Agosto', '2024', 1, 43000.00, '2024-08-19 00:00:00'),
(249, 31, '10 - Octubre', '2024', 1, 43000.00, '2024-08-19 00:00:00'),
(250, 31, '11 - Noviembre', '2024', 1, 43000.00, '2024-08-19 00:00:00'),
(251, 31, '12 - Diciembre', '2024', 1, 43000.00, '2024-08-19 00:00:00'),
(252, 26, '07 - Julio', '2024', 1, 43000.00, '2024-08-23 00:00:00'),
(253, 34, '10 - Octubre', '2024', 1, 10000.00, '2024-08-28 00:00:00'),
(254, 34, '11 - Noviembre', '2024', 1, 10000.00, '2024-08-28 00:00:00'),
(255, 34, '12 - Diciembre', '2024', 1, 10000.00, '2024-08-28 00:00:00'),
(256, 48, '09 - Septiembre', '2024', 1, 43000.00, '2024-09-02 00:00:00'),
(257, 47, '07 - Julio', '2024', 1, 43000.00, '2024-09-02 00:00:00'),
(258, 47, '08 - Agosto', '2024', 1, 43000.00, '2024-09-02 00:00:00'),
(259, 47, '09 - Septiembre', '2024', 1, 43000.00, '2024-09-02 00:00:00'),
(260, 49, '09 - Septiembre', '2024', 1, 43000.00, '2024-09-03 00:00:00'),
(261, 29, '10 - Octubre', '2024', 1, 43000.00, '2024-09-03 00:00:00'),
(262, 38, '09 - Septiembre', '2024', 1, 43000.00, '2024-09-03 00:00:00'),
(263, 11, '09 - Septiembre', '2024', 6, 10000.00, '2024-09-03 00:00:00'),
(264, 51, '08 - Agosto', '2024', 1, 43000.00, '2024-09-04 00:00:00'),
(265, 11, '07 - Julio', '2024', 1, 43000.00, '2024-09-04 00:00:00'),
(266, 11, '09 - Septiembre', '2024', 6, 26000.00, '2024-09-04 00:00:00'),
(267, 53, '09 - Septiembre', '2024', 2, 75000.00, '2024-09-06 00:00:00'),
(268, 30, '09 - Septiembre', '2024', 1, 43000.00, '2024-09-10 00:00:00'),
(269, 54, '09 - Septiembre', '2024', 2, 75000.00, '2024-09-11 00:00:00'),
(270, 27, '09 - Septiembre', '2024', 1, 43000.00, '2024-09-16 00:00:00'),
(271, 43, '10 - Octubre', '2024', 1, 43000.00, '2024-09-17 00:00:00'),
(272, 40, '10 - Octubre', '2024', 1, 43000.00, '2024-09-23 00:00:00'),
(273, 29, '11 - Noviembre', '2024', 1, 43000.00, '2024-10-02 00:00:00'),
(274, 49, '10 - Octubre', '2024', 1, 43000.00, '2024-10-01 00:00:00'),
(275, 48, '10 - Octubre', '2024', 1, 43000.00, '2024-10-02 00:00:00'),
(276, 52, '09 - Septiembre', '2023', 1, 30000.00, '2024-10-02 00:00:00'),
(277, 30, '10 - Octubre', '2024', 1, 43000.00, '2024-10-04 00:00:00'),
(278, 54, '10 - Octubre', '2024', 1, 43000.00, '2024-10-07 00:00:00'),
(279, 38, '10 - Octubre', '2024', 1, 43000.00, '2024-10-16 00:00:00'),
(280, 38, '11 - Noviembre', '2024', 1, 43000.00, '2024-10-16 00:00:00'),
(281, 43, '11 - Noviembre', '2024', 1, 43000.00, '2024-10-18 00:00:00'),
(282, 40, '11 - Noviembre', '2024', 1, 43000.00, '2024-10-22 00:00:00'),
(283, 39, '10 - Octubre', '2024', 1, 10000.00, '2024-10-24 00:00:00'),
(284, 39, '11 - Noviembre', '2024', 1, 10000.00, '2024-10-24 00:00:00'),
(285, 39, '12 - Diciembre', '2024', 1, 10000.00, '2024-10-24 00:00:00'),
(286, 27, '10 - Octubre', '2024', 1, 43000.00, '2024-10-24 00:00:00'),
(287, 30, '11 - Noviembre', '2024', 1, 43000.00, '2024-10-25 00:00:00'),
(288, 48, '11 - Noviembre', '2024', 1, 43000.00, '2024-11-04 00:00:00'),
(289, 48, '12 - Diciembre', '2024', 1, 43000.00, '2024-11-04 00:00:00'),
(290, 49, '11 - Noviembre', '2024', 1, 43000.00, '2024-11-05 00:00:00'),
(291, 45, '06 - Junio', '2024', 1, 10000.00, '2024-11-05 00:00:00'),
(292, 45, '07 - Julio', '2024', 1, 10000.00, '2024-11-05 00:00:00'),
(293, 45, '08 - Agosto', '2024', 1, 10000.00, '2024-11-05 00:00:00'),
(294, 45, '09 - Septiembre', '2024', 1, 10000.00, '2024-11-05 00:00:00'),
(295, 45, '10 - Octubre', '2024', 1, 10000.00, '2024-11-05 00:00:00'),
(296, 45, '11 - Noviembre', '2024', 1, 10000.00, '2024-11-05 00:00:00'),
(297, 45, '12 - Diciembre', '2024', 1, 10000.00, '2024-11-05 00:00:00'),
(298, 29, '12 - Diciembre', '2024', 1, 43000.00, '2024-11-05 00:00:00'),
(299, 46, '08 - Agosto', '2024', 1, 43000.00, '2024-11-14 00:00:00'),
(300, 46, '09 - Septiembre', '2024', 1, 43000.00, '2024-11-14 00:00:00'),
(301, 46, '10 - Octubre', '2024', 1, 43000.00, '2024-11-14 00:00:00'),
(302, 46, '11 - Noviembre', '2024', 1, 43000.00, '2024-11-14 00:00:00'),
(303, 46, '12 - Diciembre', '2024', 1, 43000.00, '2024-11-14 00:00:00'),
(304, 46, '01 - Enero', '2025', 1, 43000.00, '2025-03-04 00:00:00'),
(305, 35, '10 - Octubre', '2024', 1, 30000.00, '2024-11-14 00:00:00'),
(306, 35, '11 - Noviembre', '2024', 1, 30000.00, '2024-11-14 00:00:00'),
(307, 46, '09 - Septiembre', '2025', 1, 45000.00, '2025-03-04 00:00:00'),
(308, 26, '08 - Agosto', '2024', 1, 43000.00, '2024-11-18 00:00:00'),
(309, 26, '09 - Septiembre', '2024', 1, 43000.00, '2024-11-18 00:00:00'),
(310, 54, '11 - Noviembre', '2024', 1, 43000.00, '2024-11-18 00:00:00'),
(311, 40, '12 - Diciembre', '2024', 1, 43000.00, '2024-11-19 00:00:00'),
(312, 43, '12 - Diciembre', '2024', 1, 43000.00, '2024-11-23 00:00:00'),
(313, 43, '12 - Diciembre', '2024', 6, 18000.00, '2024-11-23 00:00:00'),
(314, 27, '11 - Noviembre', '43000', 1, 43000.00, '2024-11-24 00:00:00'),
(315, 30, '12 - Diciembre', '2024', 1, 43000.00, '2024-11-25 00:00:00'),
(316, 43, '11 - Noviembre', '2024', 6, 24000.00, '2024-11-29 00:00:00'),
(317, 55, '11 - Noviembre', '2024', 2, 75000.00, '2024-11-07 00:00:00'),
(318, 51, '09 - Septiembre', '2024', 1, 43000.00, '2024-11-07 00:00:00'),
(319, 11, '12 - Diciembre', '2024', 6, 90000.00, '2024-12-03 00:00:00'),
(320, 47, '10 - Octubre', '2024', 1, 43000.00, '2024-12-03 00:00:00'),
(321, 47, '11 - Noviembre', '2024', 1, 43000.00, '2024-12-03 00:00:00'),
(322, 47, '12 - Diciembre', '2024', 1, 43000.00, '2024-12-03 00:00:00'),
(323, 29, '01 - Enero', '2025', 1, 43000.00, '2024-12-03 00:00:00'),
(324, 49, '12 - Diciembre', '2024', 1, 43000.00, '2024-12-04 00:00:00'),
(325, 54, '12 - Diciembre', '2024', 1, 43000.00, '2024-12-04 00:00:00'),
(326, 55, '12 - Diciembre', '2024', 1, 43000.00, '2024-12-05 00:00:00'),
(327, 52, '10 - Octubre', '2024', 1, 30000.00, '2024-12-04 00:00:00'),
(328, 52, '11 - Noviembre', '2024', 1, 30000.00, '2024-12-04 00:00:00'),
(329, 26, '10 - Octubre', '2024', 1, 43000.00, '2024-12-11 00:00:00'),
(330, 51, '10 - Octubre', '2024', 1, 43000.00, '2024-12-10 00:00:00'),
(331, 51, '11 - Noviembre', '2024', 1, 43000.00, '2024-12-10 00:00:00'),
(332, 51, '12 - Diciembre', '2024', 1, 14000.00, '2024-12-10 00:00:00'),
(333, 38, '12 - Diciembre', '2024', 1, 43000.00, '2024-12-11 00:00:00'),
(334, 27, '12 - Diciembre', '2024', 1, 43000.00, '2024-12-17 00:00:00'),
(335, 40, '01 - Enero', '2025', 1, 43000.00, '2024-12-19 00:00:00'),
(336, 26, '11 - Noviembre', '2024', 1, 43000.00, '2024-12-20 00:00:00'),
(337, 26, '12 - Diciembre', '2024', 1, 43000.00, '2025-01-22 00:00:00'),
(338, 52, '12 - Diciembre', '2024', 1, 30000.00, '2024-12-28 00:00:00'),
(339, 52, '01 - Enero', '2025', 1, 30000.00, '2024-12-28 00:00:00'),
(340, 52, '02 - Febrero', '2025', 1, 30000.00, '2024-12-28 00:00:00'),
(341, 29, '02 - Febrero', '2025', 1, 43000.00, '2025-01-07 00:00:00'),
(342, 27, '01 - Enero', '2025', 1, 43000.00, '2025-01-14 00:00:00'),
(343, 40, '02 - Febrero', '2025', 1, 43000.00, '2025-01-20 00:00:00'),
(344, 41, '12 - Diciembre', '2024', 1, 10000.00, '2025-01-20 00:00:00'),
(345, 41, '01 - Enero', '2025', 1, 10000.00, '2025-01-20 00:00:00'),
(346, 41, '02 - Febrero', '2025', 1, 10000.00, '2025-01-20 00:00:00'),
(347, 41, '03 - Marzo', '2025', 1, 10000.00, '2025-01-20 00:00:00'),
(348, 30, '01 - Enero', '2025', 1, 43000.00, '2025-01-24 00:00:00'),
(349, 49, '01 - Enero', '2025', 1, 43000.00, '2025-01-07 00:00:00'),
(350, 26, '01 - Enero', '2025', 1, 43000.00, '2025-02-03 00:00:00'),
(351, 49, '02 - Febrero', '2025', 1, 43000.00, '2025-02-03 00:00:00'),
(352, 35, '12 - Diciembre', '2024', 1, 30000.00, '2024-12-18 00:00:00'),
(353, 36, '01 - Enero', '2025', 1, 43000.00, '2025-02-05 00:00:00'),
(354, 36, '02 - Febrero', '2025', 1, 43000.00, '2025-02-05 00:00:00'),
(355, 36, '03 - Marzo', '2025', 1, 43000.00, '2025-02-05 00:00:00'),
(356, 36, '04 - Abril', '2025', 1, 45000.00, '2025-02-05 00:00:00'),
(357, 36, '05 - Mayo', '2025', 1, 45000.00, '2025-02-05 00:00:00'),
(358, 30, '02 - Febrero', '2025', 1, 43000.00, '2025-02-10 00:00:00'),
(359, 7, '01 - Enero', '2025', 1, 43000.00, '2025-02-12 00:00:00'),
(360, 7, '02 - Febrero', '2025', 1, 43000.00, '2025-02-12 00:00:00'),
(361, 7, '03 - Marzo', '2025', 1, 43000.00, '2025-02-12 00:00:00'),
(362, 7, '04 - Abril', '2025', 1, 45000.00, '2025-02-12 00:00:00'),
(363, 7, '05 - Mayo', '2025', 1, 45000.00, '2025-02-12 00:00:00'),
(364, 7, '06 - Junio', '2025', 1, 45000.00, '2025-02-12 00:00:00'),
(365, 7, '07 - Julio', '2025', 1, 45000.00, '2025-02-12 00:00:00'),
(366, 7, '08 - Agosto', '2025', 1, 45000.00, '2025-02-12 00:00:00'),
(367, 7, '09 - Septiembre', '2025', 1, 45000.00, '2025-02-12 00:00:00'),
(368, 7, '10 - Octubre', '2025', 1, 45000.00, '2025-02-12 00:00:00'),
(369, 7, '11 - Noviembre', '2025', 1, 45000.00, '2025-02-12 00:00:00'),
(370, 7, '12 - Diciembre', '2025', 1, 45000.00, '2025-02-12 00:00:00'),
(371, 40, '03 - Marzo', '2025', 1, 43000.00, '2025-02-18 00:00:00'),
(372, 28, '01 - Enero', '2025', 1, 43000.00, '2025-02-19 00:00:00'),
(373, 28, '02 - Febrero', '2025', 1, 43000.00, '2025-02-19 00:00:00'),
(374, 54, '01 - Enero', '2025', 1, 43000.00, '2025-02-19 00:00:00'),
(375, 54, '02 - Febrero', '2025', 1, 43000.00, '2025-02-19 00:00:00'),
(376, 27, '02 - Febrero', '2025', 1, 43000.00, '2025-02-20 00:00:00'),
(377, 43, '01 - Enero', '2025', 1, 45000.00, '2025-02-21 00:00:00'),
(378, 43, '02 - Febrero', '2025', 1, 45000.00, '2025-02-21 00:00:00'),
(379, 35, '01 - Enero', '2025', 1, 43000.00, '2025-02-21 00:00:00'),
(380, 35, '02 - Febrero', '2025', 1, 43000.00, '2025-02-21 00:00:00'),
(381, 48, '01 - Enero', '2025', 1, 4300.00, '2025-02-25 00:00:00'),
(382, 48, '02 - Febrero', '2025', 1, 43000.00, '2025-02-25 00:00:00'),
(383, 29, '03 - Marzo', '2025', 1, 43000.00, '2025-03-03 00:00:00'),
(384, 47, '01 - Enero', '2025', 1, 43000.00, '2025-03-04 00:00:00'),
(385, 47, '02 - Febrero', '2025', 1, 43000.00, '2025-03-04 00:00:00'),
(386, 46, '08 - Agosto', '2025', 1, 45000.00, '2025-03-04 00:00:00'),
(387, 46, '02 - Febrero', '2025', 1, 43000.00, '2025-03-04 00:00:00'),
(388, 46, '03 - Marzo', '2025', 1, 43000.00, '2025-03-04 00:00:00'),
(389, 46, '04 - Abril', '2025', 1, 45000.00, '2025-03-04 00:00:00'),
(390, 46, '05 - Mayo', '2025', 1, 45000.00, '2025-03-04 00:00:00'),
(391, 46, '06 - Junio', '2025', 1, 45000.00, '2025-03-04 00:00:00'),
(392, 46, '07 - Julio', '2025', 1, 45000.00, '2025-03-04 00:00:00'),
(393, 55, '01 - Enero', '2025', 1, 43000.00, '2025-03-04 00:00:00'),
(394, 55, '02 - Febrero', '2025', 1, 43000.00, '2025-03-04 00:00:00'),
(395, 42, '01 - Enero', '2025', 1, 10000.00, '2025-03-05 00:00:00'),
(396, 42, '02 - Febrero', '2025', 1, 10000.00, '2025-03-05 00:00:00'),
(397, 42, '03 - Marzo', '2025', 1, 10000.00, '2025-03-05 00:00:00'),
(398, 39, '01 - Enero', '2025', 1, 10000.00, '2025-03-05 00:00:00'),
(399, 39, '02 - Febrero', '2025', 1, 10000.00, '2025-03-05 00:00:00'),
(400, 39, '03 - Marzo', '2025', 1, 10000.00, '2025-03-05 00:00:00'),
(401, 39, '04 - Abril', '2025', 1, 14000.00, '2025-03-05 00:00:00'),
(402, 39, '05 - Mayo', '2025', 1, 14000.00, '2025-03-05 00:00:00'),
(403, 39, '06 - Junio', '2025', 1, 14000.00, '2025-03-05 00:00:00'),
(404, 39, '07 - Julio', '2025', 1, 14000.00, '2025-03-05 00:00:00'),
(405, 39, '08 - Agosto', '2025', 1, 14000.00, '2025-03-05 00:00:00'),
(406, 49, '03 - Marzo', '2025', 1, 43000.00, '2025-03-06 00:00:00'),
(407, 34, '01 - Enero', '2025', 1, 10000.00, '2025-03-05 00:00:00'),
(408, 34, '02 - Febrero', '2025', 1, 10000.00, '2025-03-05 00:00:00'),
(409, 52, '03 - Marzo', '2025', 1, 30000.00, '2025-03-07 00:00:00'),
(410, 52, '04 - Abril', '2025', 1, 20000.00, '2025-03-07 00:00:00'),
(411, 30, '03 - Marzo', '2025', 1, 43000.00, '2025-03-11 00:00:00'),
(412, 34, '03 - Marzo', '2025', 1, 10000.00, '2025-03-11 00:00:00'),
(413, 55, '03 - Marzo', '2025', 1, 43000.00, '2025-03-14 00:00:00'),
(414, 28, '03 - Marzo', '2025', 1, 43000.00, '2025-03-18 00:00:00'),
(415, 40, '04 - Abril', '2025', 1, 45000.00, '2025-03-19 00:00:00'),
(416, 26, '02 - Febrero', '2025', 1, 45000.00, '2025-03-21 00:00:00'),
(417, 27, '03 - Marzo', '2025', 1, 45000.00, '2025-03-25 00:00:00'),
(418, 36, '06 - Junio', '2025', 1, 45000.00, '2025-03-24 00:00:00'),
(419, 36, '07 - Julio', '2025', 1, 45000.00, '2025-03-24 00:00:00'),
(420, 36, '08 - Agosto', '2025', 1, 45000.00, '2025-03-24 00:00:00'),
(421, 36, '09 - Septiembre', '2025', 1, 45000.00, '2025-03-24 00:00:00'),
(422, 54, '03 - Marzo', '2025', 1, 45000.00, '2025-04-01 00:00:00'),
(423, 48, '03 - Marzo', '2025', 1, 45000.00, '2025-04-02 00:00:00'),
(424, 48, '04 - Abril', '2025', 1, 45000.00, '2025-04-02 00:00:00'),
(425, 55, '04 - Abril', '2025', 1, 45000.00, '2025-04-02 00:00:00'),
(426, 49, '04 - Abril', '2025', 1, 45000.00, '2025-04-02 00:00:00'),
(427, 29, '04 - Abril', '2025', 1, 45000.00, '2025-04-02 00:00:00'),
(428, 56, '03 - Marzo', '2025', 2, 75000.00, '2025-03-29 00:00:00'),
(429, 52, '05 - Mayo', '2025', 1, 40000.00, '2025-04-03 00:00:00'),
(430, 52, '06 - Junio', '2025', 1, 10000.00, '2025-04-03 00:00:00'),
(431, 51, '01 - Enero', '2025', 1, 43000.00, '2025-04-04 00:00:00'),
(432, 51, '02 - Febrero', '2025', 1, 43000.00, '2025-04-04 00:00:00'),
(433, 51, '03 - Marzo', '2025', 1, 45000.00, '2025-04-04 00:00:00'),
(434, 51, '04 - Abril', '2025', 1, 45000.00, '2025-04-04 00:00:00'),
(435, 33, '01 - Enero', '2025', 1, 15000.00, '2025-04-04 00:00:00'),
(436, 33, '02 - Febrero', '2025', 1, 15000.00, '2025-04-04 00:00:00'),
(437, 33, '03 - Marzo', '2025', 1, 15000.00, '2025-04-04 00:00:00'),
(438, 33, '04 - Abril', '2025', 1, 15000.00, '2025-04-04 00:00:00'),
(439, 33, '05 - Mayo', '2025', 1, 15000.00, '2025-04-04 00:00:00'),
(440, 33, '06 - Junio', '2025', 1, 5000.00, '2025-04-04 00:00:00'),
(441, 11, '04 - Abril', '2025', 6, 88000.00, '2025-04-04 00:00:00'),
(442, 46, '10 - Octubre', '2025', 1, 45000.00, '2025-04-10 00:00:00'),
(443, 46, '11 - Noviembre', '2025', 1, 45000.00, '2025-04-10 00:00:00'),
(444, 46, '12 - Diciembre', '2025', 1, 45000.00, '2025-04-10 00:00:00'),
(445, 30, '04 - Abril', '2025', 1, 45000.00, '2025-04-14 00:00:00'),
(446, 27, '04 - Abril', '2025', 1, 45000.00, '2025-04-30 00:00:00'),
(447, 42, '04 - Abril', '2025', 1, 15000.00, '2025-05-02 00:00:00'),
(448, 42, '05 - Mayo', '2025', 1, 15000.00, '2025-05-02 00:00:00'),
(449, 40, '05 - Mayo', '2025', 1, 45000.00, '2025-05-02 00:00:00'),
(450, 49, '05 - Mayo', '2025', 1, 45000.00, '2025-05-02 00:00:00'),
(451, 29, '05 - Mayo', '2025', 1, 45000.00, '2025-05-05 00:00:00'),
(452, 54, '04 - Abril', '2025', 1, 45000.00, '2025-05-08 00:00:00'),
(453, 54, '05 - Mayo', '2025', 1, 45000.00, '2025-05-08 00:00:00'),
(454, 53, '10 - Octubre', '2024', 1, 43000.00, '2025-05-07 00:00:00'),
(455, 53, '11 - Noviembre', '2024', 1, 43000.00, '2025-05-08 00:00:00'),
(456, 53, '12 - Diciembre', '2024', 1, 43000.00, '2025-05-07 00:00:00'),
(457, 53, '01 - Enero', '2025', 1, 43000.00, '2025-05-08 00:00:00'),
(458, 35, '03 - Marzo', '2025', 1, 43000.00, '2025-05-08 00:00:00'),
(459, 35, '04 - Abril', '2025', 1, 43000.00, '2025-05-08 00:00:00'),
(460, 48, '05 - Mayo', '2025', 1, 45000.00, '2025-05-08 00:00:00'),
(461, 30, '05 - Mayo', '2025', 1, 45000.00, '2025-05-12 00:00:00'),
(462, 56, '05 - Mayo', '2025', 1, 45000.00, '2025-05-14 00:00:00'),
(463, 55, '05 - Mayo', '2025', 1, 45000.00, '2025-05-15 00:00:00'),
(464, 40, '06 - Junio', '2025', 1, 45000.00, '2025-05-19 00:00:00'),
(465, 28, '04 - Abril', '2025', 1, 45000.00, '2025-05-19 00:00:00'),
(466, 43, '03 - Marzo', '2025', 1, 45000.00, '2025-05-19 00:00:00'),
(467, 43, '04 - Abril', '2025', 1, 45000.00, '2025-05-19 00:00:00'),
(468, 43, '05 - Mayo', '2025', 1, 45000.00, '2025-05-19 00:00:00'),
(469, 43, '06 - Junio', '2025', 1, 45000.00, '2025-05-19 00:00:00'),
(470, 27, '05 - Mayo', '2025', 1, 45000.00, '2025-05-20 00:00:00'),
(471, 31, '01 - Enero', '2025', 1, 45000.00, '2025-05-20 00:00:00'),
(472, 31, '02 - Febrero', '2025', 1, 45000.00, '2025-05-20 00:00:00'),
(473, 31, '03 - Marzo', '2025', 1, 45000.00, '2025-05-20 00:00:00'),
(474, 31, '04 - Abril', '2025', 1, 45000.00, '2025-05-20 00:00:00'),
(475, 29, '06 - Junio', '2025', 1, 45000.00, '2025-06-02 00:00:00'),
(476, 48, '06 - Junio', '2025', 1, 45000.00, '2025-06-02 00:00:00'),
(477, 49, '06 - Junio', '2025', 1, 45000.00, '2025-06-04 00:00:00'),
(478, 47, '03 - Marzo', '2025', 1, 45000.00, '2025-06-06 00:00:00'),
(479, 47, '04 - Abril', '2025', 1, 45000.00, '2025-06-06 00:00:00'),
(480, 30, '06 - Junio', '2025', 1, 45000.00, '2025-06-11 00:00:00'),
(481, 55, '06 - Junio', '2025', 1, 45000.00, '2025-06-16 00:00:00'),
(482, 28, '05 - Mayo', '2025', 1, 45000.00, '2025-06-18 00:00:00'),
(483, 43, '07 - Julio', '2025', 1, 45000.00, '2025-06-18 00:00:00'),
(484, 40, '07 - Julio', '2025', 1, 45000.00, '2025-06-19 00:00:00'),
(485, 56, '06 - Junio', '2025', 1, 45000.00, '2025-06-24 00:00:00'),
(486, 36, '10 - Octubre', '2025', 1, 43000.00, '2025-06-17 00:00:00'),
(487, 36, '11 - Noviembre', '2025', 1, 45000.00, '2025-06-17 00:00:00'),
(488, 36, '12 - Diciembre', '2025', 1, 45000.00, '2025-06-17 00:00:00'),
(489, 36, '10 - Octubre', '2025', 1, 2000.00, '2025-06-17 00:00:00'),
(490, 26, '03 - Marzo', '2025', 1, 45000.00, '2025-06-19 00:00:00'),
(491, 26, '04 - Abril', '2025', 1, 45000.00, '2025-06-30 00:00:00'),
(492, 28, '06 - Junio', '2025', 1, 45000.00, '2025-07-19 00:00:00'),
(493, 43, '08 - Agosto', '2025', 1, 45000.00, '2025-07-21 00:00:00'),
(494, 43, '09 - Septiembre', '2025', 1, 45000.00, '2025-07-21 00:00:00'),
(495, 29, '07 - Julio', '2025', 1, 45000.00, '2025-07-02 00:00:00'),
(496, 40, '08 - Agosto', '2025', 1, 45000.00, '2025-07-21 00:00:00'),
(497, 41, '04 - Abril', '2025', 1, 10000.00, '2025-07-10 00:00:00'),
(498, 41, '05 - Mayo', '2025', 1, 15000.00, '2025-07-10 00:00:00'),
(499, 41, '07 - Julio', '2025', 1, 15000.00, '2025-07-10 00:00:00'),
(500, 41, '06 - Junio', '2025', 1, 15000.00, '2025-07-10 00:00:00'),
(501, 41, '08 - Agosto', '2025', 1, 15000.00, '2025-07-10 00:00:00'),
(502, 41, '09 - Septiembre', '2025', 1, 15000.00, '2025-07-10 00:00:00'),
(503, 41, '10 - Octubre', '2025', 1, 15000.00, '2025-07-10 00:00:00'),
(504, 30, '07 - Julio', '2025', 1, 45000.00, '2025-07-11 00:00:00'),
(505, 48, '07 - Julio', '2025', 1, 45000.00, '2025-07-17 00:00:00'),
(506, 26, '05 - Mayo', '2025', 1, 45000.00, '2025-07-19 00:00:00'),
(507, 49, '07 - Julio', '2025', 1, 45000.00, '2025-07-04 00:00:00'),
(508, 54, '06 - Junio', '2025', 1, 45000.00, '2025-07-21 00:00:00'),
(509, 54, '07 - Julio', '2025', 1, 45000.00, '2025-07-21 00:00:00'),
(510, 55, '07 - Julio', '2025', 1, 45000.00, '2025-07-07 00:00:00'),
(511, 58, '07 - Julio', '2025', 2, 75000.00, '2025-07-14 00:00:00'),
(512, 57, '07 - Julio', '2025', 2, 75000.00, '2025-07-14 00:00:00'),
(513, 51, '05 - Mayo', '2025', 1, 45000.00, '2025-07-17 00:00:00'),
(514, 51, '07 - Julio', '2025', 1, 45000.00, '2025-07-17 00:00:00'),
(515, 56, '07 - Julio', '2025', 1, 45000.00, '2025-07-18 00:00:00'),
(516, 27, '06 - Junio', '2025', 1, 45000.00, '2025-07-18 00:00:00'),
(517, 27, '07 - Julio', '2025', 1, 45000.00, '2025-07-18 00:00:00'),
(518, 34, '04 - Abril', '2025', 1, 15000.00, '2025-07-29 00:00:00'),
(519, 34, '05 - Mayo', '2025', 1, 15000.00, '2025-07-29 00:00:00'),
(520, 34, '06 - Junio', '2025', 1, 10000.00, '2025-07-29 00:00:00'),
(521, 35, '05 - Mayo', '2025', 1, 45000.00, '2025-07-29 00:00:00'),
(522, 35, '07 - Julio', '2025', 1, 45000.00, '2025-07-29 00:00:00'),
(523, 57, '08 - Agosto', '2025', 1, 45000.00, '2025-08-01 00:00:00'),
(524, 58, '08 - Agosto', '2025', 1, 45000.00, '2025-08-01 00:00:00'),
(525, 48, '08 - Agosto', '2025', 1, 45000.00, '2025-08-04 00:00:00'),
(526, 49, '08 - Agosto', '2025', 1, 45000.00, '2025-08-05 00:00:00'),
(527, 58, '09 - Septiembre', '2025', 1, 45000.00, '2025-08-07 00:00:00'),
(528, 31, '05 - Mayo', '2025', 1, 45000.00, '2025-08-06 00:00:00'),
(529, 31, '06 - Junio', '2025', 1, 45000.00, '2025-08-06 00:00:00'),
(530, 31, '07 - Julio', '2025', 1, 45000.00, '2025-08-06 00:00:00'),
(531, 33, '07 - Julio', '2025', 1, 20000.00, '2025-08-06 00:00:00'),
(532, 33, '08 - Agosto', '2025', 1, 15000.00, '2025-08-06 00:00:00'),
(533, 33, '09 - Septiembre', '2025', 1, 15000.00, '2025-08-06 00:00:00'),
(534, 33, '09 - Septiembre', '2025', 1, 15000.00, '2025-08-06 00:00:00'),
(535, 33, '10 - Octubre', '2025', 1, 15000.00, '2025-08-06 00:00:00'),
(536, 33, '11 - Noviembre', '2025', 1, 15000.00, '2025-08-06 00:00:00'),
(537, 33, '12 - Diciembre', '2025', 1, 15000.00, '2025-08-06 00:00:00'),
(538, 29, '08 - Agosto', '2025', 1, 45000.00, '2025-08-07 00:00:00'),
(539, 51, '06 - Junio', '2025', 1, 45000.00, '2025-08-06 00:00:00'),
(540, 11, '08 - Agosto', '2025', 6, 218000.00, '2025-08-07 00:00:00'),
(541, 34, '06 - Junio', '2025', 1, 5000.00, '2025-08-07 00:00:00'),
(542, 34, '07 - Julio', '2025', 1, 10000.00, '2025-08-07 00:00:00'),
(543, 34, '07 - Julio', '2025', 1, 5000.00, '2025-08-07 00:00:00'),
(544, 26, '06 - Junio', '2025', 1, 45000.00, '2025-08-07 00:00:00'),
(545, 26, '07 - Julio', '2025', 1, 45000.00, '2025-08-07 00:00:00'),
(546, 30, '08 - Agosto', '2025', 1, 45000.00, '2025-08-11 00:00:00'),
(547, 47, '05 - Mayo', '2025', 1, 45000.00, '2025-08-12 00:00:00'),
(548, 47, '06 - Junio', '2025', 1, 45000.00, '2025-08-12 00:00:00'),
(549, 47, '07 - Julio', '2025', 1, 45000.00, '2025-08-12 00:00:00'),
(550, 47, '08 - Agosto', '2025', 1, 45000.00, '2025-08-12 00:00:00'),
(551, 55, '08 - Agosto', '2025', 1, 45000.00, '2025-08-20 00:00:00'),
(552, 40, '09 - Septiembre', '2025', 1, 45000.00, '2025-08-21 00:00:00'),
(553, 27, '08 - Agosto', '2025', 1, 45000.00, '2025-08-20 00:00:00'),
(554, 35, '06 - Junio', '2025', 1, 45000.00, '2025-08-25 00:00:00'),
(555, 35, '08 - Agosto', '2025', 1, 45000.00, '2025-08-25 00:00:00'),
(556, 29, '09 - Septiembre', '2025', 1, 45000.00, '2025-09-01 00:00:00'),
(557, 49, '09 - Septiembre', '2025', 1, 45000.00, '2025-09-03 00:00:00'),
(558, 26, '08 - Agosto', '2025', 1, 45000.00, '2025-09-01 00:00:00'),
(559, 57, '09 - Septiembre', '2025', 1, 45000.00, '2025-09-05 00:00:00'),
(560, 30, '09 - Septiembre', '2025', 1, 45000.00, '2025-09-11 00:00:00'),
(561, 28, '07 - Julio', '2025', 1, 45000.00, '2025-09-16 00:00:00'),
(562, 35, '09 - Septiembre', '2025', 1, 45000.00, '2025-09-23 00:00:00'),
(563, 35, '10 - Octubre', '2025', 1, 45000.00, '2025-09-23 00:00:00'),
(564, 40, '10 - Octubre', '2025', 1, 45000.00, '2025-09-23 00:00:00'),
(565, 54, '08 - Agosto', '2025', 1, 45000.00, '2025-09-23 00:00:00'),
(566, 54, '09 - Septiembre', '2025', 1, 45000.00, '2025-09-23 00:00:00'),
(567, 29, '10 - Octubre', '2025', 1, 45000.00, '2025-10-02 09:59:00'),
(568, 49, '10 - Octubre', '2025', 1, 45000.00, '2025-10-02 10:00:00'),
(569, 57, '10 - Octubre', '2025', 1, 45000.00, '2025-10-02 10:03:00'),
(570, 55, '09 - Septiembre', '2025', 1, 45000.00, '2025-10-07 10:04:00'),
(571, 55, '10 - Octubre', '2025', 1, 45000.00, '2025-10-07 10:04:00'),
(572, 43, '10 - Octubre', '2025', 1, 45000.00, '2025-10-10 10:07:00'),
(573, 11, '10 - Octubre', '2025', 6, 16000.00, '2025-10-10 10:07:00'),
(574, 30, '10 - Octubre', '2025', 1, 45000.00, '2025-10-13 10:08:00'),
(575, 26, '09 - Septiembre', '2025', 1, 45000.00, '2025-10-15 10:11:00'),
(576, 28, '08 - Agosto', '2025', 1, 45000.00, '2025-10-20 10:12:00'),
(577, 43, '11 - Noviembre', '2025', 1, 45000.00, '2025-10-20 10:15:00'),
(578, 43, '12 - Diciembre', '2025', 1, 45000.00, '2025-10-20 10:15:00'),
(579, 11, '10 - Octubre', '2025', 6, 7000.00, '2025-10-20 10:15:00'),
(580, 40, '11 - Noviembre', '2025', 1, 45000.00, '2025-10-20 10:16:00'),
(581, 56, '08 - Agosto', '2025', 1, 45000.00, '2025-10-20 10:17:00'),
(582, 56, '09 - Septiembre', '2025', 1, 45000.00, '2025-10-20 10:17:00'),
(583, 27, '09 - Septiembre', '2025', 1, 45000.00, '2025-10-21 10:17:00'),
(584, 11, '10 - Octubre', '2025', 6, 109000.00, '2025-10-29 10:19:00'),
(585, 29, '11 - Noviembre', '2025', 1, 45000.00, '2025-11-03 10:20:00'),
(586, 35, '11 - Noviembre', '2025', 1, 45000.00, '2025-11-03 10:20:00'),
(587, 35, '12 - Diciembre', '2025', 1, 45000.00, '2025-11-03 10:20:00'),
(588, 41, '11 - Noviembre', '2025', 1, 15000.00, '2025-10-01 10:25:00'),
(589, 41, '12 - Diciembre', '2025', 1, 15000.00, '2025-10-01 10:25:00'),
(590, 34, '08 - Agosto', '2025', 1, 15000.00, '2025-10-01 10:36:00'),
(591, 34, '09 - Septiembre', '2025', 1, 15000.00, '2025-10-01 10:37:00'),
(592, 51, '08 - Agosto', '2025', 1, 45000.00, '2025-08-08 10:40:00'),
(593, 49, '11 - Noviembre', '2025', 1, 45000.00, '2025-11-03 12:36:00'),
(594, 31, '08 - Agosto', '2025', 1, 45000.00, '2025-11-03 12:30:00'),
(595, 31, '09 - Septiembre', '2025', 1, 45000.00, '2025-11-03 12:31:00'),
(596, 31, '10 - Octubre', '2025', 1, 45000.00, '2025-11-03 12:32:00'),
(597, 40, '12 - Diciembre', '2025', 1, 45000.00, '2025-11-04 10:26:00'),
(598, 57, '11 - Noviembre', '2025', 1, 45000.00, '2025-11-06 12:42:00'),
(599, 51, '09 - Septiembre', '2025', 1, 45000.00, '2025-11-07 17:45:00'),
(600, 51, '10 - Octubre', '2025', 1, 45000.00, '2025-11-07 17:45:00'),
(601, 26, '10 - Octubre', '2025', 1, 45000.00, '2025-11-14 10:59:00'),
(602, 28, '09 - Septiembre', '2025', 1, 45000.00, '2025-11-18 11:00:00'),
(603, 28, '10 - Octubre', '2025', 1, 45000.00, '2025-11-18 11:01:00'),
(604, 31, '11 - Noviembre', '2025', 1, 45000.00, '2025-11-18 11:01:00'),
(605, 31, '12 - Diciembre', '2025', 1, 45000.00, '2025-11-18 11:01:00'),
(606, 58, '10 - Octubre', '2025', 1, 45000.00, '2025-11-18 11:02:00'),
(607, 11, '08 - Agosto', '2024', 1, 43000.00, '2024-08-15 00:00:00'),
(608, 11, 'Septiembre', '2024', 1, 43000.00, '2024-09-15 00:00:00'),
(609, 11, 'Octubre', '2024', 1, 43000.00, '2024-10-15 00:00:00'),
(610, 11, 'Noviembre', '2024', 1, 43000.00, '2024-11-15 00:00:00'),
(611, 11, '12 - Diciembre', '2024', 1, 43000.00, '2024-12-15 00:00:00'),
(612, 11, '01 - Enero', '2025', 1, 45000.00, '2025-01-03 00:00:00'),
(613, 11, '02 - Febrero', '2025', 1, 45000.00, '2025-02-03 00:00:00'),
(614, 11, '03 - Marzo', '2025', 1, 45000.00, '2025-03-03 00:00:00'),
(615, 11, '04 - Abril', '2025', 1, 45000.00, '2025-04-03 00:00:00'),
(616, 11, '05 - Mayo', '2025', 1, 45000.00, '2025-05-03 00:00:00'),
(617, 11, '06 - Junio', '2025', 1, 45000.00, '2025-06-03 00:00:00'),
(618, 11, '07 - Julio', '2025', 1, 45000.00, '2025-07-03 00:00:00'),
(619, 11, '08 - Agosto', '2025', 1, 45000.00, '2025-08-03 00:00:00'),
(620, 11, '09 - Septiembre', '2025', 1, 45000.00, '2025-09-03 00:00:00'),
(621, 11, '10 - Octubre', '2025', 1, 45000.00, '2025-10-03 00:00:00'),
(622, 11, '11 - Noviembre', '2025', 1, 45000.00, '2025-11-03 00:00:00'),
(623, 11, '12 - Diciembre', '2025', 1, 45000.00, '2025-11-03 00:00:00'),
(624, 27, '10 - Octubre', '2025', 1, 45000.00, '2025-11-19 17:03:00'),
(625, 30, '11 - Noviembre', '2025', 1, 45000.00, '2025-11-12 17:27:00'),
(626, 54, '10 - Octubre', '2025', 1, 45000.00, '2025-11-20 11:01:00'),
(627, 54, '11 - Noviembre', '2025', 1, 45000.00, '2025-11-20 11:01:00'),
(628, 39, '09 - Septiembre', '2025', 1, 15000.00, '2025-11-20 11:44:00'),
(629, 39, '10 - Octubre', '2025', 1, 15000.00, '2025-11-20 11:44:00'),
(630, 39, '11 - Noviembre', '2025', 1, 15000.00, '2025-11-20 11:44:00'),
(642, 53, '02 - Febrero', '2025', 1, 45000.00, '2025-11-28 19:30:00'),
(643, 53, '03 - Marzo', '2025', 1, 45000.00, '2025-11-28 19:30:00'),
(644, 53, '04 - Abril', '2025', 1, 45000.00, '2025-11-28 19:30:00'),
(645, 53, '05 - Mayo', '2025', 1, 45000.00, '2025-11-28 19:30:00'),
(646, 53, '06 - Junio', '2025', 1, 45000.00, '2025-11-28 19:30:00'),
(647, 53, '07 - Julio', '2025', 1, 45000.00, '2025-11-28 19:30:00'),
(648, 53, '08 - Agosto', '2025', 1, 45000.00, '2025-11-28 19:30:00'),
(649, 53, '09 - Septiembre', '2025', 1, 45000.00, '2025-11-28 19:30:00'),
(650, 53, '10 - Octubre', '2025', 1, 45000.00, '2025-11-28 19:30:00'),
(651, 53, '11 - Noviembre', '2025', 1, 45000.00, '2025-11-28 19:30:00'),
(652, 53, '12 - Diciembre', '2025', 1, 45000.00, '2025-11-28 19:30:00'),
(653, 39, '12 - Diciembre', '2025', 1, 15000.00, '2025-12-01 09:06:00'),
(654, 57, '12 - Diciembre', '2025', 1, 45000.00, '2025-12-01 09:07:00'),
(655, 29, '12 - Diciembre', '2025', 1, 45000.00, '2025-12-01 09:07:00'),
(656, 49, '12 - Diciembre', '2025', 1, 45000.00, '2025-12-02 09:08:00'),
(657, 47, '09 - Septiembre', '2025', 1, 45000.00, '2025-12-03 09:09:00'),
(658, 47, '10 - Octubre', '2025', 1, 45000.00, '2025-12-03 09:09:00'),
(659, 47, '11 - Noviembre', '2025', 1, 45000.00, '2025-12-03 09:10:00'),
(660, 47, '12 - Diciembre', '2025', 1, 45000.00, '2025-12-03 09:10:00'),
(661, 47, '11 - Noviembre', '2025', 3, 65000.00, '2025-12-03 09:10:00'),
(662, 42, '06 - Junio', '2025', 1, 15000.00, '2025-12-04 19:30:00'),
(663, 42, '07 - Julio', '2025', 1, 15000.00, '2025-12-04 19:30:00'),
(664, 42, '08 - Agosto', '2025', 1, 15000.00, '2025-12-04 19:30:00'),
(665, 42, '09 - Septiembre', '2025', 1, 15000.00, '2025-12-04 19:30:00'),
(666, 42, '10 - Octubre', '2025', 1, 15000.00, '2025-12-04 19:30:00'),
(667, 42, '11 - Noviembre', '2025', 1, 15000.00, '2025-12-04 19:30:00'),
(668, 42, '12 - Diciembre', '2025', 1, 15000.00, '2025-12-04 19:30:00'),
(669, 34, '10 - Octubre', '2025', 1, 15000.00, '2025-12-05 19:30:00'),
(670, 34, '11 - Noviembre', '2025', 1, 15000.00, '2025-12-05 19:30:00'),
(671, 34, '12 - Diciembre', '2025', 1, 15000.00, '2025-12-05 19:30:00'),
(672, 58, '11 - Noviembre', '2025', 6, 31500.00, '2025-12-05 18:08:00'),
(673, 55, '11 - Noviembre', '2025', 1, 45000.00, '2025-12-09 18:11:00'),
(674, 55, '12 - Diciembre', '2025', 1, 45000.00, '2025-12-09 18:11:00'),
(675, 51, '11 - Noviembre', '2025', 1, 45000.00, '2025-12-09 18:11:00'),
(676, 30, '12 - Diciembre', '2025', 1, 45000.00, '2025-12-11 12:20:00'),
(677, 58, '11 - Noviembre', '2025', 1, 45000.00, '2025-12-18 09:35:00'),
(678, 58, '12 - Diciembre', '2025', 1, 45000.00, '2025-12-18 09:35:00'),
(679, 28, '11 - Noviembre', '2025', 1, 45000.00, '2025-12-18 09:35:00'),
(680, 28, '12 - Diciembre', '2025', 1, 45000.00, '2025-12-18 09:35:00'),
(681, 56, '10 - Octubre', '2025', 1, 45000.00, '2025-12-18 14:04:00'),
(682, 56, '11 - Noviembre', '2025', 1, 45000.00, '2025-12-18 14:04:00'),
(683, 56, '12 - Diciembre', '2025', 1, 45000.00, '2025-12-18 14:04:00'),
(684, 27, '11 - Noviembre', '2025', 1, 45000.00, '2025-12-18 14:05:00'),
(685, 40, '01 - Enero', '2026', 1, 45000.00, '2025-12-19 19:35:00'),
(686, 26, '11 - Noviembre', '2025', 1, 45000.00, '2025-12-23 13:41:00'),
(687, 54, '12 - Diciembre', '2025', 1, 45000.00, '2025-12-23 14:13:00'),
(688, 51, '12 - Diciembre', '2025', 1, 45000.00, '2025-12-23 15:46:00'),
(689, 29, '01 - Enero', '2026', 1, 45000.00, '2026-01-05 12:51:00'),
(690, 49, '01 - Enero', '2026', 1, 45000.00, '2026-01-05 12:51:00'),
(691, 59, '01 - Enero', '2026', 1, 45000.00, '2026-01-06 12:52:00'),
(692, 59, '02 - Febrero', '2026', 1, 45000.00, '2026-01-06 12:52:00'),
(693, 30, '01 - Enero', '2026', 1, 45000.00, '2026-01-15 16:54:00'),
(694, 40, '02 - Febrero', '2026', 1, 45000.00, '2026-01-20 11:27:00'),
(695, 27, '12 - Diciembre', '2025', 1, 45000.00, '2026-01-20 11:27:00'),
(696, 45, '01 - Enero', '2025', 1, 15000.00, '2025-11-28 19:30:00'),
(697, 45, '02 - Febrero', '2025', 1, 15000.00, '2025-11-28 19:30:00'),
(698, 45, '03 - Marzo', '2025', 1, 15000.00, '2025-11-28 19:30:00'),
(699, 45, '04 - Abril', '2025', 1, 15000.00, '2025-11-28 19:30:00'),
(700, 45, '05 - Mayo', '2025', 1, 15000.00, '2025-11-28 19:30:00'),
(701, 45, '06 - Junio', '2025', 1, 15000.00, '2025-11-28 19:30:00'),
(702, 45, '07 - Julio', '2025', 1, 15000.00, '2025-11-28 19:30:00'),
(703, 45, '08 - Agosto', '2025', 1, 15000.00, '2025-11-28 19:30:00'),
(704, 45, '09 - Septiembre', '2025', 1, 15000.00, '2025-11-28 19:30:00'),
(705, 45, '10 - Octubre', '2025', 1, 15000.00, '2025-11-28 19:30:00'),
(706, 57, '01 - Enero', '2026', 1, 45000.00, '2026-01-07 11:31:00'),
(707, 11, '01 - Enero', '2026', 1, 45000.00, '2026-01-05 10:47:00'),
(708, 58, '01 - Enero', '2026', 8, 10000.00, '2026-01-26 20:35:00'),
(709, 41, '01 - Enero', '2026', 8, 20000.00, '2026-01-21 20:41:00'),
(710, 59, '01 - Enero', '2026', 8, 20000.00, '2026-01-23 20:42:00'),
(711, 7, '01 - Enero', '2026', 8, 20000.00, '2026-01-26 20:43:00'),
(712, 45, '01 - Enero', '2026', 8, 20000.00, '2026-01-26 00:21:00'),
(713, 53, '01 - Enero', '2026', 8, 20000.00, '2026-01-26 00:21:00'),
(714, 11, '01 - Enero', '2026', 8, 20000.00, '2026-01-26 00:21:00'),
(715, 49, '01 - Enero', '2026', 8, 10000.00, '2026-01-26 00:22:00'),
(716, 26, '12 - Diciembre', '2025', 1, 45000.00, '2026-01-27 00:22:00'),
(717, 26, '01 - Enero', '2026', 8, 10000.00, '2026-01-27 00:23:00'),
(718, 51, '01 - Enero', '2026', 8, 20000.00, '2026-01-27 00:24:00'),
(719, 31, '01 - Enero', '2026', 8, 20000.00, '2026-01-27 00:24:00'),
(720, 35, '01 - Enero', '2026', 8, 10000.00, '2026-01-27 00:25:00'),
(721, 55, '01 - Enero', '2026', 8, 10000.00, '2026-01-29 00:25:00'),
(722, 55, '01 - Enero', '2026', 1, 45000.00, '2026-01-29 00:25:00'),
(723, 55, '02 - Febrero', '2026', 1, 45000.00, '2026-01-29 00:26:00'),
(724, 35, '01 - Enero', '2026', 7, 45000.00, '2026-01-28 00:28:00'),
(725, 49, '01 - Enero', '2026', 7, 45000.00, '2026-01-28 00:28:00'),
(726, 55, '01 - Enero', '2026', 7, 45000.00, '2026-01-28 00:29:00'),
(727, 7, '01 - Enero', '2026', 7, 45000.00, '2026-01-28 00:30:00'),
(728, 59, '01 - Enero', '2026', 7, 45000.00, '2026-01-28 00:32:00'),
(729, 36, '01 - Enero', '2026', 7, 45000.00, '2026-01-28 00:35:00'),
(730, 46, '01 - Enero', '2026', 7, 45000.00, '2026-01-28 00:40:00'),
(731, 11, '01 - Enero', '2026', 7, 45000.00, '2026-01-29 00:44:00'),
(732, 43, '01 - Enero', '2026', 8, 20000.00, '2026-01-29 10:05:00'),
(733, 36, '01 - Enero', '2026', 1, 45000.00, '2026-01-26 19:30:00'),
(734, 36, '02 - Febrero', '2026', 1, 45000.00, '2026-01-26 19:30:00'),
(735, 36, '03 - Marzo', '2026', 1, 45000.00, '2026-01-26 19:30:00'),
(736, 36, '04 - Abril', '2026', 1, 45000.00, '2026-01-26 19:30:00'),
(737, 36, '05 - Mayo', '2026', 1, 45000.00, '2026-01-26 19:30:00'),
(738, 36, '06 - Junio', '2026', 1, 45000.00, '2026-01-26 19:30:00'),
(739, 42, '01 - Enero', '2026', 7, 45000.00, '2026-01-30 14:21:00'),
(740, 45, '01 - Enero', '2026', 7, 45000.00, '2026-01-30 17:13:00'),
(741, 11, '01 - Enero', '2026', 7, 250000.00, '2026-01-30 19:03:00'),
(742, 29, '02 - Febrero', '2026', 1, 45000.00, '2026-02-02 19:04:00');
INSERT INTO `entradadinero` (`id_Entrada`, `id_User`, `entrada_Mes`, `entrada_Ano`, `entrada_Motivo`, `entrada_Monto`, `entrada_MovimientoFecha`) VALUES
(743, 57, '01 - Enero', '2026', 8, 20000.00, '2026-02-02 19:06:00'),
(744, 49, '02 - Febrero', '2026', 1, 45000.00, '2026-02-03 19:07:00'),
(745, 57, '02 - Febrero', '2026', 7, 45000.00, '2026-02-10 19:42:00'),
(746, 57, '02 - Febrero', '2026', 1, 45000.00, '2026-02-02 19:43:00'),
(747, 28, '02 - Febrero', '2026', 7, 45000.00, '2026-02-10 00:39:00'),
(748, 31, '02 - Febrero', '2026', 7, 45000.00, '2026-02-10 00:39:00'),
(749, 34, '02 - Febrero', '2026', 7, 45000.00, '2026-02-06 00:43:00'),
(750, 31, '02 - Febrero', '2026', 7, 45000.00, '2026-02-11 18:00:00'),
(751, 28, '02 - Febrero', '2026', 7, 45000.00, '2026-02-11 18:01:00'),
(752, 30, '02 - Febrero', '2026', 1, 45000.00, '2026-02-11 18:01:00'),
(753, 54, '01 - Enero', '2026', 1, 45000.00, '2026-02-17 18:02:00'),
(754, 54, '02 - Febrero', '2026', 1, 45000.00, '2026-02-17 18:03:00'),
(755, 54, '02 - Febrero', '2026', 7, 45000.00, '2026-02-17 18:03:00'),
(756, 58, '02 - Febrero', '2026', 7, 45000.00, '2026-02-17 18:03:00'),
(757, 27, '01 - Enero', '2026', 1, 45000.00, '2026-02-18 10:16:00'),
(758, 27, '02 - Febrero', '2026', 8, 20000.00, '2026-02-18 10:17:00'),
(759, 40, '03 - Marzo', '2026', 1, 45000.00, '2026-02-19 17:39:00'),
(760, 40, '02 - Febrero', '2026', 7, 45000.00, '2026-02-19 17:39:00'),
(761, 29, '02 - Febrero', '2026', 7, 45000.00, '2026-02-19 17:40:00'),
(762, 43, '01 - Enero', '2026', 1, 45000.00, '2026-02-19 17:42:00'),
(763, 43, '02 - Febrero', '2026', 1, 45000.00, '2026-02-19 17:42:00'),
(764, 33, '01 - Enero', '2026', 7, 45000.00, '2026-01-30 17:43:00'),
(765, 46, '01 - Enero', '2026', 1, 45000.00, '2026-02-11 22:30:00'),
(766, 46, '02 - Febrero', '2026', 1, 45000.00, '2026-02-11 22:30:00'),
(767, 46, '03 - Marzo', '2026', 1, 45000.00, '2026-02-11 22:30:00'),
(768, 46, '04 - Abril', '2026', 1, 45000.00, '2026-02-11 22:30:00'),
(769, 46, '05 - Mayo', '2026', 1, 45000.00, '2026-02-11 22:30:00'),
(770, 46, '06 - Junio', '2026', 1, 45000.00, '2026-02-11 22:30:00'),
(771, 46, '07 - Julio', '2026', 1, 45000.00, '2026-02-11 22:30:00'),
(772, 46, '08 - Agosto', '2026', 1, 45000.00, '2026-02-11 22:30:00'),
(773, 46, '09 - Septiembre', '2026', 1, 45000.00, '2026-02-11 22:30:00'),
(774, 46, '10 - Octubre', '2026', 1, 45000.00, '2026-02-11 22:30:00'),
(775, 46, '11 - Noviembre', '2026', 1, 45000.00, '2026-02-11 22:30:00'),
(776, 46, '12 - Diciembre', '2026', 1, 45000.00, '2026-02-11 22:30:00'),
(777, 56, '01 - Enero', '2026', 1, 45000.00, '2026-02-19 23:31:00'),
(778, 56, '02 - Febrero', '2026', 7, 45000.00, '2026-02-20 23:31:00'),
(779, 39, '02 - Febrero', '2026', 7, 45000.00, '2026-02-20 23:32:00'),
(780, 49, '03 - Marzo', '2026', 1, 45000.00, '2026-03-02 11:54:00'),
(781, 57, '03 - Marzo', '2026', 1, 45000.00, '2026-03-03 11:54:00'),
(782, 29, '03 - Marzo', '2026', 1, 45000.00, '2026-03-04 11:55:00'),
(783, 59, '03 - Marzo', '2026', 1, 45000.00, '2026-03-04 11:56:00'),
(784, 30, '03 - Marzo', '2026', 1, 45000.00, '2026-03-11 11:56:00'),
(785, 59, '04 - Abril', '2026', 1, 10000.00, '2026-03-05 00:49:00'),
(786, 7, '01 - Enero', '2026', 1, 45000.00, '2026-03-12 11:38:00'),
(787, 7, '02 - Febrero', '2026', 1, 45000.00, '2026-03-12 11:39:00'),
(788, 7, '03 - Marzo', '2026', 1, 45000.00, '2026-03-12 11:39:00'),
(789, 7, '04 - Abril', '2026', 1, 45000.00, '2026-03-12 11:40:00'),
(790, 7, '05 - Mayo', '2026', 1, 45000.00, '2026-03-12 11:40:00'),
(791, 7, '06 - Junio', '2026', 1, 45000.00, '2026-03-12 11:40:00'),
(792, 7, '07 - Julio', '2026', 1, 45000.00, '2026-03-12 11:41:00'),
(793, 7, '08 - Agosto', '2026', 1, 45000.00, '2026-03-12 11:41:00'),
(794, 33, '01 - Enero', '2026', 1, 10000.00, '2026-03-12 11:41:00'),
(795, 33, '02 - Febrero', '2026', 1, 10000.00, '2026-03-12 11:42:00'),
(796, 33, '03 - Marzo', '2026', 1, 10000.00, '2026-03-12 11:42:00'),
(797, 33, '04 - Abril', '2026', 1, 10000.00, '2026-03-12 11:42:00'),
(798, 33, '05 - Mayo', '2026', 1, 10000.00, '2026-03-12 11:43:00'),
(799, 33, '06 - Junio', '2026', 1, 10000.00, '2026-03-12 11:43:00'),
(800, 33, '07 - Julio', '2026', 1, 10000.00, '2026-03-12 11:43:00'),
(801, 33, '08 - Agosto', '2026', 1, 10000.00, '2026-03-12 11:43:00'),
(802, 33, '09 - Septiembre', '2026', 1, 10000.00, '2026-03-12 11:44:00'),
(803, 33, '10 - Octubre', '2026', 1, 10000.00, '2026-03-12 11:44:00'),
(804, 33, '11 - Noviembre', '2026', 1, 10000.00, '2026-03-12 11:44:00'),
(805, 33, '12 - Diciembre', '2026', 1, 10000.00, '2026-03-12 11:45:00'),
(806, 34, '01 - Enero', '2026', 1, 20000.00, '2026-03-17 13:11:00'),
(807, 34, '02 - Febrero', '2026', 1, 20000.00, '2026-03-17 13:12:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `entradamotivo`
--

CREATE TABLE `entradamotivo` (
  `id_Motivo` int NOT NULL,
  `name_Motivo` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf16;

--
-- Volcado de datos para la tabla `entradamotivo`
--

INSERT INTO `entradamotivo` (`id_Motivo`, `name_Motivo`) VALUES
(1, 'Cuota'),
(2, 'Derechos ingreso'),
(3, 'Derechos aumento salario'),
(4, 'Derechos exaltación'),
(5, 'Otros aportes '),
(6, 'Hospitalario'),
(7, 'Fondo Pro-Templo'),
(8, 'Paseo Logial');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `evento`
--

CREATE TABLE `evento` (
  `id_Evento` int NOT NULL,
  `nombre_Evento` varchar(250) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NOT NULL,
  `trabajo_Evento` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NOT NULL,
  `fecha_Evento` date DEFAULT NULL,
  `inicio_Evento` time DEFAULT NULL,
  `fin_Evento` time DEFAULT NULL,
  `cat_Evento` int DEFAULT NULL,
  `estado_Evento` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf16;

--
-- Volcado de datos para la tabla `evento`
--

INSERT INTO `evento` (`id_Evento`, `nombre_Evento`, `trabajo_Evento`, `fecha_Evento`, `inicio_Evento`, `fin_Evento`, `cat_Evento`, `estado_Evento`) VALUES
(1, 'Tenida 1°', 'Mensaje del VM:. \"Desafíos de la FrancMasonería\"', '2023-03-09', '20:00:00', '23:59:00', 1, 1),
(2, 'Tenida 2°', 'La Lógica', '2023-03-16', '20:00:00', '23:59:00', 2, 1),
(3, 'Tenida 1°', 'El Ritual en función del Rito; Conceptos y aspectos masónicos', '2023-03-30', '20:00:00', '23:59:00', 1, 1),
(4, 'Tenida 1°', 'Integración Americana', '2023-04-13', '20:00:00', '23:59:00', 1, 1),
(5, 'Tenida 2°', 'La verdad como concepto masónico', '2023-04-20', '20:00:00', '23:59:00', 2, 1),
(6, 'Tenida 1°', 'La Exaltación del Trabajo Masónico; Actividad de Realización Moral, Social y Progresista.', '2023-05-04', '20:00:00', '23:59:00', 1, 1),
(7, 'Tenida 2ª', 'El Concepto de Pueblo', '2023-09-21', '20:00:00', '23:59:00', 2, 1),
(8, 'Tenida 1ª', 'Las Pruebas Iniciáticas; Purificaciones', '2023-09-14', '20:00:00', '23:59:00', 1, 1),
(9, 'Tenida 3º', 'Reunión Administrativa.', '2023-09-28', '20:00:00', '23:59:00', 3, 1),
(10, 'Tenida 2º', 'Asistencia Fraternal a los Hermanos', '2023-10-05', '20:00:00', '23:59:00', 2, 1),
(11, 'Tenida 1º', 'Encuentro de dos Mundos', '2023-10-12', '20:00:00', '23:59:00', 1, 1),
(12, 'Tenida 1º', 'Aniversario Logia Caleuche 250', '2023-10-19', '20:00:00', '23:59:00', 1, 1),
(13, 'Tenida 3º', 'Objetivos y Futuro de la Logia Caleuche 250', '2023-10-26', '20:00:00', '23:59:00', 3, 1),
(14, 'Tenida 2º', 'Fiesta del Compañero', '2023-11-02', '20:00:00', '23:59:00', 2, 1),
(15, 'Tenida 1º', 'Fiesta del Aprendiz', '2023-11-09', '20:00:00', '23:59:00', 1, 1),
(16, 'Tenida 3º', 'Fiesta del Maestro', '2023-11-16', '20:00:00', '23:59:00', 3, 1),
(17, 'Tenida 3º', 'Elecciones de Oficiales', '2023-11-23', '20:00:00', '23:59:00', 3, 1),
(18, 'Tenida 1º', 'Reunión Fraternal', '2023-11-30', '20:00:00', '23:59:00', 1, 1),
(19, 'Tenida 1º', 'Conmemoración Declaración Universal de los Derechos Humanos.', '2023-12-07', '20:00:00', '23:59:00', 1, 1),
(20, 'Tenida 1º', 'Solsticio de Verano', '2023-12-15', '20:00:00', '23:59:00', 1, 1),
(21, 'Tenida 1º', 'Instalación Nueva Oficialidad (2024-2025)', '2023-12-13', '20:00:00', '23:59:00', 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `feed`
--

CREATE TABLE `feed` (
  `id_Feed` int NOT NULL,
  `titulo_Feed` varchar(150) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci DEFAULT NULL,
  `category_Feed` int DEFAULT NULL,
  `file_name` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci DEFAULT NULL,
  `cont_Feed` varchar(3000) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci DEFAULT NULL,
  `user_Feed` int DEFAULT NULL,
  `estado_Feed` int DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf16;

--
-- Volcado de datos para la tabla `feed`
--

INSERT INTO `feed` (`id_Feed`, `titulo_Feed`, `category_Feed`, `file_name`, `cont_Feed`, `user_Feed`, `estado_Feed`, `created_at`) VALUES
(1, 'Testing 1', 1, '1145-testing-02.png', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.', 11, 0, '2023-04-17 20:19:53'),
(2, 'Testing 2', 1, '1776-testing-02.png', 'Prueba Blog', 11, 0, '2023-04-18 02:42:08'),
(3, 'Primera Iniciación', 1, '4038-WhatsApp Image 2023-09-08 at 14.58.16.jpeg', 'Iniciación del QH:. José Álvaro Águila Seguel', 11, 1, '2023-09-08 22:11:32'),
(4, 'Primera Fiesta Blanca', 1, '2604-tenida-blanca.jpeg', 'El 21 de octubre de 2023, festejamos nuestra primera Fiesta Blanca.', 11, 1, '2023-10-22 22:59:40'),
(5, 'Ágape post Fiesta Blanca', 3, '1727-post-fiesta-blanca.jpeg', 'Ágape post Nuestra Primera Fiesta Blanca, anfitriones Flia. Torres.', 11, 1, '2023-10-22 23:07:34'),
(6, 'RL \"Estrella Insular\" Nº 78 de Ancud conmemora 82º aniversario', 3, '6548-estrella78.jpeg', 'En su octogésimo segundo aniversario de la RL \"Estrella Insular\" Nº 78 de Ancud, en solemne Tenida, dirigida por su VM Ernesto Solís Romero, contó con presencia del GDJ del GM, Marco Vargas Gallardo; el VM de la RL \"Caleuche\" Nº 250 del valle de Castro, Francisco Torres Osorio, quien fue acompañado por una delegación de QQHH Maestros y Aprendices. ', 11, 1, '2023-10-14 02:10:25'),
(7, 'Primera Fiesta del Aprendiz', 1, '5202-aprendizfiesta.jpg', 'Primera Fiesta del Aprendiz como Logia Justa y Perfecta.', 11, 1, '2023-12-09 05:02:51'),
(8, 'Primer Paseo Logial', 3, '6725-PHOTO-2024-01-28-19-28-14.jpg', 'Con gran regocijo y fraternal camaradería, la Respetable Logia Caleuche 250 se complace en compartir el emocionante relato de nuestro primer paseo Logial en la entrañable casa del QH:. Dante Montiel. Este encuentro trascendental no solo reforzó los lazos que unen a nuestros respetados hermanos, sino que también proporcionó un espacio de convivencia especial al incluir a nuestras queridas familias y amigos.\r\nBajo el cielo estrellado que abrazó nuestro paseo, experimentamos momentos de profunda conexión y reflexión, enriqueciendo así nuestra vida fraternal. La presencia de nuestros seres queridos agregó un toque especial, fortaleciendo la fraternidad que siempre ha caracterizado a nuestra amada logia.', 11, 1, '2024-01-29 16:59:06'),
(9, '¿POR QUE SOY MASON?', 5, '7938-POR QUE SOY MASON.docx', '¿POR QUE SOY MASON?\r\nA esta pregunta le deberíamos dar respuesta todos los días a fin de nunca olvidar las razones que nos llevaron a pertenecer a la masonería\r\nQuiero compartir con mis QQHH, la respuesta que da el QH LUIS UMBERT SANTOS,  a esta interrogante:\r\n“Por que soy hombre libre y de buenas costumbres, porque me subyuga el amor, porque me ensimisma la belleza,  porque me emociona la libertad, porque voy detrás de la justicia y anhelo la felicidad de la humanidad.\r\n Y la satisfacción de tan elevados ideales solo se encuentra en el seno de la francmasonería.\r\nLa francmasonería es la síntesis de la vida.\r\nNo escapa nada a ella.\r\nPara vivir necesita la savia del progreso que arranca muy abajo, que viene de muy lejos y que se manifiesta en la flor del pensamiento, en la cúspide de la acción , en la entraña del progreso, en las fulguraciones del ideal, en las realizaciones del ideal.\r\nPor eso es la única institución que puede y ha podido vivir a través de los siglos , de las pasiones y de las tragedias humanas.\r\nSu moral no es una moral, es la de cada pueblo, la de cada tiempo, la de cada civilización, la de la cultura.\r\n Gracias a eso no estamos encadenados a una época, ni a una religión...”\r\n“por eso nuestra obra es renovación constante. No tenemos el derecho de detenernos ante el tiempo, ni ante el espacio.\r\nPor eso seremos eternos y por ello nuestra actitud ha sido y será la de combate. Nuevos quijotes, somos caballeros andantes; nuestro camino es el mundo, quizás el universo . los que se sientan a limpiarse el sudor a mitad del camino, fatigados de la empresa y de la jornada, no son masones; lo son quienes sucumben en pleno movimiento, en recia batalla...”\r\n“la francmasonería no es solo el conocimiento de símbolos y liturgias y de medios de conocimientos. Esto es interesante al mason, no interesa a la humanidad, lo que a esta preocupa es el provecho, el rendimiento en verdad, en felicidad, que le proporcionamos con nuestra actuación. El trabajo que desarrollamos es infecundo por falta de conocimientos de la francmasonería.\r\nLo que nosotros necesitamos es hacernos sentir por el bien que desarrollamos en bien de la humanidad entera; bien de libertad, de cultura, de enseñanza, de virtud, de sacrificio, de educación, de carácter, de energía, de saludable fraternidad y de bien social...”\r\nFragmentos extraídos del libro “¿Por qué soy Mason?, escrito por el QH LUIS UMBERT SANTOS.\r\nEspero que sea de provecho para mis QQHH, y tema de reflexión que nos permita continuar nuestra labor sin perder el rumbo que nos marca el Gran Arquitecto del Universo.\r\n', 53, 0, '2024-12-03 18:24:13'),
(10, '¿POR QUE SOY MASON?', 5, '7203-POR QUE SOY MASON.docx', '¿POR QUE SOY MASON?\r\nA esta pregunta le deberíamos dar respuesta todos los días a fin de nunca olvidar las razones que nos llevaron a pertenecer a la masonería\r\nQuiero compartir con mis QQHH, la respuesta que da el QH LUIS UMBERT SANTOS, a esta interrogante:\r\n“Por qué soy hombre libre y de buenas costumbres, porque me subyuga el amor, porque me ensimisma la belleza, porque me emociona la libertad, porque voy detrás de la justicia y anhelo la felicidad de la humanidad.\r\n Y la satisfacción de tan elevados ideales solo se encuentra en el seno de la francmasonería.\r\nLa francmasonería es la síntesis de la vida.\r\nNo escapa nada a ella.\r\nPara vivir necesita la savia del progreso que arranca muy abajo, que viene de muy lejos y que se manifiesta en la flor del pensamiento, en la cúspide de la acción, en la entraña del progreso, en las fulguraciones del ideal, en las realizaciones del ideal.\r\nPor eso es la única institución que puede y ha podido vivir a través de los siglos, de las pasiones y de las tragedias humanas.\r\nSu moral no es una moral, es la de cada pueblo, la de cada tiempo, la de cada civilización, la de la cultura.\r\n Gracias a eso no estamos encadenados a una época, ni a una religión...”\r\n“por eso nuestra obra es renovación constante. No tenemos el derecho de detenernos ante el tiempo, ni ante el espacio.\r\nPor eso seremos eternos y por ello nuestra actitud ha sido y será la de combate. Nuevos quijotes, somos caballeros andantes; nuestro camino es el mundo, quizás el universo. los que se sientan a limpiarse el sudor a mitad del camino, fatigados de la empresa y de la jornada, no son masones; lo son quienes sucumben en pleno movimiento, en recia batalla...”\r\n“la francmasonería no es solo el conocimiento de símbolos y liturgias y de medios de conocimientos. Esto es interesante al masón, no interesa a la humanidad, lo que a esta preocupa es el provecho, el rendimiento en verdad, en felicidad, que le proporcionamos con nuestra actuación. El trabajo que desarrollamos es infecundo por falta de conocimientos de la francmasonería.\r\nLo que nosotros necesitamos es hacernos sentir por el bien que desarrollamos en bien de la humanidad entera; bien de libertad, de cultura, de enseñanza, de virtud, de sacrificio, de educación, de carácter, de energía, de saludable fraternidad y de bien social...”\r\nFragmentos extraídos del libro “¿Por qué soy Mason?, escrito por el QH LUIS UMBERT SANTOS.\r\nEspero que sea de provecho para mis QQHH, y tema de reflexión que nos permita continuar nuestra labor sin perder el rumbo que nos marca el Gran Arquitecto del Universo.\r\n\r\nS:.F:.U:.    L:.I:.F:.\r\n', 53, 1, '2024-12-03 18:28:18'),
(11, 'El perfeccionamiento como objetivo permanente', 2, '2315-El perfeccionamiento como objetivo permanente.pdf', 'El perfeccionamiento como objetivo permanente es uno de los pilares fundamentales de la masonería. Como aprendices, nos embarcamos en un viaje de autodescubrimiento y mejora continua, buscando pulir nuestra piedra bruta para convertirnos en mejores versiones de nosotros mismos. Este camino no tiene un final definido, sino que es un proceso constante que nos acompaña a lo largo de toda nuestra vida masónica y personal.', 53, 1, '2024-12-03 18:30:46'),
(12, 'Andrés Bello y la Masonería: Un Tema de Debate Histórico', 5, '8873-andres bello.png', 'La relación de Andrés Bello con la francmasonería ha sido objeto de debate entre historiadores y estudiosos de su vida, diversos aspectos de su trayectoria sugieren posibles vínculos con esta organización. A continuación, se exploran algunos puntos clave:\r\n\r\nVínculos de Bello con masones reconocidos\r\n\r\nFrancisco de Miranda\r\n\r\nFrancisco de Miranda, figura prominente de la masonería y precursor de la independencia americana, desempeñó un papel crucial en la difusión de los ideales de la Ilustración en América Latina. Fundador de la Gran Reunión Americana, sociedad secreta con fuertes raíces masónicas, Miranda promovió valores como la libertad, la igualdad y la fraternidad.\r\n\r\nEntre 1810 y 1811, Bello trabajó como secretario de Miranda en Londres, mientras este lideraba movimientos independentistas. Durante este período, Bello estuvo expuesto a los principios y valores que Miranda defendía, muchos de los cuales se alineaban con los ideales masónicos. Aunque no existen pruebas directas de que Bello se uniera formalmente a la masonería bajo la influencia de Miranda, su cercanía con esta figura ha dado pie a especulaciones sobre su posible afiliación.\r\n\r\nSimón Bolívar\r\n\r\nSimón Bolívar, iniciado en la masonería en la Logia Lautaro de Cádiz en 1803, fue un destacado líder masónico y figura clave en la independencia de América Latina.\r\n\r\nBello y Bolívar compartieron una amistad desde su juventud en Caracas, donde estudiaron bajo la guía de Simón Rodríguez. Ambos mostraron interés en la literatura, la filosofía y las ideas ilustradas. En 1810, Bello acompañó a Bolívar y a Luis López Méndez a Londres como parte de una misión diplomática para buscar apoyo británico en la independencia venezolana. Este viaje fortaleció sus vínculos y expuso a Bello a las ideas masónicas presentes en el entorno de Bolívar.\r\n\r\nEl entorno masónico en Londres\r\nDurante su estancia en Londres, Bello frecuentó círculos intelectuales y políticos impregnados de ideas masónicas. La ciudad era un epicentro de actividad masónica y revolucionaria en la época, y las logias servían como espacios para la planificación de movimientos republicanos e independentistas.\r\n\r\nEn este contexto, Bello tuvo contacto con líderes latinoamericanos como Bernardo O’Higgins y José de San Martín, conocidos por su afiliación masónica. Sin embargo, no se dispone de registros que confirmen la participación directa de Bello en estas logias.\r\n\r\nLos Caballeros Racionales\r\nFue Iniciado en la Logia «Los Caballeros Racionales», que funcionaba en Londres, en 1811. Años más tarde fue Venerable Maestro de esa Logia. También se encuentra en el famoso libro de Bartolomé Mitre, «Los Caballeros Racionales». Como se sabe Bartolomé Mitre, fue presidente de Argentina y un destacado dirigente masón de ese país. Acerca de la vida masónica en Londres, de Andrés Bello, hay otros libros. En ellos se afirma que se inició en la masonería junto a Luis López Méndez, su compañero de viaje, en la misión diplomática encargada por la Junta ', 53, 1, '2025-01-20 14:36:26'),
(13, 'La Fraternidad', 2, '3852-La fraternidad.docx', 'La fraternidad masónica es uno de los pilares fundamentales que sostienen la estructura moral y filosófica de nuestra institución. Más allá de ser un concepto abstracto, representa un compromiso activo y constante con nuestros hermanos y con la humanidad en su conjunto. En el marco de la Masonería, la fraternidad no se limita a un vínculo de camaradería, sino que se erige como un deber sagrado, un principio rector que guía nuestras acciones y pensamientos.\r\n\r\nPara el Aprendiz, la fraternidad es una piedra angular sobre la cual se construye su progreso masónico. Es un lazo que trasciende las diferencias y nos une en un propósito común: el auto-descubrimiento, la búsqueda de la verdad, la justicia y el bienestar colectivo. Esta virtud, lejos de ser innata, se cultiva mediante la práctica constante, la reflexión y el compromiso con los valores masónicos.\r\n\r\nEn esta plancha, exploraremos el concepto de fraternidad desde sus raíces filosóficas y morales, analizando su relevancia en el contexto masónico y en la vida cotidiana. Reflexionaremos sobre cómo esta virtud, al ser ejercida con constancia y dedicación, se convierte en un faro que ilumina nuestro camino iniciático y nos permite contribuir a la construcción de un mundo más justo y humano.\r\n\r\nQue estas palabras sirvan como una invitación a profundizar en el significado de la fraternidad y a asumirla no solo como un ideal, sino como una práctica diaria que fortalece nuestros lazos como hermanos y como seres humanos.', 53, 0, '2025-05-22 03:24:58'),
(14, 'La Fraternidad', 2, '3427-La fraternidad.docx', 'Introducción\r\n\r\nLa fraternidad masónica es uno de los pilares fundamentales que sostienen la estructura moral y filosófica de nuestra institución. Más allá de ser un concepto abstracto, representa un compromiso activo y constante con nuestros hermanos y con la humanidad en su conjunto. En el marco de la Masonería, la fraternidad no se limita a un vínculo de camaradería, sino que se erige como un deber sagrado, un principio rector que guía nuestras acciones y pensamientos.\r\n\r\nPara el Aprendiz, la fraternidad es una piedra angular sobre la cual se construye su progreso masónico. Es un lazo que trasciende las diferencias y nos une en un propósito común: el auto-descubrimiento, la búsqueda de la verdad, la justicia y el bienestar colectivo. Esta virtud, lejos de ser innata, se cultiva mediante la práctica constante, la reflexión y el compromiso con los valores masónicos.\r\n\r\nEn esta plancha, exploraremos el concepto de fraternidad desde sus raíces filosóficas y morales, analizando su relevancia en el contexto masónico y en la vida cotidiana. Reflexionaremos sobre cómo esta virtud, al ser ejercida con constancia y dedicación, se convierte en un faro que ilumina nuestro camino iniciático y nos permite contribuir a la construcción de un mundo más justo y humano.\r\n\r\nQue estas palabras sirvan como una invitación a profundizar en el significado de la fraternidad y a asumirla no solo como un ideal, sino como una práctica diaria que fortalece nuestros lazos como hermanos y como seres humanos.\r\n \r\nDesarrollo\r\n\r\nLa fraternidad masónica es el vínculo que une a los hermanos más allá de cualquier diferencia de origen, credo o posición social. Se basa en el reconocimiento mutuo y en el apoyo desinteresado dentro y fuera del templo.\r\n\r\nEn el libro, Moral y Dogma de Albert Pike se presenta la fraternidad como una ley moral natural y sagrada, que implica deberes activos hacia los demás, nos dice que: “La Masonería nos enseña que todos los hombres son hermanos, y que el amor fraternal no es solo un sentimiento, sino un deber activo.” Para Pike, la fraternidad no se reduce a un sentimiento pasivo, sino a una ética de solidaridad, ayuda y respeto universal. Pike, uno de los masones más influyentes del siglo XIX, afirmó además que: \"Lo que hacemos para nosotros mismos muere con nosotros; lo que hacemos por los demás y por el mundo perdura y es inmortal\". Esta frase nos recuerda que la fraternidad no es solo un sentimiento, sino una acción constante de ayuda y solidaridad.\r\n\r\nPor su parte, George Washington, quien también fue un ilustre masón, se refirió a la fraternidad con estas palabras: \"La masonería es más que una sociedad, es un estado del alma que nos enseña la benevolencia y la amistad universal\". En este sentido, la fraternidad masónica trasciende los límites de la logia y se convierte en una actitud de vida que debemos practicar en todos los ámbitos.\r\n\r\nOtro ilustre masón, Giuseppe Garibaldi, exclamó: \"La libertad y la igualdad no pueden existir sin fraternidad\".', 53, 1, '2025-05-22 03:27:53'),
(15, 'Purificaciones y Pruebas; La marca en el pecho', 2, '8235-Purificaciones y Pruebas; La marca en el pecho_3.doc', 'Inicio\r\nEn la Masonería, la iniciación es mucho más que una simple ceremonia: es un rito de paso simbólico que marca el comienzo de un profundo camino de transformación interior. Desde tiempos antiguos, los aspirantes a los Misterios debían purificarse y superar pruebas para demostrar su valía y abrir su conciencia a una verdad más elevada. La Francmasonería retoma este legado iniciático utilizando un lenguaje de símbolos y alegorías. Como bien señala Jules Boucher, “El simbolismo… es una verdadera ciencia, con sus propias reglas, cuyos principios emanan del mundo de los arquetipos. Sólo a través de los símbolos, ritualmente considerados, puede entenderse lo esotérico, es decir, la enseñanza dirigida a la intimidad del Aprendiz”\r\n\r\nCada palabra, cada gesto y cada emblema en logia encierra múltiples significados velados que el Aprendiz irá desentrañando gradualmente. En este contexto, las pruebas y purificaciones del grado de Aprendiz Masón representan un recorrido ritual por los elementos fundamentales de la naturaleza –tierra, aire, agua y fuego– los cuales operan como agentes de purificación espiritual. A través de este proceso simbólico, el neófito experimenta una muerte y renacimiento interior (paso “de las tinieblas a la luz”), entendiendo que para empezar su camino masónico debe primero despojarse de las impurezas profanas. El sentido general de estas pruebas iniciáticas es preparar y templar el carácter del Aprendiz: depurar su mente y corazón de prejuicios y vicios, forjar en él las virtudes requeridas, y sellar en su alma el compromiso con los ideales masónicos. Así, las purificaciones y pruebas no son castigos ni meros formalismos, sino etapas necesarias de un viaje simbólico que conduce al descubrimiento de la verdad interior y al despertar de la conciencia. En las líneas siguientes exploraremos cada una de estas pruebas del Primer Grado –relativas a los cuatro elementos– y el significado de “la marca en el pecho” como sello indeleble del compromiso interior del nuevo iniciado.\r\n \r\nDesarrollo\r\nPrueba de la Tierra (Cámara de Reflexión). La primera purificación corresponde al elemento Tierra y tiene lugar antes de entrar en la Logia, en la llamada Cámara de Reflexión. Este recinto pequeño, cerrado y aislado simboliza una gruta subterránea o matriz primordial donde el aspirante enfrenta su propia mortalidad y oscuridad interior. El ambiente mismo refuerza este simbolismo: Albert Pike indicaba que la Cámara de Reflexión “debería estar un piso debajo de la sala de la logia; y si es posible, subterráneo, sin ventanas. El suelo deberá ser, en todo caso, de tierra”\r\n\r\nRodeado de muros negros y en completa soledad, el candidato es invitado a meditar sobre sí mismo, a escribir un testamento filosófico y a considerar seriamente los motivos de su ingreso. Los objetos dispuestos allí –como el cráneo, el pan y el agua, la sal y el azufre, el reloj de arena, el espejo, entre otros– son emblemas que confrontan al neófito con las verdades esenciales: l', 53, 0, '2025-05-22 03:31:15'),
(16, 'Purificaciones y Pruebas; La marca en el pecho', 2, '3862-20250522_1137_Masonic Ritual Initiation_simple_compose_01jvwa92fpecpacnbv5z0je1ev.gif', 'Introducción\r\n\r\nEn el seno de la Francmasonería, la iniciación representa mucho más que un ingreso formal: es el tránsito consciente del profano hacia una vida simbólica guiada por los valores eternos del arte real. En este camino, cada signo, cada palabra y cada acto ritual son portadores de enseñanzas profundas. Uno de estos símbolos —quizás uno de los más íntimos y trascendentales— es la marca en el pecho, que no remite a un trazo físico, sino al sello invisible pero indeleble de un compromiso moral y espiritual que el nuevo Aprendiz asume consigo mismo, con sus Hermanos y con la Orden. Lejos de ser un adorno ritual, esta marca representa la internalización del ideal masónico: vivir con honor, trabajar por la verdad y actuar con virtud. Como escribió Jules Boucher, “el verdadero reconocimiento del masón no se encuentra en signos externos, sino en la conformidad de su vida con los principios que proclama” (Boucher, 1948, p. 211). En el presente trazado nos alejaremos de los elementos tradicionales como las pruebas iniciáticas de los cuatro elementos y pondremos el foco en este signo silencioso, la marca en el pecho, como emblema central del compromiso iniciático.\r\n \r\nDesarrollo\r\n\r\nLa marca en el pecho es un símbolo que aparece hacia el final del ritual de iniciación del Aprendiz Masón. No se trata de una herida, ni de un tatuaje ni de una marca visible para los ojos profanos. Es, más bien, un signo interior, un sello ético y espiritual que queda grabado en la conciencia del iniciado al haber superado las pruebas del ritual y haber recibido la luz. Como señala Oswald Wirth, “la verdadera iniciación no es un espectáculo ni un acto teatral, sino un proceso interior de transformación en el que el corazón debe ser tocado por el fuego sagrado de la verdad” (Wirth, 1894/2019, p. 106).\r\n\r\nEste sello representa la conciencia activa del deber masónico, y su ubicación simbólica en el pecho no es casual. El pecho es la sede del corazón, órgano central no solo de la vida biológica, sino también —en las tradiciones esotéricas— de la vida moral. El corazón, como nos recuerda René Guénon, es “el lugar de la inteligencia directa y del conocimiento superior; allí reside la luz interior” (Guénon, 1946, p. 123). Por tanto, llevar una marca en el pecho es asumir una vida orientada por esa luz, que actúa como guía ética permanente en la vida del masón.\r\n\r\nDurante la ceremonia de iniciación, el Venerable Maestro advierte al recipiendario que una marca exterior sería inútil si no estuviese acompañada de una transformación interna. Este es un mensaje profundo: la Masonería no se satisface con gestos superficiales, sino que exige del neófito una disposición auténtica al cambio. Como escribió Jean-Marie Ragon en su Curso Filosófico de las Iniciaciones Antiguas y Modernas, “el masón no es masón por el mandil que lleva, sino por la obra que realiza consigo mismo y por la virtud que refleja en sus actos” (Ragon, 1853, p. 84).\r\n\r\nLa marca en el pecho no tiene duración limita', 53, 0, '2025-05-22 15:39:28'),
(17, 'Purificaciones y Pruebas; La marca en el pecho', 2, '5797-20250522_1137_Masonic Ritual Initiation_simple_compose_01jvwa92fpecpacnbv5z0je1ev.gif', 'Introducción\r\nEn el seno de la Francmasonería, la iniciación representa mucho más que un ingreso formal: es el tránsito consciente del profano hacia una vida simbólica guiada por los valores eternos del arte real. En este camino, cada signo, cada palabra y cada acto ritual son portadores de enseñanzas profundas. Uno de estos símbolos —quizás uno de los más íntimos y trascendentales— es la marca en el pecho, que no remite a un trazo físico, sino al sello invisible pero indeleble de un compromiso moral y espiritual que el nuevo Aprendiz asume consigo mismo, con sus Hermanos y con la Orden. Lejos de ser un adorno ritual, esta marca representa la internalización del ideal masónico: vivir con honor, trabajar por la verdad y actuar con virtud. Como escribió Jules Boucher, “el verdadero reconocimiento del masón no se encuentra en signos externos, sino en la conformidad de su vida con los principios que proclama” (Boucher, 1948, p. 211). En el presente trazado nos alejaremos de los elementos tradicionales como las pruebas iniciáticas de los cuatro elementos y pondremos el foco en este signo silencioso, la marca en el pecho, como emblema central del compromiso iniciático.\r\n', 53, 0, '2025-05-22 15:49:45'),
(18, 'Purificaciones y Pruebas; La marca en el pecho', 2, '4127-20250522_1137_Masonic Ritual Initiation_simple_compose_01jvwa92fpecpacnbv5z0je1ev.gif', 'En el seno de la Francmasonería, la iniciación representa mucho más que un ingreso formal: es el tránsito consciente del profano hacia una vida simbólica guiada por los valores eternos del arte real. En este camino, cada signo, cada palabra y cada acto ritual son portadores de enseñanzas profundas. Uno de estos símbolos —quizás uno de los más íntimos y trascendentales— es la marca en el pecho, que no remite a un trazo físico, sino al sello invisible pero indeleble de un compromiso moral y espiritual que el nuevo Aprendiz asume consigo mismo, con sus Hermanos y con la Orden. Lejos de ser un adorno ritual, esta marca representa la internalización del ideal masónico: vivir con honor, trabajar por la verdad y actuar con virtud. Como escribió Jules Boucher, “el verdadero reconocimiento del masón no se encuentra en signos externos, sino en la conformidad de su vida con los principios que proclama” (Boucher, 1948, p. 211). En el presente trazado nos alejaremos de los elementos tradicionales como las pruebas iniciáticas de los cuatro elementos y pondremos el foco en este signo silencioso, la marca en el pecho, como emblema central del compromiso iniciático.', 53, 0, '2025-05-22 15:53:04'),
(19, 'Purificaciones y Pruebas; La marca en el pecho', 2, '2233-20250522_1137_Masonic Ritual Initiation_simple_compose_01jvwa92fpecpacnbv5z0je1ev.gif', 'En el seno de la Francmasonería, la iniciación representa mucho más que un ingreso formal: es el tránsito consciente del profano hacia una vida simbólica guiada por los valores eternos del arte real. En este camino, cada signo, cada palabra y cada acto ritual son portadores de enseñanzas profundas. Uno de estos símbolos —quizás uno de los más íntimos y trascendentales— es la marca en el pecho, que no remite a un trazo físico, sino al sello invisible pero indeleble de un compromiso moral y espiritual que el nuevo Aprendiz asume consigo mismo, con sus Hermanos y con la Orden. Lejos de ser un adorno ritual, esta marca representa la internalización del ideal masónico: vivir con honor, trabajar por la verdad y actuar con virtud. Como escribió Jules Boucher, “el verdadero reconocimiento del masón no se encuentra en signos externos, sino en la conformidad de su vida con los principios que proclama” (Boucher, 1948, p. 211). En el presente trazado nos alejaremos de los elementos tradicionales como las pruebas iniciáticas de los cuatro elementos y pondremos el foco en este signo silencioso, la marca en el pecho, como emblema central del compromiso iniciático.', 53, 1, '2025-05-22 21:41:11');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `files`
--

CREATE TABLE `files` (
  `id` int NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `uploaded_on` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf16;

--
-- Volcado de datos para la tabla `files`
--

INSERT INTO `files` (`id`, `file_name`, `uploaded_on`) VALUES
(1, 'Prueba Edgardo.pdf', '2023-03-03 18:10:03'),
(2, 'Prueba Edgardo.pdf', '2023-03-03 21:02:16'),
(3, 'ejemplo-02.png', '2023-03-05 18:50:54'),
(4, 'ejemplo-01.jpeg', '2023-03-05 18:50:54'),
(5, 'ejemplo-03.jpg', '2023-03-05 18:50:59'),
(6, 'Boletín Eternos Aprendices N°1.pdf', '2023-03-27 23:42:25'),
(7, 'Boletín Eternos Aprendices N°1.pdf', '2023-03-27 23:52:08'),
(8, 'Boletín Eternos Aprendices N°1.pdf', '2023-03-27 23:54:53'),
(9, 'Boletín Eternos Aprendices N°1.pdf', '2023-03-27 23:57:51'),
(10, 'Boletín Eternos Aprendices N°1.pdf', '2023-03-28 00:01:25');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `grado`
--

CREATE TABLE `grado` (
  `id` int NOT NULL,
  `grado_nombre` varchar(250) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf16;

--
-- Volcado de datos para la tabla `grado`
--

INSERT INTO `grado` (`id`, `grado_nombre`) VALUES
(1, 'Aprendiz'),
(2, 'Compañero'),
(3, 'Maestro');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `message`
--

CREATE TABLE `message` (
  `id_Message` int NOT NULL,
  `from_Message` int DEFAULT NULL,
  `to_Message` int DEFAULT NULL,
  `subject_Message` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci DEFAULT NULL,
  `content_Message` varchar(400) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci DEFAULT NULL,
  `date_Message` datetime DEFAULT CURRENT_TIMESTAMP,
  `status_Message` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf16;

--
-- Volcado de datos para la tabla `message`
--

INSERT INTO `message` (`id_Message`, `from_Message`, `to_Message`, `subject_Message`, `content_Message`, `date_Message`, `status_Message`) VALUES
(1, 28, 28, 'Mensaje de Cumpleaños', 'Que tengas un muy buen Feliz Cumpleaños!!!', '2023-04-18 18:27:10', 1),
(2, 11, 31, 'Mensaje de Cumpleaños', 'Que tengas un muy buen Feliz Cumpleaños!!!', '2023-09-08 21:44:28', 0),
(3, 11, 31, 'Mensaje de Cumpleaños', 'Que tengas un muy buen Feliz Cumpleaños!!!', '2023-09-08 21:44:34', 0),
(4, 28, 7, 'Mensaje de Cumpleaños', 'Que tengas un muy buen Feliz Cumpleaños!!!', '2023-10-06 17:10:11', 0),
(5, 28, 7, 'Mensaje de Cumpleaños', 'Que tengas un muy buen Feliz Cumpleaños!!!', '2023-10-11 13:07:18', 0),
(6, 38, 7, '', 'Felicito al gestor de esta página muy bonita como\r\nQuedarán recuerdos para los que vienen\r\nOscar Gómez B', '2023-12-07 18:06:21', 0),
(7, 29, 29, 'Mensaje de Cumpleaños', 'Que tengas un muy buen Feliz Cumpleaños!!!', '2024-08-06 22:15:33', 0),
(8, 29, 29, 'Mensaje de Cumpleaños', 'Que tengas un muy buen Feliz Cumpleaños!!!', '2024-08-06 22:15:39', 0),
(9, 29, 29, 'Mensaje de Cumpleaños', 'Que tengas un muy buen Feliz Cumpleaños!!!', '2024-08-06 22:15:49', 0),
(10, 29, 29, 'Mensaje de Cumpleaños', 'Que tengas un muy buen Feliz Cumpleaños!!!', '2024-08-06 22:15:51', 0),
(11, 53, 11, 'Solicitud', 'Q:. H:. Edgardo\r\n\r\nEn mi usuario hay una sección para subir mis trabajos y el botón no esta activo, no me permite subir trabajos.  podría ayudarme en revisar eso.\r\n\r\nQuedo atento a sus gestiones', '2024-11-27 12:12:48', 1),
(12, 11, 53, 'Permisos', 'Q:.H:. El problema que tiene esto es que necesitas ser Vigilante para poder subir los trabajos. Pero dejame ver como puedo darte permisos para que puedas subirlo.', '2024-12-28 17:10:47', 1),
(13, 53, 49, 'Mensaje de Cumpleaños', 'Que tengas un muy buen Feliz Cumpleaños!!!', '2025-05-09 20:51:52', 1),
(14, 53, 49, 'Mensaje de Cumpleaños', 'Que tengas un muy buen Feliz Cumpleaños!!!', '2025-05-22 21:42:47', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `noticias`
--

CREATE TABLE `noticias` (
  `id_Noticia` int NOT NULL,
  `titulo_Noticia` varchar(255) CHARACTER SET utf8mb3 NOT NULL,
  `img_Noticia` varchar(255) CHARACTER SET utf8mb3 DEFAULT NULL,
  `ext_Noticia` varchar(255) CHARACTER SET utf8mb3 NOT NULL,
  `des_Noticia` text CHARACTER SET utf8mb3 NOT NULL,
  `gallery` varchar(255) CHARACTER SET utf8mb3 DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `id_User` int DEFAULT NULL,
  `id_Categoria` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf16;

--
-- Volcado de datos para la tabla `noticias`
--

INSERT INTO `noticias` (`id_Noticia`, `titulo_Noticia`, `img_Noticia`, `ext_Noticia`, `des_Noticia`, `gallery`, `created_at`, `id_User`, `id_Categoria`) VALUES
(4, 'Testing 4', '../uploads/noticias/5887-02.jpeg', 'Prueba testing 4', 'Testing 4 prueba testing 4', '../uploads/noticias/01.jpeg,../uploads/noticias/03.png,../uploads/noticias/04.png,', '2023-03-13 00:38:43', 7, 2),
(5, 'Lunes 13 prueba', '../uploads/noticias/7524-01.jpeg', 'Prueba de lunes 13 y dia de clases', 'Prueba de lunes 13 y dia de clases Prueba de lunes 13 y dia de clases\r\nPrueba de lunes 13 y dia de clases', '../uploads/noticias/02.jpeg,../uploads/noticias/03.png,../uploads/noticias/04.png,', '2023-03-13 10:03:58', 7, 2),
(6, 'testing', '../uploads/noticias/6531-WhatsApp Image 2022-11-30 at 12.40.07.jpeg', 'saDSAFDSFSDAFSDFDSAF', 'DSAFASDFDSAFASDFSDAFSDAFSDA', '../uploads/noticias/WhatsApp Image 2022-11-30 at 12.40.07.jpeg,', '2023-03-27 20:33:48', 7, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `noticias_category`
--

CREATE TABLE `noticias_category` (
  `id_Categoria` int NOT NULL,
  `name_Categoria` varchar(100) CHARACTER SET utf8mb3 DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf16;

--
-- Volcado de datos para la tabla `noticias_category`
--

INSERT INTO `noticias_category` (`id_Categoria`, `name_Categoria`) VALUES
(1, 'Publicas'),
(2, 'Internas');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `oficiales`
--

CREATE TABLE `oficiales` (
  `id_Oficial` int NOT NULL,
  `nombre_Oficial` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf16;

--
-- Volcado de datos para la tabla `oficiales`
--

INSERT INTO `oficiales` (`id_Oficial`, `nombre_Oficial`) VALUES
(1, 'Ninguno'),
(2, 'Venerable Maestro'),
(3, 'Primer Vigilante'),
(4, 'Segundo Vigilante'),
(5, 'Orador'),
(6, 'Secretario'),
(7, 'Tesorero'),
(8, 'Hospitalario'),
(9, 'Maestro de Ceremonia'),
(10, 'Maestro Experto'),
(11, 'Guarda Templo'),
(12, 'Maestro de Banquetes'),
(13, 'Maestro de Armonía'),
(14, 'Ex-Venerable Maestro'),
(15, 'Bibliotecario');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `salidadinero`
--

CREATE TABLE `salidadinero` (
  `id_Salida` int NOT NULL,
  `id_User` int DEFAULT NULL,
  `salida_Mes` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci DEFAULT NULL,
  `salida_Ano` varchar(16) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NOT NULL,
  `salida_Motivo` int DEFAULT NULL,
  `salida_Monto` decimal(10,2) DEFAULT NULL,
  `salida_MovimientoFecha` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf16;

--
-- Volcado de datos para la tabla `salidadinero`
--

INSERT INTO `salidadinero` (`id_Salida`, `id_User`, `salida_Mes`, `salida_Ano`, `salida_Motivo`, `salida_Monto`, `salida_MovimientoFecha`) VALUES
(1, 28, '12 - Diciembre', '2023', 1, 62000.00, '2023-12-07 00:00:00'),
(2, 11, '12 - Diciembre', '2023', 13, 14.00, '2023-12-07 00:00:00'),
(3, 28, '12 - Diciembre', '2023', 1, 194000.00, '2023-12-12 00:00:00'),
(4, 11, '12 - Diciembre', '2023', 13, 300.00, '2023-12-12 00:00:00'),
(5, 28, '12 - Diciembre', '2023', 1, 7080.00, '2023-12-13 00:00:00'),
(6, 11, '12 - Diciembre', '2023', 13, 300.00, '2023-12-14 00:00:00'),
(7, 11, '01 - Enero', '2024', 4, 100000.00, '2024-01-10 00:00:00'),
(8, 11, '01 - Enero', '2024', 13, 300.00, '2024-01-10 00:00:00'),
(9, 11, '01 - Enero', '2024', 4, 102575.00, '2024-01-11 00:00:00'),
(10, 11, '01 - Enero', '2024', 13, 300.00, '2024-01-11 00:00:00'),
(11, 11, '12 - Diciembre', '2023', 12, 37394.00, '2024-01-15 00:00:00'),
(12, 11, '12 - Diciembre', '2023', 14, 16000.00, '2024-01-15 00:00:00'),
(13, 11, '01 - Enero', '2024', 13, 300.00, '2024-01-15 00:00:00'),
(14, 31, '01 - Enero', '2024', 14, 384000.00, '2024-01-27 00:00:00'),
(15, 28, '01 - Enero', '2024', 14, 7551.00, '2024-01-27 00:00:00'),
(16, 11, '01 - Enero', '2024', 13, 300.00, '2024-01-27 00:00:00'),
(17, 28, '01 - Enero', '2024', 14, 274450.00, '2024-01-30 00:00:00'),
(18, 11, '01 - Enero', '2024', 13, 300.00, '2024-01-30 00:00:00'),
(19, 11, '02 - Febrero', '2024', 4, 202575.00, '2024-02-15 00:00:00'),
(20, 11, '02 - Febrero', '2024', 13, 300.00, '2024-02-15 00:00:00'),
(21, 28, '02 - Febrero', '2024', 14, 4800.00, '2024-02-15 00:00:00'),
(22, 11, '03 - Marzo', '2024', 4, 202575.00, '2024-03-04 00:00:00'),
(23, 11, '03 - Marzo', '2024', 13, 300.00, '2024-03-04 00:00:00'),
(24, 11, '03 - Marzo', '2024', 9, 100000.00, '2024-03-04 00:00:00'),
(25, 11, '03 - Marzo', '2024', 13, 600.00, '2024-03-04 00:00:00'),
(26, 11, '03 - Marzo', '2024', 14, 330000.00, '2024-03-04 00:00:00'),
(27, 28, '04 - Abril', '2024', 1, 387000.00, '2024-04-01 00:00:00'),
(28, 11, '04 - Abril', '2024', 13, 300.00, '2024-04-01 00:00:00'),
(29, 11, '04 - Abril', '2024', 4, 202575.00, '2024-04-01 00:00:00'),
(30, 11, '04 - Abril', '2024', 9, 100000.00, '2024-04-01 00:00:00'),
(31, 11, '04 - Abril', '2024', 5, 24000.00, '2024-04-03 00:00:00'),
(32, 28, '04 - Abril', '2024', 1, 300000.00, '2024-04-09 00:00:00'),
(33, 28, '04 - Abril', '2024', 1, 30300.00, '2024-04-25 00:00:00'),
(34, 49, '04 - Abril', '2024', 16, 12000.00, '2024-04-25 00:00:00'),
(35, 50, '04 - Abril', '2024', 16, 12000.00, '2024-04-25 00:00:00'),
(36, 51, '04 - Abril', '2024', 16, 12000.00, '2024-04-25 00:00:00'),
(37, 28, '05 - Mayo', '2024', 1, 400000.00, '2024-05-03 00:00:00'),
(38, 28, '05 - Mayo', '2024', 1, 24000.00, '2024-05-01 00:00:00'),
(39, 11, '05 - Mayo', '2024', 4, 202575.00, '2024-05-08 00:00:00'),
(40, 11, '05 - Mayo', '2024', 9, 100000.00, '2024-05-08 00:00:00'),
(41, 28, '05 - Mayo', '2024', 14, 18000.00, '2024-05-08 00:00:00'),
(42, 28, '06 - Junio', '2024', 1, 400000.00, '2024-06-05 00:00:00'),
(43, 11, '06 - Junio', '2024', 4, 202875.00, '2024-06-10 00:00:00'),
(44, 11, '06 - Junio', '2024', 9, 100300.00, '2024-06-10 00:00:00'),
(45, 28, '06 - Junio', '2024', 3, 14000.00, '2024-06-12 00:00:00'),
(46, 43, '06 - Junio', '2024', 5, 18000.00, '2024-06-12 00:00:00'),
(47, 43, '06 - Junio', '2024', 6, 9000.00, '2024-06-12 00:00:00'),
(48, 11, '06 - Junio', '2024', 13, 300.00, '2024-06-12 00:00:00'),
(49, 11, '06 - Junio', '2024', 1, 15300.00, '2024-06-15 00:00:00'),
(50, 11, '06 - Junio', '2024', 14, 6500.00, '2024-06-24 00:00:00'),
(51, 11, '06 - Junio', '2024', 13, 300.00, '2024-06-24 00:00:00'),
(52, 28, '06 - Junio', '2024', 1, 700000.00, '2024-06-28 00:00:00'),
(53, 11, '06 - Junio', '2024', 13, 300.00, '2024-06-28 00:00:00'),
(54, 7, '07 - Julio', '2024', 8, 86900.00, '2024-07-04 00:00:00'),
(55, 28, '07 - Julio', '2024', 1, 150000.00, '2024-07-04 00:00:00'),
(56, 11, '07 - Julio', '2024', 13, 300.00, '2024-07-06 00:00:00'),
(57, 28, '07 - Julio', '2024', 3, 60000.00, '2024-07-10 00:00:00'),
(58, 11, '07 - Julio', '2024', 4, 202575.00, '2024-07-11 00:00:00'),
(59, 11, '07 - Julio', '2024', 13, 300.00, '2024-07-11 00:00:00'),
(60, 11, '07 - Julio', '2024', 9, 13400.00, '2024-07-11 00:00:00'),
(61, 11, '07 - Julio', '2024', 2, 100300.00, '2024-07-17 00:00:00'),
(62, 28, '07 - Julio', '2024', 1, 100300.00, '2024-07-23 00:00:00'),
(63, 31, '07 - Julio', '2024', 8, 116000.00, '2024-07-03 00:00:00'),
(64, 31, '07 - Julio', '2024', 8, 33000.00, '2024-07-03 00:00:00'),
(65, 28, '08 - Agosto', '2024', 2, 100000.00, '2024-08-01 00:00:00'),
(66, 11, '08 - Agosto', '2024', 13, 300.00, '2024-08-01 00:00:00'),
(67, 11, '08 - Agosto', '2024', 4, 202575.00, '2024-08-12 00:00:00'),
(68, 11, '08 - Agosto', '2024', 9, 100000.00, '2024-08-12 00:00:00'),
(69, 11, '08 - Agosto', '2024', 13, 600.00, '2024-08-12 00:00:00'),
(70, 11, '08 - Agosto', '2024', 1, 120000.00, '2024-08-19 00:00:00'),
(71, 11, '08 - Agosto', '2024', 13, 300.00, '2024-08-19 00:00:00'),
(72, 11, '08 - Agosto', '2024', 5, 96900.00, '2024-08-22 00:00:00'),
(73, 11, '08 - Agosto', '2024', 2, 100300.00, '2024-08-28 00:00:00'),
(74, 11, '09 - Septiembre', '2024', 8, 10000.00, '2024-09-04 00:00:00'),
(75, 11, '09 - Septiembre', '2024', 1, 120300.00, '2024-09-04 00:00:00'),
(76, 11, '09 - Septiembre', '2024', 1, 200300.00, '2024-09-11 00:00:00'),
(77, 43, '09 - Septiembre', '2024', 5, 22000.00, '2024-09-12 00:00:00'),
(78, 28, '09 - Septiembre', '2024', 1, 22300.00, '2024-09-16 00:00:00'),
(79, 11, '09 - Septiembre', '2024', 4, 200575.00, '2024-09-25 00:00:00'),
(80, 11, '09 - Septiembre', '2024', 9, 100000.00, '2024-09-25 00:00:00'),
(81, 11, '09 - Septiembre', '2024', 1, 150000.00, '2024-09-25 00:00:00'),
(82, 11, '09 - Septiembre', '2024', 13, 900.00, '2024-09-25 00:00:00'),
(83, 11, '09 - Septiembre', '2024', 18, 21300.00, '2024-09-26 00:00:00'),
(84, 31, '09 - Septiembre', '2024', 14, 100970.00, '2024-09-26 00:00:00'),
(85, 11, '09 - Septiembre', '2024', 14, 37900.00, '2024-09-27 00:00:00'),
(86, 11, '09 - Septiembre', '2024', 13, 300.00, '2024-09-27 00:00:00'),
(87, 11, '09 - Septiembre', '2024', 14, 35000.00, '2024-09-30 00:00:00'),
(88, 11, '10 - Octubre', '2024', 2, 100300.00, '2024-10-03 00:00:00'),
(89, 11, '10 - Octubre', '2024', 14, 36300.00, '2024-10-05 00:00:00'),
(90, 11, '10 - Octubre', '2024', 3, 90300.00, '2024-10-10 00:00:00'),
(91, 43, '10 - Octubre', '2024', 14, 20000.00, '2024-10-11 00:00:00'),
(92, 11, '10 - Octubre', '2024', 2, 90300.00, '2024-10-17 00:00:00'),
(93, 11, '10 - Octubre', '2024', 1, 130300.00, '2024-10-24 00:00:00'),
(94, 11, '10 - Octubre', '2024', 4, 202575.00, '2024-10-24 00:00:00'),
(95, 11, '10 - Octubre', '2024', 9, 100000.00, '2024-10-24 00:00:00'),
(96, 11, '10 - Octubre', '2024', 13, 600.00, '2024-10-24 00:00:00'),
(97, 11, '11 - Noviembre', '2024', 1, 140300.00, '2024-11-07 00:00:00'),
(98, 28, '07 - Julio', '2024', 1, 150000.00, '2024-07-04 00:00:00'),
(99, 11, '11 - Noviembre', '2024', 8, 13300.00, '2024-11-15 00:00:00'),
(100, 48, '11 - Noviembre', '2024', 3, 100000.00, '2024-11-19 00:00:00'),
(101, 48, '11 - Noviembre', '2024', 3, 8000.00, '2024-11-21 00:00:00'),
(102, 11, '11 - Noviembre', '2024', 4, 202575.00, '2024-11-29 00:00:00'),
(103, 11, '11 - Noviembre', '2024', 9, 100000.00, '2024-11-29 00:00:00'),
(104, 11, '11 - Noviembre', '2024', 13, 600.00, '2024-11-29 00:00:00'),
(105, 31, '12 - Diciembre', '2024', 1, 150000.00, '2024-12-04 00:00:00'),
(106, 11, '12 - Diciembre', '2024', 4, 260075.00, '2024-12-04 00:00:00'),
(107, 11, '12 - Diciembre', '2024', 9, 100000.00, '2024-12-04 00:00:00'),
(108, 11, '12 - Diciembre', '2024', 13, 600.00, '2024-12-04 00:00:00'),
(109, 11, '12 - Diciembre', '2024', 3, 50000.00, '2024-12-06 00:00:00'),
(110, 11, '12 - Diciembre', '2024', 13, 300.00, '2024-12-06 00:00:00'),
(111, 11, '12 - Diciembre', '2024', 1, 140000.00, '2024-12-12 00:00:00'),
(112, 11, '12 - Diciembre', '2024', 13, 300.00, '2024-12-12 00:00:00'),
(113, 11, '12 - Diciembre', '2024', 1, 210000.00, '2024-12-19 00:00:00'),
(114, 11, '12 - Diciembre', '2024', 13, 300.00, '2024-12-19 00:00:00'),
(115, 31, '01 - Enero', '2025', 1, 321000.00, '2025-01-25 00:00:00'),
(116, 11, '03 - Marzo', '2025', 4, 859749.00, '2025-03-03 00:00:00'),
(117, 11, '01 - Enero', '2025', 13, 300.00, '2025-03-03 00:00:00'),
(118, 11, '03 - Marzo', '2025', 1, 162000.00, '2025-03-07 00:00:00'),
(119, 11, '03 - Marzo', '2025', 13, 300.00, '2025-03-07 00:00:00'),
(120, 11, '03 - Marzo', '2025', 3, 50000.00, '2025-03-13 00:00:00'),
(121, 11, '03 - Marzo', '2025', 13, 300.00, '2025-03-13 00:00:00'),
(122, 11, '03 - Marzo', '2025', 1, 160000.00, '2025-03-20 00:00:00'),
(123, 11, '03 - Marzo', '2025', 13, 300.00, '2025-03-20 00:00:00'),
(124, 11, '03 - Marzo', '2025', 2, 60300.00, '2025-03-27 00:00:00'),
(125, 11, '03 - Marzo', '2025', 15, 35000.00, '2025-03-29 00:00:00'),
(126, 11, '04 - Abril', '2025', 1, 250000.00, '2025-04-03 00:00:00'),
(127, 11, '04 - Abril', '2025', 4, 266472.00, '2025-04-03 00:00:00'),
(128, 11, '04 - Abril', '2025', 13, 600.00, '2025-04-03 00:00:00'),
(129, 11, '04 - Abril', '2025', 9, 200000.00, '2025-04-03 00:00:00'),
(130, 11, '04 - Abril', '2025', 13, 300.00, '2025-04-03 00:00:00'),
(131, 11, '04 - Abril', '2025', 1, 190000.00, '2025-04-10 00:00:00'),
(132, 11, '04 - Abril', '2025', 13, 300.00, '2025-04-10 00:00:00'),
(133, 11, '04 - Abril', '2025', 14, 17700.00, '2025-04-16 00:00:00'),
(134, 11, '04 - Abril', '2025', 14, 40000.00, '2025-04-18 00:00:00'),
(135, 11, '04 - Abril', '2025', 14, 20000.00, '2025-04-21 00:00:00'),
(136, 11, '04 - Abril', '2025', 14, 19684.00, '2025-04-15 00:00:00'),
(137, 11, '04 - Abril', '2025', 14, 77000.00, '2025-04-29 00:00:00'),
(138, 11, '04 - Abril', '2025', 13, 968.00, '2025-04-25 00:00:00'),
(139, 11, '05 - Mayo', '2025', 1, 160000.00, '2025-05-08 00:00:00'),
(140, 11, '05 - Mayo', '2025', 4, 266472.00, '2025-05-08 00:00:00'),
(141, 11, '05 - Mayo', '2025', 9, 100000.00, '2025-05-08 00:00:00'),
(142, 11, '05 - Mayo', '2025', 4, 2063.00, '2025-05-15 00:00:00'),
(143, 11, '05 - Mayo', '2025', 8, 850.00, '2025-05-09 00:00:00'),
(144, 11, '05 - Mayo', '2025', 2, 100000.00, '2025-05-15 00:00:00'),
(145, 11, '05 - Mayo', '2025', 3, 60000.00, '2025-05-22 00:00:00'),
(146, 11, '05 - Mayo', '2025', 1, 150000.00, '2025-05-28 00:00:00'),
(147, 11, '06 - Junio', '2025', 3, 100000.00, '2025-06-04 00:00:00'),
(148, 11, '06 - Junio', '2025', 1, 512000.00, '2025-06-10 00:00:00'),
(149, 11, '06 - Junio', '2025', 2, 40000.00, '2025-06-19 00:00:00'),
(150, 11, '07 - Julio', '2025', 3, 100000.00, '2025-07-01 00:00:00'),
(151, 11, '07 - Julio', '2025', 4, 537070.00, '2025-07-01 00:00:00'),
(152, 11, '07 - Julio', '2025', 9, 100000.00, '2025-07-01 00:00:00'),
(153, 11, '07 - Julio', '2025', 1, 6818.00, '2025-07-17 00:00:00'),
(154, 11, '07 - Julio', '2025', 1, 250000.00, '2025-07-15 00:00:00'),
(155, 11, '07 - Julio', '2025', 5, 126900.00, '2025-07-10 00:00:00'),
(156, 11, '07 - Julio', '2025', 1, 125000.00, '2025-07-10 00:00:00'),
(157, 11, '07 - Julio', '2025', 1, 140000.00, '2025-07-22 00:00:00'),
(158, 11, '07 - Julio', '2025', 15, 40000.00, '2025-07-28 00:00:00'),
(159, 11, '04 - Abril', '2025', 14, 30450.00, '2025-05-28 00:00:00'),
(160, 11, '07 - Julio', '2025', 3, 130000.00, '2025-07-30 00:00:00'),
(161, 11, '07 - Julio', '2025', 15, 50000.00, '2025-07-31 00:00:00'),
(162, 11, '08 - Agosto', '2025', 4, 271448.00, '2025-08-01 00:00:00'),
(163, 11, '08 - Agosto', '2025', 9, 100000.00, '2025-08-01 00:00:00'),
(164, 11, '08 - Agosto', '2025', 1, 190000.00, '2025-08-06 00:00:00'),
(165, 11, '08 - Agosto', '2025', 2, 40000.00, '2025-08-13 00:00:00'),
(166, 11, '08 - Agosto', '2025', 3, 40000.00, '2025-08-20 00:00:00'),
(167, 11, '08 - Agosto', '2025', 1, 46000.00, '2025-08-28 00:00:00'),
(168, 11, '08 - Agosto', '2025', 14, 24000.00, '2025-08-19 00:00:00'),
(169, 11, '09 - Septiembre', '2025', 2, 50000.00, '2025-09-03 00:00:00'),
(170, 11, '09 - Septiembre', '2025', 1, 190000.00, '2025-09-11 00:00:00'),
(171, 11, '09 - Septiembre', '2025', 3, 40000.00, '2025-09-25 00:00:00'),
(172, 11, '10 - Octubre', '2025', 2, 42500.00, '2025-10-01 00:00:00'),
(173, 11, '10 - Octubre', '2025', 9, 100000.00, '2025-10-01 00:00:00'),
(174, 11, '09 - Septiembre', '2025', 4, 272906.00, '2025-10-01 00:00:00'),
(175, 11, '09 - Septiembre', '2025', 14, 67200.00, '2025-09-22 00:00:00'),
(176, 11, '09 - Septiembre', '2025', 3, 40000.00, '2025-09-25 09:57:00'),
(177, 11, '10 - Octubre', '2025', 2, 42500.00, '2025-10-02 10:01:00'),
(178, 11, '10 - Octubre', '2025', 4, 272906.00, '2025-10-02 10:01:00'),
(179, 11, '10 - Octubre', '2025', 9, 100000.00, '2025-10-02 10:02:00'),
(180, 11, '10 - Octubre', '2025', 14, 67200.00, '2025-10-02 10:02:00'),
(181, 11, '10 - Octubre', '2025', 2, 8400.00, '2025-10-03 10:04:00'),
(182, 11, '10 - Octubre', '2025', 1, 150000.00, '2025-10-08 10:06:00'),
(183, 11, '10 - Octubre', '2025', 3, 40000.00, '2025-10-15 10:09:00'),
(184, 11, '10 - Octubre', '2025', 14, 30000.00, '2025-10-15 10:09:00'),
(185, 11, '10 - Octubre', '2025', 2, 50000.00, '2025-10-23 10:18:00'),
(186, 11, '11 - Noviembre', '2025', 9, 55000.00, '2025-11-04 10:24:00'),
(187, 11, '10 - Octubre', '2025', 4, 272906.00, '2025-11-04 10:25:00'),
(188, 11, '11 - Noviembre', '2025', 4, 272906.00, '2025-11-04 10:25:00'),
(189, 11, '12 - Diciembre', '2025', 4, 272908.00, '2025-11-04 10:26:00'),
(190, 11, '11 - Noviembre', '2025', 14, 800000.00, '2025-11-04 16:33:00'),
(191, 11, '11 - Noviembre', '2025', 3, 49500.00, '2025-11-06 18:05:00'),
(192, 11, '11 - Noviembre', '2025', 14, 45900.00, '2025-11-08 10:25:00'),
(193, 11, '11 - Noviembre', '2025', 1, 50000.00, '2025-11-12 10:57:00'),
(194, 11, '11 - Noviembre', '2025', 15, 40000.00, '2025-11-12 10:58:00'),
(195, 11, '11 - Noviembre', '2025', 1, 40850.00, '2025-11-20 14:54:00'),
(196, 11, '11 - Noviembre', '2025', 3, 40000.00, '2025-11-26 08:39:00'),
(197, 11, '12 - Diciembre', '2025', 14, 13500.00, '2025-12-01 09:08:00'),
(198, 11, '12 - Diciembre', '2025', 1, 210000.00, '2025-12-03 09:16:00'),
(199, 11, '12 - Diciembre', '2025', 1, 7800.00, '2025-12-04 18:09:00'),
(200, 11, '12 - Diciembre', '2025', 4, 21000.00, '2025-12-06 11:29:00'),
(201, 11, '01 - Enero', '2025', 14, 100000.00, '2025-12-11 10:40:00'),
(202, 11, '12 - Diciembre', '2025', 1, 129606.00, '2025-12-18 19:44:00'),
(203, 11, '01 - Enero', '2026', 15, 250000.00, '2026-01-20 11:40:00'),
(204, 11, '01 - Enero', '2026', 11, 223589.00, '2026-01-29 10:10:00'),
(205, 11, '02 - Febrero', '2026', 14, 2000000.00, '2026-02-11 18:00:00'),
(206, 11, '02 - Febrero', '2026', 14, 1310000.00, '2026-02-20 23:40:00'),
(207, 11, '01 - Enero', '2026', 4, 370783.00, '2026-03-17 11:36:00'),
(208, 11, '02 - Febrero', '2026', 4, 370783.00, '2026-03-17 11:37:00'),
(209, 11, '03 - Marzo', '2026', 4, 370783.00, '2026-03-17 11:38:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `salidamotivo`
--

CREATE TABLE `salidamotivo` (
  `id_SalidaMotivo` int NOT NULL,
  `name_SalidaMotivo` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf16;

--
-- Volcado de datos para la tabla `salidamotivo`
--

INSERT INTO `salidamotivo` (`id_SalidaMotivo`, `name_SalidaMotivo`) VALUES
(1, 'Ágape Primer Grado'),
(2, 'Ágape Segundo Grado'),
(3, 'Ágape Tercer Grado'),
(4, 'Pago Cuota G:. L:. D:. Ch:.'),
(5, 'Implementos Aprendiz'),
(6, 'Implementos Compañeros'),
(7, 'Implementos Maestros'),
(8, 'Insumos Logia, Velas, fósforos,etc.'),
(9, 'Arriendo'),
(10, 'Leña'),
(11, 'Viajes Columnas'),
(12, 'Camaras En Conjunto'),
(13, 'Comisión Banco'),
(14, 'Otros Gastos'),
(15, 'Hospitalario'),
(16, 'Derecho de Afiliación o Reincorporación'),
(17, 'Derecho de Visación por Cartas de Retiro'),
(18, 'Pasaporte Masónico');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `trazado`
--

CREATE TABLE `trazado` (
  `id_Trazado` int NOT NULL,
  `name_Trazado` varchar(250) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci DEFAULT NULL,
  `file_name` varchar(250) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NOT NULL,
  `autor_Trazado` int DEFAULT NULL,
  `grado_Trazado` int DEFAULT NULL,
  `fecha_Trazado` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf16;

--
-- Volcado de datos para la tabla `trazado`
--

INSERT INTO `trazado` (`id_Trazado`, `name_Trazado`, `file_name`, `autor_Trazado`, `grado_Trazado`, `fecha_Trazado`) VALUES
(1, 'El Ritual en función del Rito; Conceptos y aspectos masónicos', '2228-el_ritual_en funsion_del rito_conceptos _y _aspectos masonicos.pdf', 26, 1, '2023-03-30'),
(4, 'El Símbolo de la Razón', '4123-El Símbolo de la Razón - QH Edgardo Ruotolo.pdf', 11, 2, '2022-07-29'),
(5, 'El Número Cinco', '5994-El numero cinco.pdf', 11, 2, '2022-05-30'),
(6, 'El Paso de la Perpendicular al Nivel', '9825-ElPasodelaPerpendicularalNivel.pdf', 28, 2, '2023-03-28'),
(7, 'Las Pruebas Iniciáticas; Purificaciones', '4137-La Pruebas Iniciaticas_Purificaciones.pdf', 36, 1, '2023-09-14'),
(8, 'Dia del maestro patrocinador', '5047-Dia del maestro patrocinador.pdf', 38, 1, '2023-07-06'),
(9, 'Mandil, Mazo y Cincel', '9209-Mandil, Mazo y cincel..pdf', 27, 1, '2023-07-27'),
(10, '¿De donde vengo?', '9009-De donde vengo.pdf', 26, 1, '2023-08-17'),
(11, 'El hombre como ser social', '4836-El hombre como ser social.pdf', 11, 2, '2023-08-31'),
(13, 'Deberes y Derechos del Compañero Masón', '3335-Deberes y Derechos del Compañero Masón.pdf', 11, 2, '2023-07-26'),
(14, 'Teología', '7309-Teología.pdf', 11, 2, '2023-06-22'),
(15, 'El Trivium y el Quadrivium', '1769-El Trivium y el Quadrivium.pdf', 30, 2, '2023-06-28'),
(16, 'Meliorismo', '1012-MELIORISMO CALEUCHE ABRIL 2023.pdf', 28, 2, '2023-07-05'),
(17, 'Los viajes misteriosos', '2512-Los Viajes Misteriosos - Ernesto Soliz R.pdf', 41, 2, '2023-07-13'),
(18, 'Las herramientas del compañero', '4048-LAS HERRAMIENTAS DEL COMPAÑERO MASON CALEUCHE AGOSTO 2023.pdf', 28, 2, '2023-08-02'),
(19, 'Amos, Cap. 7. Versículo 7 y 8; Análisis Filosófico', '9651-Amos7-7y7-8.pdf', 30, 2, '2023-08-03'),
(20, 'El Símbolo de la Razón', '8473-El símbolo de la razón.pdf', 11, 2, '2023-08-09'),
(21, 'La posición de la escuadra y el compás', '1657-La posición de la escuadra y el compás revisado.pdf', 30, 2, '2023-08-16'),
(22, 'Sois compañero masón', '6858-sois compañero mason Caleuche 2023 (1).pdf', 28, 2, '2023-08-23'),
(23, 'El ritual de apertura y cierre en el Grado de Compañero', '8276-El ritual de apertura y cierre.pdf', 30, 2, '2023-09-13'),
(24, 'Concepto de Pueblo', '6904-CONCEPTO DE PUEBLO 2023.pdf', 28, 2, '2023-09-21');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `useremail` varchar(100) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(100) NOT NULL,
  `token` varchar(100) DEFAULT NULL,
  `image` text,
  `name` varchar(100) DEFAULT NULL,
  `lastname` varchar(100) DEFAULT NULL,
  `date_birthday` date DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `address` varchar(100) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `category` int DEFAULT NULL,
  `date_initiation` date DEFAULT NULL,
  `date_salary` date DEFAULT NULL,
  `date_exalted` date DEFAULT NULL,
  `grado` int DEFAULT NULL,
  `oficialidad` int DEFAULT NULL,
  `estado` tinyint(1) DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf16;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `useremail`, `username`, `password`, `token`, `image`, `name`, `lastname`, `date_birthday`, `phone`, `address`, `city`, `category`, `date_initiation`, `date_salary`, `date_exalted`, `grado`, `oficialidad`, `estado`, `created_at`) VALUES
(7, 'ftorres@gmail.com', '7266082K', '$2y$10$1EAumtigqF6S5oEM5JiiLemy4Cdsi4fKPDXha7V.JXBIFRsqeSTVy', '754bcf4b23f6b6f887e30182f22ac0b7bd577256d26e7e744546ac8403ee855a3aa236909dd98571731913e85f8dd1b1e7c9', '7753-2767-avatar-9.jpg', 'Francisco', 'Torres Osorio', '1957-10-11', NULL, NULL, 'Castro', 3, NULL, NULL, NULL, 3, 2, 1, '2020-09-24 17:53:37'),
(11, 'edgardoruotolo@gmail.com', '270396356', '$2y$10$LwtNT7yid7zNfnkxyHF5/.YoStWcvRo08HBOYtc.cYlF1hHb/.nuy', '253ef9c81e64fb44bd4830151234619ce94c58a66a7c2212991242006a944d462a112c76720ce98a173e86a93f2119ffb795', '4969-7869-avatar-4.jpg', 'Edgardo', 'Ruotolo Cardozo', '1983-01-25', '967553841', 'Antonio Guarategua Lebeck (Nercon)', 'Castro', 1, '2019-11-09', '2022-04-08', '2023-11-23', 3, 7, 1, '2023-03-02 12:40:19'),
(26, 'pablosilva@logiacaleuche.cl', '157128019', '$2y$10$5YjzvrezkmBg/R62AARPWe4tijAU76XMxLbu01yJNPfH43WI0bSL2', '24a7a164b5de597b8431f92eb3b042d84f93772bb3bc4984103ad4fed58e04a67cdef8195f45887ef4767387b44b7e8f1edd', '8431-psilva.png', 'Pablo', 'Silva Silva', '1984-03-18', '978340416', 'Rotonda de Chonchi', 'Chonchi', 3, '2022-04-04', NULL, NULL, 1, 1, 1, '2023-03-31 17:56:36'),
(27, 'isegovia526@gmail.com', '135943363', '$2y$10$nkV89kkMNzy3MGTMkXZcF.gAqgjQSJVgX8BgNi6dexCRhbNfmDRdG', 'b1bbff84a096f6506e6b78b8d55f7c1fdbdfa41316c36aa72b6de943ebed9c56d303007b424e113c6d7a04b461d16db61a3e', '1892-ivan-segovia.jpg', 'Ivan', 'Segovia Barria', '1979-04-19', '984085189', NULL, 'Chonchi', 3, '2022-04-04', NULL, NULL, 1, 1, 1, '2023-04-01 00:15:01'),
(28, 'fdo3012@gmail.com', '103459567', '$2y$10$vqWTixNz5tPGhIV34pS2uutjGoN9aPVCgwg/5z6Pgxwf.8RlWmlxa', 'dacd0d82d4fc80abf3f5eabdb0d6000a73b7179093ad72126d44d6b9130a75786518a63f4c152e83b4849e635e748f726fc0', '9762-fduran.jpg', 'Fernando', 'Durán Salas', '1966-12-30', '994536569', 'Camino a la playa parcela n° 3 Llau Llao', 'Castro', 3, '2008-10-17', '2012-04-20', '2023-09-28', 3, 12, 1, '2023-04-01 00:20:16'),
(29, 'pedromartinezbarria@gmail.com', '67572637', '$2y$10$yvLggo4rrPeT5lC3f/O6suIVH6pebiNYuJNjtVO6tXRYTufTNSCE2', 'cd24514fcb44063df2fc8a50f2289f557057eab34cbc21145ca7a6a95f7927b7ca1653a817b31aecb918072af11d413d2caf', '5878-IMG_3362.jpg', 'Pedro', 'Martinez Barria', '1952-08-07', '998836378', NULL, 'Castro', 3, NULL, NULL, NULL, 3, 3, 1, '2023-04-03 20:58:08'),
(30, 'ps.rubencelis@gmail.com', '106289050', '$2y$10$KmAKtnxe6Wa/2QS5PTwx6OdQTiBkyPiu76ZwVx.6PCqZ0YMWYHZ3.', '195f47e56fd7e9272e4f2e8bb0ac6c3a4571b15a5f2af8afbcdb622e77244a73897be03ad707c99d6df57d115f33232a0b23', '3816-rube-celis.jpeg', 'Rubén', 'Celis Schneider', '1973-03-01', '993372895', 'Av. Francia 1720, Ed. 4, Dep. 505', 'Osorno', 2, '2018-04-02', '2022-05-09', '2023-11-23', 3, 10, 1, '2023-04-17 19:47:28'),
(31, 'ctorresmarquez@gmail.com', '129978120', '$2y$10$0uuxydQVpIgcSf6B.8RmGOyBqRwxnc18NJMB.Kvi7A6sUjmX8mohe', '6b44e42bffa2e81f1233016234cff7a24e1270f2418df83e8d2e1797bd0a8162c761a94301125ff8d2376a399107d20d475e', '9812-288228081_2854709684674296_7511592915573018582_n.jpg', 'Cristian', 'Torres Márquez', '1976-09-19', '988890267', NULL, 'Chonchi', 2, NULL, NULL, NULL, 3, 4, 1, '2023-04-18 16:05:25'),
(32, 'erasmopizarrod@gmail.com', '37558249', '$2y$10$v/YQl/L6LDh79CjXbz3Gmu41ZanJjaUOJuzczVSlKGbfO5Wsb1a/u', 'e84ceeb6f2e3941e54ad5a9b34e57c468ec370eebad2ac406a6423ab91769bbf2a521cf5b5ab91a047ac7fe20f6e3548e543', '4817-default.jpg', 'Erasmo', 'Pizarro Díaz', '1938-01-15', NULL, NULL, 'Castro', 3, NULL, NULL, NULL, 3, 1, 0, '2023-09-09 18:00:10'),
(33, 'hcmb40@yahoo.es', '45127850', '$2y$10$Zcwn2.zwr8rN.IcXlYJdxOSe8ufqt4zVmrr/M37CMcn/EDtyTzDR2', 'c86d89a162b80bf1f89849966f92a0fe7a395eddb761089e809b54c9f4c6657a12a8a288cb4956f2a3feadef0e2120fb05b6', '9217-default.jpg', 'Hector', 'Muñoz Bustamante', '1940-06-06', NULL, NULL, 'Castro', 3, NULL, NULL, NULL, 3, 1, 1, '2023-09-09 18:07:22'),
(34, 'pnar854@gmail.com', '50020428', '$2y$10$EPfcjXTCdG5WhKB7Sd6yNOdoBVgx3B6bYmmc6w9rmaXEsaSU5iqyK', '95bf7e6a95c4a2bfc03f5a273e024604ba4ae9d433155bf5ed37cbb1972b92ebfbe057a4ba0ab3db447a9c2eb55f21e623b0', '5479-default.jpg', 'Pedro', 'Alvarez Rivera', NULL, NULL, NULL, 'Castro', 3, NULL, NULL, NULL, 3, 8, 1, '2023-09-09 18:08:44'),
(35, 'andrade1952@gmail.com', '55348030', '$2y$10$zKNVoWMZUwHVwPI90LW3b.qdjIb85kwmmNkz.0ByC3P0cIx7eJLqS', 'e5e34e7a0e372b141e6afa77bde36c4a60e662399829a26128ab44a7e81f334a424474f1890357ab9184d1f8afd3095e6978', '7875-default.jpg', 'Ramón', 'Andrade Pinochet', '1952-01-21', NULL, NULL, 'Castro', 3, NULL, NULL, NULL, 3, 1, 1, '2023-09-09 18:10:14'),
(36, 'pbravoc@yahoo.es', '62747706', '$2y$10$0VUE9ijjVe5IC722qe2Gx.KWzjt2lfXoeGsOiTByRD8J3eEqgHtL2', '29c452067bb50c013f42deaacf3c72bd0ab5f5f8e0a1d7aa7ebf095c84b8f803eb19f741021eeb4b5fbdbce07e866ce9b98e', '3957-default.jpg', 'Pedro', 'Bravo Crisostomo', '1950-08-06', NULL, NULL, 'Castro', 3, NULL, NULL, NULL, 3, 9, 1, '2023-09-09 18:11:57'),
(37, 'diezytriunfo@hotmail.com', '37509698', '$2y$10$qb7ELV3TMXjEOzpItCCFDOW475HDBO2ODAJups4E4cI80JaZkVxfe', 'd09f84d9f8fd9207ed8a505ba02d3bb6303129fef5c302981cd44c816ef450bc0a3ad61f73a7b925f3c68784a841e818c462', '1532-default.jpg', 'Luis', 'Carcamo Cardenas', NULL, NULL, NULL, 'Castro', 3, NULL, NULL, NULL, 3, 1, 0, '2023-09-09 18:13:21'),
(38, 'ofgb1958@gmail.com', '71177521', '$2y$10$FsCe9IBFFyj5Lpw5K9tMe.ZxQTLbBwSoCAnbb7jTIWSp4bnsi9CIu', '23ccd3798c4520df151c3b149d508866dede4ed0c899e6c8c985cf3aa8c087d3dbdeb2f253d5a8afabbbd966205776ae08c6', '1407-default.jpg', 'Oscar', 'Gomez Borquez', '1958-04-15', '', 'Vilupulli Rural Chonchi', 'Chonchi', 3, NULL, NULL, NULL, 3, 8, 0, '2023-09-09 18:14:30'),
(39, 'borisbarra202@gmail.com', '79153427', '$2y$10$TYgh.FBexsimsWYuneEeV.3tUeqKfWsv.7Cdg514O8GKN0.is4nc6', 'd19fb18f2d988dce66681ff1be0970029a1a4173d422070ddc6cd6dae6aa0deac9ec5c6d15d333e1280b5bee7f8ef80ae722', '8951-default.jpg', 'Boris', 'Barra Uribe', '1958-12-30', NULL, NULL, 'Ancud', 3, NULL, NULL, NULL, 3, 1, 1, '2023-09-09 18:15:48'),
(40, 'dantemontiel@hotmail.com', '78049650', '$2y$10$QbIMdjcbJSd0.Igg2i5jN.stjd854sFud6otEJKjCKiBTajn.sMBu', '0187697df74d000779fbfcfc6a87ab80b824e9762376de30321b7e8863014b8a8ac8bf9aa5b618e5a6e5b173bc4c2ba05ab2', '3571-default.jpg', 'Dante', 'Montiel Vera', '1959-03-31', '977586786', NULL, 'Castro', 3, NULL, NULL, NULL, 3, 5, 1, '2023-09-09 18:17:03'),
(41, 'solizernesto@gmail.com', '82731156', '$2y$10$V8McdjS9/5l9KzyjYI3Rve4uoP4IVfCS9upCVDghW8GCE9OvBWm/6', '45b9c659896bc3e0f225d0f6e0af2698925207d7e2934527f35a625e19f6adf5817bdef57c975fd09d48ff69ba68ded99f3f', '1443-default.jpg', 'Ernesto', 'Soliz Romero', '1959-07-20', NULL, NULL, 'Ancud', 3, NULL, NULL, NULL, 3, 1, 0, '2023-09-09 18:19:00'),
(42, 'juandiaz7.saldivia@gmail.com', '85088971', '$2y$10$nlSxZkgmq3Yc34Fvofbnb..PFWQkHVdx.pTBf7bl/rBDsOH1EMdqC', '3e104c1943764fa8e211b8c3b00061c65e2977ca42ac90775853ec709f7a993376606191162477d4629e89a58cd2d3a126c7', '1402-default.jpg', 'Juan', 'Díaz Saldivia', '1959-11-23', '982193495', 'Yerbas Buenas 12 P.banco Estado ', 'Ancud', 3, NULL, NULL, NULL, 3, 11, 1, '2023-09-09 18:22:28'),
(43, 'mloaizaperez@yahoo.es', '9267259k', '$2y$10$2cm9umWBk5TKeb.ahUGxBOsLTYWrh0n0j3ob.WxJuc4sPbTR5gSri', 'cd587a979fee493fdce378d37506b876a3430eb1d0867b8e4011252d9cd43163fa4ebaea80dc2e3dd9598d86296ad4e55e22', '4747-default.jpg', 'Manuel', 'Loaiza Perez', '1964-03-26', NULL, NULL, 'Castro', 3, NULL, NULL, NULL, 3, 6, 1, '2023-09-09 18:23:56'),
(45, 'lobosroa@gmail.com', '133582142', '$2y$10$QtvU6ij66Cn2iFqJaEBlbOyTj6.cqjJmc/xCFVFxbWystJzi/Q/Ia', 'd3c932c245d9ed610613117ba17ef6697042c55f306788f9076f4b041d907531061caba95d076c3bf4548e6eda62a7b7ffc2', '8890-default.jpg', 'Felipe', 'Lobos Roa', '1978-06-04', NULL, NULL, 'Ancud', 3, NULL, NULL, NULL, 3, 13, 1, '2023-09-09 18:26:37'),
(46, 'juanluisserra@gmail.com', '7096242k', '$2y$10$EzdANz7h116ZZwMNZ3B2ce4uzOO55ObJCx0ldomT30R8M06zJYV.W', '84b7a21865600e6c1726e4b75e847e2be86330f082004ec8efa7f4981db87dfb0ce718ff1f3cbb6659b57a41a0ef5271d118', '7124-default.jpg', 'Juan Luis', 'Serra Orellana', '1956-12-24', NULL, NULL, 'Castro', 3, NULL, NULL, NULL, 3, 14, 1, '2023-09-09 18:28:19'),
(47, 'alvaroaguila67@yahoo.es', '131204213', '$2y$10$kIc3PkiVWPyDPWY/QkEzpe6wu5M3P0ds0UlPieFo8OyMUkblRVI5a', 'f5fa22c15eca0466eca87f97d8f8c0951abc12c4dab98b180159066ecd3d043acf11dacb81e4afeb468dc55bf646b607ed1b', '5860-default.jpg', 'José Álvaro', 'Aguila Seguel', '1976-01-26', NULL, NULL, NULL, 3, NULL, '2025-10-23', NULL, 2, 1, 1, '2023-09-15 20:26:24'),
(48, 'ju.veas@gmail.com', '169235791', '$2y$10$a/vdVNJaCsTuR5PwX4AlMuf7xn1mCRxyf/gzW/slgcreKR8J03zrC', '9a246a409091c7274a0fa29dfdeb1414e1992ee16377cbaf52e899d1a2f57ade467e6f34cd5042e0a72f883bcaab716f55a5', '9413-368355428_10230938335100734_1876963847099256149_n.jpg', 'Julio', 'Veas Pinochet', NULL, '983555267', NULL, NULL, 3, NULL, NULL, NULL, 2, 1, 0, '2023-12-12 22:36:46'),
(49, 'drmoba7@gmail.com', '221158857', '$2y$10$7MwAoVmLYwRmpUTdbnGzYOMCx7zpoRw9VkC2rrhiRayXYz0pf7E/e', 'ff591f93572efb461b4456d6c991bd1d2e5eb1ed1c1b7bfc45fa2c976408a3af284e3eb68746f92fccb072cb1d30aa6424ee', '4652-IDPhoto_20241024_174443.jpg', 'Mario Oswaldo', 'Baquerizo Albán', '1974-06-29', '+56990010489', 'Ciprés 18', 'Queilén ', 3, '2024-04-04', NULL, NULL, 1, 1, 1, '2024-04-03 16:30:45'),
(50, 'luis.carreno.gallardo@gmail.com', '143782603', '$2y$10$lW3U7hXL7/sEUs8KqDHVVujKVOqJ5BpkLDScsqI4vfBiuLdYBI6KO', '9a898491dab1a0e82a4048320c183ad8e3b7dd351c63653d7349956dc19e211666e38d01b8f484534728e267bc3bad1b497a', '4992-', 'Luis Jacob', 'Carreño Gallardo', NULL, NULL, NULL, NULL, 3, NULL, NULL, NULL, 1, 1, 0, '2024-04-04 14:05:16'),
(51, 'mebarria47@gmail.com', '58593753', '$2y$10$iMmlfKcVJLCms/D2HU.Wsu5ZPzJkR5YkIe1mqsqAYgv5zpGVnUxiW', 'a639549da568fa8c862f647631c666dd8963ca7db7247a96ef40537b1ee17fc9ef3764fff409837d351f245bc4e93c369b81', '3958-Captura de pantalla 2024-04-25 a la(s) 15.33.59.png', 'Manuel Enrique', 'Barria Barria', NULL, NULL, NULL, NULL, 3, NULL, NULL, NULL, 1, 1, 1, '2024-04-25 19:34:25'),
(52, 'tavi_64@hotmail.com', '97440484', '$2y$10$HhnYrK02kk/yWW/BtR5mJeUE0tsU.r0POe96dSSvcxJ3XJSjJc57u', 'fda1edc137f31a9acc414320c1db110850a45b0d514b7775328c5f9fb63130fd6e2ea3c84a40c30276b19cb997e294ea78f0', '5693-1450936_10202652789379859_1593900097_n.jpg', 'Gustavo', 'Cubillos', NULL, NULL, NULL, NULL, 3, NULL, NULL, NULL, 3, 1, 0, '2024-04-27 20:38:14'),
(53, 'dannyfranco@gmail.com', '256451409', '$2y$10$mw9ylVD7NdMPyJCyBn.De.YrZuIMX3IowMvuzJRu9z3p44.B.8wFa', 'aaef1720068331a0b4f4f2bda52bf514e6df76c6929ffb86fda057a6b8d6b5e268102f9636f6acc19337d3f231e3f4584bfc', '6932-dannyfranco_foto_perfil.png', 'Danny Alexander', 'Franco Figuera', '1978-08-06', '+56987241101', 'Ubaldo Mansilla 131, 5700328 Castro, Los Lagos', 'Castro', 3, NULL, NULL, NULL, 1, 1, 1, '2024-09-06 22:03:56'),
(54, 'ignaciomontielandrade@gmail.com', '177207845', '$2y$10$VEGqWhyfkEf2kpxO5b1GZubN5RvzHK12yb2LmKxlP/SGF.z9hqrl6', '65593d263cdf107a6be50b5c19fc4a64a55b315702446adcf082a514275f89b22d38718b8515b721457fea09ff87728edf28', '1748-', 'Ignacio Antonio', 'Montiel Andrade', NULL, NULL, NULL, NULL, 3, NULL, NULL, NULL, 1, 1, 1, '2024-09-11 20:47:58'),
(55, 'cm.alquimetspa@gmail.com', '158843668', '$2y$10$tOGTpBCVsyvmxAeYKwFCDOC7PBm8XKzkmKU8OZNhTyk0RB4Z1kBzu', 'de883150f1beeb678427957bd742d25d143b7243dc9f7c5639fe25803569d09383236a7d7ff258c4d8f4d7b65801aa41c6c9', '6767-', 'Claudio Leonardo', 'Mella Chico', '1984-11-06', NULL, NULL, NULL, 3, '2024-11-07', NULL, NULL, 1, 1, 1, '2024-11-11 14:40:15'),
(56, 'velasquezcortes86@gmail.com', '164528839', '$2y$10$XLDL/U5x5gNbWLP9J.orIO8PtqvESXta022bhxi6eYt8Mdq5cCFU.', '00cfa37efd046fb8eeb7ec31e2acde97c258f3a13c718d61d64794e55b93aab5f964741125be1932b51f51271b7b0547a711', '9677-', 'Carlos Alberto', 'Velásquez Cortés', NULL, NULL, NULL, NULL, 3, NULL, NULL, NULL, 1, 1, 1, '2025-04-03 13:56:49'),
(57, 'Cristian.azocarvas@gmail.com', '171974941', '$2y$10$i5b96U0IGZVntXQMFZRX0OODmIO5fz.HCspshUxmBybbrrRkVf3aW', 'c0c703b1afb16daf415cffd6d9e77ec6ce33ff4be63eec28c176f1715a9768236acc01ed45d48ba695bc6547c8b942813e6b', '2563-', 'Cristian', 'Azocar Vasquez', NULL, NULL, NULL, NULL, 3, NULL, NULL, NULL, 1, 1, 1, '2025-07-22 22:14:36'),
(58, 'aguilaalvarado@gmail.com', '120246348', '$2y$10$yGlpQSYmdqhprL07yD9ZI.SEKBemGM4FxLaOj8PNEg3Kr3x3h83cu', '0239cd15f5bf927376b2f848272acf8f3bafaacdc92f0eb3fb53d4b706de5a65209f72aad44a9abf88fee491f8c7af3c9c21', '6739-', 'Luis', 'Águila Alvarado', NULL, NULL, NULL, NULL, 3, NULL, NULL, NULL, 1, 1, 1, '2025-07-22 22:15:25'),
(59, 'jorgebustos@logiacaleuche.cl', '87483290', '$2y$10$53QP91bCgE6kLqBYHYhN7OD8h5rWusx5MVGsvjmWx6D0kIzU80/ja', '170f9b16c2da09b7881520b7a488853c44ff14dc53d048008db12b21507591fe753a955bd10280d2528c4af15370b1f5aabd', '2096-Captura de pantalla 2025-11-07 a la(s) 11.13.13.png', 'Jorge Silvano', 'Bustos Cabrera', '1965-10-30', '950195488', 'Pasaje Los Robles s/n Putemun ', 'Castro', 3, NULL, NULL, NULL, 3, 1, 1, '2025-12-01 14:13:41');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user_category`
--

CREATE TABLE `user_category` (
  `id_Cat` int NOT NULL,
  `cat_Nombre` varchar(255) CHARACTER SET utf8mb3 DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf16;

--
-- Volcado de datos para la tabla `user_category`
--

INSERT INTO `user_category` (`id_Cat`, `cat_Nombre`) VALUES
(1, 'Super Administrador'),
(2, 'Administrador'),
(3, 'Usuario');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `acta`
--
ALTER TABLE `acta`
  ADD PRIMARY KEY (`id_Acta`),
  ADD KEY `acta_grado_id_fk` (`grado_Acta`);

--
-- Indices de la tabla `biblioteca`
--
ALTER TABLE `biblioteca`
  ADD PRIMARY KEY (`id_Libro`),
  ADD KEY `biblioteca_grado_id_fk` (`grado_Libro`);

--
-- Indices de la tabla `boletin`
--
ALTER TABLE `boletin`
  ADD PRIMARY KEY (`id_Boletin`),
  ADD KEY `boletin_grado_id_fk` (`grado_Boletin`);

--
-- Indices de la tabla `categoryevent`
--
ALTER TABLE `categoryevent`
  ADD PRIMARY KEY (`id_Category`);

--
-- Indices de la tabla `categoryfeed`
--
ALTER TABLE `categoryfeed`
  ADD PRIMARY KEY (`id_Category`);

--
-- Indices de la tabla `commentsfeed`
--
ALTER TABLE `commentsfeed`
  ADD PRIMARY KEY (`id_Comment`),
  ADD KEY `commentsfeed_users_id_fk` (`user_Comment`),
  ADD KEY `commentsfeed_feed_id_Feed_fk` (`feed_Comment`);

--
-- Indices de la tabla `documents`
--
ALTER TABLE `documents`
  ADD PRIMARY KEY (`id_Doc`);

--
-- Indices de la tabla `entradadinero`
--
ALTER TABLE `entradadinero`
  ADD PRIMARY KEY (`id_Entrada`),
  ADD KEY `entradadinero_users_id_fk` (`id_User`),
  ADD KEY `entradadinero_entradamotivo_id_Motivo_fk` (`entrada_Motivo`);

--
-- Indices de la tabla `entradamotivo`
--
ALTER TABLE `entradamotivo`
  ADD PRIMARY KEY (`id_Motivo`);

--
-- Indices de la tabla `evento`
--
ALTER TABLE `evento`
  ADD PRIMARY KEY (`id_Evento`),
  ADD KEY `evento_categoryevent_id_Category_fk` (`cat_Evento`);

--
-- Indices de la tabla `feed`
--
ALTER TABLE `feed`
  ADD PRIMARY KEY (`id_Feed`),
  ADD KEY `feed_categoryfeed_id_Category_fk` (`category_Feed`),
  ADD KEY `feed_users_id_fk` (`user_Feed`);

--
-- Indices de la tabla `files`
--
ALTER TABLE `files`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `grado`
--
ALTER TABLE `grado`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `message`
--
ALTER TABLE `message`
  ADD PRIMARY KEY (`id_Message`),
  ADD KEY `message_users_id_fk` (`from_Message`);

--
-- Indices de la tabla `noticias`
--
ALTER TABLE `noticias`
  ADD PRIMARY KEY (`id_Noticia`),
  ADD KEY `noticias_users_id_fk` (`id_User`),
  ADD KEY `noticias_Categoria_fk` (`id_Categoria`);

--
-- Indices de la tabla `noticias_category`
--
ALTER TABLE `noticias_category`
  ADD PRIMARY KEY (`id_Categoria`);

--
-- Indices de la tabla `oficiales`
--
ALTER TABLE `oficiales`
  ADD PRIMARY KEY (`id_Oficial`);

--
-- Indices de la tabla `salidadinero`
--
ALTER TABLE `salidadinero`
  ADD PRIMARY KEY (`id_Salida`),
  ADD KEY `salidadinero_salidamotivo_id_SalidaMotivo_fk` (`salida_Motivo`),
  ADD KEY `salidadinero_users_id_fk` (`id_User`);

--
-- Indices de la tabla `salidamotivo`
--
ALTER TABLE `salidamotivo`
  ADD PRIMARY KEY (`id_SalidaMotivo`);

--
-- Indices de la tabla `trazado`
--
ALTER TABLE `trazado`
  ADD PRIMARY KEY (`id_Trazado`),
  ADD KEY `trazado_grado_id_fk` (`grado_Trazado`),
  ADD KEY `trazado_users_id_fk` (`autor_Trazado`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `useremail` (`useremail`),
  ADD KEY `users_grado_id_fk` (`grado`),
  ADD KEY `users_oficiales_id_Oficial_fk` (`oficialidad`),
  ADD KEY `users_user_category_id_Cat_fk` (`category`);

--
-- Indices de la tabla `user_category`
--
ALTER TABLE `user_category`
  ADD PRIMARY KEY (`id_Cat`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `acta`
--
ALTER TABLE `acta`
  MODIFY `id_Acta` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `biblioteca`
--
ALTER TABLE `biblioteca`
  MODIFY `id_Libro` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT de la tabla `boletin`
--
ALTER TABLE `boletin`
  MODIFY `id_Boletin` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT de la tabla `categoryevent`
--
ALTER TABLE `categoryevent`
  MODIFY `id_Category` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `commentsfeed`
--
ALTER TABLE `commentsfeed`
  MODIFY `id_Comment` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `documents`
--
ALTER TABLE `documents`
  MODIFY `id_Doc` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `entradadinero`
--
ALTER TABLE `entradadinero`
  MODIFY `id_Entrada` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=808;

--
-- AUTO_INCREMENT de la tabla `feed`
--
ALTER TABLE `feed`
  MODIFY `id_Feed` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT de la tabla `files`
--
ALTER TABLE `files`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `grado`
--
ALTER TABLE `grado`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `message`
--
ALTER TABLE `message`
  MODIFY `id_Message` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `noticias`
--
ALTER TABLE `noticias`
  MODIFY `id_Noticia` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `noticias_category`
--
ALTER TABLE `noticias_category`
  MODIFY `id_Categoria` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `salidadinero`
--
ALTER TABLE `salidadinero`
  MODIFY `id_Salida` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=210;

--
-- AUTO_INCREMENT de la tabla `trazado`
--
ALTER TABLE `trazado`
  MODIFY `id_Trazado` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=60;

--
-- AUTO_INCREMENT de la tabla `user_category`
--
ALTER TABLE `user_category`
  MODIFY `id_Cat` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `acta`
--
ALTER TABLE `acta`
  ADD CONSTRAINT `acta_grado_id_fk` FOREIGN KEY (`grado_Acta`) REFERENCES `grado` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Filtros para la tabla `biblioteca`
--
ALTER TABLE `biblioteca`
  ADD CONSTRAINT `biblioteca_grado_id_fk` FOREIGN KEY (`grado_Libro`) REFERENCES `grado` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Filtros para la tabla `boletin`
--
ALTER TABLE `boletin`
  ADD CONSTRAINT `boletin_grado_id_fk` FOREIGN KEY (`grado_Boletin`) REFERENCES `grado` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Filtros para la tabla `commentsfeed`
--
ALTER TABLE `commentsfeed`
  ADD CONSTRAINT `commentsfeed_feed_id_Feed_fk` FOREIGN KEY (`feed_Comment`) REFERENCES `feed` (`id_Feed`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `commentsfeed_users_id_fk` FOREIGN KEY (`user_Comment`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Filtros para la tabla `entradadinero`
--
ALTER TABLE `entradadinero`
  ADD CONSTRAINT `entradadinero_entradamotivo_id_Motivo_fk` FOREIGN KEY (`entrada_Motivo`) REFERENCES `entradamotivo` (`id_Motivo`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `entradadinero_users_id_fk` FOREIGN KEY (`id_User`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Filtros para la tabla `evento`
--
ALTER TABLE `evento`
  ADD CONSTRAINT `evento_categoryevent_id_Category_fk` FOREIGN KEY (`cat_Evento`) REFERENCES `categoryevent` (`id_Category`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Filtros para la tabla `feed`
--
ALTER TABLE `feed`
  ADD CONSTRAINT `feed_categoryfeed_id_Category_fk` FOREIGN KEY (`category_Feed`) REFERENCES `categoryfeed` (`id_Category`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `feed_users_id_fk` FOREIGN KEY (`user_Feed`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Filtros para la tabla `message`
--
ALTER TABLE `message`
  ADD CONSTRAINT `message_users_id_fk` FOREIGN KEY (`from_Message`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Filtros para la tabla `noticias`
--
ALTER TABLE `noticias`
  ADD CONSTRAINT `noticias_Categoria_fk` FOREIGN KEY (`id_Categoria`) REFERENCES `noticias_category` (`id_Categoria`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `noticias_users_id_fk` FOREIGN KEY (`id_User`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Filtros para la tabla `salidadinero`
--
ALTER TABLE `salidadinero`
  ADD CONSTRAINT `salidadinero_salidamotivo_id_SalidaMotivo_fk` FOREIGN KEY (`salida_Motivo`) REFERENCES `salidamotivo` (`id_SalidaMotivo`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `salidadinero_users_id_fk` FOREIGN KEY (`id_User`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Filtros para la tabla `trazado`
--
ALTER TABLE `trazado`
  ADD CONSTRAINT `trazado_grado_id_fk` FOREIGN KEY (`grado_Trazado`) REFERENCES `grado` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `trazado_users_id_fk` FOREIGN KEY (`autor_Trazado`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Filtros para la tabla `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_grado_id_fk` FOREIGN KEY (`grado`) REFERENCES `grado` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `users_oficiales_id_Oficial_fk` FOREIGN KEY (`oficialidad`) REFERENCES `oficiales` (`id_Oficial`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `users_user_category_id_Cat_fk` FOREIGN KEY (`category`) REFERENCES `user_category` (`id_Cat`) ON DELETE RESTRICT ON UPDATE RESTRICT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
