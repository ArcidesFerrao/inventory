
import { getServerSession } from 'next-auth'
import { authOptions } from './auth'

export default async function authCheck() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return null;
  }

  


    return session;
}
