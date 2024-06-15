import { ApplicationError } from '../middlewares/errorHandler';
import User, { UserModel } from '../models/user.model';
import { UserSession } from '../models/user.model';

class UserController {
  async updateUser(user: UserSession, data: Partial<UserModel>) {
    const savedUser = await User.findOneAndUpdate({ _id: user.userId }, { ...data }, { new: true }).lean();
    if (!savedUser) {
      throw new ApplicationError(404, 'User not found');
    }
    savedUser.password = undefined;
    savedUser.username = undefined;
    savedUser.fingerPrint = undefined;
    return savedUser;
  }

  async getUser(user: UserSession) {
    const userInfo = await User.findById(user.userId).lean();
    if (!userInfo) {
      throw new ApplicationError(404, 'User not found');
    }

    userInfo.password = undefined;
    userInfo.username = undefined;
    userInfo.fingerPrint = undefined;
    return userInfo;
  }
}
export default UserController;
