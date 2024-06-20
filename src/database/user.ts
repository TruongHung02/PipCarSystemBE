import _User from '../models/user.model';
import { hashPassword } from '../utils';

export const UserSeeder = async (): Promise<void> => {
  await _User
    .deleteMany()
    .then(() => {
      console.log('User is Cleared');
    })
    .catch((error) => {
      console.log(error);
    });
  const data = [
    {
      phone: '0965670347',
      name: 'Trần Hiếu ADMIN',
      password: '1234567890',
      role: 'ADMIN',
      status: 1,
    },
    {
      phone: '0969559556',
      name: 'Trần Hiếu PM',
      password: '1234567890',
      role: 'PM',
      status: 1,
    },
  ];

  data.forEach(async ({ password, ...item }) => {
    const encryptedPassword = await hashPassword(password);
    await new _User({
      ...item,
      password: encryptedPassword,
    }).save();
  });

  console.log('User is Seeded');
};
