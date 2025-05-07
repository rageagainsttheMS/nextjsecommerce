import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertToPlainObject<T>(value : T): T {
  return JSON.parse(JSON.stringify(value));
}

export function formatNumberWithDecimal(num: number): string {
  const [intValue, floatValue] = num.toString().split('.');
  return floatValue ? `${intValue}.${floatValue.padEnd(2, '0')}` : `${intValue}.00`;
}

//eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatErrors(error : any){
    if(error.name === 'ZodError'){
      const fieldErrors = Object.keys(error.errors).map((field) => error.errors[field].message);
      return fieldErrors.join('. ',);
    } else if(error.name === 'PrismaClientKnownRequestError'){
      const field = error.meta?.target ?  error.meta.target[0] : 'Field';
      return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    } else {
      return typeof error.message === 'string' ? error.message : JSON.stringify(error.message)
    }
}
