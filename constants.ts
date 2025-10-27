
import { Student } from './types';

export const INITIAL_STUDENTS: Student[] = [
  { "id": "52f430c6-b6f9-4a08-ada7-7356f143f0d1", "nama": "Habel Irenza Sitopu", "umur": 20, "kelas": "7C", "gender": "L", "ssw": "Kaigo", "tb": 164, "bb": 56 },
  { "id": "503f0302-1e5e-4010-b239-c5c7bbcad022", "nama": "Robi Ginting", "umur": 20, "kelas": "Kelas Mensetsu", "gender": "L", "ssw": "Kaigo", "tb": 167, "bb": 81 },
  { "id": "9b98377e-51cf-4ca6-868f-3b8b907b61c2", "nama": "King Samurai", "umur": 20, "kelas": "7B", "gender": "L", "ssw": "Belum ada", "tb": 169, "bb": 69 },
  { "id": "038667de-59a9-4e13-a9b8-a0d69f0bbbaf", "nama": "Jon Setiawan Damanik", "umur": 19, "kelas": "7B", "gender": "L", "ssw": "Belum ada", "tb": 165, "bb": 59 },
  { "id": "b168c66c-8fd8-4cc2-b7d8-da903c1c8585", "nama": "Rani Tobing", "umur": 20, "kelas": "7C", "gender": "P", "ssw": "Kaigo", "tb": 148, "bb": 45 },
  { "id": "239ac26f-5dce-45f0-9b66-1af9cd2d06a5", "nama": "Rivan", "umur": 20, "kelas": "7A", "gender": "L", "ssw": "Kaigo", "tb": 167, "bb": 60 },
  { "id": "d0df22c6-0206-4af9-9b6e-44200e45812c", "nama": "Immanuel", "umur": 20, "kelas": "7C", "gender": "L", "ssw": "Kaigo, Restoran", "tb": 161, "bb": 53 },
  { "id": "5b722540-20fd-494d-82f4-e0ba246ac446", "nama": "Hime", "umur": 18, "kelas": "7C", "gender": "P", "ssw": "Kaigo, Pengolahan Makanan", "tb": 159, "bb": 48 },
  { "id": "d8ddbff4-22ab-4613-a9eb-cf63a8b222b8", "nama": "Haruka", "umur": 20, "kelas": "7A", "gender": "P", "ssw": "Kaigo, Peternakan", "tb": 160, "bb": 49 },
  { "id": "40ebbc22-8957-4cda-bb82-485ffd04aba5", "nama": "Akihiko", "umur": 20, "kelas": "7C", "gender": "L", "ssw": "Kaigo, Pengolahan Makanan", "tb": 165, "bb": 57 },
  { "id": "1fcfd23c-c380-4745-aa34-ceddb64f18b1", "nama": "Yuki", "umur": 18, "kelas": "7B", "gender": "P", "ssw": "Peternakan", "tb": 158, "bb": 49 },
  { "id": "3d1bc780-84b9-4cd3-b4db-07dab8fca2bb", "nama": "Nori", "umur": 17, "kelas": "7C", "gender": "P", "ssw": "Pembersihan Gedung", "tb": 162, "bb": 50 },
  { "id": "6768c214-ffe1-44d5-9ff1-8323e61a42a6", "nama": "Saskeh", "umur": 20, "kelas": "7C", "gender": "L", "ssw": "Konstruksi", "tb": 165, "bb": 58 },
  { "id": "dd76d93a-f21f-485a-aeb0-32d0cccd75f4", "nama": "Sachi", "umur": 19, "kelas": "Kelas Mensetsu", "gender": "L", "ssw": "Perikanan", "tb": 165, "bb": 56 },
  { "id": "125a9b2a-5089-4e35-9565-d15f9f1b6d20", "nama": "Nagano", "umur": 25, "kelas": "7C", "gender": "L", "ssw": "Pembersihan Gedung, Perikanan", "tb": 166, "bb": 57 },
  { "id": "e82a0c34-4277-422c-ad38-ecb52d601459", "nama": "Nartoh", "umur": 20, "kelas": "7C", "gender": "L", "ssw": "Pertanian, Konstruksi, Pembersihan Gedung", "tb": 165, "bb": 57 },
  { "id": "f4374ea3-f653-4964-af87-9fca8c0de30c", "nama": "Rawr", "umur": 35, "kelas": "7C", "gender": "L", "ssw": "Pembersihan Gedung", "tb": 168, "bb": 99 },
  { "id": "a437f93e-54a1-45bf-929e-3f83da983a4a", "nama": "Ayam", "umur": 999, "kelas": "Kelas Mensetsu", "gender": "L", "ssw": "SSW", "tb": 999, "bb": 999 }
];

export const KELAS_OPTIONS = ["7A", "7B", "7C", "Kelas Mensetsu"];

export const GENDER_OPTIONS = [
  { value: "L", label: "Laki-laki" },
  { value: "P", label: "Perempuan" },
];

export const SSW_OPTIONS = [
  "Kaigo",
  "Pengolahan Makanan",
  "Restoran",
  "Pertanian",
  "Konstruksi",
  "Pembersihan Gedung",
  "Perikanan",
  "Industri Mesin",
  "Elektronik",
  "Tekstil",
  "Pembuatan Logam",
  "Peternakan",
  "Belum ada"
];