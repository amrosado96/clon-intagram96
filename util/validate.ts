export const emailValidate = (values: string) => {
  let errors = '';
  const regex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  const regexTwo = /@/;

  if (values.length === 0) {
    errors = 'El correo es obligatorio!';
  } else if (!regexTwo.test(values)) {
    errors = 'Por favor incluye un "@" en tu dirección de correo electrónico';
  } else if (!regex.test(values)) {
    errors = 'Por favor utiliza una dirección de correo electrónico válida!';
  } else if (values.length > 30) {
    errors = 'El correo no puede exceder más de 30 caracteres';
  }
  return errors;
};

export const passwordValidate = (values: string) => {
  let errors = '';
  const regexLetters = /^(?=.*[a-z])(?=.*[A-Z])/;
  const regexNumbers = /^(?=.*[0-9])/;

  if (values.length === 0) {
    errors = 'La contraseña es obligatoria!';
  } else if (!regexLetters.test(values)) {
    errors = 'La contraseña debe contener al menos una letra minúscula y una letra mayúscula';
  } else if (!regexNumbers.test(values)) {
    errors = 'La contraseña debe contener al menos un número';
  } else if (values.length < 8) {
    errors = 'La contraseña debe tener al menos ocho caracteres';
  } else if (values.length > 30) {
    errors = 'La contraseña no puede exceder más de 30 caracteres';
  }

  return errors;
};

export const usernameValidate = (values: string) => {
  let errors = '';
  const regexLetters = /^[a-zA-Z]+$/;

  if (values.length === 0) {
    errors = 'El nombre de usuario es obligatorio!';
  } else if (!regexLetters.test(values)) {
    errors =
      'El nombre de usuario debe contener al menos una letra minúscula, una letra mayúscula y solo caracteres alfabéticos';
  } else if (values.length < 5) {
    errors = 'El nombre de usuario debe tener al menos cinco caracteres';
  } else if (values.length > 13) {
    errors = 'El nombre de usuario no puede exceder más de 13 caracteres';
  }

  return errors;
};
