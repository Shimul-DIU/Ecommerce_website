import bcrypt from "bcryptjs";

const hashPassword = async () => {

  const hashed = await bcrypt.hash("123456", 10);

  console.log(hashed);

};

hashPassword();