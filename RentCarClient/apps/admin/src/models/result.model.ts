export interface Result<T>{
   data?:T;
   errorMessage?: string[];
   isSuccessful: boolean;
   statusCode: number;
}
