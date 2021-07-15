import {
  allPass,
  pipe,
  prop,
  tap,
  gt,
  lt,
  curry,
  partialRight,
  andThen,
  otherwise,
} from "ramda";
import { round } from "lodash";

/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import Api from "../tools/api";

const api = new Api();

// API
const convertNumber = api.get("https://api.tech/numbers/base");
const fetchAnimal = (id) => api.get(`https://animals.tech/${id}`)({});

// Validation
const getSymbolsQty = (val) => `${val}`.length;
const symbolsQtyLt10 = pipe(getSymbolsQty, gt(10));
const symbolsQtyGt2 = pipe(getSymbolsQty, lt(2));
const isValidBase10Number = (val) => /^[0-9]+(\.[0-9]+)?$/.test(`${val}`);

const validateFn = curry((error, validate, value) => {
  const isNotValid = !validate(value);

  if (isNotValid) {
    error("ValidationError");
  }
});

const validatorFn = allPass([
  isValidBase10Number,
  symbolsQtyLt10,
  symbolsQtyGt2,
  lt(0),
]);

// Getters
const getResponseValue = prop("result");
const getValue = prop("value");
// const getWriteLog = prop("writeLog");
// const getHandleSuccess = prop("handleSuccess");
// const getHandleError = prop("handleError");

// Misc
const roundToPrecisionOf1 = partialRight(round, [1]);
const mod3 = (val) => val % 3;
const square = partialRight(Math.pow, [2]);
const convertToBinary = (val) =>
  convertNumber({ number: val, from: 10, to: 2 });

// Задание
const processSequence = (param) => {
  const { writeLog, handleSuccess, handleError } = param;

  const log = tap(writeLog);
  const validateValue = tap(validateFn(handleError, validatorFn));
  const handleReject = otherwise(handleError);

  // Сдесь наверное можно было поставить try/catch
  // и потом выкидывать ошибки в валидации чтобы остановить пайплайн
  // но из задания непонятно можно ли так делать

  pipe(
    getValue,
    log,
    validateValue,
    roundToPrecisionOf1,
    log,
    convertToBinary,
    handleReject,
    andThen(
      pipe(
        getResponseValue,
        log,
        getSymbolsQty,
        log,
        square,
        log,
        mod3,
        log,
        fetchAnimal,
        handleReject,
        andThen(pipe(getResponseValue, handleSuccess))
      )
    )
  )(param);
};

export default processSequence;
