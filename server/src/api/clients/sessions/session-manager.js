import mongoManager from '../../../lib/mongo-manager';

async function create(db, clientId) {
  return await db.insert({ _id: clientId, sessionLog: [] });
}

async function insert(db, clientId, session) {
  const exists = await mongoManager.byId(db, clientId);

  if (!exists) {
    return await db.insert({ _id: clientId, sessionLog: [session] });
  }

  return await db.updateOne(
    { _id: clientId },
    { $push: { sessionLog: session } }
  );
}

export default {
  ...mongoManager,
  withConnection: mongoManager.withConnection('sessions'),
  insert,
  create,
};
