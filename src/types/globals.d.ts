type Env = "local" | "dev" | "stage" | "prod";
declare module "@env" {
  export const API_URL: string;
  export const APP_ENV: Env;
}
