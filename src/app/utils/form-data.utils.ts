// TODO: change type to toFormData<T>(formValue: T)
export default function toFormData(formValue: any) {
  const formData = new FormData();

  // eslint-disable-next-line no-restricted-syntax
  for (const key of Object.keys(formValue)) {
    const value = formValue[key];

    formData.append(key, value);
  }

  return formData;
}
