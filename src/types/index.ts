export interface Termin {
  id: string;
  datum: string;
  cas: string;
  tema: string;
  maxUcastniku: number;
  ucastnici: Ucastnik[];
  vytvoren: string;
}

export interface Ucastnik {
  id: string;
  jmeno: string;
  email: string;
  telefon?: string;
  registrovan: string;
}

export interface AdminUser {
  username: string;
  password: string;
}