import {
  equals,
  prop,
  compose,
  not,
  anyPass,
  allPass,
  cond,
  T,
  F,
  filter,
  length,
  lte,
  gte,
} from "ramda";
import { COLORS, SHAPES } from "../constants";

/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

// Цвета
const isColorGreen = equals(COLORS.GREEN);
const isColorBlue = equals(COLORS.BLUE);
const isColorOrange = equals(COLORS.ORANGE);
const isColorRed = equals(COLORS.RED);
const isColorWhite = equals(COLORS.WHITE);

// Формы
const starColor = prop(SHAPES.STAR);
const circleColor = prop(SHAPES.CIRCLE);
const squareColor = prop(SHAPES.SQUARE);
const triangleColor = prop(SHAPES.TRIANGLE);

// Предикаты цветов форм
const isTriangleGreen = compose(isColorGreen, triangleColor);
const isTriangleWhite = compose(isColorWhite, triangleColor);
const isTriangleNotWhite = compose(not, isTriangleWhite);

const isCircleBlue = compose(isColorBlue, circleColor);
const isCircleWhite = compose(isColorWhite, circleColor);
const isCircleNotWhite = compose(not, isCircleWhite);

const isStarRed = compose(isColorRed, starColor);
const isStarWhite = compose(isColorWhite, starColor);
const isStarNotRed = compose(not, isStarRed);
const isStarNotWhite = compose(not, isStarWhite);

const isSquareGreen = compose(isColorGreen, squareColor);
const isSquareOrange = compose(isColorOrange, squareColor);
const isSquareWhite = compose(isColorWhite, squareColor);
const isSquareNotWhite = compose(not, isSquareWhite);

const isTriangleOrCircleNotWhite = anyPass([
  isTriangleNotWhite,
  isCircleNotWhite,
]);
const isStarRedAndSquareGreen = allPass([isStarRed, isSquareGreen]);

// Разное
const objectKeysLength = compose(length, Object.keys);

// Фильтры
const onlyGreenShapes = filter(isColorGreen);
const onlyRedShapes = filter(isColorRed);
const onlyBlueShapes = filter(isColorBlue);
const onlyWhiteShapes = filter(isColorWhite);
const onlyOrangeShapes = filter(isColorOrange);

// Размеры списков
const qtyOfGreenShapes = compose(objectKeysLength, onlyGreenShapes);
const qtyOfBlueShapes = compose(objectKeysLength, onlyBlueShapes);
const qtyOfRedShapes = compose(objectKeysLength, onlyRedShapes);
const qtyOfWhiteShapes = compose(objectKeysLength, onlyWhiteShapes);
const qtyOfOrangeShapes = compose(objectKeysLength, onlyOrangeShapes);

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = cond([
  [isTriangleOrCircleNotWhite, F],
  [isStarRedAndSquareGreen, T],
]);

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = compose(lte(2), qtyOfGreenShapes);

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = (shapes) =>
  qtyOfBlueShapes(shapes) === qtyOfRedShapes(shapes);

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = allPass([
  isCircleBlue,
  isStarRed,
  isSquareOrange,
]);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = compose(gte(1), qtyOfWhiteShapes);

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = allPass([
  isTriangleGreen,
  compose(equals(2), qtyOfGreenShapes),
  compose(equals(1), qtyOfRedShapes),
]);

// 7. Все фигуры оранжевые.
export const validateFieldN7 = compose(equals(4), qtyOfOrangeShapes);

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = allPass([isStarNotRed, isStarNotWhite]);

// 9. Все фигуры зеленые.
export const validateFieldN9 = compose(equals(4), qtyOfGreenShapes);

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = allPass([
  isTriangleNotWhite,
  isSquareNotWhite,
  (shapes) => triangleColor(shapes) === squareColor(shapes),
]);
