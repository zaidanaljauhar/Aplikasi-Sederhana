export interface Student {
  nim: number;
  nama: string;
  alamat: string;
  jurusan: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StudentFormData {
  nim: number;
  nama: string;
  alamat: string;
  jurusan: string;
}