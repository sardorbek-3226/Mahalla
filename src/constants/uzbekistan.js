// O'zbekistonning ma'muriy-hududiy bo'linishi: 12 viloyat + Toshkent shahri +
// Qoraqalpog'iston Respublikasi, har birining tumanlari bilan.
// Bu — barqaror ma'lumotnoma (davlat/viloyat ro'yxatiga o'xshash), shuning uchun
// statik saqlanadi. Mahalla darajasi esa backenddan keladi/yaratiladi, chunki u
// doimiy o'zgaruvchi, haqiqiy ma'lumot.
export const UZ_REGIONS = [
  {
    name: 'Toshkent shahri',
    districts: [
      'Bektemir', 'Chilonzor', 'Mirobod', "Mirzo Ulug'bek", 'Olmazor',
      'Sergeli', 'Shayxontohur', 'Uchtepa', 'Yakkasaroy', 'Yashnobod', 'Yunusobod',
    ],
  },
  {
    name: 'Toshkent viloyati',
    districts: [
      'Angren shahri', 'Bekabad tumani', 'Bekabad shahri', "Bo'stonliq tumani", "Bo'ka tumani",
      'Chinoz tumani', 'Nurafshon shahri', 'Ohangaron tumani', 'Ohangaron shahri',
      "Oqqo'rg'on tumani", "O'rtachirchiq tumani", 'Parkent tumani', 'Piskent tumani',
      'Qibray tumani', 'Quyichirchiq tumani', 'Yangiyo\'l tumani', "Yangiyo'l shahri",
      'Yuqorichirchiq tumani', 'Zangiota tumani',
    ],
  },
  {
    name: 'Andijon viloyati',
    districts: [
      'Andijon shahri', 'Andijon tumani', 'Asaka tumani', 'Baliqchi tumani', "Bo'z tumani",
      'Buloqboshi tumani', 'Izboskan tumani', 'Jalaquduq tumani', "Qo'rg'ontepa tumani",
      "Ma'rhamat tumani", "Oltinko'l tumani", 'Paxtaobod tumani', 'Shahrixon tumani',
      "Ulug'nor tumani", "Xo'jaobod tumani", 'Xonobod shahri',
    ],
  },
  {
    name: 'Farg\'ona viloyati',
    districts: [
      "Farg'ona shahri", "Farg'ona tumani", 'Beshariq tumani', "Bog'dod tumani",
      'Buvayda tumani', "Dang'ara tumani", 'Furqat tumani', "Qo'shtepa tumani",
      'Quva tumani', 'Quvasoy shahri', "Marg'ilon shahri", 'Oltiariq tumani',
      "Qo'qon shahri", 'Rishton tumani', "So'x tumani", 'Toshloq tumani',
      "Uchko'prik tumani", "O'zbekiston tumani", 'Yozyovon tumani',
    ],
  },
  {
    name: 'Namangan viloyati',
    districts: [
      'Namangan shahri', 'Namangan tumani', 'Chortoq tumani', 'Chust tumani',
      'Kosonsoy tumani', 'Mingbuloq tumani', 'Norin tumani', 'Pop tumani',
      "To'raqo'rg'on tumani", 'Uychi tumani', "Uchqo'rg'on tumani", "Yangiqo'rg'on tumani",
    ],
  },
  {
    name: 'Samarqand viloyati',
    districts: [
      'Samarqand shahri', 'Samarqand tumani', "Bulung'ur tumani", 'Ishtixon tumani',
      'Jomboy tumani', "Kattaqo'rg'on shahri", "Kattaqo'rg'on tumani", "Qo'shrobot tumani",
      'Narpay tumani', 'Nurobod tumani', 'Oqdaryo tumani', 'Pastdarg\'om tumani',
      'Payariq tumani', 'Paxtachi tumani', 'Toyloq tumani', 'Urgut tumani',
    ],
  },
  {
    name: 'Buxoro viloyati',
    districts: [
      'Buxoro shahri', 'Buxoro tumani', "G'ijduvon tumani", 'Jondor tumani',
      'Kogon shahri', 'Kogon tumani', 'Olot tumani', 'Peshku tumani',
      "Qorako'l tumani", 'Qorovulbozor tumani', 'Romitan tumani', 'Shofirkon tumani',
      'Vobkent tumani',
    ],
  },
  {
    name: 'Navoiy viloyati',
    districts: [
      'Navoiy shahri', 'Navbahor tumani', 'Nurota tumani', 'Konimex tumani',
      'Karmana tumani', 'Xatirchi tumani', 'Qiziltepa tumani', 'Tomdi tumani',
      "Uchquduq tumani", 'Zarafshon shahri',
    ],
  },
  {
    name: 'Qashqadaryo viloyati',
    districts: [
      'Qarshi shahri', 'Qarshi tumani', 'Kasbi tumani', 'Kitob tumani',
      'Koson tumani', 'Mirishkor tumani', 'Muborak tumani', 'Nishon tumani',
      "G'uzor tumani", "Yakkabog' tumani", 'Chiroqchi tumani', 'Shahrisabz shahri',
      'Shahrisabz tumani', 'Dehqonobod tumani', 'Kamashi tumani',
    ],
  },
  {
    name: 'Surxondaryo viloyati',
    districts: [
      'Termiz shahri', 'Termiz tumani', 'Angor tumani', 'Boysun tumani',
      'Denov tumani', "Jarqo'rg'on tumani", 'Muzrabot tumani', 'Oltinsoy tumani',
      'Qiziriq tumani', "Qumqo'rg'on tumani", 'Sariosiyo tumani', 'Sherobod tumani',
      "Sho'rchi tumani", 'Uzun tumani',
    ],
  },
  {
    name: 'Jizzax viloyati',
    districts: [
      'Jizzax shahri', 'Jizzax tumani', 'Arnasoy tumani', 'Baxmal tumani',
      "Do'stlik tumani", 'Forish tumani', "G'allaorol tumani", 'Zafarobod tumani',
      'Zarbdor tumani', 'Zomin tumani', "Mirzacho'l tumani", 'Paxtakor tumani',
      'Yangiobod tumani', 'Zarafshon shahri',
    ],
  },
  {
    name: 'Sirdaryo viloyati',
    districts: [
      'Guliston shahri', 'Guliston tumani', 'Boyovut tumani', 'Mirzaobod tumani',
      'Sardoba tumani', 'Sayxunobod tumani', 'Sirdaryo tumani', 'Xovos tumani',
      'Shirin shahri',
    ],
  },
  {
    name: 'Xorazm viloyati',
    districts: [
      'Urganch shahri', 'Urganch tumani', "Bog'ot tumani", 'Gurlan tumani',
      "Qo'shko'pir tumani", 'Shovot tumani', 'Xonqa tumani', 'Xazorasp tumani',
      'Yangiariq tumani', 'Yangibozor tumani', 'Xiva shahri', 'Xiva tumani',
    ],
  },
  {
    name: 'Qoraqalpog\'iston Respublikasi',
    districts: [
      'Nukus shahri', 'Nukus tumani', 'Amudaryo tumani', 'Beruniy tumani',
      "Bo'zatov tumani", 'Kegayli tumani', "Mo'ynoq tumani", "Qanliko'l tumani",
      "Qo'ng'irot tumani", "Qorao'zak tumani", 'Shumanay tumani', "Taxtako'pir tumani",
      "To'rtko'l tumani", "Xo'jayli tumani", "Ellikqal'a tumani", 'Chimboy tumani',
    ],
  },
];

export const districtsOf = (regionName) =>
  UZ_REGIONS.find((r) => r.name === regionName)?.districts || [];
