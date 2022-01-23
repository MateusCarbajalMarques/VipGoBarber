import { ValidationError } from 'yup';

interface Errors {
    [key: string]: string;
}

export default function getValidationErros(err: ValidationError): Errors {
    const validationError: Errors = {};

    err.inner.forEach(error => { if (error.path) validationError[error.path] = error.message;});


    return validationError;
}